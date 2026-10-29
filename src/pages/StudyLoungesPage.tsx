import React, { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
  AlertCircle,
  ArrowUp,
  LockKeyhole,
  LogOut,
  MessageCircle,
  Radio,
  Send,
  Sparkles,
  Users,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiRequest, getApiSocketOrigin } from '../utils/api';

interface ApiUser {
  id: string;
  email: string;
  displayName: string;
  streamId: string;
  streakCount: number;
  emailNotifications: boolean;
  telegramNotifications: boolean;
  telegramChatId: string | null;
}

interface RoomMessage {
  id: string;
  userId: string;
  displayName: string;
  body: string;
  createdAt: string;
}

interface RoomParticipant {
  userId: string;
  displayName: string;
  focusEndsAt: number | null;
  remainingSeconds: number;
}

interface FocusBoost {
  id: string;
  userId: string;
  senderName: string;
  emoji: string;
}

type Language = 'ar' | 'fr' | 'en';
type CopyKey =
  | 'title' | 'subtitle' | 'online' | 'chooseSubject' | 'participants'
  | 'noParticipants' | 'you' | 'focus' | 'startFocus' | 'stopFocus'
  | 'resumeFocus' | 'focusIdle' | 'roomChat' | 'chatHint' | 'messagePlaceholder'
  | 'send' | 'boost' | 'boostSent' | 'setupTitle' | 'setupDescription'
  | 'connecting' | 'connectError' | 'chatError' | 'displayNameNotice'
  | 'emptyChat' | 'minute' | 'login' | 'register' | 'email' | 'password'
  | 'displayName' | 'accountTitle' | 'accountHint' | 'switchRegister'
  | 'switchLogin' | 'submit' | 'logout' | 'offline' | 'passwordHint'
  | 'accountCreated' | 'notificationSettings' | 'emailAlerts' | 'telegramAlerts'
  | 'linkTelegram' | 'telegramLinked' | 'openTelegramLink' | 'preferencesSaved';

