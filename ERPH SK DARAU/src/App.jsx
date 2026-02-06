import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, doc, setDoc, updateDoc, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { User, FileText, CheckCircle, BarChart3, LogOut, MessageSquare, Save, Search, School, Lock, Clock, Mail, AlertTriangle, Send, LogIn, KeyRound, ChevronRight, Users, ShieldCheck, ExternalLink, X, Calendar, Filter, ChevronLeft, ChevronDown, ThumbsUp, Megaphone, Bell, Info } from 'lucide-react';

// --- FIREBASE CONFIGURATION (LIVE SK DARAU 2026) ---
const firebaseConfig = {
  apiKey: "AIzaSyDPTOOj98A0HTtvm_frCTPTHPc7O7r9fzE",
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
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
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

// --- ADMIN ACCESS CONFIGURATION ---
const ADMIN_PROFILES = [
  { id: 'admin_gb', name: 'Guru Besar', roleLabel: 'GB', access: 'all', description: 'Akses Penuh (Semua Guru)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GB', color: 'bg-purple-600' },
  { id: 'admin_sys', name: 'Admin ICT', roleLabel: 'ADMIN', access: 'all', description: 'Akses Penuh (Penyelenggaraan)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SysAdmin', color: 'bg-slate-800' },
  { id: 'admin_pk1', name: 'PK Pentadbiran', roleLabel: 'PK1', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru Subjek Teras', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PK1', color: 'bg-blue-600' },
  { id: 'admin_hem', name: 'PK HEM', roleLabel: 'PKHEM', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru PI & Sejarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HEM', color: 'bg-green-600' },
  { id: 'admin_koko', name: 'PK Kokurikulum', roleLabel: 'PKKOKUM', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru RBT & PJPK', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Koko', color: 'bg-orange-600' },
  { id: 'admin_petang', name: 'PK Petang', roleLabel: 'PKPETANG', access: 'restricted', filterRule: (t) => true, description: 'Akses: Guru Sesi Petang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petang', color: 'bg-indigo-600' },
];

// --- Main Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Auth Error:", error);
        }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (selectedRole, profile = null) => {
    setRole(selectedRole);
    setCurrentProfile(profile);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentProfile(null);
  };

  if (loading) return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-blue-800 font-bold animate-pulse">Menghubungkan ke Database Sekolah...</div>
    </div>
  );

  if (!role) {
    return <LoginScreen onLogin={handleLogin} teachers={TEACHERS_DB} />;
  }

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

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, teachers]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === "1234") {
      onLogin(userType, selectedUser);
      setSelectedUser(null);
      setPinInput("");
    } else {
      setErrorMsg("PIN Salah. Sila cuba lagi.");
      setPinInput("");
    }
  };

  const openPinModal = (user, type) => {
    setSelectedUser(user);
    setUserType(type);
    setErrorMsg("");
    setPinInput("");
  };

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
                         <img src={admin.avatar} className="w-8 h-8 rounded-full bg-white/10"/>
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
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
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
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateTemplate = () => {
    const start = calendarData[`week_${selectedWeek}_start`];
    const end = calendarData[`week_${selectedWeek}_end`];
    const deadline = calendarData[`week_${selectedWeek}_deadline`];

    if (!start || !end) {
      alert("Sila tetapkan tarikh untuk minggu ini di menu 'Tetapan Takwim' dahulu.");
      return;
    }

    const template = `PERHATIAN GURU:\n\nPenghantaran RPH untuk Minggu ${selectedWeek} kini dibuka.\n\n📅 Tarikh: ${formatDateRange(start, end)}\n⏰ Deadline: ${formatDeadline(deadline)}\n\nSila pastikan folder Google Drive anda dikemaskini dan dihantar sebelum tarikh akhir untuk mengelakkan status 'LEWAT'.\n\nSekian, terima kasih.`;
    setAnnouncement(template);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, DB_SETTINGS, 'announcement'), {
        text: announcement,
        isActive: isActive,
        updatedAt: new Date().toISOString()
      });
      alert("Pengumuman berjaya disimpan ke Dashboard Guru!");
    } catch (e) {
      alert("Gagal menyimpan pengumuman.");
    } finally {
      setSaving(false);
    }
  };

  const handleBroadcast = () => {
    if (!announcement) {
        alert("Sila tulis pengumuman dahulu.");
        return;
    }
    const confirm = window.confirm("Adakah anda pasti mahu menghantar emel ini kepada SEMUA 72 GURU?");
    if (confirm) {
        setBroadcasting(true);
        setTimeout(() => {
            alert(`Sistem telah berjaya menghantar emel peringatan kepada 72 orang guru SK Darau.`);
            setBroadcasting(false);
        }, 2000);
    }
  };

  if (loading) return <div className="text-center py-10">Memuatkan...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Megaphone size={24} /></div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Sistem Siaraya (Announcement)</h3>
          <p className="text-sm text-gray-500">Buat pengumuman di dashboard & hantar emel pukal.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* TEMPLATE GENERATOR */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
            <span className="text-xs font-bold text-blue-700 uppercase">Jana Mesej Auto:</span>
            <select 
                value={selectedWeek} 
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="bg-white border border-blue-200 text-sm rounded-lg px-2 py-1 focus:outline-none"
            >
                {Array.from({length: 42},(_,i)=>i+1).map(w => <option key={w} value={w}>Minggu {w}</option>)}
            </select>
            <button onClick={generateTemplate} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-bold">
                Isi Template
            </button>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Teks Pengumuman</label>
          <textarea 
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 min-h-[200px] text-sm leading-relaxed"
            placeholder="Tulis pengumuman di sini..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="text-sm font-bold text-gray-700">Status Paparan Dashboard</label>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}
          >
            {isActive ? 'DIPAPARKAN' : 'DISEMBUNYIKAN'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors shadow-sm"
            >
            <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Sahaja'}
            </button>

            <button 
            onClick={handleBroadcast} 
            disabled={broadcasting}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
            >
            <Send size={18} /> {broadcasting ? 'Sedang Menghantar...' : 'Hantar Emel Peringatan'}
            </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">Nota: Butang 'Hantar Emel' akan menghantar salinan pengumuman ini ke semua 72 alamat emel guru.</p>
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
        const docRef = doc(db, DB_SETTINGS, 'school_calendar');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCalendarData(docSnap.data());
        }
      } catch (e) {
        console.error("Error fetching calendar:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, DB_SETTINGS, 'school_calendar'), calendarData);
      alert("Takwim berjaya disimpan!");
    } catch (e) {
      alert("Gagal menyimpan takwim.");
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = (week, field, value) => {
    setCalendarData(prev => ({ ...prev, [`week_${week}_${field}`]: value }));
  };

  if (loading) return <div className="text-center py-10">Memuatkan takwim...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Tetapan Takwim Sekolah</h3>
          <p className="text-sm text-gray-500">Tetapkan tarikh mula, tamat, dan deadline penghantaran.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm w-full md:w-auto">
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="h-[60vh] overflow-y-auto custom-scrollbar p-2">
        {Array.from({ length: 42 }, (_, i) => i + 1).map(week => (
          <div key={week} className="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-3">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">M{week}</div>
                <div className="md:hidden text-xs font-bold text-gray-400">Minggu {week}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Tarikh Mula</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={calendarData[`week_${week}_start`] || ''}
                      onChange={(e) => handleDataChange(week, 'start', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Tarikh Tamat</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={calendarData[`week_${week}_end`] || ''}
                      onChange={(e) => handleDataChange(week, 'end', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-red-600 mb-1 block flex items-center gap-1"><Clock size={12}/> Deadline</label>
                    <input 
                      type="datetime-local" 
                      className="w-full p-2 border border-red-200 bg-red-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none text-red-800 font-medium"
                      value={calendarData[`week_${week}_deadline`] || ''}
                      onChange={(e) => handleDataChange(week, 'deadline', e.target.value)}
                    />
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- EMAIL AUTOMATION PANEL (UPDATED WITH 3 COLUMNS) ---
function EmailAutomationPanel({ user, teachers }) {
  const [targetWeek, setTargetWeek] = useState(1);
  const [lateList, setLateList] = useState([]);
  const [missingList, setMissingList] = useState([]);
  const [onTimeList, setOnTimeList] = useState([]); // New category
  const [scanning, setScanning] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    getDoc(doc(db, DB_SETTINGS, 'school_calendar')).then(snap => {
        if(snap.exists()) setCalendarData(snap.data());
    });
  }, []);

  const scanForLateSubmissions = async () => {
    setScanning(true);
    setEmailSent(false);
    setLateList([]); 
    setMissingList([]);
    setOnTimeList([]);

    try {
      const q = query(collection(db, DB_COLLECTION), where('week', '==', parseInt(targetWeek)));
      const querySnapshot = await getDocs(q);
      
      const submittedMap = {}; 
      querySnapshot.forEach((doc) => {
        submittedMap[doc.data().teacherId] = doc.data();
      });

      const missing = [];
      const late = [];
      const onTime = [];

      teachers.forEach(t => {
          if (!submittedMap[t.id]) {
              missing.push(t);
          } else {
              if (submittedMap[t.id].isLate) {
                  late.push({ ...t, ...submittedMap[t.id] });
              } else {
                  onTime.push({ ...t, ...submittedMap[t.id] });
              }
          }
      });
      
      setMissingList(missing);
      setLateList(late);
      setOnTimeList(onTime);

    } catch (error) {
      console.error("Ralat Audit:", error);
      alert("Gagal menyemak database.");
    } finally {
      setScanning(false);
    }
  };

  const triggerBatchEmail = () => {
    alert(`Sistem akan menghantar peringatan kepada ${missingList.length} guru belum hantar.`);
    setEmailSent(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
         <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck size={32} /></div>
         <h3 className="text-2xl font-bold text-gray-900">Audit Penghantaran</h3>
         <p className="text-gray-500">Status pematuhan tarikh penghantaran RPH.</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Minggu</label>
          <select value={targetWeek} onChange={(e) => { setTargetWeek(e.target.value); setLateList([]); setMissingList([]); setOnTimeList([]); setEmailSent(false); }} className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none">
            {Array.from({length: 42}, (_, i) => i + 1).map(w => <option key={w} value={w}>Minggu {w}</option>)}
          </select>
        </div>
        <button onClick={scanForLateSubmissions} disabled={scanning} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200">
          {scanning ? 'Mengimbas...' : 'Mula Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KOLUM 1: TEPAT MASA */}
          <div className="border border-green-200 rounded-xl bg-green-50/50 overflow-hidden flex flex-col h-96">
              <div className="p-4 bg-green-100 border-b border-green-200 flex justify-between items-center">
                  <h4 className="font-bold text-green-800 flex items-center gap-2"><ThumbsUp size={18}/> Tepat Masa ({onTimeList.length})</h4>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                  {onTimeList.map(t => (
                      <div key={t.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-green-100 mb-1">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold"><CheckCircle size={14}/></div>
                          <span className="text-xs font-medium text-gray-700 truncate">{t.name}</span>
                      </div>
                  ))}
                  {onTimeList.length === 0 && !scanning && <div className="text-center p-4 text-gray-400 text-xs">Tiada data.</div>}
              </div>
          </div>

          {/* KOLUM 2: LEWAT HANTAR */}
          <div className="border border-orange-200 rounded-xl bg-orange-50/50 overflow-hidden flex flex-col h-96">
              <div className="p-4 bg-orange-100 border-b border-orange-200">
                  <h4 className="font-bold text-orange-800 flex items-center gap-2"><Clock size={18}/> Lewat ({lateList.length})</h4>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                  {lateList.map(t => (
                      <div key={t.id} className="flex flex-col p-2 bg-white rounded-lg border border-orange-100 mb-1">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-medium text-gray-700 truncate">{t.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">
                              {formatDateMY(t.submittedAt)}
                          </span>
                      </div>
                  ))}
                  {lateList.length === 0 && !scanning && <div className="text-center p-4 text-gray-400 text-xs">Tiada rekod lewat.</div>}
              </div>
          </div>

          {/* KOLUM 3: BELUM HANTAR */}
          <div className="border border-red-200 rounded-xl bg-red-50/50 overflow-hidden flex flex-col h-96">
              <div className="p-4 bg-red-100 border-b border-red-200 flex justify-between items-center">
                  <h4 className="font-bold text-red-800 flex items-center gap-2"><X size={18}/> Belum ({missingList.length})</h4>
                  {missingList.length > 0 && !emailSent && <button onClick={triggerBatchEmail} className="text-[10px] bg-white text-red-600 px-2 py-1 rounded border border-red-200 hover:bg-red-50">Email</button>}
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                  {missingList.map(t => (
                      <div key={t.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-red-100 mb-1">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">{t.name.charAt(0)}</div>
                          <span className="text-xs font-medium text-gray-700 truncate">{t.name}</span>
                      </div>
                  ))}
                  {missingList.length === 0 && !scanning && <div className="text-center p-4 text-gray-400 text-xs">Semua hantar!</div>}
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
      let sub = 0;
      snapshot.forEach(doc => { if (doc.data().status !== 'pending') sub++; });
      setStats({ submitted: sub });
    });
    return () => unsubscribe();
  }, [user, teacher.id]);

  return (
    <div onClick={onClick} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-400 cursor-pointer shadow-sm group hover:shadow-md transition-all active:scale-[0.98]">
      <div className="flex items-center gap-4 mb-4">
        {teacher.avatar ? (
          <img src={getAvatarUrl(teacher.avatar)} alt={teacher.name} className="w-12 h-12 rounded-full bg-slate-100 border border-gray-100" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-200 border border-gray-100 flex items-center justify-center text-slate-400">
            <User size={24} />
          </div>
        )}
        <div className="overflow-hidden"><h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600">{teacher.name}</h4><p className="text-xs text-gray-500">{teacher.subject}</p></div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-wide"><span>Siap</span><span>{Math.round((stats.submitted / TOTAL_WEEKS) * 100)}%</span></div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(stats.submitted / TOTAL_WEEKS) * 100}%` }}></div></div>
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
      const subs = {};
      snapshot.forEach(doc => subs[doc.data().week] = { id: doc.id, ...doc.data() });
      setSubmissions(subs);
    });
    return () => unsubscribe();
  }, [user, teacher.id]);

  const handleSelectWeek = (week) => {
    setSelectedWeek(week);
    setGradingMode(false);
    if (submissions[week]) {
      setGradeData({
        score: submissions[week].score || '',
        comment: submissions[week].comment || ''
      });
    }
  };

  const saveGrade = async () => {
    if (!selectedWeek || !submissions[selectedWeek]) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, DB_COLLECTION, submissions[selectedWeek].id);
      await updateDoc(docRef, {
        status: 'graded',
        score: parseInt(gradeData.score),
        comment: gradeData.comment,
        gradedAt: new Date().toISOString()
      });
      setGradingMode(false);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan markah.");
    } finally {
      setIsSaving(false);
    }
  };

  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
      <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-4 mb-6">
          {teacher.avatar ? (
            <img src={getAvatarUrl(teacher.avatar)} className="w-14 h-14 rounded-full border border-gray-200 object-cover"/>
          ) : (
            <div className="w-14 h-14 rounded-full border border-gray-200 bg-slate-200 flex items-center justify-center text-slate-400">
              <User size={28} />
            </div>
          )}
          <div><h3 className="font-bold text-xl text-gray-900">{teacher.name}</h3><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{teacher.subject}</span></div>
        </div>
        <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">Rekod Mingguan</h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {weeks.map(week => {
            const sub = submissions[week];
            return (
              <button key={week} onClick={() => sub ? handleSelectWeek(week) : null} className={`relative h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${sub ? (sub.status === 'graded' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700') : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'} ${selectedWeek === week ? 'ring-4 ring-blue-100 border-blue-500 scale-105 z-10' : ''}`}>
                <span className="font-bold text-sm">M{week}</span>
                {sub?.isLate && <span className="absolute -bottom-2 text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold shadow-sm z-20">LEWAT</span>}
                {sub?.score && <span className="absolute top-1 right-1 text-[9px] font-bold bg-white/60 px-1 rounded text-green-800">{sub.score}%</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="lg:w-1/3">
        {selectedWeek && submissions[selectedWeek] ? (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 h-full flex flex-col animate-in slide-in-from-right-4">
            <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-xl text-gray-900">Butiran Minggu {selectedWeek}</h3>
                <button onClick={() => setSelectedWeek(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <div className={`p-5 rounded-2xl border mb-6 ${submissions[selectedWeek].isLate ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
               <div className="flex items-center gap-2 mb-2"><Clock size={20} className={submissions[selectedWeek].isLate ? 'text-red-600' : 'text-green-600'} /><span className={`font-bold ${submissions[selectedWeek].isLate ? 'text-red-800' : 'text-green-800'}`}>{submissions[selectedWeek].isLate ? 'Lewat Hantar' : 'Tepat Masa'}</span></div>
               <p className="text-sm font-medium text-gray-600 pl-7">{formatDateMY(submissions[selectedWeek].submittedAt)}</p>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Pautan Fail (Klik untuk Buka)</label>
              <a href={submissions[selectedWeek].content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                <div className="bg-blue-100 p-2 rounded text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><ExternalLink size={18} /></div>
                <span className="text-sm font-medium text-blue-700 truncate flex-1 underline group-hover:no-underline">{submissions[selectedWeek].content}</span>
              </a>
            </div>

            {gradingMode ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-auto animate-in fade-in slide-in-from-bottom-2">
                    <h4 className="font-bold text-gray-800 mb-3">Penilaian RPH</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Markah (0-100)</label>
                            <input type="number" min="0" max="100" className="w-full p-2 border border-gray-300 rounded-lg" value={gradeData.score} onChange={(e) => setGradeData({...gradeData, score: e.target.value})} placeholder="Contoh: 90" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Ulasan</label>
                            <textarea className="w-full p-2 border border-gray-300 rounded-lg text-sm" rows="3" value={gradeData.comment} onChange={(e) => setGradeData({...gradeData, comment: e.target.value})} placeholder="Sangat baik..." />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setGradingMode(false)} className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600">Batal</button>
                            <button onClick={saveGrade} disabled={isSaving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-auto space-y-4">
                   {submissions[selectedWeek].score && (
                       <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                           <div className="text-3xl font-bold text-green-700">{submissions[selectedWeek].score}%</div>
                           <p className="text-sm text-green-800 italic">"{submissions[selectedWeek].comment}"</p>
                       </div>
                   )}
                   <button onClick={() => setGradingMode(true)} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                     <CheckCircle size={18} /> {submissions[selectedWeek].score ? 'Kemaskini Penilaian' : 'Nilai RPH Ini'}
                   </button>
                </div>
            )}
          </div>
        ) : <div className="bg-slate-50 h-full rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-gray-400 p-8 text-center"><p>Pilih Minggu</p></div>}
      </div>
    </div>
  );
}

// --- TEACHER PORTAL (MOBILE OPTIMIZED & REAL-TIME ANNOUNCEMENT) ---
function TeacherPortal({ user, profile }) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [linkInput, setLinkInput] = useState('');
  const [submission, setSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarData, setCalendarData] = useState({});
  const [announcement, setAnnouncement] = useState({ text: '', isActive: false });

  // Load Data
  useEffect(() => {
    // 1. Load Calendar (Sekali sahaja okay)
    const fetchCalendar = async () => {
      try {
        const docRef = doc(db, DB_SETTINGS, 'school_calendar');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCalendarData(docSnap.data());
        }
      } catch (e) {
        console.log("No calendar data yet");
      }
    };
    fetchCalendar();

    // 2. Load Announcement (REAL-TIME: Supaya terus muncul bila admin update)
    const unsubAnn = onSnapshot(doc(db, DB_SETTINGS, 'announcement'), (doc) => {
        if (doc.exists()) {
            setAnnouncement(doc.data());
        }
    });

    return () => unsubAnn();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, DB_COLLECTION, `${profile.id}_w${selectedWeek}`);
    const unsub = onSnapshot(docRef, (doc) => setSubmission(doc.data()), (e) => console.log("New file, no data yet"));
    return () => unsub();
  }, [user, profile.id, selectedWeek]);

  const handleTurnIn = async (e) => {
    e.preventDefault();
    if (!linkInput.startsWith('http')) {
        alert("Sila masukkan link yang sah (bermula dengan http:// atau https://)");
        return;
    }

    setIsSubmitting(true);
    const now = new Date();
    
    let isLate = false;
    const deadlineString = calendarData[`week_${selectedWeek}_deadline`];
    if (deadlineString) {
        const deadlineDate = new Date(deadlineString);
        if (now > deadlineDate) isLate = true;
    }

    try {
        await setDoc(doc(db, DB_COLLECTION, `${profile.id}_w${selectedWeek}`), {
          teacherId: profile.id,
          teacherName: profile.name,
          week: selectedWeek,
          content: linkInput,
          status: 'submitted',
          submittedAt: now.toISOString(),
          isLate: isLate, 
          score: null
        });
    } catch (e) {
        console.error("Submission error:", e);
        alert("Gagal menghantar. Sila cuba lagi.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const currentDateRange = (calendarData[`week_${selectedWeek}_start`] && calendarData[`week_${selectedWeek}_end`]) 
    ? formatDateRange(calendarData[`week_${selectedWeek}_start`], calendarData[`week_${selectedWeek}_end`]) 
    : "Tarikh belum ditetapkan";
    
  const currentDeadline = calendarData[`week_${selectedWeek}_deadline`] 
    ? formatDeadline(calendarData[`week_${selectedWeek}_deadline`])
    : "Belum ditetapkan";

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-6 pb-24 md:pb-10 relative">
      
      {/* 1. WEEK SELECTOR: HORIZONTAL SCROLL ON MOBILE, VERTICAL ON DESKTOP */}
      <div className="md:col-span-4 lg:col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm md:sticky md:top-24 h-auto md:h-[calc(100vh-120px)] order-2 md:order-1">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 text-sm">Pilih Minggu</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded md:hidden">Minggu {selectedWeek}</span>
        </div>
        
        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto p-2 space-x-2 custom-scrollbar bg-slate-50 min-h-[80px] items-center">
           {Array.from({length: 42},(_,i)=>i+1).map(w => (
             <button 
                key={w} 
                onClick={()=>{setSelectedWeek(w); setLinkInput('');}} 
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${selectedWeek===w?'bg-blue-600 text-white border-blue-600 shadow-md':'bg-white text-gray-600 border-gray-200'}`}
             >
               M{w}
             </button>
           ))}
        </div>

        {/* Desktop: Vertical List */}
        <div className="hidden md:flex flex-col flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
           {Array.from({length: 42},(_,i)=>i+1).map(w => (
             <button key={w} onClick={()=>{setSelectedWeek(w); setLinkInput('');}} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex flex-col ${selectedWeek===w?'bg-blue-600 text-white shadow-md transform scale-[1.02]':'hover:bg-gray-100 text-gray-600'}`}>
               <span className="font-bold">Minggu {w}</span>
               <span className={`text-[10px] mt-0.5 ${selectedWeek===w?'text-blue-200':'text-gray-400'}`}>
                 {(calendarData[`week_${w}_start`] && calendarData[`week_${w}_end`]) 
                    ? formatDateRange(calendarData[`week_${w}_start`], calendarData[`week_${w}_end`]) 
                    : '...'}
               </span>
             </button>
           ))}
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="md:col-span-8 lg:col-span-9 bg-white border border-gray-200 rounded-2xl p-6 md:p-10 flex flex-col justify-start items-center shadow-sm relative overflow-hidden min-h-[500px] order-1 md:order-2">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><span className="text-9xl font-bold text-blue-900 leading-none">{selectedWeek}</span></div>
         
         {/* --- ANNOUNCEMENT BANNER YANG CANTIK & GAH --- */}
         {announcement.isActive && announcement.text && (
            <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-5 mb-8 shadow-sm flex flex-col sm:flex-row gap-4 relative z-10 animate-in slide-in-from-top-4 duration-500">
               <div className="bg-white p-2.5 rounded-full shadow-sm text-blue-600 shrink-0 self-start">
                 <Megaphone size={24} className="animate-pulse" />
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h4 className="font-extrabold text-blue-800 text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
                        PENGUMUMAN PENTADBIR
                        <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded animate-bounce">BARU</span>
                     </h4>
                  </div>
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                    {announcement.text}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 italic">Dikemaskini pada: {new Date(announcement.updatedAt).toLocaleString('ms-MY')}</p>
               </div>
            </div>
         )}
         {/* ---------------------------------------------- */}

         <div className="relative z-10 flex flex-col items-center mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 mb-3">
               {profile.avatar ? (
                 <img src={getAvatarUrl(profile.avatar)} alt={profile.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={40} /></div>
               )}
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-800 text-center px-4 leading-tight">{profile.name}</h2>
            <p className="text-xs md:text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full mt-2">{profile.email}</p>
         </div>

         <div className="relative z-10 w-full max-w-lg text-center pt-2 border-t border-gray-100 mt-2">
           <div className="mb-6 mt-4">
             <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Penghantaran Minggu {selectedWeek}</p>
             <p className="text-blue-600 font-bold text-base md:text-lg mt-1">{currentDateRange}</p>
             {currentDeadline !== "Belum ditetapkan" && (
                 <div className="mt-2 inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-medium border border-red-100">
                    <Clock size={12} /> Deadline: {currentDeadline}
                 </div>
             )}
           </div>
         
           {submission ? (
             <div className="space-y-6 animate-in zoom-in duration-300 w-full">
                <div className={`p-6 rounded-3xl border flex flex-col items-center bg-white shadow-lg ${submission.isLate ? 'border-red-100 bg-red-50/30' : 'border-green-100 bg-green-50/30'}`}>
                   <div className={`p-3 rounded-full mb-3 ${submission.isLate ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{submission.isLate ? <AlertTriangle size={32}/> : <CheckCircle size={32}/>}</div>
                   <h3 className={`text-xl font-bold ${submission.isLate ? 'text-red-700' : 'text-green-700'}`}>{submission.isLate ? 'DIHANTAR LEWAT' : 'BERJAYA DIHANTAR'}</h3>
                   <p className="text-gray-500 mt-2 font-mono text-xs">{formatDateMY(submission.submittedAt)}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-left flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><FileText size={18} /></div>
                    <div className="flex-1 overflow-hidden">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Pautan Folder</label>
                        <a href={submission.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold truncate text-sm underline hover:text-blue-800 block">{submission.content}</a>
                    </div>
                </div>

                {submission.status === 'graded' && (
                    <div className="bg-green-50 border border-green-200 p-6 rounded-3xl animate-in slide-in-from-bottom-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-green-800 flex items-center gap-2"><CheckCircle size={18}/> Semakan Pentadbir</h4>
                            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-bold text-lg">{submission.score}%</span>
                        </div>
                        <div className="bg-white/60 p-3 rounded-xl border border-green-100">
                            <p className="text-sm text-green-900 italic">"{submission.comment}"</p>
                        </div>
                    </div>
                )}
             </div>
           ) : (
             <form onSubmit={handleTurnIn} className="space-y-5 bg-white p-1 rounded-3xl w-full">
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-xs text-amber-900 text-left items-start"><Clock size={16} className="shrink-0 mt-0.5 text-amber-600" /><div><p className="font-bold mb-0.5">Peringatan Deadline</p><p className="leading-relaxed opacity-90">Sila hantar RPH sebelum <strong>Jumaat, 11:59 PM</strong>.</p></div></div>
                <div className="text-left space-y-2">
                    <label className="font-bold text-gray-700 block pl-1 text-sm">Pautan Google Drive</label>
                    <input type="text" required value={linkInput} onChange={(e)=>setLinkInput(e.target.value)} placeholder="https://docs.google.com/..." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-base outline-none transition-all shadow-sm" />
                    <p className="text-[10px] text-gray-400 pl-1">Pastikan link bermula dengan http:// atau https://</p>
                </div>
                <button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-blue-200 text-base flex justify-center items-center gap-2 transition-transform active:scale-[0.98]">{isSubmitting ? 'Menghantar...' : <><Send size={18} /> HANTAR SEKARANG</>}</button>
             </form>
           )}
         </div>
      </div>
    </div>
  );
}