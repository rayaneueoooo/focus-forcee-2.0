import { ThemeId } from '../types';

export interface ThemeDefinition {
  id: ThemeId;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  previewColor: string;
  previewAccent: string;
  light: {
    bg: string;
    card: string;
    cardHover: string;
    text: string;
    muted: string;
    subtle: string;
    border: string;
    primary: string;
    primaryHover: string;
    primaryLight: string;
    accent: string;
    accentLight: string;
    badge: string;
  };
  dark: {
    bg: string;
    card: string;
    cardHover: string;
    text: string;
    muted: string;
    subtle: string;
    border: string;
    primary: string;
    primaryHover: string;
    primaryLight: string;
    accent: string;
    accentLight: string;
    badge: string;
  };
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  'cherry-cream': {
    id: 'cherry-cream',
    nameAr: 'الكرز والقشطة (الرسمي)',
    nameFr: 'Cerise & Crème (Signature)',
    nameEn: 'Cherry Cream (Signature)',
    descriptionAr: 'الهوية الرسمية لمنصة FOCUS & FORCE: عاجي كريمي، كرزي عميق، ووردي ناعم',
    descriptionFr: 'Identité officielle: ivoire crémeux, bordeaux profond et blush délicat',
    descriptionEn: 'The official identity: creamy ivory, rich burgundy, and soft blush',
    previewColor: '#721126',
    previewAccent: '#E8C5C8',
    light: {
      bg: '#FBF9F5',
      card: '#FFFFFF',
      cardHover: '#F7F3EE',
      text: '#221518',
      muted: '#6F5C62',
      subtle: '#EAE1D9',
      border: '#E8DFD7',
      primary: '#721126',
      primaryHover: '#590D1E',
      primaryLight: '#F5E6E8',
      accent: '#B23A48',
      accentLight: '#FCEEF0',
      badge: '#8B1E3F',
    },
    dark: {
      bg: '#140D0F',
      card: '#1F1417',
      cardHover: '#2A1C20',
      text: '#FBF9F5',
      muted: '#B09BA1',
      subtle: '#332025',
      border: '#3D272E',
      primary: '#D94A62',
      primaryHover: '#E85D75',
      primaryLight: '#38161D',
      accent: '#FF758F',
      accentLight: '#421C24',
      badge: '#E85D75',
    }
  },
  'burgundy-prestige': {
    id: 'burgundy-prestige',
    nameAr: 'العنابي الملكي الفاخر',
    nameFr: 'Bordeaux Prestige',
    nameEn: 'Burgundy Prestige',
    descriptionAr: 'أناقة مخملية مع لمسات ذهبية تحفز على التميز الأكاديمي',
    descriptionFr: 'Élégance bordeaux royale avec des accents or raffinés',
    descriptionEn: 'Royal burgundy elegance with refined gold accents for high achievers',
    previewColor: '#540817',
    previewAccent: '#D4AF37',
    light: {
      bg: '#FAF6F4',
      card: '#FFFFFF',
      cardHover: '#F4ECE8',
      text: '#200D11',
      muted: '#664C52',
      subtle: '#EBDCD9',
      border: '#E2CECB',
      primary: '#540817',
      primaryHover: '#3D0510',
      primaryLight: '#F7E7E9',
      accent: '#C59B27',
      accentLight: '#FCF6E5',
      badge: '#540817',
    },
    dark: {
      bg: '#120508',
      card: '#1D0A0F',
      cardHover: '#280F16',
      text: '#FAF6F4',
      muted: '#A99297',
      subtle: '#36151E',
      border: '#451D28',
      primary: '#E04A67',
      primaryHover: '#EC617C',
      primaryLight: '#331018',
      accent: '#E5C058',
      accentLight: '#3D3110',
      badge: '#E5C058',
    }
  },
  'pink-cloud': {
    id: 'pink-cloud',
    nameAr: 'غيمة وردية لطيفة',
    nameFr: 'Nuage Rose',
    nameEn: 'Pink Cloud',
    descriptionAr: 'جو دراسي هادئ ولطيف يقلل التوتر ويعزز التركيز الإيجابي',
    descriptionFr: 'Atmosphère douce et apaisante qui réduit le stress des révisions',
    descriptionEn: 'Gentle, soft, and comforting ambience reducing exam stress',
    previewColor: '#DB2777',
    previewAccent: '#FCE7F3',
    light: {
      bg: '#FFF8FA',
      card: '#FFFFFF',
      cardHover: '#FDF0F4',
      text: '#2B121E',
      muted: '#7A5B69',
      subtle: '#FCE3EB',
      border: '#F7D4E0',
      primary: '#D94680',
      primaryHover: '#C02667',
      primaryLight: '#FDECF3',
      accent: '#EC4899',
      accentLight: '#FFF0F7',
      badge: '#BE185D',
    },
    dark: {
      bg: '#150910',
      card: '#220F1A',
      cardHover: '#2F1625',
      text: '#FFF8FA',
      muted: '#B89AA8',
      subtle: '#3C1B2E',
      border: '#4D223B',
      primary: '#F472B6',
      primaryHover: '#FB7185',
      primaryLight: '#3E1428',
      accent: '#F9A8D4',
      accentLight: '#4B1733',
      badge: '#F472B6',
    }
  },
  'lavender-dream': {
    id: 'lavender-dream',
    nameAr: 'حلم اللافندر والأرجوان',
    nameFr: 'Rêve Lavande',
    nameEn: 'Lavender Dream',
    descriptionAr: 'درجات الخزامى المريحة للأعصاب لجلسات حفظ ومطالعة ممتدة',
    descriptionFr: 'Nuances de lavande relaxantes pour les longues sessions de mémorisation',
    descriptionEn: 'Soothing lavender hues for deep memorization and extended reading',
    previewColor: '#7C3AED',
    previewAccent: '#DDD6FE',
    light: {
      bg: '#F9F8FD',
      card: '#FFFFFF',
      cardHover: '#F2F0FB',
      text: '#1C152E',
      muted: '#62587E',
      subtle: '#ECE7F9',
      border: '#DFD8F3',
      primary: '#7C3AED',
      primaryHover: '#6D28D9',
      primaryLight: '#EDE9FE',
      accent: '#8B5CF6',
      accentLight: '#F5F3FF',
      badge: '#6D28D9',
    },
    dark: {
      bg: '#0F0B18',
      card: '#181227',
      cardHover: '#231B38',
      text: '#F9F8FD',
      muted: '#A59BBF',
      subtle: '#2E2248',
      border: '#3E2F5E',
      primary: '#A78BFA',
      primaryHover: '#C4B5FD',
      primaryLight: '#2C1B4D',
      accent: '#C4B5FD',
      accentLight: '#392266',
      badge: '#A78BFA',
    }
  },
  'matcha-study': {
    id: 'matcha-study',
    nameAr: 'الماتشا الأخضر المنعش',
    nameFr: 'Matcha Étude',
    nameEn: 'Matcha Study',
    descriptionAr: 'نضارة الشاي الأخضر والورق الطبيعي لصفاء الذهن وحل التمارين',
    descriptionFr: 'Fraîcheur vivifiante et équilibre naturel pour la clarté d’esprit',
    descriptionEn: 'Zen botanical green promoting mental clarity and deep problem solving',
    previewColor: '#2D5A27',
    previewAccent: '#C9E4C5',
    light: {
      bg: '#F6F9F5',
      card: '#FFFFFF',
      cardHover: '#EEF4EC',
      text: '#122310',
      muted: '#4E614B',
      subtle: '#E0EAE0',
      border: '#D0DEC9',
      primary: '#2E6F24',
      primaryHover: '#22551A',
      primaryLight: '#E8F3E5',
      accent: '#4C8C35',
      accentLight: '#F0F8EE',
      badge: '#2E6F24',
    },
    dark: {
      bg: '#0B130A',
      card: '#122010',
      cardHover: '#1B2E18',
      text: '#F6F9F5',
      muted: '#96A994',
      subtle: '#243A20',
      border: '#324E2D',
      primary: '#5DBE4E',
      primaryHover: '#72D463',
      primaryLight: '#1B3B16',
      accent: '#82D674',
      accentLight: '#264B1F',
      badge: '#5DBE4E',
    }
  },
  'ocean-calm': {
    id: 'ocean-calm',
    nameAr: 'سكينة المحيط الأزرق',
    nameFr: 'Océan Calme',
    nameEn: 'Ocean Calm',
    descriptionAr: 'عمق وسكينة المحيط لتثبيت المعلومات والمراجعة الاستراتيجية',
    descriptionFr: 'Profondeur océanique et sérénité pour structurer ses révisions',
    descriptionEn: 'Strategic marine depth and poise for structured revision',
    previewColor: '#0F4C81',
    previewAccent: '#BAE6FD',
    light: {
      bg: '#F5F9FC',
      card: '#FFFFFF',
      cardHover: '#EDF4F9',
      text: '#0C1C2A',
      muted: '#4D6274',
      subtle: '#DEECF4',
      border: '#CBE0EC',
      primary: '#0F4C81',
      primaryHover: '#0A3760',
      primaryLight: '#E3EFF9',
      accent: '#0284C7',
      accentLight: '#F0F9FF',
      badge: '#0369A1',
    },
    dark: {
      bg: '#081119',
      card: '#0E1D2A',
      cardHover: '#162C3F',
      text: '#F5F9FC',
      muted: '#8EA7BB',
      subtle: '#1C364D',
      border: '#274966',
      primary: '#38BDF8',
      primaryHover: '#7DD3FC',
      primaryLight: '#0E314F',
      accent: '#60A5FA',
      accentLight: '#143C61',
      badge: '#38BDF8',
    }
  },
  'midnight-focus': {
    id: 'midnight-focus',
    nameAr: 'تركيز منتصف الليل الفاحم',
    nameFr: 'Minuit Focus',
    nameEn: 'Midnight Focus',
    descriptionAr: 'تصميم داكن عالي التباين مصمم لحماية العين في الجلسات الليلية',
    descriptionFr: 'Mode sombre ultra-profond pensé pour les révisions nocturnes intenses',
    descriptionEn: 'High-contrast nocturnal OLED mode tailored for late-night deep work',
    previewColor: '#E63946',
    previewAccent: '#1F2937',
    light: {
      bg: '#F3F4F6',
      card: '#FFFFFF',
      cardHover: '#E5E7EB',
      text: '#111827',
      muted: '#4B5563',
      subtle: '#E5E7EB',
      border: '#D1D5DB',
      primary: '#E63946',
      primaryHover: '#C92A36',
      primaryLight: '#FEE2E2',
      accent: '#D90429',
      accentLight: '#FEE2E2',
      badge: '#111827',
    },
    dark: {
      bg: '#0A0C10',
      card: '#12161F',
      cardHover: '#1A202C',
      text: '#F9FAFB',
      muted: '#9CA3AF',
      subtle: '#1F2937',
      border: '#2D3748',
      primary: '#FF4757',
      primaryHover: '#FF6B81',
      primaryLight: '#37151D',
      accent: '#FF6B81',
      accentLight: '#401822',
      badge: '#FF4757',
    }
  },
  'minimal-ivory': {
    id: 'minimal-ivory',
    nameAr: 'العاج النقي الأدنى',
    nameFr: 'Ivoire Minimal',
    nameEn: 'Minimal Ivory',
    descriptionAr: 'بساطة فائقة بدون أي مشتتات تركز على الهدف والأرقام الحقيقية',
    descriptionFr: 'Minimalisme pur inspiré du papier japonais pour zéro distraction',
    descriptionEn: 'Pure archival stationery feel: minimal, crisp, and distraction-free',
    previewColor: '#374151',
    previewAccent: '#E5E7EB',
    light: {
      bg: '#FAF9F6',
      card: '#FFFFFF',
      cardHover: '#F4F2EC',
      text: '#1F2937',
      muted: '#526071',
      subtle: '#ECE9E0',
      border: '#DDD8CB',
      primary: '#334155',
      primaryHover: '#1E293B',
      primaryLight: '#F1F5F9',
      accent: '#64748B',
      accentLight: '#F8FAFC',
      badge: '#334155',
    },
    dark: {
      bg: '#111315',
      card: '#1A1D20',
      cardHover: '#24282D',
      text: '#F3F4F6',
      muted: '#9CA3AF',
      subtle: '#2E3339',
      border: '#3D444C',
      primary: '#94A3B8',
      primaryHover: '#CBD5E1',
      primaryLight: '#1E293B',
      accent: '#CBD5E1',
      accentLight: '#2A3441',
      badge: '#94A3B8',
    }
  }
};

export function applyThemeTokens(themeId: ThemeId, isDark: boolean, customAccent?: string) {
  const theme = THEMES[themeId] || THEMES['cherry-cream'];
  const tokens = isDark ? theme.dark : theme.light;
  const root = document.documentElement;

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.style.setProperty('--color-bg', tokens.bg);
  root.style.setProperty('--color-card', tokens.card);
  root.style.setProperty('--color-card-hover', tokens.cardHover);
  root.style.setProperty('--color-text', tokens.text);
  root.style.setProperty('--color-muted', tokens.muted);
  root.style.setProperty('--color-subtle', tokens.subtle);
  root.style.setProperty('--color-border', tokens.border);
  
  // Custom accent if provided
  const primary = customAccent || tokens.primary;
  root.style.setProperty('--color-primary', primary);
  root.style.setProperty('--color-primary-hover', tokens.primaryHover);
  root.style.setProperty('--color-primary-light', tokens.primaryLight);
  root.style.setProperty('--color-accent', tokens.accent);
  root.style.setProperty('--color-accent-light', tokens.accentLight);
  root.style.setProperty('--color-badge', tokens.badge);
}

