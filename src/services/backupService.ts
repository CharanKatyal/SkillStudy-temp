import JSZip from 'jszip';
import { storageService } from './storageService';
import { StillSkudyBackup } from '../types/storage';
import { IdeProject, IdeFile } from '../types';

export class BackupService {
  /**
   * Generates a full offline JSON backup of all student data.
   */
  async generateFullBackup(): Promise<StillSkudyBackup> {
    const [
      profile,
      settings,
      progress,
      ideProjects,
      managedProjects,
      plannerTasks,
      portfolio,
      achievements,
      practiceAttempts
    ] = await Promise.all([
      storageService.getProfile(),
      storageService.getSettings(),
      storageService.getProgress(),
      storageService.getIdeProjects(),
      storageService.getManagedProjects(),
      storageService.getPlannerTasks(),
      storageService.getPortfolio(),
      storageService.getAchievements(),
      storageService.getPracticeAttempts()
    ]);

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      app: 'SkillForge',
      profile,
      settings,
      progress,
      ideProjects,
      managedProjects,
      plannerTasks,
      portfolio,
      achievements,
      practiceAttempts
    };
  }

  /**
   * Downloads a JSON backup file to the local disk.
   */
  async exportFullBackupToFile(): Promise<void> {
    const backupData = await this.generateFullBackup();
    const jsonStr = JSON.stringify(backupData, null, 2);
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `SkillForge_Backup_${dateStr}.json`;

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Restores a full backup from a JSON string.
   */
  async restoreFromBackupJson(jsonString: string): Promise<{ success: boolean; message: string }> {
    try {
      const data: StillSkudyBackup = JSON.parse(jsonString);

      if ((data.app !== 'SkillForge' && data.app !== 'StillSkudy') || !data.profile || !data.progress) {
        throw new Error('Invalid SkillForge backup format');
      }

      await storageService.resetAllData();

      // Restore each domain
      if (data.profile) await storageService.saveProfile(data.profile);
      if (data.settings) await storageService.saveSettings(data.settings);
      if (data.progress) await storageService.saveProgress(data.progress);
      if (data.portfolio) await storageService.savePortfolio(data.portfolio);

      if (Array.isArray(data.ideProjects)) {
        for (const proj of data.ideProjects) {
          await storageService.saveIdeProject(proj);
        }
      }

      if (Array.isArray(data.managedProjects)) {
        for (const proj of data.managedProjects) {
          await storageService.saveManagedProject(proj);
        }
      }

      if (Array.isArray(data.plannerTasks)) {
        for (const task of data.plannerTasks) {
          await storageService.savePlannerTask(task);
        }
      }

      if (Array.isArray(data.achievements)) {
        for (const ach of data.achievements) {
          await storageService.saveAchievement(ach);
        }
      }

      if (Array.isArray(data.practiceAttempts)) {
        for (const att of data.practiceAttempts) {
          await storageService.recordPracticeAttempt(att);
        }
      }

      return { success: true, message: 'Data restored successfully!' };
    } catch (err: any) {
      console.error('Failed to restore backup:', err);
      return { success: false, message: err.message || 'Corrupted or incompatible backup file.' };
    }
  }

  /**
   * Exports an IDE Project as a downloadable ZIP archive.
   */
  async exportProjectAsZip(project: IdeProject): Promise<void> {
    const zip = new JSZip();

    // Add each file to the zip root
    Object.entries(project.files).forEach(([filename, fileObj]) => {
      zip.file(filename, fileObj.content);
    });

    // Add SkillForge project manifest
    const manifest = {
      name: project.name,
      description: project.description,
      exportedFrom: 'SkillForge Offline IDE',
      createdAt: project.createdAt,
      exportedAt: new Date().toISOString()
    };
    zip.file('stillskudy-manifest.json', JSON.stringify(manifest, null, 2));

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const sanitizedName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Exports an IDE Project as a standalone JSON file.
   */
  exportProjectAsJson(project: IdeProject): void {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const sanitizedName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedName}.stillskudy.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Imports an IDE Project from a ZIP file uploaded by the student.
   */
  async importProjectFromZip(file: File): Promise<IdeProject> {
    const zip = await JSZip.loadAsync(file);
    const files: Record<string, IdeFile> = {};
    let projectName = file.name.replace(/\.zip$/i, '');
    let projectDescription = 'Imported from ZIP archive';

    const entries = Object.keys(zip.files);
    for (const filename of entries) {
      const zipEntry = zip.files[filename];
      if (zipEntry.dir) continue;

      if (filename === 'stillskudy-manifest.json') {
        const text = await zipEntry.async('string');
        try {
          const meta = JSON.parse(text);
          if (meta.name) projectName = meta.name;
          if (meta.description) projectDescription = meta.description;
        } catch {
          // ignore manifest parse error
        }
        continue;
      }

      const content = await zipEntry.async('string');
      let language: IdeFile['language'] = 'text';
      if (filename.endsWith('.html')) language = 'html';
      else if (filename.endsWith('.css')) language = 'css';
      else if (filename.endsWith('.js')) language = 'javascript';
      else if (filename.endsWith('.py')) language = 'python';
      else if (filename.endsWith('.json')) language = 'json';

      files[filename] = {
        name: filename,
        content,
        language
      };
    }

    if (Object.keys(files).length === 0) {
      throw new Error('ZIP archive did not contain any valid project files.');
    }

    const defaultActive = Object.keys(files).find(f => f === 'index.html') || Object.keys(files)[0];

    const newProject: IdeProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      description: projectDescription,
      files,
      activeFileName: defaultActive,
      openTabs: Object.keys(files).slice(0, 3),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await storageService.saveIdeProject(newProject);
    return newProject;
  }
}

export const backupService = new BackupService();
