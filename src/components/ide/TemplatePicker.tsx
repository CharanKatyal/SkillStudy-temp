import React from 'react';
import {
  Sparkles,
  Calculator,
  CheckSquare,
  Clock,
  HelpCircle,
  Layout,
  Gamepad2,
  User,
  FolderGit2,
  ArrowRight
} from 'lucide-react';
import { PROJECT_TEMPLATES } from '../../data/projectTemplates';
import { useIDE } from '../../context/IDEContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({ isOpen, onClose }) => {
  const { createFromTemplate } = useIDE();

  const iconsMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
    Calculator: <Calculator className="w-5 h-5 text-sky-400" />,
    CheckSquare: <CheckSquare className="w-5 h-5 text-emerald-400" />,
    Clock: <Clock className="w-5 h-5 text-purple-400" />,
    HelpCircle: <HelpCircle className="w-5 h-5 text-blue-400" />,
    Layout: <Layout className="w-5 h-5 text-cyan-400" />,
    Gamepad2: <Gamepad2 className="w-5 h-5 text-rose-400" />,
    User: <User className="w-5 h-5 text-brand-400" />,
    FolderGit2: <FolderGit2 className="w-5 h-5 text-emerald-400" />
  };

  const handleSelectTemplate = async (templateId: string) => {
    await createFromTemplate(templateId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Starter Project Template" maxWidth="4xl">
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Select a pre-built offline project template to instantly generate HTML, CSS, and JavaScript files in your IDE.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
          {PROJECT_TEMPLATES.map(template => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className="p-4 rounded-xl bg-slate-850 border border-slate-750 hover:border-brand-500 hover:bg-slate-800 cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {iconsMap[template.icon] || <Sparkles className="w-5 h-5 text-brand-400" />}
                  </div>
                  <Badge
                    variant={
                      template.difficulty === 'Beginner'
                        ? 'success'
                        : template.difficulty === 'Intermediate'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {template.difficulty}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition">
                  {template.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-brand-400">
                <span>{Object.keys(template.files).length} files included</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
