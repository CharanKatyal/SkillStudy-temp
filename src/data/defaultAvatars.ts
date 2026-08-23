export interface PredefinedAvatar {
  id: string;
  name: string;
  category: string;
  bgGradient: string;
  emojiOrIcon: string;
  svgDataUrl?: string;
}

export const PREDEFINED_AVATARS: PredefinedAvatar[] = [
  {
    id: 'avatar-scholar',
    name: 'Top Scholar',
    category: 'Academic',
    bgGradient: 'from-blue-600 to-indigo-700',
    emojiOrIcon: '🎓'
  },
  {
    id: 'avatar-coder',
    name: 'Code Wizard',
    category: 'Tech',
    bgGradient: 'from-emerald-500 to-teal-700',
    emojiOrIcon: '💻'
  },
  {
    id: 'avatar-rocket',
    name: 'Space Explorer',
    category: 'Science',
    bgGradient: 'from-purple-600 to-pink-600',
    emojiOrIcon: '🚀'
  },
  {
    id: 'avatar-robot',
    name: 'Cyber Bot',
    category: 'Tech',
    bgGradient: 'from-cyan-500 to-blue-600',
    emojiOrIcon: '🤖'
  },
  {
    id: 'avatar-fox',
    name: 'Clever Fox',
    category: 'Nature',
    bgGradient: 'from-amber-500 to-orange-600',
    emojiOrIcon: '🦊'
  },
  {
    id: 'avatar-owl',
    name: 'Wise Owl',
    category: 'Academic',
    bgGradient: 'from-slate-700 to-slate-900',
    emojiOrIcon: '🦉'
  },
  {
    id: 'avatar-lion',
    name: 'Brave Lion',
    category: 'Nature',
    bgGradient: 'from-yellow-500 to-amber-700',
    emojiOrIcon: '🦁'
  },
  {
    id: 'avatar-panda',
    name: 'Focus Panda',
    category: 'Nature',
    bgGradient: 'from-zinc-600 to-zinc-900',
    emojiOrIcon: '🐼'
  },
  {
    id: 'avatar-artist',
    name: 'Creative Artist',
    category: 'Design',
    bgGradient: 'from-rose-500 to-pink-600',
    emojiOrIcon: '🎨'
  },
  {
    id: 'avatar-science',
    name: 'Lab Scientist',
    category: 'Science',
    bgGradient: 'from-teal-500 to-emerald-700',
    emojiOrIcon: '🔬'
  },
  {
    id: 'avatar-bolt',
    name: 'Speed Prodigy',
    category: 'Tech',
    bgGradient: 'from-amber-400 to-yellow-600',
    emojiOrIcon: '⚡'
  },
  {
    id: 'avatar-dragon',
    name: 'Master Builder',
    category: 'Tech',
    bgGradient: 'from-violet-600 to-indigo-900',
    emojiOrIcon: '🐉'
  }
];

export const getAvatarDisplay = (avatarUrl?: string, displayName?: string) => {
  if (avatarUrl) {
    // If it's a predefined avatar ID (starts with avatar-)
    const found = PREDEFINED_AVATARS.find(a => a.id === avatarUrl);
    if (found) {
      return {
        type: 'predefined' as const,
        bgGradient: found.bgGradient,
        emojiOrIcon: found.emojiOrIcon,
        name: found.name
      };
    }
    // If it's a data URL / custom image
    if (avatarUrl.startsWith('data:') || avatarUrl.startsWith('http')) {
      return {
        type: 'custom' as const,
        imageUrl: avatarUrl
      };
    }
  }

  // Fallback to initial
  const initial = displayName ? displayName[0].toUpperCase() : 'S';
  return {
    type: 'initial' as const,
    initial
  };
};
