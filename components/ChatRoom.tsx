import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebase'; // تأكد من مسار ملف الـ firebase حسب مكان المكون
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const ChatRoom: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. مراقبة حالة المصادقة (Auth State)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. جلب الرسائل في الوقت الفعلي (Real-time Firestore)
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 3. تسجيل الدخول أو إنشاء حساب
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 4. إرسال رسالة جديدة
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error("خطأ في إرسال الرسالة: ", err);
    }
  };

  // إذا لم يتم تسجيل الدخول، اعرض نموذج الدخول/التسجيل بالبريد
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl text-white">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">
            {isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول لصالون الشات'}
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">كلمة المرور</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium py-3 rounded-lg text-white shadow-lg"
            >
              {isRegistering ? 'تسجيل حساب' : 'دخول إلى الصالون'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-indigo-400 hover:underline focus:outline-none"
            >
              {isRegistering ? 'لديك حساب بالفعل؟ سجل الدخول' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // واجهة الشات الجماعي في الوقت الحقيقي
  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-white">
      {/* شريط علوي مع زر الخروج */}
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <div>
          <h3 className="font-bold text-lg text-indigo-400">صالون التركيز الجماعي</h3>
          <p className="text-xs text-slate-400">متصل بـ: {user.email}</p>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 px-4 py-1.5 rounded-lg text-sm transition-colors"
        >
          خروج
        </button>
      </div>

      {/* قائمة الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.uid === user.uid;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-slate-500 mb-1 px-1">{msg.email}</span>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* صندوق كتابة وإرسال الرسائل */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك للزملاء هنا..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
        />
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-6 py-3 rounded-xl font-medium text-sm shadow-lg"
        >
          إرسال
        </button>
      </form>
    </div>
  );
};
