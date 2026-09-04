import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/Toast';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';
import { PowerOffModal } from '../common/PowerOffModal';
import { useApp } from '../../context/AppContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPowerOffOpen, setIsPowerOffOpen] = useState(false);
  const { toasts, removeToast } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <div className="flex flex-1 relative">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onPowerOff={() => setIsPowerOffOpen(true)}
        />

        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            collapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
        >
          <Header
            onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
            onPowerOff={() => setIsPowerOffOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <AIAssistantDrawer />

      {/* Power Off Confirmation Modal */}
      <PowerOffModal
        isOpen={isPowerOffOpen}
        onClose={() => setIsPowerOffOpen(false)}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
