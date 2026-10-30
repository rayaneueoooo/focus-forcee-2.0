// إعداد Firebase وتصدير الخدمات للاستعمال في المشروع
const firebaseConfig = {
    apiKey: "حط_API_Key_هنا",
    authDomain: "حط_Auth_Domain_هنا",
    projectId: "حط_Project_ID_هنا",
    storageBucket: "حط_Storage_Bucket_هنا",
    messagingSenderId: "حط_Messaging_Sender_Id_هنا",
    appId: "حط_App_Id_هنا"
};

// التأكد من عدم تهيئة Firebase أكثر من مرة
const app = !window.firebase.apps.length 
    ? window.firebase.initializeApp(firebaseConfig) 
    : window.firebase.app();

export const auth = window.firebase.auth();
export const db = window.firebase.firestore();
