import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const instructions = {
  ar: { title: 'ثبّت FOCUS & FORCE', body: 'أضف المنصة إلى الشاشة الرئيسية للوصول السريع واستخدام أدوات الدراسة دون اتصال بعد أول زيارة.', install: 'تثبيت التطبيق', ios: 'في Safari: اضغط «مشاركة» ثم «إضافة إلى الشاشة الرئيسية».' },
  fr: { title: 'Installer FOCUS & FORCE', body: 'Ajoutez l’application à votre écran d’accueil. Les outils de travail restent accessibles hors ligne après la première visite.', install: 'Installer', ios: 'Dans Safari, touchez « Partager », puis « Sur l’écran d’accueil ».' },
  en: { title: 'Install FOCUS & FORCE', body: 'Add the app for quick access. Study tools remain available offline after your first visit.', install: 'Install app', ios: 'In Safari, tap Share, then “Add to Home Screen”.' }
};

export const InstallAppPrompt: React.FC = () => {
  const { profile } = useApp();
  const language = profile.preferredLanguage;
  const text = instructions[language] || instructions.en;
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const iosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIos(iosDevice && !standalone);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', () => setDismissed(true), { once: true });
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (dismissed || (!promptEvent && !isIos)) return null;

  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'accepted') setDismissed(true);
    setPromptEvent(null);
  };

  return (
    <aside className="fixed bottom-20 left-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-theme-border bg-theme-card p-4 shadow-elevated md:bottom-5">
      <button
        type="button"
        aria-label={language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Dismiss'}
        onClick={() => setDismissed(true)}
        className="absolute end-3 top-3 rounded-lg p-1.5 text-theme-muted hover:bg-theme-card-hover"
      >
        <X className="h-4 w-4" />
      </button>
      <h2 className="pe-8 text-sm font-black text-theme-text">{text.title}</h2>
      <p className="mt-1 text-xs leading-5 text-theme-muted">{isIos ? text.ios : text.body}</p>
      {promptEvent && (
        <button
          type="button"
          onClick={() => void install()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-theme-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-theme-primary-hover"
        >
          <Download className="h-4 w-4" />
          {text.install}
        </button>
      )}
    </aside>
  );
};