const copy: Record<Language, Record<CopyKey, string>> = {
  ar: {
    title: 'صالون التركيز الجماعي',
    subtitle: 'ذاكر مع طلبة شعبتك، تابع حضورهم، وتبادل التشجيع في الوقت الفعلي.',
    online: 'متصل الآن',
    chooseSubject: 'اختر غرفة المادة',
    participants: 'الزملاء في الغرفة',
    noParticipants: 'لا يوجد زملاء آخرون هنا الآن. أرسل دعوة لصديق وابدؤوا معاً.',
    you: 'أنت',
    focus: 'جلسة تركيز مشتركة',
    startFocus: 'ابدأ بومودورو 25 دقيقة',
    stopFocus: 'إيقاف مؤقت',
    resumeFocus: 'استئناف الجلسة',
    focusIdle: 'متاح للدراسة',
    roomChat: 'دردشة الغرفة',
    chatHint: 'كن لطيفاً، وشارك أسئلتك الدراسية فقط.',
    messagePlaceholder: 'اكتب رسالة للمجموعة...',
    send: 'إرسال',
    boost: 'أرسل دفعة تحفيز',
    boostSent: 'أرسل تشجيعاً إلى الغرفة',
    setupTitle: 'تسجيل الدخول مطلوب للغرف المباشرة',
    setupDescription: 'أنشئ حساباً أو سجّل الدخول للدردشة مع طلاب شعبتك. بيانات الدراسة تبقى محفوظة محلياً على جهازك.',
    connecting: 'جارٍ الاتصال بالغرفة...',
    connectError: 'تعذر الاتصال بخدمة الغرف.',
    chatError: 'تعذر تحميل الرسائل أو إرسالها.',
    displayNameNotice: 'الدردشة عامة لطلاب المنصة. اسم العرض ورسائلك مرئية؛ لا تشارك معلومات شخصية.',
    emptyChat: 'لا توجد رسائل بعد. ابدأ بسؤال دراسي أو تحية.',
    minute: 'د',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    displayName: 'الاسم الظاهر',
    accountTitle: 'حساب الطالب',
    accountHint: 'كلمة المرور 12 حرفاً على الأقل. لا تشاركها مع أي شخص.',
    switchRegister: 'ليس لديك حساب؟ أنشئ حساباً',
    switchLogin: 'لديك حساب؟ سجّل الدخول',
    submit: 'متابعة',
    logout: 'تسجيل الخروج',
    offline: 'تعذر الوصول إلى خادم المنصة. تحقق من الاتصال وحاول مجدداً.',
    passwordHint: 'استخدم 12 حرفاً على الأقل',
    accountCreated: 'تم إنشاء الحساب وتسجيل الدخول.',
    notificationSettings: 'التنبيهات',
    emailAlerts: 'تنبيهات البريد الإلكتروني (اختيارية)',
    telegramAlerts: 'تنبيهات Telegram',
    linkTelegram: 'ربط Telegram عبر البوت',
    telegramLinked: 'حساب Telegram مربوط',
    openTelegramLink: 'افتح Telegram لإكمال الربط',
    preferencesSaved: 'تم حفظ تفضيلات التنبيه.'
  },
  fr: {
    title: 'Salon d’étude collectif',
    subtitle: 'Étudiez avec votre filière, voyez qui est présent et encouragez-vous en temps réel.',
    online: 'En ligne',
    chooseSubject: 'Choisir une salle',
    participants: 'Étudiants dans la salle',
    noParticipants: 'Personne d’autre ici pour le moment. Invitez un ami à vous rejoindre.',
    you: 'Vous',
    focus: 'Session de concentration',
    startFocus: 'Démarrer un Pomodoro de 25 min',
    stopFocus: 'Mettre en pause',
    resumeFocus: 'Reprendre la session',
    focusIdle: 'Disponible',
    roomChat: 'Discussion de la salle',
    chatHint: 'Soyez bienveillant et restez sur les sujets scolaires.',
    messagePlaceholder: 'Écrire au groupe...',
    send: 'Envoyer',
    boost: 'Envoyer un encouragement',
    boostSent: 'Encouragement envoyé',
    setupTitle: 'Connexion requise pour le salon',
    setupDescription: 'Créez un compte ou connectez-vous pour discuter avec votre filière. Vos données d’étude restent enregistrées localement.',
    connecting: 'Connexion à la salle...',
    connectError: 'Connexion au service des salles impossible.',
    chatError: 'Impossible de charger ou envoyer les messages.',
    displayNameNotice: 'Salon public aux étudiants de la plateforme. Votre nom et vos messages sont visibles ; ne partagez pas de données personnelles.',
    emptyChat: 'Aucun message. Lancez une question ou dites bonjour.',
    minute: 'min',
    login: 'Connexion',
    register: 'Créer un compte',
    email: 'E-mail',
    password: 'Mot de passe',
    displayName: 'Nom affiché',
    accountTitle: 'Compte étudiant',
    accountHint: '12 caractères minimum. Ne partagez jamais votre mot de passe.',
    switchRegister: 'Pas de compte ? Créez-en un',
    switchLogin: 'Déjà inscrit ? Connectez-vous',
    submit: 'Continuer',
    logout: 'Déconnexion',
    offline: 'Serveur inaccessible. Vérifiez votre connexion et réessayez.',
    passwordHint: '12 caractères minimum',
    accountCreated: 'Compte créé et connecté.',
    notificationSettings: 'Notifications',
    emailAlerts: 'Alertes e-mail (facultatif)',
    telegramAlerts: 'Alertes Telegram',
    linkTelegram: 'Lier Telegram via le bot',
    telegramLinked: 'Compte Telegram associé',
    openTelegramLink: 'Ouvrir Telegram pour terminer',
    preferencesSaved: 'Préférences enregistrées.'
  },
  en: {
    title: 'Study Focus Lounge',
    subtitle: 'Study alongside your stream, see who is present, and encourage each other in real time.',
    online: 'Online now',
    chooseSubject: 'Choose a subject room',
    participants: 'Students in this room',
    noParticipants: 'No one else is here yet. Invite a classmate to join you.',
    you: 'You',
    focus: 'Shared focus session',
    startFocus: 'Start a 25-minute Pomodoro',
    stopFocus: 'Pause session',
    resumeFocus: 'Resume session',
    focusIdle: 'Available to study',
    roomChat: 'Room chat',
    chatHint: 'Be kind and keep messages study-related.',
    messagePlaceholder: 'Write to the group...',
    send: 'Send',
    boost: 'Send a focus boost',
    boostSent: 'Encouragement sent to the room',
    setupTitle: 'Sign in to join live rooms',
    setupDescription: 'Create an account or sign in to chat with your stream. Study data remains saved locally on this device.',
    connecting: 'Connecting to the room...',
    connectError: 'Could not connect to the room service.',
    chatError: 'Could not load or send messages.',
    displayNameNotice: 'This room is public to platform students. Your name and messages are visible; do not share personal information.',
    emptyChat: 'No messages yet. Start with a study question or a hello.',
    minute: 'min',
    login: 'Sign in',
    register: 'Create account',
    email: 'Email',
    password: 'Password',
    displayName: 'Display name',
    accountTitle: 'Student account',
    accountHint: 'Use at least 12 characters. Never share your password.',
    switchRegister: 'New here? Create an account',
    switchLogin: 'Already registered? Sign in',
    submit: 'Continue',
    logout: 'Sign out',
    offline: 'Could not reach the platform server. Check your connection and try again.',
    passwordHint: 'At least 12 characters',
    accountCreated: 'Account created and signed in.',
    notificationSettings: 'Notifications',
    emailAlerts: 'Email alerts (optional)',
    telegramAlerts: 'Telegram alerts',
    linkTelegram: 'Link Telegram through the bot',
    telegramLinked: 'Telegram account linked',
    openTelegramLink: 'Open Telegram to finish linking',
    preferencesSaved: 'Notification preferences saved.'
  }
};

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export const StudyLoungesPage: React.FC = () => {
  const { profile, subjects, logFocusSession } = useApp();
  const language = profile.preferredLanguage as Language;
  const text = copy[language] || copy.en;
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [user, setUser] = useState<ApiUser | null>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'anonymous' | 'authenticated' | 'offline'>('checking');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(profile.name);
  const [authError, setAuthError] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [messageDraft, setMessageDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [focusEndsAt, setFocusEndsAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [now, setNow] = useState(Date.now());
  const [boosts, setBoosts] = useState<FocusBoost[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const subjectName = (subjectId: string) => {
    const subject = subjects.find(item => item.id === subjectId);
    if (!subject) return subjectId;
    if (language === 'ar') return subject.nameAr;
    if (language === 'fr') return subject.nameFr;
    return subject.nameEn;
  };

  useEffect(() => {
    if (!subjects.some(subject => subject.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0]?.id || '');
    }
  }, [selectedSubjectId, subjects]);

  useEffect(() => {
    let active = true;
    apiRequest<{ user: ApiUser }>('/auth/me')
      .then(result => {
        if (active) {
          setUser(result.user);
          setAuthStatus('authenticated');
        }
      })
      .catch(error => {
        if (!active) return;
        if (error instanceof Error && /401|session|authentication/i.test(error.message)) {
          setAuthStatus('anonymous');
        } else {
          setAuthStatus('offline');
          setAuthError(error instanceof Error ? error.message : text.offline);
        }
      });
    return () => { active = false; };
  }, [text.offline]);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !user || !selectedSubjectId) return;
    setConnectionState('connecting');
    setMessages([]);
    setParticipants([]);
    const socket = io(getApiSocketOrigin(), {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelayMax: 5000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('room:join', { subjectId: selectedSubjectId }, (result: {
        error?: string;
        messages?: RoomMessage[];
        participants?: RoomParticipant[];
      }) => {
        if (result?.error) {
          setConnectionState('error');
          setErrorMessage(result.error);
          return;
        }
        setConnectionState('connected');
        setMessages(result.messages || []);
        setParticipants(result.participants || []);
      });
    });
    socket.on('connect_error', (error: Error) => {
      setConnectionState('error');
      setErrorMessage(error.message || text.connectError);
    });
    socket.on('disconnect', () => setConnectionState('connecting'));
    socket.on('chat:message', (message: RoomMessage) => {
      setMessages(current => current.some(item => item.id === message.id)
        ? current
        : [...current, message].slice(-100));
    });
    socket.on('presence:joined', (participant: RoomParticipant) => {
      setParticipants(current => current.some(item => item.userId === participant.userId)
        ? current
        : [...current, participant]);
    });
    socket.on('presence:left', (participant: { userId: string }) => {
      setParticipants(current => current.filter(item => item.userId !== participant.userId));
    });
    socket.on('focus:update', (update: RoomParticipant) => {
      setParticipants(current => current.map(item => item.userId === update.userId
        ? { ...item, ...update }
        : item));
    });
    socket.on('focus:boost', (boost: FocusBoost) => {
      setBoosts(current => [...current.slice(-3), boost]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authStatus, selectedSubjectId, text.connectError, user]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const list = messageListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!focusEndsAt) return;
    const remaining = Math.max(0, Math.ceil((focusEndsAt - Date.now()) / 1000));
    setSecondsRemaining(remaining);
    if (remaining > 0) return;

    setFocusEndsAt(null);
    setSecondsRemaining(25 * 60);
    socketRef.current?.emit('focus:update', { focusEndsAt: null, remainingSeconds: 25 * 60 });
    logFocusSession({
      subjectId: selectedSubjectId,
      durationMinutes: 25,
      actualMinutes: 25,
      type: 'pomodoro',
      completedAt: new Date().toISOString(),
      rating: 5
    });
    void apiRequest('/focus-sessions', {
      method: 'POST',
      body: JSON.stringify({
        subjectId: selectedSubjectId,
        durationMinutes: 25,
        actualMinutes: 25,
        sessionType: 'pomodoro',
        completedAt: new Date().toISOString(),
        rating: 5
      })
    }).catch(error => setErrorMessage(error instanceof Error ? error.message : text.connectError));
  }, [focusEndsAt, logFocusSession, selectedSubjectId, text.connectError]);

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    try {
      const path = isRegistering ? '/auth/register' : '/auth/login';
      const payload = isRegistering
        ? { email, password, displayName, streamId: profile.streamId }
        : { email, password };
      const result = await apiRequest<{ user: ApiUser }>(path, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setUser(result.user);
      setAuthStatus('authenticated');
      setPassword('');
      setAuthError(isRegistering ? text.accountCreated : '');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : text.offline);
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST', body: '{}' });
      setUser(null);
      setAuthStatus('anonymous');
      setParticipants([]);
      setMessages([]);
      setFocusEndsAt(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : text.connectError);
    }
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const body = messageDraft.trim();
    if (!body || body.length > 500 || isSending || !socketRef.current) return;
    setIsSending(true);
    socketRef.current.emit('chat:send', { body }, (result: { error?: string }) => {
      setIsSending(false);
      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }
      setMessageDraft('');
    });
  };

  const toggleFocusSession = () => {
    if (focusEndsAt) {
      const remainingSeconds = Math.max(0, Math.ceil((focusEndsAt - Date.now()) / 1000));
      setSecondsRemaining(remainingSeconds);
      setFocusEndsAt(null);
      socketRef.current?.emit('focus:update', { focusEndsAt: null, remainingSeconds });
      return;
    }
    const endsAt = Date.now() + secondsRemaining * 1000;
    setFocusEndsAt(endsAt);
    socketRef.current?.emit('focus:update', { focusEndsAt: endsAt, remainingSeconds: secondsRemaining });
  };

  const sendBoost = (emoji: string) => {
    socketRef.current?.emit('focus:boost', { emoji }, (result: { error?: string }) => {
      if (result?.error) setErrorMessage(result.error);
    });
  };

  const updateNotificationPreference = async (field: 'emailNotifications' | 'telegramNotifications', value: boolean) => {
    if (!user) return;
    try {
      const result = await apiRequest<{ user: ApiUser }>('/profile', {
        method: 'PATCH',
        body: JSON.stringify({ [field]: value })
      });
      setUser(result.user);
      setErrorMessage(text.preferencesSaved);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : text.connectError);
    }
  };

  const requestTelegramLink = async () => {
    try {
      const result = await apiRequest<{ link: string }>('/notifications/telegram/link', {
        method: 'POST',
        body: '{}'
      });
      setTelegramLink(result.link);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : text.connectError);
    }
  };

  const currentUserId = user?.id || '';
  const streamParticipants = participants.filter(participant => user && participant.userId);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in pb-12">
      <header className="flex flex-col gap-3 border-b border-theme-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-theme-text">
            <Users className="h-6 w-6 text-theme-primary" />
            {text.title}
          </h1>
          <p className="mt-1 text-sm text-theme-muted">{text.subtitle}</p>
        </div>
        {authStatus === 'authenticated' && (
          <div className={`flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${
            connectionState === 'connected'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
              : 'border-theme-border bg-theme-card text-theme-muted'
          }`}>
            <Radio className="h-4 w-4" />
            {connectionState === 'connected'
              ? `${participants.length} ${text.online}`
              : connectionState === 'error'
                ? text.connectError
                : text.connecting}
          </div>
        )}
      </header>

      {authStatus !== 'authenticated' && (
        <section className="mx-auto max-w-xl rounded-2xl border border-theme-border bg-theme-card p-6 shadow-card">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-theme-primary-light text-theme-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-theme-text">{text.accountTitle}</h2>
              <p className="text-xs leading-5 text-theme-muted">{text.setupDescription}</p>
            </div>
          </div>
          {authStatus === 'checking' ? (
            <p className="text-sm text-theme-muted">{text.connecting}</p>
          ) : authStatus === 'offline' ? (
            <div role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-theme-text">
              {authError || text.offline}
              <button type="button" className="ms-3 font-bold text-theme-primary underline" onClick={() => window.location.reload()}>
                {text.submit}
              </button>
            </div>
          ) : (
            <form onSubmit={submitAuth} className="space-y-3">
              {isRegistering && (
                <label className="block text-xs font-bold text-theme-text">
                  {text.displayName}
                  <input
                    value={displayName}
                    onChange={event => setDisplayName(event.target.value)}
                    required
                    maxLength={32}
                    autoComplete="nickname"
                    className="mt-1 w-full rounded-xl border border-theme-border bg-theme-bg px-3 py-2.5 text-sm font-normal"
                  />
                </label>
              )}
              <label className="block text-xs font-bold text-theme-text">
                {text.email}
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="mt-1 w-full rounded-xl border border-theme-border bg-theme-bg px-3 py-2.5 text-sm font-normal"
                />
              </label>
              <label className="block text-xs font-bold text-theme-text">
                {text.password}
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                  minLength={12}
                  maxLength={128}
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  className="mt-1 w-full rounded-xl border border-theme-border bg-theme-bg px-3 py-2.5 text-sm font-normal"
                />
              </label>
              <p className="text-[11px] text-theme-muted">{text.accountHint}</p>
              {authError && <p role="alert" className="text-xs text-rose-600">{authError}</p>}
              <button type="submit" className="w-full rounded-xl bg-theme-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-theme-primary-hover">
                {isRegistering ? text.register : text.login}
              </button>
              <button
                type="button"
                onClick={() => { setIsRegistering(value => !value); setAuthError(''); }}
                className="w-full py-2 text-xs font-bold text-theme-primary"
              >
                {isRegistering ? text.switchLogin : text.switchRegister}
              </button>
            </form>
          )}
        </section>
      )}

      {authStatus === 'authenticated' && (
        <>
          {errorMessage && (
            <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700">
              <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage('')} aria-label="Close" className="font-bold">×</button>
            </div>
          )}
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
            <section className="space-y-5">
              <div className="rounded-2xl border border-theme-border bg-theme-card p-5 shadow-card">
                <h2 className="mb-3 text-sm font-bold text-theme-text">{text.notificationSettings}</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-3 text-xs text-theme-text">
                    <span>{text.emailAlerts}</span>
                    <input
                      type="checkbox"
                      checked={user?.emailNotifications || false}
                      onChange={event => void updateNotificationPreference('emailNotifications', event.target.checked)}
                      className="h-4 w-4 accent-theme-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-3 text-xs text-theme-text">
                    <span>{text.telegramAlerts}</span>
                    <input
                      type="checkbox"
                      checked={user?.telegramNotifications || false}
                      disabled={!user?.telegramChatId}
                      onChange={event => void updateNotificationPreference('telegramNotifications', event.target.checked)}
                      className="h-4 w-4 accent-theme-primary disabled:opacity-40"
                    />
                  </label>
                  {user?.telegramChatId ? (
                    <p className="text-[11px] font-semibold text-emerald-700">{text.telegramLinked}</p>
                  ) : telegramLink ? (
                    <a
                      href={telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg bg-theme-primary-light px-3 py-2 text-[11px] font-bold text-theme-primary"
                    >
                      {text.openTelegramLink}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void requestTelegramLink()}
                      className="rounded-lg border border-theme-border px-3 py-2 text-[11px] font-bold text-theme-primary hover:bg-theme-card-hover"
                    >
                      {text.linkTelegram}
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-theme-border bg-theme-card p-5 shadow-card">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label htmlFor="study-room-subject" className="block text-xs font-bold text-theme-muted">
                    {text.chooseSubject}
                  </label>
                  <button type="button" onClick={() => void logout()} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold text-theme-muted hover:bg-theme-card-hover">
                    <LogOut className="h-3.5 w-3.5" />{text.logout}
                  </button>
                </div>
                <select
                  id="study-room-subject"
                  value={selectedSubjectId}
                  onChange={event => setSelectedSubjectId(event.target.value)}
                  className="w-full rounded-xl border border-theme-border bg-theme-card px-3 py-3 text-sm font-bold text-theme-text focus:border-theme-primary focus:outline-none"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {language === 'ar' ? subject.nameAr : language === 'fr' ? subject.nameFr : subject.nameEn}
                    </option>
                  ))}
                </select>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-theme-card-hover/60 p-4">
                  <div>
                    <p className="text-xs font-bold text-theme-muted">{text.focus}</p>
                    <p className="mt-1 font-mono text-3xl font-black text-theme-text" aria-live="polite">
                      {formatTime(secondsRemaining)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFocusSession}
                    disabled={connectionState !== 'connected'}
                    className="rounded-xl bg-theme-primary px-4 py-3 text-xs font-bold text-white transition hover:bg-theme-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {focusEndsAt
                      ? text.stopFocus
                      : secondsRemaining < 25 * 60
                        ? text.resumeFocus
                        : text.startFocus}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-theme-border bg-theme-card p-5 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-bold text-theme-text">
                    <Users className="h-5 w-5 text-theme-primary" />
                    {text.participants}
                  </h2>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {streamParticipants.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {streamParticipants.map(participant => {
                    const isFocusing = participant.focusEndsAt !== null && participant.focusEndsAt > now;
                    return (
                      <div key={participant.userId} className="flex items-center justify-between gap-3 rounded-xl bg-theme-card-hover/50 p-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-theme-primary-light text-sm font-black text-theme-primary">
                            {participant.displayName.slice(0, 1)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-theme-text">
                              {participant.displayName}{participant.userId === currentUserId ? ` (${text.you})` : ''}
                            </p>
                            <p className="truncate text-xs text-theme-muted">{subjectName(selectedSubjectId)}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isFocusing ? 'bg-indigo-500/10 text-indigo-600' : 'bg-theme-subtle text-theme-muted'
                        }`}>
                          {isFocusing
                            ? `${formatTime(Math.max(0, Math.ceil((participant.focusEndsAt! - now) / 1000)))}`
                            : text.focusIdle}
                        </span>
                      </div>
                    );
                  })}
                  {streamParticipants.length === 0 && (
                    <p className="rounded-xl bg-theme-card-hover/50 p-4 text-sm leading-6 text-theme-muted">
                      {connectionState === 'connected' ? text.noParticipants : text.connecting}
                    </p>
                  )}
                </div>
                <p className="mt-4 flex items-center gap-2 text-[11px] text-theme-muted">
                  <Volume2 className="h-4 w-4 shrink-0" />
                  {text.displayNameNotice}
                </p>
              </div>
            </section>

            <section className="flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-theme-border bg-theme-card shadow-card">
              <div className="flex items-center justify-between border-b border-theme-border p-4">
                <div>
                  <h2 className="flex items-center gap-2 font-bold text-theme-text">
                    <MessageCircle className="h-5 w-5 text-theme-primary" />
                    {text.roomChat}
                  </h2>
                  <p className="mt-1 text-[11px] text-theme-muted">{subjectName(selectedSubjectId)} · {text.chatHint}</p>
                </div>
                <div className="flex gap-1">
                  {['💪', '✨', '👏'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => sendBoost(emoji)}
                      disabled={connectionState !== 'connected'}
                      aria-label={text.boost}
                      title={text.boost}
                      className="rounded-lg p-2 text-lg transition hover:bg-theme-card-hover disabled:opacity-40"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {boosts.length > 0 && (
                <div aria-live="polite" className="flex flex-wrap gap-2 border-b border-theme-border px-4 py-2">
                  {boosts.slice(-3).map(boost => (
                    <span key={boost.id} className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-700">
                      {boost.emoji} {boost.senderName} · {text.boostSent}
                    </span>
                  ))}
                </div>
              )}

              <div ref={messageListRef} className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
                {messages.map(message => (
                  <article
                    key={message.id}
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                      message.userId === currentUserId
                        ? 'ms-auto rounded-ee-sm bg-theme-primary text-white'
                        : 'me-auto rounded-es-sm bg-theme-card-hover text-theme-text'
                    }`}
                  >
                    <p className={`mb-1 text-[10px] font-bold ${message.userId === currentUserId ? 'text-white/75' : 'text-theme-primary'}`}>
                      {message.userId === currentUserId ? text.you : message.displayName}
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6" dir="auto">{message.body}</p>
                    <time className={`mt-1 block text-end text-[9px] ${message.userId === currentUserId ? 'text-white/65' : 'text-theme-muted'}`}>
                      {new Intl.DateTimeFormat(language, { hour: '2-digit', minute: '2-digit' }).format(new Date(message.createdAt))}
                    </time>
                  </article>
                ))}
                {messages.length === 0 && (
                  <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-sm text-theme-muted">
                    <Sparkles className="h-6 w-6 text-theme-primary/60" />
                    {connectionState === 'connected' ? text.emptyChat : text.connecting}
                  </div>
                )}
              </div>

              <form onSubmit={sendMessage} className="border-t border-theme-border p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    value={messageDraft}
                    onChange={event => setMessageDraft(event.target.value.slice(0, 500))}
                    onKeyDown={event => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    maxLength={500}
                    rows={2}
                    placeholder={text.messagePlaceholder}
                    aria-label={text.messagePlaceholder}
                    disabled={connectionState !== 'connected'}
                    className="min-h-11 flex-1 resize-none rounded-xl border border-theme-border bg-theme-bg px-3 py-2.5 text-sm text-theme-text placeholder:text-theme-muted focus:border-theme-primary focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={connectionState !== 'connected' || !messageDraft.trim() || isSending}
                    aria-label={text.send}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-primary text-white transition hover:bg-theme-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {language === 'ar' ? <ArrowUp className="h-5 w-5" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-theme-muted">
                  <span>{text.chatHint}</span>
                  <span>{messageDraft.length}/500</span>
                </div>
              </form>
            </section>
          </div>
        </>
      )}
    </div>
  );
};
