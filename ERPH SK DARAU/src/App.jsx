import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, doc, setDoc, updateDoc, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { User, FileText, CheckCircle, BarChart3, LogOut, MessageSquare, Save, Search, School, Lock, Clock, Mail, AlertTriangle, Send, LogIn, KeyRound, ChevronRight, Users, ShieldCheck, ExternalLink, X, Calendar, Filter, ChevronLeft, ChevronDown, ThumbsUp, Megaphone, Bell, Info, AlertOctagon, RefreshCw, Copy, ClipboardCopy, SendHorizonal } from 'lucide-react';

// --- FIREBASE CONFIGURATION (LIVE SK DARAU 2026) ---
const firebaseConfig = {
  // KEMBALI KEPADA ENVIRONMENT VARIABLE (BEST PRACTICE UNTUK GITHUB/VERCEL)
  // Pastikan anda set 'VITE_GOOGLE_API_KEY' di setting Vercel anda.
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "erph-sk-darau-2026.firebaseapp.com",
  projectId: "erph-sk-darau-2026",
  storageBucket: "erph-sk-darau-2026.firebasestorage.app",
  messagingSenderId: "604130256349",
  appId: "1:604130256349:web:f031c7363de450ab6e8234"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Nama Koleksi Database
const DB_COLLECTION = 'submissions_2026';
const DB_SETTINGS = 'settings_2026'; 

// --- Constants ---
const TOTAL_WEEKS = 42;
// Logo URL (Converted to Direct Link)
const LOGO_SK_DARAU = "https://lh3.googleusercontent.com/d/1iVOOLzgxpQv2BGFAPH1QuCgVxIR9GTmx";
const LOGO_TS25 = "https://lh3.googleusercontent.com/d/13aBIWqbHgWmnUACjF0dTpbL5mPfmiGO7";


// --- DATA GURU SK DARAU (72 ORANG) ---
const TEACHERS_DB = [
  { id: 'g-87240145', name: 'ABDUL AZIZ BIN ABDULLAH', email: 'g-87240145@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-05569692', name: 'AHMED GHAZALI BIN APIUDDIN', email: 'g-05569692@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-00564304', name: 'AINI NADZIRAH BINTI MOHD KHLUBI', email: 'g-00564304@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-47261544', name: 'ALDEY SUSIN', email: 'g-47261544@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-95254612', name: 'ANGELINA @ CHRISTIE GADAS', email: 'g-95254612@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-66240149', name: 'ASNILAH ASHKAR', email: 'g-66240149@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-23278580', name: 'AWANGKU SYAHRUDIN BIN AWANG DZULKARNAIN', email: 'g-23278580@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-17240150', name: 'AZMAN BIN MUSA', email: 'g-17240150@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-18240151', name: 'AZWANI IZZAURA BINTI BASRI', email: 'g-18240151@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-65240152', name: 'BINJAMIN LOSOD', email: 'g-65240152@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-28240156', name: 'DELORIA RUBY BINTI JUSKING', email: 'g-28240156@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-18240157', name: 'DG MARIANI BINTI AWANG JUHAD', email: 'g-18240157@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-84240158', name: 'DORIN BINTI ATIU', email: 'g-84240158@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-80241999', name: 'FAIDATHUL ADAWIAH BINTI A. MALEK', email: 'g-80241999@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-56240161', name: 'FAUSIA BINTI NASIR', email: 'g-56240161@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-32511002', name: 'HAFIZATUL BINTI MOHD ZAINI', email: 'g-32511002@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-94241064', name: 'HARIANA A. AHONG', email: 'g-94241064@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-16240163', name: 'HASLINAH BTE HUSSIN', email: 'g-16240163@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-38240165', name: 'IDA HENDRAMARIA BINTI SUKUR', email: 'g-38240165@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-79244893', name: 'JERRY BIN JULIAN', email: 'g-79244893@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-81273852', name: 'JINEO SIMUN', email: 'g-81273852@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-27240169', name: 'JOHAN @ MOHD JOHAN BIN JANA', email: 'g-27240169@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-60240170', name: 'JOMILIN BINTI SIBIN', email: 'g-60240170@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-18240172', name: 'JURIA BINTI JUSOH', email: 'g-18240172@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-48240174', name: 'KHAIRNIELISA @ KHAIRUNISA BINTI LIAM', email: 'g-48240174@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-97239289', name: 'KHAIRUL AZWANI BIN AHININ', email: 'g-97239289@moe-dl.edu.my', subject: 'Guru Akademik', avatar: 'https://drive.google.com/file/d/1_qqCMlpiQSwRTGFjM1OQbPwgSefQfm-8/view?usp=sharing' },
  { id: 'g-28241668', name: 'KUNG ANNY @ WAN NUR ARDINI ABDULLAH', email: 'g-28241668@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-40240177', name: 'LAWI ANAK KECHENDAI', email: 'g-40240177@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-06250632', name: 'LESLEY DESIREE EDANG', email: 'g-06250632@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-10240566', name: 'LORINA WILEH', email: 'g-10240566@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-46485985', name: 'MAISARAH BT ABD MALIK', email: 'g-46485985@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-16240178', name: 'MARIA BINTI JAMES MISSON', email: 'g-16240178@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-06240179', name: 'MARIATI BINTI MUSLEH', email: 'g-06240179@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-62237494', name: 'MARILYN SANDRA JEFFREY', email: 'g-62237494@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-32240181', name: 'MAZNIH BINTI MADIN', email: 'g-32240181@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-25256470', name: 'MELVIN HENRY', email: 'g-25256470@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-ipgp25204192', name: 'MUHAMMAD HAFIZ BIN ABDUL MUTALIB', email: 'g-ipgp25204192@moe-dl.edu.my', subject: 'Guru Akademik (Baru)', avatar: '' },
  { id: 'g-49240184', name: 'MUJOS BIN MIASIN', email: 'g-49240184@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-42240186', name: 'NONI BINTI ALI', email: 'g-42240186@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-50254583', name: 'NOORAIDY BINTI MUTANG', email: 'g-50254583@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-17514173', name: 'NOORIDZAM BIN YUNUS', email: 'g-17514173@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-62241201', name: 'NORAMIRA BINTI ALI', email: 'g-62241201@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-58241077', name: 'NORMAWANI BINTI TOMO', email: 'g-58241077@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-24240190', name: 'NORSAIDAH BINTI SAIDIN', email: 'g-24240190@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-96565422', name: 'NUR AFIFAH SOLEHAH BINTI ZULKIFLY', email: 'g-96565422@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-22568935', name: 'NUR AUFA HADHIRAH BINTI MOHD ADNAM', email: 'g-22568935@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-60567093', name: 'NUR AYU IZZATI BINTI BAHARIN', email: 'g-60567093@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-12250987', name: 'NUR FADLINA BINTI MOHD LAZIM', email: 'g-12250987@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-44215818', name: 'NURSHAFIZA BINTI SHAFIE', email: 'g-44215818@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-56240191', name: 'NURSIAH BINTI MADRAH', email: 'g-56240191@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-22240193', name: 'PATIMAH BINTI LASAIN', email: 'g-22240193@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-26240195', name: 'REBECCA BT JIMMY', email: 'g-26240195@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-16240196', name: 'ROHAMI BINTI LASSIM', email: 'g-16240196@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-96240199', name: 'ROSIE LIEW', email: 'g-96240199@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-30240201', name: 'ROSLINAH BINTI MOHD NOOR', email: 'g-30240201@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-84240202', name: 'ROSMAH BINTI KASMAN', email: 'g-84240202@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-10240203', name: 'RUSDAH IJUM', email: 'g-10240203@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-21241022', name: 'SABRI BIN BAHRIN', email: 'g-21241022@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-90240207', name: 'SANDAUYAH BINTI DATU UGAI', email: 'g-90240207@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-49183622', name: 'SHARIF BIN SAFIAI', email: 'g-49183622@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-74240210', name: 'SITI NABILAH BINTI SAJALI', email: 'g-74240210@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-66566831', name: 'SITI NADIA BINTI MOHD HERMIN', email: 'g-66566831@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-24240211', name: 'STAFFALDA PATRICK DAYU', email: 'g-24240211@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-61249319', name: 'SUKRAN BIN SAUIPUL AHMAD', email: 'g-61249319@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-60240212', name: 'SUMARTINI BINTI SEMAIL', email: 'g-60240212@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-44240213', name: 'SURIANTI BINTI IRWAN', email: 'g-44240213@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-12240214', name: 'SUZAN KOJUNA', email: 'g-12240214@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-94511001', name: 'SUZANAH AWANG HUSSIN', email: 'g-94511001@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-06240215', name: 'VICTORIA JOHN', email: 'g-06240215@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-16240217', name: 'WINNY TAN TZE CHING', email: 'g-16240217@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-84240218', name: 'YUSNI BINTI YUNUS', email: 'g-84240218@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' },
  { id: 'g-44524756', name: 'ZURIDHAH WAMIN', email: 'g-44524756@moe-dl.edu.my', subject: 'Guru Akademik', avatar: '' }
];

// --- HELPER: AUTO-CONVERT GOOGLE DRIVE LINKS TO IMAGE PREVIEW ---
const getAvatarUrl = (url) => {
  if (!url) return null;
  if (url.includes('drive.google.com') && url.includes('/d/')) {
    const idMatch = url.match(/\/d\/(.*?)\//);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }
  return url;
};

// --- HELPER: DATE FORMATTER MALAYSIA ---
const formatDateMY = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('ms-MY', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });
};

const formatDateRange = (start, end) => {
  if (!start || !end) return "Tarikh belum ditetapkan";
  const s = new Date(start);
  const e = new Date(end);
  const options = { day: 'numeric', month: 'short' };
  return `${s.toLocaleDateString('ms-MY', options)} - ${e.toLocaleDateString('ms-MY', options)}`;
};

const formatDeadline = (deadlineStr) => {
  if (!deadlineStr) return "Belum ditetapkan";
  return new Date(deadlineStr).toLocaleString('ms-MY', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
};

// --- HELPER: SEND INDIVIDUAL EMAIL (PAUTAN TERUS GMAIL) ---
const sendIndividualEmail = (teacher, type, extraData = {}) => {
    if (!teacher.email) {
        alert("Guru ini tiada alamat email dalam sistem.");
        return;
    }

    let subject = "";
    let body = "";

    if (type === 'missing') {
        subject = `PERINGATAN: RPH Minggu ${extraData.week} Belum Diterima`;
        body = `Assalamualaikum dan Salam Sejahtera ${teacher.name},\n\nSemakan mendapati tuan/puan masih belum menghantar RPH bagi Minggu ${extraData.week}. Sila hantar dengan kadar segera.\n\nTerima kasih.\nPentadbir SK Darau`;
    } else if (type === 'grading') {
        subject = `KEPUTUSAN SEMAKAN RPH: Minggu ${extraData.week}`;
        body = `Assalamualaikum ${teacher.name},\n\nRPH Minggu ${extraData.week} anda telah disemak.\n\nMARKAH: ${extraData.score}%\nULASAN: ${extraData.comment}\n\nTerima kasih atas komitmen anda.\nPentadbir SK Darau`;
    } else if (type === 'general') {
        subject = `Hubungi Pentadbir: ${teacher.name}`;
        body = `Assalamualaikum ${teacher.name},\n\nMerujuk kepada perkara...`;
    }

    // Gunakan pautan Gmail khas (view=cm) untuk buka tetingkap tulis email secara terus
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${teacher.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
};

// --- ADMIN ACCESS CONFIGURATION (TIADA AVATAR - KOSONGKAN MEDAN AVATAR) ---
// Nota: Medan "avatar" dibiarkan kosong ('') supaya ikon lidi (User) dipaparkan secara automatik.
const ADMIN_PROFILES = [
  { id: 'admin_gb', name: 'Guru Besar', roleLabel: 'GB', access: 'all', description: 'Akses Penuh (Semua Guru)', avatar: '', color: 'bg-purple-600' },
  { id: 'admin_sys', name: 'Admin ICT', roleLabel: 'ADMIN', access: 'all', description: 'Akses Penuh (Penyelenggaraan)', avatar: '', color: 'bg-slate-800' },
  { id: 'admin_pk1', name: 'PK Pentadbiran', roleLabel: 'PK1', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru Subjek Teras', avatar: '', color: 'bg-blue-600' },
  { id: 'admin_hem', name: 'PK HEM', roleLabel: 'PKHEM', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru PI & Sejarah', avatar: '', color: 'bg-green-600' },
  { id: 'admin_koko', name: 'PK Kokurikulum', roleLabel: 'PKKOKUM', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru RBT & PJPK', avatar: '', color: 'bg-orange-600' },
  { id: 'admin_petang', name: 'PK Petang', roleLabel: 'PKPETANG', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru Sesi Petang', avatar: '', color: 'bg-indigo-600' },
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        try { await signInAnonymously(auth); } catch (error) { console.error("Auth Error:", error); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return () => unsubscribe();
  }, []);

  const handleLogin = (selectedRole, profile = null) => { setRole(selectedRole); setCurrentProfile(profile); };
  const handleLogout = () => { setRole(null); setCurrentProfile(null); };

  if (loading) return <div className="flex flex-col h-screen items-center justify-center bg-slate-50 gap-4"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div><div className="text-blue-800 font-bold animate-pulse">Menghubungkan ke Database Sekolah...</div></div>;

  if (!role) return <LoginScreen onLogin={handleLogin} teachers={TEACHERS_DB} />;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      <Navbar role={role} profile={currentProfile} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto p-4 md:p-6 max-w-7xl">
        {role === 'admin' ? (
          <AdminDashboard user={user} teachers={TEACHERS_DB} currentProfile={currentProfile} />
        ) : (
          <TeacherPortal user={user} profile={currentProfile} />
        )}
      </main>
    </div>
  );
}

// --- LOGIN SCREEN ---
function LoginScreen({ onLogin, teachers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAdminList, setShowAdminList] = useState(false);

  const filteredTeachers = useMemo(() => teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.email.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, teachers]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === "1234") { onLogin(userType, selectedUser); setSelectedUser(null); setPinInput(""); } 
    else { setErrorMsg("PIN Salah. Sila cuba lagi."); setPinInput(""); }
  };

  const openPinModal = (user, type) => { setSelectedUser(user); setUserType(type); setErrorMsg(""); setPinInput(""); };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-900 md:justify-center p-4">
      <div className="w-full max-w-md md:max-w-5xl md:flex md:h-[80vh] md:rounded-3xl md:overflow-hidden md:bg-white md:shadow-2xl">
        <div className="bg-blue-600 p-8 rounded-t-3xl md:rounded-none md:w-2/5 flex flex-col items-center justify-center text-center text-white relative">
          <div className="flex gap-4 mb-6 justify-center">
             <img src={LOGO_SK_DARAU} alt="SK Darau" className="w-24 h-24 object-contain drop-shadow-md bg-white rounded-full p-2" />
             <img src={LOGO_TS25} alt="TS25" className="w-24 h-24 object-contain drop-shadow-md bg-white rounded-lg p-2" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">e-RPH SK DARAU 2026</h1>
          <p className="text-blue-100 text-sm mb-8">Portal Pengurusan RPH Digital</p>

          {!showAdminList ? (
            <button onClick={() => setShowAdminList(true)} className="w-full bg-white text-blue-700 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:bg-blue-50 transition-all group">
              <Lock size={18} className="text-blue-400 group-hover:text-blue-600" /> Akses Pentadbir
            </button>
          ) : (
             <div className="w-full animate-in fade-in slide-in-from-left-4">
                <div className="flex justify-between items-center mb-4 border-b border-blue-400/30 pb-2">
                   <h3 className="font-bold text-white">Pilih Jawatan</h3>
                   <button onClick={() => setShowAdminList(false)} className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30">Batal</button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                   {ADMIN_PROFILES.map(admin => (
                      <button key={admin.id} onClick={() => openPinModal(admin, 'admin')} className="w-full flex items-center gap-3 p-2 bg-blue-700/50 hover:bg-blue-500 rounded-lg text-left transition-colors border border-blue-500/30">
                         {admin.avatar ? <img src={admin.avatar} className="w-8 h-8 rounded-full bg-white/10"/> : <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><User size={16} /></div>}
                         <div><span className="block text-xs font-bold text-white">{admin.name}</span><span className="block text-[10px] text-blue-200">{admin.roleLabel}</span></div>
                      </button>
                   ))}
                </div>
             </div>
          )}
        </div>

        <div className="bg-slate-50 flex-1 p-6 md:p-8 flex flex-col rounded-b-3xl md:rounded-none min-h-[50vh]">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Log Masuk Guru</h2>
            <p className="text-sm text-gray-500">Pilih nama anda untuk log masuk.</p>
          </div>
          <div className="relative mb-4">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari nama atau email MOE..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {filteredTeachers.map((teacher, index) => (
              <button key={teacher.id} onClick={() => openPinModal(teacher, 'teacher')} className="w-full flex items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-left group">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3 shrink-0">{index + 1}</div>
                {teacher.avatar ? (
                  <img src={getAvatarUrl(teacher.avatar)} alt="Avatar" className="w-10 h-10 rounded-full mr-3 bg-slate-100 object-cover hidden sm:block" />
                ) : (
                  <div className="w-10 h-10 rounded-full mr-3 bg-slate-200 flex items-center justify-center text-slate-400 hidden sm:flex">
                    <User size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="block font-bold text-gray-800 truncate group-hover:text-blue-700 text-sm md:text-base">{teacher.name}</span>
                  <span className="block text-[10px] md:text-xs text-gray-500">{teacher.email}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-50"><ChevronRight size={18} className="text-gray-400 group-hover:text-blue-500" /></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`${userType === 'admin' ? selectedUser.color : 'bg-blue-600'} p-6 text-center text-white`}>
               <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-3 text-white backdrop-blur-sm overflow-hidden">
                 {selectedUser.avatar ? <img src={getAvatarUrl(selectedUser.avatar)} className="w-full h-full object-cover"/> : <KeyRound size={32} />}
               </div>
               <h3 className="font-bold text-lg">{userType === 'admin' ? `Akses ${selectedUser.name}` : 'Keselamatan Folder'}</h3>
               <p className="text-white/80 text-sm">{userType === 'admin' ? 'Masukkan PIN Pentadbir' : `PIN diperlukan untuk ${selectedUser.name}`}</p>
            </div>
            <form onSubmit={handlePinSubmit} className="p-6">
              <div className="mb-6 text-center">
                 <input type="password" autoFocus maxLength={4} placeholder="• • • •" className="w-full text-center text-3xl tracking-[1em] font-bold py-3 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors text-gray-800 placeholder:text-gray-300" value={pinInput} onChange={(e) => setPinInput(e.target.value)} />
                 <p className="text-xs text-gray-400 mt-2">PIN Demo: 1234</p>
              </div>
              {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg text-center flex items-center justify-center gap-2"><AlertTriangle size={14} /> {errorMsg}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelectedUser(null)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50">Batal</button>
                <button type="submit" disabled={pinInput.length < 4} className={`flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed ${userType === 'admin' ? selectedUser.color : 'bg-blue-600 hover:bg-blue-700'}`}>Masuk</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar({ role, profile, onLogout }) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        <div className="flex items-center gap-3">
          <img src={LOGO_SK_DARAU} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-gray-800 text-lg tracking-tight hidden sm:inline">e-RPH <span className="text-blue-600">SK DARAU 2026</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{profile?.name}</p>
            <p className="text-[10px] uppercase font-bold text-gray-500">{role === 'admin' ? profile?.roleLabel : 'Guru'}</p>
          </div>
          <button onClick={onLogout} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"><LogOut size={20} /></button>
        </div>
      </div>
    </nav>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ user, teachers, currentProfile }) {
  const [viewMode, setViewMode] = useState('list'); 
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // NEW STATE FOR LIVE PREVIEW
  const [announcement, setAnnouncement] = useState(null);

  const accessibleTeachers = useMemo(() => {
    if (currentProfile.access === 'all') return teachers;
    else if (currentProfile.access === 'restricted') return teachers; 
    return [];
  }, [teachers, currentProfile]);

  // NEW EFFECT TO FETCH ANNOUNCEMENT FOR ADMIN PREVIEW
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const annDoc = await getDoc(doc(db, DB_SETTINGS, 'announcement'));
        if (annDoc.exists()) setAnnouncement(annDoc.data());
      } catch (e) { console.log(e); }
    };
    fetchAnnouncement();
  }, [viewMode]); 

  const filteredTeachers = accessibleTeachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard {currentProfile.roleLabel}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
             <ShieldCheck size={16} className="text-green-600" />
             <span>{currentProfile.description}</span>
             <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{accessibleTeachers.length} Guru</span>
          </div>
        </div>
      </div>

      {/* ADMIN LIVE PREVIEW BANNER */}
      {announcement?.isActive && announcement?.text && (
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
           <div className="bg-yellow-100 p-2 rounded text-yellow-700 shrink-0"><Megaphone size={20}/></div>
           <div>
              <h4 className="font-bold text-yellow-800 text-xs uppercase tracking-wide mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Status: Sedang Dipaparkan Kepada Guru
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed">{announcement.text}</p>
           </div>
        </div>
      )}

      <div className="bg-white p-1 rounded-xl border border-gray-200 inline-flex shadow-sm w-full md:w-auto overflow-x-auto">
        <div className="flex gap-1 min-w-full">
            <button onClick={() => setViewMode('list')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${viewMode === 'list' ? `${currentProfile.color} text-white shadow` : 'text-gray-600 hover:bg-gray-50'}`}><BarChart3 size={18} /> Senarai Guru</button>
            <button onClick={() => setViewMode('audit')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${viewMode === 'audit' ? 'bg-white text-red-600 border border-red-100 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}><Mail size={18} /> Audit & Email</button>
            <button onClick={() => setViewMode('calendar')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${viewMode === 'calendar' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}><Calendar size={18} /> Tetapan Takwim</button>
            <button onClick={() => setViewMode('announcement')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${viewMode === 'announcement' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}><Megaphone size={18} /> Pengumuman</button>
        </div>
      </div>

      {viewMode === 'list' && !selectedTeacher && (
        <div className="space-y-4">
          <div className="relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder={`Cari dalam senarai ${accessibleTeachers.length} guru...`} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeachers.map((teacher) => <TeacherCard key={teacher.id} teacher={teacher} onClick={() => setSelectedTeacher(teacher)} user={user} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed"><Users size={48} className="mx-auto mb-2 opacity-20" /><p>Tiada guru ditemui.</p></div>
          )}
        </div>
      )}

      {viewMode === 'list' && selectedTeacher && (
        <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
           <button onClick={() => setSelectedTeacher(null)} className="text-gray-600 hover:text-blue-600 flex items-center gap-2 font-bold text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all w-fit"><ChevronRight size={16} className="rotate-180" /> Kembali</button>
           <AdminGradingView user={user} teacher={selectedTeacher} />
        </div>
      )}

      {viewMode === 'audit' && <EmailAutomationPanel user={user} teachers={accessibleTeachers} />}
      {viewMode === 'calendar' && <CalendarSettingsPanel user={user} />}
      {viewMode === 'announcement' && <AnnouncementPanel user={user} />}
    </div>
  );
}

// --- ANNOUNCEMENT PANEL ---
function AnnouncementPanel() {
  const [announcement, setAnnouncement] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [type, setType] = useState('info'); 
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const calDoc = await getDoc(doc(db, DB_SETTINGS, 'school_calendar'));
        if (calDoc.exists()) setCalendarData(calDoc.data());

        const annDoc = await getDoc(doc(db, DB_SETTINGS, 'announcement'));
        if (annDoc.exists()) {
          setAnnouncement(annDoc.data().text || '');
          setIsActive(annDoc.data().isActive ?? true);
          setType(annDoc.data().type || 'info');
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const generateTemplate = () => {
    const start = calendarData[`week_${selectedWeek}_start`];
    const end = calendarData[`week_${selectedWeek}_end`];
    const deadline = calendarData[`week_${selectedWeek}_deadline`];
    if (!start || !end) { alert("Sila tetapkan tarikh minggu ini di 'Takwim' dahulu."); return; }

    const template = `PERHATIAN SEMUA GURU:\n\nPenghantaran RPH untuk Minggu ${selectedWeek} kini dibuka.\n\n📅 Tarikh: ${formatDateRange(start, end)}\n⏰ Tarikh Akhir: ${formatDeadline(deadline)}\n\nSila kemaskini folder Google Drive anda tepat pada masanya. Terima kasih.`;
    setAnnouncement(template);
    setType('info');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, DB_SETTINGS, 'announcement'), {
        text: announcement,
        isActive: isActive,
        type: type,
        updatedAt: new Date().toISOString()
      });
      alert("Pengumuman telah DI-LIVE-KAN!");
    } catch (e) { alert("Gagal menyimpan."); } finally { setSaving(false); }
  };

  const clearAnn = () => { setAnnouncement(''); setIsActive(false); };

  if (loading) return <div className="text-center py-10"><RefreshCw className="animate-spin mx-auto text-blue-600 mb-2"/> Memuatkan Siaraya...</div>;

  const getTypeStyles = (t) => {
    switch(t) {
      case 'warning': return { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', icon: <AlertOctagon size={24}/>, label: 'AMARAN' };
      case 'alert': return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', icon: <AlertTriangle size={24}/>, label: 'PENTING' };
      default: return { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800', icon: <Info size={24}/>, label: 'INFO' };
    }
  };

  const style = getTypeStyles(type);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      {/* KONTROL EDITOR */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Megaphone size={24} /></div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Editor Siaraya Live</h3>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Kawal Paparan Dashboard Guru</p>
          </div>
        </div>

        <div className="space-y-5">
           <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[10px] font-bold text-gray-400 w-full mb-1 uppercase">Kategori Pengumuman:</span>
              <button onClick={()=>setType('info')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${type==='info'?'bg-blue-600 text-white border-blue-600 shadow-lg':'bg-gray-50 text-gray-600 border-gray-200'}`}>Info</button>
              <button onClick={()=>setType('warning')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${type==='warning'?'bg-amber-500 text-white border-amber-500 shadow-lg':'bg-gray-50 text-gray-600 border-gray-200'}`}>Amaran</button>
              <button onClick={()=>setType('alert')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${type==='alert'?'bg-red-600 text-white border-red-600 shadow-lg':'bg-gray-50 text-gray-600 border-gray-200'}`}>Penting</button>
           </div>

           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Jana Mesej Mingguan:</label>
              <div className="flex gap-2">
                <select value={selectedWeek} onChange={(e)=>setSelectedWeek(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold">
                    {Array.from({length:42},(_,i)=>i+1).map(w => <option key={w} value={w}>Minggu {w}</option>)}
                </select>
                <button onClick={generateTemplate} className="flex-1 bg-blue-600 text-white text-[10px] font-extrabold uppercase py-2 rounded-lg hover:bg-blue-700 transition-all">Gunakan Template</button>
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Kandungan Mesej:</label>
              <textarea className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm min-h-[180px] leading-relaxed shadow-inner" placeholder="Tulis pengumuman..." value={announcement} onChange={(e)=>setAnnouncement(e.target.value)} />
           </div>

           <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">Status Live</span>
                  <span className="text-[10px] text-gray-400">Guru akan melihat ini jika aktif</span>
              </div>
              <button onClick={()=>setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
           </div>

           <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={clearAnn} className="py-3 rounded-xl border border-gray-300 text-gray-500 font-bold hover:bg-gray-50 text-xs">BERSIHKAN</button>
              <button onClick={handleSave} disabled={saving} className={`py-3 rounded-xl text-white font-extrabold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-xs ${isActive ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-gray-800 hover:bg-black shadow-slate-200'}`}>
                {saving ? 'PROSES...' : <><RefreshCw size={16}/> LIVE KAN SEKARANG</>}
              </button>
           </div>
        </div>
      </div>

      {/* LIVE PREVIEW DASHBOARD GURU */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Paparan Sisi Guru (Live Preview)</h3>
           {isActive && <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> <span className="text-[10px] font-bold text-red-600 uppercase">Sedang Live</span></div>}
        </div>
        <div className="bg-slate-100 rounded-3xl p-6 md:p-10 border-4 border-white shadow-2xl min-h-[400px] flex flex-col items-center">
            <div className="w-full bg-white rounded-2xl shadow-sm p-4 mb-4 flex justify-between items-center opacity-50">
                <div className="flex gap-2"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-yellow-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div></div>
                <div className="text-[10px] font-bold text-gray-300">DASHBOARD GURU</div>
                <div className="w-6 h-6 bg-slate-100 rounded-full"></div>
            </div>

            {/* PREVIEW BANNER SEBENAR */}
            {isActive && announcement ? (
              <div className={`w-full ${style.bg} border-l-4 ${style.border} rounded-r-xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 animate-in slide-in-from-top-4 duration-500`}>
                <div className={`bg-white p-2.5 rounded-full shadow-sm ${style.text} shrink-0 self-start`}>
                   {style.icon}
                </div>
                <div className="flex-1">
                    <h4 className={`font-extrabold ${style.text} text-[10px] uppercase tracking-widest mb-1 flex items-center gap-2`}>
                        {style.label} <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded animate-bounce">BARU</span>
                    </h4>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                      {announcement}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-2 italic tracking-tighter uppercase">DIKEMASKINI: {new Date().toLocaleTimeString('ms-MY')}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50/50">
                 Tiada Pengumuman Aktif
              </div>
            )}
            
            <div className="mt-auto w-full flex flex-col items-center opacity-20">
                <div className="w-16 h-16 bg-slate-300 rounded-full mb-3"></div>
                <div className="w-2/3 h-4 bg-slate-300 rounded mb-2"></div>
                <div className="w-1/2 h-3 bg-slate-300 rounded mb-6"></div>
                <div className="grid grid-cols-2 gap-4 w-full">
                   <div className="h-20 bg-slate-200 rounded-2xl"></div>
                   <div className="h-20 bg-slate-200 rounded-2xl"></div>
                </div>
            </div>
        </div>
        <p className="text-[10px] text-center text-gray-400 italic">"Gunakan Editor di kiri untuk mengemaskini paparan ini secara langsung."</p>
      </div>
    </div>
  );
}

// --- CALENDAR SETTINGS PANEL ---
function CalendarSettingsPanel() {
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const docSnap = await getDoc(doc(db, DB_SETTINGS, 'school_calendar'));
        if (docSnap.exists()) setCalendarData(docSnap.data());
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchCalendar();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, DB_SETTINGS, 'school_calendar'), calendarData);
      alert("Takwim berjaya disimpan!");
    } catch (e) { alert("Gagal menyimpan."); } finally { setSaving(false); }
  };

  const handleDataChange = (week, field, value) => {
    setCalendarData(prev => ({ ...prev, [`week_${week}_${field}`]: value }));
  };

  if (loading) return <div className="text-center py-10">Memuatkan takwim...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Tetapan Takwim 2026</h3>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Kawalan Tarikh & Deadline</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 w-full md:w-auto text-xs uppercase">
          {saving ? 'MENYIMPAN...' : 'SIMPAN SEMUA'}
        </button>
      </div>

      <div className="h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-3">
        {Array.from({ length: 42 }, (_, i) => i + 1).map(week => (
          <div key={week} className="flex flex-col md:flex-row md:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-100 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">M{week}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div>
                    <label className="text-[9px] font-bold text-gray-400 mb-1 block uppercase">Mula</label>
                    <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-xs" value={calendarData[`week_${week}_start`] || ''} onChange={(e)=>handleDataChange(week, 'start', e.target.value)}/>
                </div>
                <div>
                    <label className="text-[9px] font-bold text-gray-400 mb-1 block uppercase">Tamat</label>
                    <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-xs" value={calendarData[`week_${week}_end`] || ''} onChange={(e)=>handleDataChange(week, 'end', e.target.value)}/>
                </div>
                <div>
                    <label className="text-[9px] font-bold text-red-400 mb-1 block uppercase">Tarikh Akhir (Deadline)</label>
                    <input type="datetime-local" className="w-full p-2 border border-red-200 bg-red-50 rounded-lg text-xs font-bold text-red-700" value={calendarData[`week_${week}_deadline`] || ''} onChange={(e)=>handleDataChange(week, 'deadline', e.target.value)}/>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- EMAIL/AUDIT PANEL (FIXED EMAIL BUTTON WITH CLIPBOARD COPY & INDIVIDUAL EMAILS) ---
function EmailAutomationPanel({ teachers }) {
  const [targetWeek, setTargetWeek] = useState(1);
  const [lateList, setLateList] = useState([]);
  const [missingList, setMissingList] = useState([]);
  const [onTimeList, setOnTimeList] = useState([]);
  const [scanning, setScanning] = useState(false);

  const scanForLateSubmissions = async () => {
    setScanning(true);
    setLateList([]); setMissingList([]); setOnTimeList([]);
    try {
      const q = query(collection(db, DB_COLLECTION), where('week', '==', parseInt(targetWeek)));
      const querySnapshot = await getDocs(q);
      const submittedMap = {}; 
      querySnapshot.forEach(doc => submittedMap[doc.data().teacherId] = doc.data());

      const missing = []; const late = []; const onTime = [];
      teachers.forEach(t => {
          if (!submittedMap[t.id]) missing.push(t);
          else if (submittedMap[t.id].isLate) late.push({ ...t, ...submittedMap[t.id] });
          else onTime.push({ ...t, ...submittedMap[t.id] });
      });
      setMissingList(missing); setLateList(late); setOnTimeList(onTime);
    } catch (error) { alert("Gagal menyemak database."); } finally { setScanning(false); }
  };

  const triggerBatchEmail = async () => {
    if (missingList.length === 0) return;
    const emailList = missingList.map(t => t.email).filter(e => e).join(', ');
    try { await navigator.clipboard.writeText(emailList); } catch (err) { console.error(err); }
    const subject = encodeURIComponent(`PERINGATAN: Penghantaran RPH Minggu ${targetWeek}`);
    const body = encodeURIComponent(`Assalamualaikum dan Salam Sejahtera,\n\nMerujuk perkara di atas, semakan sistem mendapati tuan/puan belum menghantar RPH bagi Minggu ${targetWeek}.\n\nSila kemaskini pautan Google Drive anda di portal e-RPH dengan kadar segera.\n\nTerima kasih.\nPentadbir SK Darau`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    alert("✅ Senarai email guru telah disalin!\n\nSila 'PASTE' (Ctrl+V) senarai email tersebut di ruangan 'To' atau 'BCC' dalam Gmail yang baru dibuka.");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
         <div className="w-14 h-14 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-lg"><ShieldCheck size={28} /></div>
         <h3 className="text-xl font-bold text-gray-900">Audit Penghantaran RPH</h3>
         <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Sistem Pemantauan Pematuhan Tarikh</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center mb-8 shadow-inner">
        <div className="w-full">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Pilih Minggu Audit:</label>
          <select value={targetWeek} onChange={(e)=>setTargetWeek(e.target.value)} className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-800 outline-none shadow-sm">
            {Array.from({length: 42}, (_, i) => i + 1).map(w => <option key={w} value={w}>Minggu {w}</option>)}
          </select>
        </div>
        <button onClick={scanForLateSubmissions} disabled={scanning} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-100 uppercase text-xs">
          {scanning ? 'MENYEMAK...' : 'MULA AUDIT'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-green-200 rounded-2xl bg-green-50/30 overflow-hidden flex flex-col h-96 shadow-sm">
              <div className="p-4 bg-green-100 border-b border-green-200 flex justify-between items-center"><h4 className="font-bold text-green-800 text-xs uppercase flex items-center gap-2"><ThumbsUp size={16}/> TEPAT ({onTimeList.length})</h4></div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {onTimeList.map(t => <div key={t.id} className="p-2 bg-white rounded-lg border border-green-100 text-[10px] font-bold text-gray-700 shadow-sm truncate">{t.name}</div>)}
              </div>
          </div>
          <div className="border border-amber-200 rounded-2xl bg-amber-50/30 overflow-hidden flex flex-col h-96 shadow-sm">
              <div className="p-4 bg-amber-100 border-b border-amber-200"><h4 className="font-bold text-amber-800 text-xs uppercase flex items-center gap-2"><Clock size={16}/> LEWAT ({lateList.length})</h4></div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {lateList.map(t => (
                      <div key={t.id} className="p-2 bg-white rounded-lg border border-amber-100 text-[10px] font-bold text-gray-700 shadow-sm flex justify-between items-center group">
                          <span className="truncate flex-1">{t.name}</span>
                          <button onClick={() => sendIndividualEmail(t, 'missing', {week: targetWeek})} className="text-amber-500 hover:bg-amber-100 p-1 rounded transition-colors" title="Email Peringatan"><Mail size={12}/></button>
                      </div>
                  ))}
              </div>
          </div>
          <div className="border border-red-200 rounded-2xl bg-red-50/30 overflow-hidden flex flex-col h-96 shadow-sm">
              <div className="p-4 bg-red-100 border-b border-red-200 flex justify-between items-center">
                 <h4 className="font-bold text-red-800 text-xs uppercase flex items-center gap-2"><X size={16}/> BELUM ({missingList.length})</h4>
                 {missingList.length > 0 && (
                    <button onClick={triggerBatchEmail} className="text-[9px] bg-white text-red-600 px-3 py-1.5 rounded-full border border-red-200 hover:bg-red-50 font-extrabold shadow-sm uppercase flex items-center gap-1 transition-all hover:scale-105 active:scale-95 group">
                      <Copy size={10} className="group-hover:hidden" /> <Mail size={10} className="hidden group-hover:block" /> COPY & EMAIL
                    </button>
                 )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {missingList.map(t => (
                      <div key={t.id} className="p-2 bg-white rounded-lg border border-red-100 text-[10px] font-bold text-gray-700 shadow-sm flex justify-between items-center group">
                          <span className="truncate flex-1">{t.name}</span>
                          <button onClick={() => sendIndividualEmail(t, 'missing', {week: targetWeek})} className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors" title="Email Peringatan"><Mail size={12}/></button>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}

function TeacherCard({ teacher, onClick, user }) {
  const [stats, setStats] = useState({ submitted: 0 });
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, DB_COLLECTION), where('teacherId', '==', teacher.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let sub = 0; snapshot.forEach(doc => { if (doc.data().status !== 'pending') sub++; });
      setStats({ submitted: sub });
    });
    return () => unsubscribe();
  }, [user, teacher.id]);

  return (
    <div className="relative bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-400 cursor-pointer shadow-sm group hover:shadow-lg transition-all active:scale-[0.98]" onClick={onClick}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-100 flex items-center justify-center text-slate-400 font-black text-xs">
            {teacher.name.charAt(0)}
        </div>
        <div className="overflow-hidden flex-1">
            <h4 className="font-extrabold text-gray-900 text-xs truncate group-hover:text-blue-600">{teacher.name}</h4>
            <p className="text-[10px] text-gray-400 uppercase font-bold">{teacher.subject}</p>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); sendIndividualEmail(teacher, 'general'); }} 
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" 
            title="Hubungi Guru"
        >
            <Mail size={16}/>
        </button>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 font-black mb-2 uppercase"><span>PRESTASI</span><span>{Math.round((stats.submitted / TOTAL_WEEKS) * 100)}%</span></div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden"><div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(stats.submitted / TOTAL_WEEKS) * 100}%` }}></div></div>
    </div>
  );
}

function AdminGradingView({ user, teacher }) {
  const [submissions, setSubmissions] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [gradingMode, setGradingMode] = useState(false);
  const [gradeData, setGradeData] = useState({ score: '', comment: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, DB_COLLECTION), where('teacherId', '==', teacher.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = {}; snapshot.forEach(doc => subs[doc.data().week] = { id: doc.id, ...doc.data() });
      setSubmissions(subs);
    });
    return () => unsubscribe();
  }, [user, teacher.id]);

  const handleSelectWeek = (week) => {
    setSelectedWeek(week); setGradingMode(false);
    if (submissions[week]) setGradeData({ score: submissions[week].score || '', comment: submissions[week].comment || '' });
  };

  const saveGrade = async () => {
    if (!selectedWeek || !submissions[selectedWeek]) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, DB_COLLECTION, submissions[selectedWeek].id), {
        status: 'graded', score: parseInt(gradeData.score), comment: gradeData.comment, gradedAt: new Date().toISOString()
      });
      setGradingMode(false);
    } catch (e) { alert("Gagal menyimpan."); } finally { setIsSaving(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
      <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-50 pb-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-50 bg-slate-100 flex items-center justify-center text-slate-400 font-black">{teacher.name.charAt(0)}</div>
          <div><h3 className="font-extrabold text-lg text-gray-900 leading-tight">{teacher.name}</h3><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{teacher.subject}</span></div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {Array.from({length: TOTAL_WEEKS}, (_, i) => i + 1).map(week => {
            const sub = submissions[week];
            return (
              <button key={week} onClick={() => sub ? handleSelectWeek(week) : null} className={`relative h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${sub ? (sub.status === 'graded' ? 'bg-green-50 border-green-200 text-green-700 shadow-inner' : 'bg-blue-50 border-blue-200 text-blue-700') : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'} ${selectedWeek === week ? 'ring-4 ring-blue-100 border-blue-500 scale-105 z-10' : ''}`}>
                <span className="font-black text-xs">M{week}</span>
                {sub?.isLate && <span className="absolute -bottom-2 text-[7px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-black shadow-sm z-20">LEWAT</span>}
                {sub?.score && <span className="absolute top-1 right-1 text-[8px] font-black text-green-800">{sub.score}%</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:w-1/3">
        {selectedWeek && submissions[selectedWeek] ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-6 h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-extrabold text-lg text-gray-900">Butiran M{selectedWeek}</h3>
                <button onClick={() => setSelectedWeek(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <div className={`p-4 rounded-xl border mb-6 ${submissions[selectedWeek].isLate ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
               <div className="flex items-center gap-2 mb-1"><Clock size={16} className={submissions[selectedWeek].isLate ? 'text-red-600' : 'text-green-600'} /><span className={`font-black text-xs ${submissions[selectedWeek].isLate ? 'text-red-800' : 'text-green-800'}`}>{submissions[selectedWeek].isLate ? 'DIHANTAR LEWAT' : 'TEPAT MASA'}</span></div>
               <p className="text-[10px] font-bold text-gray-500">{formatDateMY(submissions[selectedWeek].submittedAt)}</p>
            </div>

            <a href={submissions[selectedWeek].content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group mb-6">
                <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:scale-110 transition-transform"><ExternalLink size={18} /></div>
                <div className="overflow-hidden flex-1"><label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Pautan RPH</label><span className="text-xs font-bold text-blue-700 truncate block underline">KLIK UNTUK BUKA</span></div>
            </a>

            {gradingMode ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-auto space-y-4">
                    <h4 className="font-black text-xs text-gray-800 uppercase tracking-widest">Penilaian</h4>
                    <input type="number" min="0" max="100" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-bold" value={gradeData.score} onChange={(e) => setGradeData({...gradeData, score: e.target.value})} placeholder="Markah (0-100)" />
                    <textarea className="w-full p-2.5 border border-gray-300 rounded-lg text-xs" rows="3" value={gradeData.comment} onChange={(e) => setGradeData({...gradeData, comment: e.target.value})} placeholder="Ulasan pentadbir..." />
                    <div className="flex gap-2">
                        <button onClick={() => setGradingMode(false)} className="flex-1 py-2 text-xs font-bold text-gray-500">BATAL</button>
                        <button onClick={saveGrade} disabled={isSaving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-100 uppercase">{isSaving ? '...' : 'SIMPAN'}</button>
                    </div>
                </div>
            ) : (
                <div className="mt-auto space-y-3">
                   {submissions[selectedWeek].score && (
                       <div className="bg-green-50 p-5 rounded-2xl border border-green-200 text-center shadow-inner">
                           <div className="text-4xl font-black text-green-700">{submissions[selectedWeek].score}%</div>
                           <p className="text-xs text-green-800 italic mt-2">"{submissions[selectedWeek].comment}"</p>
                       </div>
                   )}
                   <button onClick={() => setGradingMode(true)} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 uppercase text-xs">
                     <CheckCircle size={18} /> {submissions[selectedWeek].score ? 'KEMASKINI NILAI' : 'MULA SEMAK'}
                   </button>
                   
                   {submissions[selectedWeek].score && (
                       <button onClick={() => sendIndividualEmail(teacher, 'grading', { week: selectedWeek, score: submissions[selectedWeek].score, comment: submissions[selectedWeek].comment })} className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200 flex items-center justify-center gap-2 text-xs">
                           <SendHorizonal size={14} /> HANTAR KEPUTUSAN KE GURU
                       </button>
                   )}
                </div>
            )}
          </div>
        ) : <div className="bg-slate-50 h-full rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 p-10 text-center font-bold uppercase tracking-widest text-xs">Pilih Minggu Untuk Semak</div>}
      </div>
    </div>
  );
}

// --- TEACHER PORTAL (UPDATED WITH REAL-TIME ANNOUNCEMENT) ---
function TeacherPortal({ user, profile }) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [linkInput, setLinkInput] = useState('');
  const [submission, setSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarData, setCalendarData] = useState({});
  const [announcement, setAnnouncement] = useState({ text: '', isActive: false, type: 'info' });

  useEffect(() => {
    // Sync Calendar
    getDoc(doc(db, DB_SETTINGS, 'school_calendar')).then(s => s.exists() && setCalendarData(s.data()));
    // Sync Real-Time Announcement
    const unsubAnn = onSnapshot(doc(db, DB_SETTINGS, 'announcement'), (snap) => {
        if (snap.exists()) setAnnouncement(snap.data());
    });
    return () => unsubAnn();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, DB_COLLECTION, `${profile.id}_w${selectedWeek}`), (doc) => setSubmission(doc.data()));
    return () => unsub();
  }, [user, profile.id, selectedWeek]);

  const handleTurnIn = async (e) => {
    e.preventDefault();
    if (!linkInput.startsWith('http')) { alert("Sila masukkan pautan yang sah!"); return; }
    setIsSubmitting(true);
    const now = new Date();
    let isLate = false;
    const dl = calendarData[`week_${selectedWeek}_deadline`];
    if (dl && now > new Date(dl)) isLate = true;

    try {
        await setDoc(doc(db, DB_COLLECTION, `${profile.id}_w${selectedWeek}`), {
          teacherId: profile.id, teacherName: profile.name, week: selectedWeek, content: linkInput,
          status: 'submitted', submittedAt: now.toISOString(), isLate: isLate, score: null
        });
    } catch (e) { alert("Gagal menghantar."); console.error(e); } finally { setIsSubmitting(false); }
  };

  const getAnnStyles = (t) => {
    switch(t) {
      case 'warning': return { bg: 'bg-gradient-to-r from-amber-50 to-orange-50', border: 'border-amber-400', text: 'text-amber-800', icon: <AlertOctagon size={24}/>, label: 'AMARAN' };
      case 'alert': return { bg: 'bg-gradient-to-r from-red-50 to-rose-50', border: 'border-red-500', text: 'text-red-800', icon: <AlertTriangle size={24}/>, label: 'PENTING' };
      default: return { bg: 'bg-gradient-to-r from-blue-50 to-indigo-50', border: 'border-blue-500', text: 'text-blue-800', icon: <Info size={24}/>, label: 'INFO' };
    }
  };

  const annStyle = getAnnStyles(announcement.type);

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-6 pb-20 relative">
      <div className="md:col-span-4 lg:col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm h-auto md:h-[calc(100vh-120px)] md:sticky md:top-24 order-2 md:order-1">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center"><h3 className="font-black text-xs uppercase tracking-widest text-gray-500">Pilih Minggu</h3></div>
        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 space-x-2 md:space-x-0 md:space-y-1 custom-scrollbar">
           {Array.from({length: 42},(_,i)=>i+1).map(w => (
             <button key={w} onClick={()=>setSelectedWeek(w)} className={`flex-shrink-0 md:w-full text-left px-4 py-3 rounded-xl text-xs transition-all flex flex-col ${selectedWeek===w?'bg-blue-600 text-white shadow-xl transform scale-[1.02]':'hover:bg-gray-100 text-gray-600'}`}>
               <span className="font-black">MINGGU {w}</span>
               <span className={`text-[9px] mt-0.5 font-bold ${selectedWeek===w?'text-blue-200':'text-gray-400'}`}>{calendarData[`week_${w}_start`] ? formatDateRange(calendarData[`week_${w}_start`], calendarData[`week_${w}_end`]) : '...'}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="md:col-span-8 lg:col-span-9 bg-white border border-gray-200 rounded-3xl p-6 md:p-10 flex flex-col items-center shadow-sm relative overflow-hidden min-h-[500px] order-1 md:order-2">
         {/* REAL-TIME ANNOUNCEMENT BANNER */}
         {announcement.isActive && announcement.text && (
            <div className={`w-full ${annStyle.bg} border-l-4 ${annStyle.border} rounded-r-2xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row gap-5 relative z-10 animate-in slide-in-from-top-4 duration-700`}>
               <div className="bg-white p-3 rounded-full shadow-md text-blue-600 shrink-0 self-start">
                 {React.cloneElement(annStyle.icon, { className: 'animate-pulse' })}
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className={`font-black ${annStyle.text} text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-2`}>
                        SIARAYA LIVE <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-bounce">BARU</span>
                     </h4>
                  </div>
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed font-bold whitespace-pre-wrap">{announcement.text}</p>
                  <p className="text-[9px] text-gray-400 mt-3 italic font-bold">DIKEMASKINI: {formatDateMY(announcement.updatedAt)}</p>
               </div>
            </div>
         )}

         <div className="relative z-10 flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 mb-4 flex items-center justify-center text-slate-300 font-black text-2xl uppercase">
               {profile.name.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-gray-900 text-center leading-tight uppercase px-4">{profile.name}</h2>
            <p className="text-[10px] text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full mt-3 tracking-widest uppercase">{profile.email}</p>
         </div>

         <div className="relative z-10 w-full max-w-lg text-center border-t border-gray-50 pt-8 mt-2">
           <div className="mb-8">
             <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">Penghantaran Minggu {selectedWeek}</p>
             <h3 className="text-blue-600 font-black text-xl md:text-2xl">{calendarData[`week_${selectedWeek}_start`] ? formatDateRange(calendarData[`week_${selectedWeek}_start`], calendarData[`week_${selectedWeek}_end`]) : "Tarikh Belum Ditetapkan"}</h3>
             {calendarData[`week_${selectedWeek}_deadline`] && (
                 <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-xs font-black border border-red-100 shadow-sm animate-pulse">
                    <Clock size={14} /> DEADLINE: {formatDeadline(calendarData[`week_${selectedWeek}_deadline`])}
                 </div>
             )}
           </div>
         
           {submission ? (
             <div className="space-y-6 animate-in zoom-in duration-500 w-full">
                <div className={`p-8 rounded-[2rem] border-2 flex flex-col items-center shadow-2xl ${submission.isLate ? 'border-red-100 bg-red-50/50' : 'border-green-100 bg-green-50/50'}`}>
                   <div className={`p-4 rounded-full mb-4 shadow-lg bg-white ${submission.isLate ? 'text-red-600' : 'text-green-600'}`}>{submission.isLate ? <AlertOctagon size={40}/> : <CheckCircle size={40}/>}</div>
                   <h3 className={`text-2xl font-black ${submission.isLate ? 'text-red-700' : 'text-green-700'} uppercase tracking-widest`}>{submission.isLate ? 'LEWAT HANTAR' : 'TELAH DIHANTAR'}</h3>
                   <p className="text-gray-400 mt-2 font-black text-[10px] uppercase tracking-widest">{formatDateMY(submission.submittedAt)}</p>
                </div>

                <a href={submission.content} target="_blank" rel="noopener noreferrer" className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md text-left flex items-center gap-4 hover:border-blue-500 transition-all group">
                    <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-all"><FileText size={20} /></div>
                    <div className="flex-1 overflow-hidden"><label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">FOLDER GOOGLE DRIVE</label><span className="text-blue-700 font-black truncate text-xs block underline group-hover:no-underline uppercase">Klik Untuk Semak Fail</span></div>
                </a>

                {submission.status === 'graded' && (
                    <div className="bg-white border-2 border-green-400 p-8 rounded-[2.5rem] animate-in slide-in-from-bottom-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle size={80}/></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <h4 className="font-black text-green-800 text-xs uppercase tracking-widest flex items-center gap-2">REKOD SEMAKAN</h4>
                            <span className="bg-green-600 text-white px-4 py-1 rounded-full font-black text-2xl shadow-xl">{submission.score}%</span>
                        </div>
                        <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 relative z-10 shadow-inner">
                            <p className="text-sm text-green-900 font-bold italic leading-relaxed">"{submission.comment}"</p>
                        </div>
                    </div>
                )}
             </div>
           ) : (
             <form onSubmit={handleTurnIn} className="space-y-6 bg-white p-2 rounded-3xl w-full">
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-4 text-xs text-amber-900 text-left items-start shadow-inner">
                    <AlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-600" />
                    <div><p className="font-black uppercase mb-1 tracking-widest">Sila Ambil Perhatian</p><p className="leading-relaxed font-medium">Sila pastikan link Google Drive anda telah ditetapkan kepada <strong>"Anyone with the link can view"</strong> sebelum menghantar.</p></div>
                </div>
                <div className="text-left space-y-2 px-1">
                    <label className="font-black text-gray-500 block text-[10px] uppercase tracking-widest ml-1">PAUTAN GOOGLE DRIVE (HTTPS)</label>
                    <input type="url" required value={linkInput} onChange={(e)=>setLinkInput(e.target.value)} placeholder="https://drive.google.com/..." className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-bold outline-none transition-all shadow-sm" />
                </div>
                <button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 text-sm flex justify-center items-center gap-3 transition-all active:scale-95 uppercase tracking-widest">
                  {isSubmitting ? 'PENGHANTARAN SEDANG DIPROSES...' : <><Send size={20} /> HANTAR RPH M{selectedWeek}</>}
                </button>
             </form>
           )}
         </div>
      </div>
    </div>
  );
}


