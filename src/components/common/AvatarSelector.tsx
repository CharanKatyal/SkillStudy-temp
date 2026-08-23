import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Upload, Check } from 'lucide-react';
import { PREDEFINED_AVATARS, getAvatarDisplay } from '../../data/defaultAvatars';
import { ImageCropModal } from './ImageCropModal';

interface AvatarSelectorProps {
  selectedAvatarUrl?: string;
  displayName: string;
  onSelectAvatar: (avatarUrl: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatarUrl,
  displayName,
  onSelectAvatar
}) => {
  const [tab, setTab] = useState<'illustrations' | 'custom'>('illustrations');
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDisplay = getAvatarDisplay(selectedAvatarUrl, displayName);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawImageSrc(reader.result);
        setIsCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = (compressedDataUrl: string) => {
    onSelectAvatar(compressedDataUrl);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        Profile Photo &amp; Avatar
      </label>

      {/* Selected Avatar Preview + Switcher Tabs */}
      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
        {/* Large Avatar Badge */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md flex items-center justify-center border-2 border-brand-500/80 bg-slate-800">
            {currentDisplay.type === 'custom' && currentDisplay.imageUrl ? (
              <img
                src={currentDisplay.imageUrl}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            ) : currentDisplay.type === 'predefined' ? (
              <div
                className={`w-full h-full bg-gradient-to-tr ${currentDisplay.bgGradient} flex items-center justify-center text-2xl select-none`}
              >
                {currentDisplay.emojiOrIcon}
              </div>
            ) : (
              <div className="w-full h-full bg-brand-600 flex items-center justify-center text-white text-2xl font-black">
                {currentDisplay.initial}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('illustrations')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                tab === 'illustrations'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750'
              }`}
            >
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Illustrations</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab('custom');
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                tab === 'custom'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750'
              }`}
            >
              <span className="flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload Photo</span>
              </span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {tab === 'illustrations'
              ? 'Choose a predefined mascot or avatar below.'
              : 'Upload and crop any photo into a square avatar.'}
          </p>
        </div>
      </div>

      {/* Predefined Grid */}
      {tab === 'illustrations' && (
        <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl max-h-36 overflow-y-auto">
          {PREDEFINED_AVATARS.map(avatar => {
            const isSelected = selectedAvatarUrl === avatar.id;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => onSelectAvatar(avatar.id)}
                className={`relative p-2 rounded-xl flex flex-col items-center justify-center transition aspect-square group ${
                  isSelected
                    ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-slate-900 shadow-md scale-105'
                    : 'hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
                title={avatar.name}
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${avatar.bgGradient} flex items-center justify-center text-lg shadow-sm`}
                >
                  {avatar.emojiOrIcon}
                </div>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white rounded-full flex items-center justify-center text-[10px] shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Hidden File Input for Custom Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Interactive Crop Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={rawImageSrc}
        onClose={() => setIsCropModalOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};
