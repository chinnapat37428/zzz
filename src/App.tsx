import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  TrendingUp, 
  Bell, 
  Activity as ActivityIcon, 
  Search, 
  Settings, 
  Plus, 
  Users, 
  Database, 
  LogOut, 
  FileSpreadsheet, 
  HelpCircle, 
  Map as MapIcon, 
  User as UserIcon, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  ChevronRight, 
  Check, 
  Calendar,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Download,
  Clipboard
} from 'lucide-react';
import { googleSignIn, googleSignOut, initAuth, getAccessToken } from './lib/firebase';
import { SheetsService } from './lib/sheetsService';
import { Patient, Activity, PatientCategory, ActivityType, ActivityStatus, DashboardStats } from './types';

const PHAI_TAM_MY_MAPS_PATIENTS: Patient[] = [
  {
    id: 'HN-MM001',
    name: 'คุณยายพะยอม ดีเสมอ',
    category: 'ติดเตียง',
    address: 'บ้านเลขที่ 11 หมู่ 5 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
    vitalSigns: 'ความดัน 135/85 ชีพจร 78 ครั้ง/นาที แผลกดทับที่สะโพกดีขึ้นมากตามลำดับ',
    caregiver: 'อสม. ประกายดาว สุขสำราญ',
    lat: 14.332066,
    lng: 100.822967,
    lastVisited: 'ดึงข้อมูลสำเร็จจาก Google My Maps',
    phone: '081-555-1234',
  },
  {
    id: 'HN-MM002',
    name: 'คุณตาประกอบ วาจาดี',
    category: 'ติดบ้าน',
    address: 'บ้านเลขที่ 4 หมู่ 1 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
    vitalSigns: 'ความดันปกติ 120/80 ปวดเข่าและข้อเท้า มีโรคประจำตัวเบาหวานประเภทที่ 2',
    caregiver: 'อสม. รัตนาภรณ์ รักษ์ดี',
    lat: 14.333155,
    lng: 100.821421,
    lastVisited: 'ดึงข้อมูลสำเร็จจาก Google My Maps',
    phone: '082-666-2345',
  },
  {
    id: 'HN-MM003',
    name: 'คุณป้าสมจิต เพลินจิต',
    category: 'ติดสังคม',
    address: 'บ้านเลขที่ 72 หมู่ 3 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
    vitalSigns: 'ความดัน 125/75 ครั้ง/นาที ร่าเริง เดินไปวัดและร่วมประชุมผู้สูงอายุได้ปกติ',
    caregiver: 'อสม. สุทิน บัวงาม',
    lat: 14.331122,
    lng: 100.824555,
    lastVisited: 'ดึงข้อมูลสำเร็จจาก Google My Maps',
    phone: '089-777-3456',
  },
  {
    id: 'HN-MM004',
    name: 'คุณลุงสุวรรณ แก้วประเสริฐ',
    category: 'ติดเตียง',
    address: 'บ้านเลขที่ 58 หมู่ 2 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
    vitalSigns: 'อัมพาตครึ่งซีกด้านซ้าย ความดันเฉลี่ย 130/80 งดเค็ม ฝึกกายภาพ',
    caregiver: 'อสม. สายใจ แก้วระย้า',
    lat: 14.334055,
    lng: 100.823901,
    lastVisited: 'ดึงข้อมูลสำเร็จจาก Google My Maps',
    phone: '085-888-4567',
  },
  {
    id: 'HN-MM005',
    name: 'คุณยายกิ่งแก้ว ยอดรัก',
    category: 'ติดบ้าน',
    address: 'บ้านเลขที่ 102/1 หมู่ 5 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
    vitalSigns: 'ควบคุมระดับน้ำตาลได้ค่อนข้างคงที่ ปวดหลังเรื้อรังเดินลุกนั่งลำบาก',
    caregiver: 'อสม. ประกายดาว สุขสำราญ',
    lat: 14.329899,
    lng: 100.821999,
    lastVisited: 'ดึงข้อมูลสำเร็จจาก Google My Maps',
    phone: '083-999-5678',
  },
  {
    id: 'HN-MM006',
    name: 'คุณตาเฉลิม นามสมมติ',
    category: 'ติดเตียง',
    address: 'บ้านเลขที่ 15 หมู่ 4 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
    vitalSigns: 'ผู้ป่วยสูงอายุให้อาหารทางสายยาง ขับถ่ายทางสายสวนปัสสาวะ อ่อนเพลียเล็กน้อย',
    caregiver: 'อสม. วิจิตร ใจอารีย์',
    lat: 14.331500,
    lng: 100.825100,
    lastVisited: 'ดึงข้อมูลสำเร็จจาก Google My Maps',
    phone: '084-333-8899',
  },
  {
    id: 'HN-MM007',
    name: 'คุณน้ามาลี ศรีวิชัย',
    category: 'ติดสังคม',
    address: 'บ้านเลขที่ 8/2 หมู่ 1 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
    vitalSigns: 'ปกติ มีประวัติโรคความดันโลหิตสูง รับประทานยาต่อเนื่องสม่ำเสมอ แข็งแรงดี',
    caregiver: 'อสม. รัตนาภรณ์ รักษ์ดี',
    lat: 14.332600,
    lng: 100.820200,
    lastVisited: 'ดึงข้อมูลสำเร็จจาก Google My Maps',
    phone: '086-444-5566',
  }
];

export default function App() {
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('stitchsync_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('stitchsync_token');
  });
  const [userRole, setUserRole] = useState<'staff' | 'public' | null>(() => {
    return localStorage.getItem('stitchsync_role') as any;
  });
  const [needsAuth, setNeedsAuth] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('stitchsync_user');
    } catch {
      return true;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'map' | 'analytics' | 'logs' | 'team' | 'import'>('dashboard');

  // Google My Maps Importer States
  const [importedPatients, setImportedPatients] = useState<Patient[]>(PHAI_TAM_MY_MAPS_PATIENTS);
  const [kmlInput, setKmlInput] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSearchQuery, setImportSearchQuery] = useState<string>('');
  const [importCategoryFilter, setImportCategoryFilter] = useState<PatientCategory | 'ทั้งหมด'>('ทั้งหมด');

  // Google Sheets Importer States
  const [sheetUrl, setSheetUrl] = useState<string>('https://docs.google.com/spreadsheets/d/1o-StlQu_vf1-b3NCh5qmH1h3YScmTMm594Krao03L1A/edit?usp=sharing');
  const [sheetList, setSheetList] = useState<string[]>([]);
  const [selectedSheetName, setSelectedSheetName] = useState<string>('');
  const [sheetPatients, setSheetPatients] = useState<Patient[]>([]);
  const [loadingSheet, setLoadingSheet] = useState<boolean>(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [sheetsImportTab, setSheetsImportTab] = useState<'mymaps' | 'sheets'>('sheets');

  // Login Options
  const [loginTab, setLoginTab] = useState<'staff' | 'public'>('staff');
  const [guestName, setGuestName] = useState<string>('');
  const [mockStaffName, setMockStaffName] = useState<string>('');

  // Authorized Staff Emails List for security whitelist
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stitchsync_authorized_emails');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Seed with user's email and mock emails
    return ['chinnapat37428@gmail.com', 'somchai.staff@phaitam.go.th', 'somsri.staff@phaitam.go.th', 'somchai@gmail.com'];
  });
  const [newAuthEmail, setNewAuthEmail] = useState<string>('');

  // Save authorized emails list to localStorage on change
  useEffect(() => {
    localStorage.setItem('stitchsync_authorized_emails', JSON.stringify(authorizedEmails));
  }, [authorizedEmails]);

  // Helper to determine role
  const resolveAndSetUserRole = (email: string | null, list: string[] = authorizedEmails) => {
    if (!email) return 'public';
    const normalizedEmail = email.trim().toLowerCase();
    const isApproved = list.some(e => e.trim().toLowerCase() === normalizedEmail);
    return isApproved ? 'staff' : 'public';
  };

  // Core Data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<PatientCategory | 'ทั้งหมด'>('ทั้งหมด');
  
  // New Report Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'visit' | 'patient' | 'edit-patient'>('visit');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  
  // Visit Report Fields
  const [visitVitalSigns, setVisitVitalSigns] = useState<string>('');
  const [visitDescription, setVisitDescription] = useState<string>('');
  const [visitStatus, setVisitStatus] = useState<ActivityStatus>('Normal');

  // New Patient Fields
  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newPatientCategory, setNewPatientCategory] = useState<PatientCategory>('ติดสังคม');
  const [newPatientAddress, setNewPatientAddress] = useState<string>('');
  const [newPatientPhone, setNewPatientPhone] = useState<string>('');
  const [newPatientVital, setNewPatientVital] = useState<string>('');
  const [newPatientCaregiver, setNewPatientCaregiver] = useState<string>('');

  // Edit Patient Fields
  const [editPatientId, setEditPatientId] = useState<string>('');
  const [editPatientName, setEditPatientName] = useState<string>('');
  const [editPatientCategory, setEditPatientCategory] = useState<PatientCategory>('ติดสังคม');
  const [editPatientAddress, setEditPatientAddress] = useState<string>('');
  const [editPatientPhone, setEditPatientPhone] = useState<string>('');
  const [editPatientVital, setEditPatientVital] = useState<string>('');
  const [editPatientCaregiver, setEditPatientCaregiver] = useState<string>('');

  // Local sync logging for the Network Logs tab
  const [networkLogs, setNetworkLogs] = useState<Array<{ time: string; type: string; details: string; status: 'success' | 'error' | 'pending' }>>([]);

  const addLog = (type: string, details: string, status: 'success' | 'error' | 'pending' = 'success') => {
    const newLog = {
      time: new Date().toLocaleTimeString('th-TH'),
      type,
      details,
      status,
    };
    setNetworkLogs(prev => [newLog, ...prev]);
  };

  // Auth flow initialization
  useEffect(() => {
    addLog('System', 'กำลังเริ่มต้นระบบยืนยันตัวตน...', 'pending');
    
    // Check local storage session first
    const savedRole = localStorage.getItem('stitchsync_role');
    const savedUser = localStorage.getItem('stitchsync_user');
    const savedToken = localStorage.getItem('stitchsync_token');

    if (savedRole && (savedRole === 'public' || savedToken === 'mock-staff-token')) {
      const parsedUser = savedUser ? JSON.parse(savedUser) : { displayName: 'ผู้ใช้ทั่วไป', email: '' };
      setUser(parsedUser);
      setToken(savedToken);
      setUserRole(savedRole as any);
      setNeedsAuth(false);
      setLoading(false);
      addLog('Auth', `กู้คืนระบบแบบรวดเร็วสำเร็จ: [${savedRole === 'public' ? 'บุคคลทั่วไป' : 'เจ้าหน้าที่จำลอง'}] คุณ ${parsedUser.displayName}`, 'success');
      fetchData(savedToken);
      return;
    }

    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        
        // Resolve role dynamically based on whitelist
        const resolvedRole = resolveAndSetUserRole(currentUser.email);
        setUserRole(resolvedRole);
        
        localStorage.setItem('stitchsync_role', resolvedRole);
        localStorage.setItem('stitchsync_user', JSON.stringify({
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL
        }));
        localStorage.setItem('stitchsync_token', accessToken);
        
        setNeedsAuth(false);
        setLoading(false);
        addLog('Auth', `เชื่อมต่อ Google Sign-In สำเร็จ: ${currentUser.displayName} [สิทธิ์: ${resolvedRole === 'staff' ? 'เจ้าหน้าที่' : 'บุคคลทั่วไป'}]`, 'success');
        // Initial Fetch
        fetchData(accessToken);
      },
      () => {
        if (!localStorage.getItem('stitchsync_role')) {
          setNeedsAuth(true);
          addLog('Auth', 'รอลงชื่อเข้าใช้ระบบ (เจ้าหน้าที่ หรือ บุคคลทั่วไป)...', 'pending');
        }
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [authorizedEmails]); // Listen to whitelist changes

  // Auto-fetch Google Sheets data on tab open
  useEffect(() => {
    if (currentTab === 'import' && sheetPatients.length === 0 && !loadingSheet) {
      handleFetchGoogleSheet();
    }
  }, [currentTab]);

  const handleLogin = async () => {
    setLoading(true);
    addLog('Auth', 'กำลังเปิดหน้าจอยืนยันสิทธิ์ Google Sign-In...', 'pending');
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        
        // Resolve role dynamically based on whitelist
        const resolvedRole = resolveAndSetUserRole(result.user.email);
        setUserRole(resolvedRole);
        
        localStorage.setItem('stitchsync_role', resolvedRole);
        localStorage.setItem('stitchsync_user', JSON.stringify({
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL
        }));
        localStorage.setItem('stitchsync_token', result.accessToken);
        
        setNeedsAuth(false);
        if (resolvedRole === 'staff') {
          addLog('Auth', `เชื่อมต่อบัญชี Gmail ${result.user.email} สำเร็จ (สิทธิ์เจ้าหน้าที่สาธารณสุข)`, 'success');
        } else {
          addLog('Auth', `เชื่อมต่อบัญชี Gmail ${result.user.email} สำเร็จในฐานะ [บุคคลทั่วไป]`, 'success');
          alert('💡 หมายเหตุ: บัญชีของคุณได้รับการลงชื่อเข้าใช้แล้ว แต่เนื่องจากอีเมลนี้ไม่ได้อยู่ในรายชื่อเจ้าหน้าที่ที่ได้รับอนุมัติ (Whitelist) คุณจะใช้งานในฐานะ "บุคคลทั่วไป" (สิทธิ์อ่านอย่างเดียว) หากเป็นเจ้าหน้าที่ กรุณาติดต่อผู้ดูแลระบบหลักเพื่อเพิ่มอีเมลนี้เข้าสู่รายชื่ออนุมัติ');
        }
        fetchData(result.accessToken);
      }
    } catch (error: any) {
      console.error(error);
      addLog('Auth', `เข้าสู่ระบบไม่สำเร็จ: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMockStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = mockStaffName.trim() || 'เจ้าหน้าที่ สมชาย (อสม.ไผ่ต่ำ)';
    setLoading(true);
    addLog('Auth', `กำลังเตรียมการเข้าสู่ระบบแบบ อสม. จำลอง: ${name}`, 'pending');
    
    setTimeout(() => {
      const mockUser = {
        displayName: name,
        email: 'somchai.staff@phaitam.go.th',
        photoURL: ''
      };
      setUser(mockUser);
      setToken('mock-staff-token');
      setUserRole('staff');
      
      localStorage.setItem('stitchsync_role', 'staff');
      localStorage.setItem('stitchsync_user', JSON.stringify(mockUser));
      localStorage.setItem('stitchsync_token', 'mock-staff-token');
      
      setNeedsAuth(false);
      setLoading(false);
      addLog('Auth', `เข้าใช้งานในฐานะเจ้าหน้าที่จำลองสำเร็จ: คุณ ${name}`, 'success');
      fetchData('mock-staff-token');
    }, 400);
  };

  const handlePublicLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = guestName.trim() || 'บุคคลทั่วไป (ผู้มาเยือน)';
    setLoading(true);
    addLog('Auth', `กำลังเข้าสู่ระบบเพื่อเข้าชมทั่วไป: ${name}`, 'pending');
    
    setTimeout(() => {
      const mockUser = {
        displayName: name,
        email: 'guest@phaitam.go.th',
        photoURL: ''
      };
      setUser(mockUser);
      setToken(null);
      setUserRole('public');
      
      localStorage.setItem('stitchsync_role', 'public');
      localStorage.setItem('stitchsync_user', JSON.stringify(mockUser));
      localStorage.removeItem('stitchsync_token');
      
      setNeedsAuth(false);
      setLoading(false);
      addLog('Auth', `เข้าใช้งานในฐานะบุคคลทั่วไปสำเร็จ: ${name} (โหมดจำกัดสิทธิ์แก้ไข)`, 'success');
      fetchData(null);
    }, 400);
  };

  const handleLogout = async () => {
    if (window.confirm('คุณต้องการออกจากระบบการจัดการสุขภาพใช่หรือไม่?')) {
      addLog('Auth', 'กำลังทำการออกจากระบบ...', 'pending');
      
      localStorage.removeItem('stitchsync_role');
      localStorage.removeItem('stitchsync_user');
      localStorage.removeItem('stitchsync_token');
      
      if (token && token !== 'mock-staff-token') {
        try {
          await googleSignOut();
        } catch (e) {
          console.error(e);
        }
      }
      
      setUser(null);
      setToken(null);
      setUserRole(null);
      setNeedsAuth(true);
      setPatients([]);
      setActivities([]);
      addLog('Auth', 'ออกจากระบบและเคลียร์เซสชันเรียบร้อย', 'success');
    }
  };

  // Fetch from Google Sheets Database
  const fetchData = async (accessToken: string | null) => {
    setSyncing(true);
    
    if (!accessToken || accessToken === 'mock-staff-token') {
      addLog('Local DB', 'กำลังอ่านข้อมูลประชากรจากฐานข้อมูล Sandbox ของเครื่อง...', 'pending');
      try {
        const localPatients = localStorage.getItem('stitchsync_patients');
        const localActivities = localStorage.getItem('stitchsync_activities');
        
        let loadedPatients: Patient[] = [];
        let loadedActivities: Activity[] = [];

        // Check/Seed Patients
        if (localPatients) {
          loadedPatients = JSON.parse(localPatients);
        } else {
          // sheetsService mock fallback
          const service = new SheetsService('');
          loadedPatients = await service.fetchPatients(); // returns seed
          localStorage.setItem('stitchsync_patients', JSON.stringify(loadedPatients));
        }

        // Check/Seed Activities
        if (localActivities) {
          loadedActivities = JSON.parse(localActivities);
        } else {
          const service = new SheetsService('');
          loadedActivities = await service.fetchActivities(); // returns seed
          localStorage.setItem('stitchsync_activities', JSON.stringify(loadedActivities));
        }

        setPatients(loadedPatients);
        setActivities(loadedActivities);
        addLog('Local DB', `ดึงข้อมูลสำเร็จ: โหลดผู้ป่วย ${loadedPatients.length} ราย, กิจกรรมเยี่ยมบ้าน ${loadedActivities.length} รายการ`, 'success');
        
        if (loadedPatients.length > 0 && selectedPatientId === '') {
          setSelectedPatientId(loadedPatients[0].id);
        }
      } catch (e: any) {
        console.error(e);
        addLog('Local DB', `เกิดข้อผิดพลาดการโหลด Sandbox DB: ${e.message}`, 'error');
      } finally {
        setSyncing(false);
      }
      return;
    }

    addLog('Sheets DB', 'กำลังค้นหาหรือเชื่อมต่อ Google Sheets ฐานข้อมูล...', 'pending');
    try {
      const sheetsService = new SheetsService(accessToken);
      const spreadId = await sheetsService.getOrCreateSpreadsheet();
      addLog('Sheets DB', `เชื่อมต่อแผ่นงานรหัส: ${spreadId.substring(0, 15)}... แล้ว`, 'success');
      
      addLog('Sheets DB', 'กำลังอ่านข้อมูลประชากรและผู้ป่วย...', 'pending');
      const loadedPatients = await sheetsService.fetchPatients();
      setPatients(loadedPatients);
      addLog('Sheets DB', `โหลดข้อมูลผู้ป่วยจำนวน ${loadedPatients.length} ราย สำเร็จ`, 'success');

      addLog('Sheets DB', 'กำลังอ่านประวัติกิจกรรมล่าสุด...', 'pending');
      const loadedActivities = await sheetsService.fetchActivities();
      setActivities(loadedActivities);
      addLog('Sheets DB', `โหลดบันทึกกิจกรรมจำนวน ${loadedActivities.length} รายการ สำเร็จ`, 'success');

      if (loadedPatients.length > 0 && selectedPatientId === '') {
        setSelectedPatientId(loadedPatients[0].id);
      }
    } catch (error: any) {
      console.error(error);
      addLog('Sheets DB', `การเชื่อมต่อหรือดึงข้อมูลล้มเหลว: ${error.message}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Quick manual refresh
  const handleRefresh = () => {
    fetchData(token);
  };

  // Parser KML Content from Google My Maps
  const parseKML = (kmlText: string): Patient[] => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(kmlText, "text/xml");
      const placemarks = xmlDoc.getElementsByTagName("Placemark");
      const importedList: Patient[] = [];

      for (let i = 0; i < placemarks.length; i++) {
        const placemark = placemarks[i];
        const nameEl = placemark.getElementsByTagName("name")[0];
        const descEl = placemark.getElementsByTagName("description")[0];
        const coordsEl = placemark.getElementsByTagName("coordinates")[0];

        if (!nameEl) continue;

        const name = nameEl.textContent?.trim() || `ผู้ป่วยนำเข้า #${i + 1}`;
        const desc = descEl ? descEl.textContent || "" : "";
        
        let lat = 14.332266;
        let lng = 100.822967;
        
        if (coordsEl && coordsEl.textContent) {
          const parts = coordsEl.textContent.trim().split(",");
          if (parts.length >= 2) {
            lng = parseFloat(parts[0]) || 100.822967;
            lat = parseFloat(parts[1]) || 14.332266;
          }
        }

        // Try to identify category
        let category: PatientCategory = "ติดสังคม";
        if (desc.includes("ติดเตียง") || name.includes("ติดเตียง") || desc.includes("เตียง")) {
          category = "ติดเตียง";
        } else if (desc.includes("ติดบ้าน") || name.includes("ติดบ้าน")) {
          category = "ติดบ้าน";
        }

        // Extract caregiver / อสม.
        let caregiver = "อสม. ในพื้นที่";
        const vhvMatch = desc.match(/(อสม|ผู้ดูแล|อสม\.)[:\s]+([^\n\r,]+)/);
        if (vhvMatch) {
          caregiver = vhvMatch[2].trim();
        }

        // Extract phone number
        let phone = "08x-xxx-xxxx";
        const phoneMatch = desc.match(/(เบอร์โทร|โทรศัพท์|โทร|ติดต่อ)[:\s]+([0-9\-]+)/);
        if (phoneMatch) {
          phone = phoneMatch[2].trim();
        }

        // Extract vital signs or symptoms
        let vitalSigns = "ปกติ วัดความดันและชีพจรเสถียร";
        const vitalMatch = desc.match(/(อาการ|ชีพจร|ความดัน|สัญญาณชีพ)[:\s]+([^\n\r,]+)/);
        if (vitalMatch) {
          vitalSigns = vitalMatch[2].trim();
        }

        // Extract address
        let address = "หมู่ตำบลไผ่ต่ำ อ.วิหารแดง จ.สระบุรี";
        const addrMatch = desc.match(/(ที่อยู่|บ้านเลขที่)[:\s]+([^\n\r]+)/);
        if (addrMatch) {
          address = addrMatch[2].trim();
        }

        importedList.push({
          id: `HN-MM${String(patients.length + importedList.length + 1).padStart(3, '0')}`,
          name,
          category,
          address,
          vitalSigns,
          caregiver,
          lat,
          lng,
          lastVisited: 'นำเข้าจาก Google My Maps',
          phone,
        });
      }

      return importedList;
    } catch (e: any) {
      console.error("KML Parse error:", e);
      throw new Error(`รูปแบบไฟล์ KML ไม่ถูกต้องหรือการประมวลผลล้มเหลว: ${e.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setKmlInput(text);
      setImportError(null);
    };
    reader.readAsText(file);
  };

  const handleProcessKML = () => {
    if (!kmlInput.trim()) {
      setImportError('กรุณาวางข้อมูล KML หรืออัปโหลดไฟล์ KML ของคุณก่อน');
      return;
    }
    setImportError(null);
    try {
      const parsed = parseKML(kmlInput);
      if (parsed.length === 0) {
        setImportError('ไม่พบข้อมูลจุดพิกัดผู้ป่วย (<Placemark>) ในเนื้อหา KML ที่ระบุ');
      } else {
        setImportedPatients(parsed);
        addLog('My Maps Parser', `ดึงพิกัดและรายชื่อสำเร็จ: พบบุคคลเป้าหมาย ${parsed.length} ราย`, 'success');
      }
    } catch (err: any) {
      setImportError(err.message);
    }
  };

  const handleLoadDemoMyMaps = () => {
    setImportError(null);
    addLog('My Maps Simulated', 'กำลังดึงสตรีมพิกัดแผนที่ตำบลไผ่ต่ำจากลิงก์แผนที่...', 'pending');
    
    // Exact high-quality simulator matching the provided map coordinates in Phai Tam: 
    // center: 14.332266451410785, 100.82296756103872
    const demoPatients: Patient[] = [
      {
        id: `HN-MM${String(patients.length + 1).padStart(3, '0')}`,
        name: 'คุณยายพะยอม ดีเสมอ',
        category: 'ติดเตียง',
        address: 'บ้านเลขที่ 11 หมู่ 5 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
        vitalSigns: 'ความดัน 135/85 ชีพจร 78 ครั้ง/นาที',
        caregiver: 'อสม. ประกายดาว',
        lat: 14.332066,
        lng: 100.822967,
        lastVisited: 'เพิ่งนำเข้าจาก My Maps',
        phone: '081-555-1234',
      },
      {
        id: `HN-MM${String(patients.length + 2).padStart(3, '0')}`,
        name: 'คุณตาประกอบ วาจาดี',
        category: 'ติดบ้าน',
        address: 'บ้านเลขที่ 4 หมู่ 1 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
        vitalSigns: 'ความดันปกติ 120/80 ปวดขาและเข่าเล็กน้อย',
        caregiver: 'อสม. รัตนาภรณ์',
        lat: 14.333155,
        lng: 100.821421,
        lastVisited: 'เพิ่งนำเข้าจาก My Maps',
        phone: '082-666-2345',
      },
      {
        id: `HN-MM${String(patients.length + 3).padStart(3, '0')}`,
        name: 'คุณป้าพยอม เพลินจิต',
        category: 'ติดสังคม',
        address: 'บ้านเลขที่ 72 หมู่ 3 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
        vitalSigns: 'ปกติ แข็งแรง อารมณ์ร่าเริงแจ่มใส',
        caregiver: 'อสม. สุทิน',
        lat: 14.331122,
        lng: 100.824555,
        lastVisited: 'เพิ่งนำเข้าจาก My Maps',
        phone: '089-777-3456',
      },
      {
        id: `HN-MM${String(patients.length + 4).padStart(3, '0')}`,
        name: 'คุณลุงสุวรรณ แก้วประเสริฐ',
        category: 'ติดเตียง',
        address: 'บ้านเลขที่ 58 หมู่ 2 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
        vitalSigns: 'อัมพาตครึ่งซีก ตอบสนองดีเมื่อเรียก',
        caregiver: 'อสม. สายใจ',
        lat: 14.334055,
        lng: 100.823901,
        lastVisited: 'เพิ่งนำเข้าจาก My Maps',
        phone: '085-888-4567',
      },
      {
        id: `HN-MM${String(patients.length + 5).padStart(3, '0')}`,
        name: 'คุณยายกิ่งแก้ว ยอดรัก',
        category: 'ติดบ้าน',
        address: 'บ้านเลขที่ 102/1 หมู่ 5 ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี',
        vitalSigns: 'ควบคุมเบาหวานได้ดี น้ำตาลสะสมคงที่',
        caregiver: 'อสม. ประกายดาว',
        lat: 14.329899,
        lng: 100.821999,
        lastVisited: 'เพิ่งนำเข้าจาก My Maps',
        phone: '083-999-5678',
      }
    ];

    setTimeout(() => {
      setImportedPatients(demoPatients);
      addLog('My Maps Parser', 'ดึงข้อมูลจำลองเสมือนจริงของตำบลไผ่ต่ำเรียบร้อยแล้ว!', 'success');
    }, 600);
  };

  const extractSpreadsheetId = (url: string): string | null => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentVal = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i+1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++; // skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentVal.trim());
        if (row.length > 0 && row.some(val => val !== '')) {
          lines.push(row);
        }
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    if (currentVal || row.length > 0) {
      row.push(currentVal.trim());
      lines.push(row);
    }
    return lines;
  };

  const mapRowsToPatients = (rows: any[][]): Patient[] => {
    if (rows.length < 2) return [];
    
    // Find header row
    let headerIndex = 0;
    for (let r = 0; r < Math.min(rows.length, 5); r++) {
      const rowStr = rows[r].join(' ').toLowerCase();
      if (rowStr.includes('ชื่อ') || rowStr.includes('name') || rowStr.includes('ลำดับ') || rowStr.includes('hn') || rowStr.includes('เลข')) {
        headerIndex = r;
        break;
      }
    }
    
    const headers = rows[headerIndex].map((h: any) => String(h || '').trim().toLowerCase());
    const dataRows = rows.slice(headerIndex + 1);
    
    // Look for indices
    const nameIdx = headers.findIndex(h => h.includes('ชื่อ') || h.includes('นามสกุล') || h.includes('name') || h.includes('คนไข้') || h.includes('ผู้สูงอายุ') || h.includes('ผู้มีภาวะพึ่งพิง'));
    const catIdx = headers.findIndex(h => h.includes('กลุ่ม') || h.includes('ประเภท') || h.includes('ภาวะพึ่งพิง') || h.includes('adl') || h.includes('เตียง') || h.includes('category') || h.includes('ระดับ'));
    const addrIdx = headers.findIndex(h => h.includes('ที่อยู่') || h.includes('บ้านเลขที่') || h.includes('address') || h.includes('บ้าน'));
    const cgIdx = headers.findIndex(h => h.includes('อสม') || h.includes('ผู้ดูแล') || h.includes('caregiver') || h.includes('cg'));
    const phoneIdx = headers.findIndex(h => h.includes('โทร') || h.includes('เบอร์') || h.includes('phone') || h.includes('ติดต่อ'));
    const latIdx = headers.findIndex(h => h.includes('lat') || h.includes('ละติจูด') || h.includes('latitude') || h.includes('พิกัด y') || h.includes('y'));
    const lngIdx = headers.findIndex(h => h.includes('lng') || h.includes('ลองจิจูด') || h.includes('longitude') || h.includes('พิกัด x') || h.includes('x'));
    const vitalIdx = headers.findIndex(h => h.includes('อาการ') || h.includes('สัญญาณชีพ') || h.includes('ชีพจร') || h.includes('ความดัน') || h.includes('โรคประจำตัว') || h.includes('โรค') || h.includes('หมายเหตุ') || h.includes('vitals') || h.includes('ภาวะพึ่งพิง'));

    const parsed: Patient[] = [];
    
    dataRows.forEach((row, i) => {
      if (!row || row.length === 0 || !row.some(val => val !== '')) return;
      
      let name = '';
      if (nameIdx !== -1 && row[nameIdx]) {
        name = String(row[nameIdx]).trim();
      } else {
        const firstTextCol = row.find((val: any) => val && isNaN(Number(val)) && String(val).trim().length > 3);
        name = firstTextCol ? String(firstTextCol).trim() : `ผู้พึ่งพิงรายที่ ${i + 1}`;
      }

      if (name.includes('รวม') || name.includes('ชื่อ-นามสกุล') || name === 'Name' || name.length < 2) return;
      
      let hn = `HN-S${String(patients.length + parsed.length + 1).padStart(3, '0')}`;
      const hnIdx = headers.findIndex(h => h.includes('hn') || h.includes('รหัส') || h.includes('เลขประจำตัว') || h.includes('id'));
      if (hnIdx !== -1 && row[hnIdx]) {
        hn = String(row[hnIdx]).trim();
      }
      
      let category: PatientCategory = 'ติดบ้าน';
      let catVal = '';
      if (catIdx !== -1 && row[catIdx]) {
        catVal = String(row[catIdx]).trim();
      } else {
        const rowText = row.join(' ');
        if (rowText.includes('ติดเตียง') || rowText.includes('เตียง') || rowText.includes('group 3') || rowText.includes('กลุ่ม 3')) {
          category = 'ติดเตียง';
        } else if (rowText.includes('ติดบ้าน') || rowText.includes('บ้าน') || rowText.includes('group 2') || rowText.includes('กลุ่ม 2')) {
          category = 'ติดบ้าน';
        } else if (rowText.includes('ติดสังคม') || rowText.includes('สังคม') || rowText.includes('group 1') || rowText.includes('กลุ่ม 1')) {
          category = 'ติดสังคม';
        }
      }
      
      if (catVal) {
        if (catVal.includes('เตียง') || catVal.includes('ติดเตียง') || catVal.includes('3') || catVal.toLowerCase().includes('bedridden')) {
          category = 'ติดเตียง';
        } else if (catVal.includes('บ้าน') || catVal.includes('ติดบ้าน') || catVal.includes('2') || catVal.toLowerCase().includes('homebound')) {
          category = 'ติดบ้าน';
        } else {
          category = 'ติดสังคม';
        }
      }
      
      let address = 'ตำบลไผ่ต่ำ อ.วิหารแดง จ.สระบุรี';
      if (addrIdx !== -1 && row[addrIdx]) {
        address = String(row[addrIdx]).trim();
        if (!address.includes('ไผ่ต่ำ') && !address.includes('สระบุรี')) {
          address += ' ต.ไผ่ต่ำ อ.วิหารแดง จ.สระบุรี';
        }
      }
      
      let caregiver = 'อสม. ประจำหมู่บ้าน';
      if (cgIdx !== -1 && row[cgIdx]) {
        caregiver = String(row[cgIdx]).trim();
      }
      
      let phone = '08x-xxx-xxxx';
      if (phoneIdx !== -1 && row[phoneIdx]) {
        phone = String(row[phoneIdx]).trim();
      }
      
      let vitalSigns = 'สัญญาณชีพเสถียร ติดตามอาการต่อเนื่อง';
      if (vitalIdx !== -1 && row[vitalIdx]) {
        vitalSigns = String(row[vitalIdx]).trim();
      }
      
      let lat = 14.320 + (Math.random() * 0.015);
      let lng = 100.810 + (Math.random() * 0.020);
      
      if (latIdx !== -1 && row[latIdx]) {
        const parsedLat = parseFloat(row[latIdx]);
        if (!isNaN(parsedLat) && parsedLat > 13 && parsedLat < 16) {
          lat = parsedLat;
        }
      }
      if (lngIdx !== -1 && row[lngIdx]) {
        const parsedLng = parseFloat(row[lngIdx]);
        if (!isNaN(parsedLng) && parsedLng > 99 && parsedLng < 102) {
          lng = parsedLng;
        }
      }
      
      parsed.push({
        id: hn,
        name,
        category,
        address,
        vitalSigns,
        caregiver,
        lat,
        lng,
        lastVisited: 'นำเข้าจาก Google Sheets',
        phone
      });
    });
    
    return parsed;
  };

  const handleFetchGoogleSheet = async (customUrl?: string, specificSheet?: string) => {
    const targetUrl = customUrl || sheetUrl;
    const spreadsheetId = extractSpreadsheetId(targetUrl);
    if (!spreadsheetId) {
      setSheetError('ลิงก์ Google Sheets ไม่ถูกต้อง กรุณาใช้รูปแบบ https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/...');
      return;
    }

    setLoadingSheet(true);
    setSheetError(null);
    addLog('Sheets Loader', `กำลังเริ่มดึงข้อมูลจาก Spreadsheet: ${spreadsheetId.substring(0, 10)}...`, 'pending');

    try {
      if (token && token !== 'mock-staff-token') {
        const sheetsService = new SheetsService(token);
        
        // 1. Get sheets list first if empty or different sheet loaded
        let sheets = sheetList;
        try {
          sheets = await sheetsService.getSpreadsheetSheets(spreadsheetId);
          setSheetList(sheets);
        } catch (metaErr) {
          console.warn('Could not fetch sheet list via API, trying default sheets:', metaErr);
          sheets = ['Sheet1', 'Patients', 'แผ่นงาน1', 'รายชื่อผู้พึ่งพิง'];
          setSheetList(sheets);
        }

        const activeSheet = specificSheet || selectedSheetName || sheets[0] || 'Sheet1';
        if (!selectedSheetName) {
          setSelectedSheetName(activeSheet);
        }

        // 2. Fetch sheet values
        const rows = await sheetsService.fetchSheetValues(spreadsheetId, activeSheet);
        if (rows.length === 0) {
          throw new Error(`ไม่พบข้อมูลในแผ่นงาน "${activeSheet}" หรือไม่สามารถดึงข้อมูลได้`);
        }

        const parsedPatients = mapRowsToPatients(rows);
        setSheetPatients(parsedPatients);
        addLog('Sheets Loader', `ดึงข้อมูลด้วยสิทธิ์ Google API สำเร็จ! โหลดได้ ${parsedPatients.length} รายชื่อ`, 'success');
      } else {
        // Public sheet CSV fetch fallback
        addLog('Sheets Loader', 'กำลังเชื่อมต่อแบบ Public Export Link (ไม่ต้องใช้การล็อกอิน)...', 'pending');
        
        const activeSheet = specificSheet || selectedSheetName || 'Sheet1';
        const publicUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${specificSheet || selectedSheetName ? `&sheet=${encodeURIComponent(activeSheet)}` : ''}`;
        
        const response = await fetch(publicUrl);
        if (!response.ok) {
          throw new Error('ไม่สามารถเข้าถึงแผ่นงานได้ทางสาธารณะ กรุณาตั้งค่าแชร์แผ่นงานให้ "ทุกคนที่มีลิงก์มีสิทธิ์อ่าน" (Anyone with link can view) หรือ ล็อกอินเข้าสู่ระบบด้วยบัญชี Google ของท่าน');
        }

        const csvText = await response.text();
        const rows = parseCSV(csvText);
        
        if (rows.length === 0) {
          throw new Error('ไม่พบแถวข้อมูลจากการดึงแบบสาธารณะ');
        }

        const parsedPatients = mapRowsToPatients(rows);
        setSheetPatients(parsedPatients);
        
        if (sheetList.length === 0) {
          setSheetList([activeSheet]);
          setSelectedSheetName(activeSheet);
        }

        addLog('Sheets Loader', `ดึงข้อมูลแบบสาธารณะสำเร็จ! ถอดโครงสร้างได้ ${parsedPatients.length} รายชื่อ`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      setSheetError(err.message || 'เกิดข้อผิดพลาดในการโหลดชีท');
      addLog('Sheets Loader', `โหลดแผ่นงานล้มเหลว: ${err.message}`, 'error');
    } finally {
      setLoadingSheet(false);
    }
  };

  const handleSaveSheetPatients = () => {
    if (sheetPatients.length === 0) {
      alert('ไม่มีรายชื่อที่โหลดมาเพื่อบันทึก');
      return;
    }

    if (userRole === 'public') {
      alert('⚠️ สิทธิ์การใช้งานจำกัด: บุคคลทั่วไปไม่สามารถซิงค์หรือนำรายชื่อใหม่เข้าสู่ระบบฐานข้อมูลได้');
      return;
    }

    setSyncing(true);
    addLog('Sheets Sync', `กำลังนำเข้าผู้พึ่งพิงจำนวน ${sheetPatients.length} รายเข้าสู่ระบบ...`, 'pending');

    setTimeout(async () => {
      try {
        if (!token || token === 'mock-staff-token') {
          // Sync locally
          const existingNames = new Set(patients.map(p => p.name));
          const newToAppend = sheetPatients.filter(p => !existingNames.has(p.name));
          
          if (newToAppend.length === 0) {
            alert('ข้อมูลรายชื่อทั้งหมดเชื่อมโยงอยู่แล้ว ไม่จำเป็นต้องนำเข้าซ้ำ');
            addLog('Sheets Sync', 'ไม่พบรายชื่อใหม่ในการซิงค์ฐานข้อมูล', 'success');
            setSyncing(false);
            return;
          }

          const updated = [...newToAppend, ...patients];
          setPatients(updated);
          localStorage.setItem('stitchsync_patients', JSON.stringify(updated));
          addLog('Local DB', `ซิงค์รายชื่อใหม่ ${newToAppend.length} รายการลงระบบ Sandbox สำเร็จ!`, 'success');
          alert(`ซิงค์ข้อมูลใหม่สำเร็จ! เพิ่มประชากรใหม่เข้าสู่ระบบจำนวน ${newToAppend.length} ราย`);
        } else {
          // Sync with Google Sheets DB
          const sheetsService = new SheetsService(token);
          const existingNames = new Set(patients.map(p => p.name));
          const newToAppend = sheetPatients.filter(p => !existingNames.has(p.name));

          if (newToAppend.length === 0) {
            alert('รายชื่อทั้งหมดในตารางเชื่อมโยงกับระบบหลักเรียบร้อยแล้ว');
            addLog('Sheets Sync', 'ระบบหลักได้รับการอัปเดตเรียบร้อยก่อนหน้าแล้ว', 'success');
            setSyncing(false);
            return;
          }

          addLog('Sheets Sync', `กำลังอัปโหลดรายชื่อผู้ป่วย ${newToAppend.length} รายทีละคน...`, 'pending');
          let successCount = 0;
          for (const p of newToAppend) {
            const ok = await sheetsService.addPatient(p);
            if (ok) successCount++;
          }

          addLog('Sheets Sync', `ซิงค์ขึ้น Google Sheets หลักสำเร็จ ${successCount}/${newToAppend.length} ราย`, 'success');
          await fetchData(token);
          alert(`ซิงค์ข้อมูลเข้าระบบ Google Sheets สำเร็จ! เพิ่มขึ้นทั้งหมด ${successCount} รายชื่อ`);
        }
      } catch (err: any) {
        console.error(err);
        addLog('Sheets Sync', `เกิดข้อผิดพลาดในการซิงค์: ${err.message}`, 'error');
        alert(`ซิงค์รายชื่อไม่สำเร็จ: ${err.message}`);
      } finally {
        setSyncing(false);
      }
    }, 1000);
  };

  const handleDownloadCSV = (listToExport: Patient[]) => {
    if (listToExport.length === 0) {
      alert('ไม่มีข้อมูลให้ส่งออก');
      return;
    }
    const headers = ['รหัสผู้ป่วย (HN)', 'ชื่อ-นามสกุล', 'กลุ่มสุขภาพ', 'ที่อยู่', 'อสม. ผู้รับผิดชอบ/ผู้ดูแล', 'เบอร์โทรศัพท์', 'ละติจูด (Lat)', 'ลองจิจูด (Lng)', 'ข้อมูลสัญญาณชีพ/อาการล่าสุด'];
    const rows = listToExport.map(p => [
      p.id,
      p.name,
      p.category,
      p.address,
      p.caregiver,
      p.phone,
      p.lat.toString(),
      p.lng.toString(),
      p.vitalSigns
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "รายชื่อผู้ป่วยพึ่งพิง_ตำบลไผ่ต่ำ.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('Export', 'ส่งออกไฟล์ CSV สำเร็จเรียบร้อยแล้ว', 'success');
  };

  const handleCopyToClipboard = (listToExport: Patient[]) => {
    if (listToExport.length === 0) {
      alert('ไม่มีข้อมูลให้คัดลอก');
      return;
    }
    const headers = ['รหัสผู้ป่วย (HN)', 'ชื่อ-นามสกุล', 'กลุ่มสุขภาพ', 'ที่อยู่', 'อสม. ผู้ดูแล', 'เบอร์โทรศัพท์', 'ละติจูด', 'ลองจิจูด', 'อาการล่าสุด'];
    const rows = listToExport.map(p => [
      p.id,
      p.name,
      p.category,
      p.address,
      p.caregiver,
      p.phone,
      p.lat.toString(),
      p.lng.toString(),
      p.vitalSigns
    ]);
    const textContent = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
    navigator.clipboard.writeText(textContent)
      .then(() => {
        alert('📋 คัดลอกข้อมูลทั้งหมดไปยังคลิปบอร์ดแล้ว! สามารถนำไปวางใน Excel หรือ Google Sheets ได้ทันที');
        addLog('Export', 'คัดลอกข้อมูลไปยังคลิปบอร์ดสำเร็จ', 'success');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('เกิดข้อผิดพลาดในการคัดลอก');
      });
  };

  const handleSaveImportedPatients = async () => {
    if (userRole === 'public') {
      alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุขและ อสม. เท่านั้นที่ได้รับอนุญาตให้นำเข้าข้อมูลระบบได้');
      return;
    }
    if (importedPatients.length === 0) return;

    setSyncing(true);
    addLog('My Maps Import', `กำลังนำเข้าประชากรสุขภาพใหม่จำนวน ${importedPatients.length} ราย...`, 'pending');

    if (!token || token === 'mock-staff-token') {
      // Save locally (Sandbox)
      setTimeout(() => {
        const existingNames = new Set(patients.map(p => p.name));
        const newToAppend = importedPatients.filter(p => !existingNames.has(p.name));
        
        if (newToAppend.length === 0) {
          addLog('Local DB', `ไม่พบบัญชีใหม่เนื่องจากรายชื่อซ้ำกับที่มีอยู่แล้วทั้งหมด`, 'error');
          alert('รายชื่อผู้ป่วยทั้งหมดมีอยู่ในการจำลองข้อมูลแล้ว');
          setSyncing(false);
          return;
        }

        const updatedPatients = [...newToAppend, ...patients];
        setPatients(updatedPatients);
        localStorage.setItem('stitchsync_patients', JSON.stringify(updatedPatients));

        addLog('Local DB', `นำเข้าข้อมูลและพิกัดแผนที่เพิ่มใหม่ ${newToAppend.length} รายลงคลังสำเร็จ!`, 'success');
        alert(`นำเข้าผู้ป่วยและพิกัดใหม่จำนวน ${newToAppend.length} รายสำเร็จ! (เข้าคลังจำลอง)`);
        setImportedPatients([]);
        setKmlInput('');
        setSyncing(false);
        setCurrentTab('analytics');
      }, 500);
      return;
    }

    // Save to Google Sheets Cloud DB
    try {
      const sheetsService = new SheetsService(token);
      let successCount = 0;
      
      const existingNames = new Set(patients.map(p => p.name));
      const newToAppend = importedPatients.filter(p => !existingNames.has(p.name));
      
      if (newToAppend.length === 0) {
        addLog('Sheets DB', 'รายชื่อผู้ป่วยเหล่านี้ถูกบันทึกใน Google Sheets แล้วทั้งหมด', 'success');
        alert('ผู้ป่วยทุกรายจากแผนที่ถูกนำเข้าเรียบร้อยแล้ว (ไม่พบข้อมูลรายชื่อใหม่)');
        setSyncing(false);
        return;
      }

      for (const p of newToAppend) {
        const ok = await sheetsService.addPatient(p);
        if (ok) successCount++;
      }

      if (successCount > 0) {
        addLog('Sheets DB', `เขียนข้อมูลลงแผ่นงานสำเร็จ: บันทึกคนไข้เพิ่มพิกัด ${successCount} ราย`, 'success');
        await fetchData(token);
        alert(`นำเข้าพิกัดและข้อมูลผู้ป่วย/อสม./caregiver จำนวน ${successCount} รายเข้าสู่ Google Sheets สำเร็จ!`);
        setImportedPatients([]);
        setKmlInput('');
        setCurrentTab('analytics');
      } else {
        addLog('Sheets DB', 'การนำเข้าข้อมูลไม่สำเร็จ', 'error');
        alert('นำเข้าไม่สำเร็จ กรุณาตรวจสอบสิทธิ์การเขียนไฟล์แผ่นงาน');
      }
    } catch (error: any) {
      console.error(error);
      addLog('Sheets DB', `เกิดข้อผิดพลาดในการเซฟเข้า Google Sheets: ${error.message}`, 'error');
      alert(`ไม่สามารถซิงค์ข้อมูลเข้า Google Sheets: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // Add a new activity (visited record)
  const submitNewVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'staff' && userRole !== 'caregiver') {
      alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุข, อสม. และผู้ดูแล Caregiver เท่านั้นที่ได้รับอนุญาตให้บันทึกรายงานผลการเข้าเยี่ยมบ้านได้');
      return;
    }
    if (!selectedPatientId) return;

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    setSyncing(true);

    const newActivity: Activity = {
      timestamp: 'เมื่อสักครู่',
      patientName: patient.name,
      caregiverName: user?.displayName || 'อสม. ผู้ดูแล',
      type: 'เข้าเยี่ยม',
      description: visitDescription || `อสม. เข้าตรวจเยี่ยมและติดตามผล อาการทั่วไป: ${visitVitalSigns || 'ปกติ'}`,
      status: visitStatus,
    };

    if (!token || token === 'mock-staff-token') {
      addLog('Local DB', `กำลังบันทึกรายงานเข้าเยี่ยม (จำลอง) สำหรับ: ${patient.name}...`, 'pending');
      setTimeout(() => {
        const updatedActivities = [newActivity, ...activities];
        setActivities(updatedActivities);
        localStorage.setItem('stitchsync_activities', JSON.stringify(updatedActivities));
        
        // Update patient lastVisited field locally
        const updatedPatients = patients.map(p => {
          if (p.id === patient.id) {
            return {
              ...p,
              lastVisited: 'เมื่อสักครู่',
              vitalSigns: visitVitalSigns || p.vitalSigns
            };
          }
          return p;
        });
        setPatients(updatedPatients);
        localStorage.setItem('stitchsync_patients', JSON.stringify(updatedPatients));

        addLog('Local DB', `บันทึกรายงานเข้าเยี่ยมคุณ ${patient.name} สำเร็จลง Sandbox ของเบราว์เซอร์`, 'success');
        
        // Reset form and close modal
        setVisitVitalSigns('');
        setVisitDescription('');
        setVisitStatus('Normal');
        setIsModalOpen(false);
        setSyncing(false);
      }, 300);
      return;
    }

    addLog('Sheets DB', `กำลังบันทึกรายงานเข้าเยี่ยมสำหรับ: ${patient.name}...`, 'pending');
    try {
      const sheetsService = new SheetsService(token);
      
      // Post activity to sheets
      const success = await sheetsService.addActivity(newActivity);
      if (success) {
        addLog('Sheets DB', `บันทึกรายงานเข้าเยี่ยมคุณ ${patient.name} ลง Google Sheet สำเร็จ`, 'success');
        
        // Refresh local data to show the new list
        await fetchData(token);
        
        // Reset form and close modal
        setVisitVitalSigns('');
        setVisitDescription('');
        setVisitStatus('Normal');
        setIsModalOpen(false);
      } else {
        throw new Error('Sheets API returned false status');
      }
    } catch (error: any) {
      console.error(error);
      addLog('Sheets DB', `ไม่สามารถเพิ่มรายงานได้: ${error.message}`, 'error');
      alert('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSyncing(false);
    }
  };

  // Create a brand new patient
  const submitNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== 'staff') {
      alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุขและ อสม. เท่านั้นที่ได้รับอนุญาตให้ลงทะเบียนผู้ป่วยใหม่ได้');
      return;
    }
    if (!newPatientName) return;

    setSyncing(true);
    const newId = `HN${String(patients.length + 1).padStart(3, '0')}`;
    const newPatient: Patient = {
      id: newId,
      name: newPatientName,
      category: newPatientCategory,
      address: newPatientAddress || 'ต.ไผ่ต่ำ อ.วิหารแดง',
      vitalSigns: newPatientVital || 'ปกติ',
      caregiver: newPatientCaregiver || user?.displayName || 'อสม. สมศรี',
      lat: 14.320 + (Math.random() - 0.5) * 0.015, // Generate nearby randomized coordinates for map markers
      lng: 100.815 + (Math.random() - 0.5) * 0.015,
      lastVisited: 'เพิ่งลงทะเบียน',
      phone: newPatientPhone || '08x-xxx-xxxx',
    };

    const newActivity: Activity = {
      timestamp: 'เมื่อสักครู่',
      patientName: newPatientName,
      caregiverName: user?.displayName || 'อสม. ผู้ดูแล',
      type: 'นัดหมาย',
      description: `ลงทะเบียนผู้ป่วยใหม่ในระบบ (${newPatientCategory}) พิกัด ต.ไผ่ต่ำ`,
      status: 'Normal',
    };

    if (!token || token === 'mock-staff-token') {
      addLog('Local DB', `กำลังลงทะเบียนผู้ป่วยใหม่ (จำลอง): ${newPatientName}...`, 'pending');
      setTimeout(() => {
        const updatedPatients = [newPatient, ...patients];
        const updatedActivities = [newActivity, ...activities];
        
        setPatients(updatedPatients);
        setActivities(updatedActivities);
        localStorage.setItem('stitchsync_patients', JSON.stringify(updatedPatients));
        localStorage.setItem('stitchsync_activities', JSON.stringify(updatedActivities));

        addLog('Local DB', `ลงทะเบียนผู้ป่วยใหม่ ${newPatientName} (${newId}) ลงใน Sandbox เรียบร้อย`, 'success');
        
        // Reset
        setNewPatientName('');
        setNewPatientAddress('');
        setNewPatientPhone('');
        setNewPatientVital('');
        setNewPatientCaregiver('');
        setIsModalOpen(false);
        setSyncing(false);
      }, 300);
      return;
    }

    addLog('Sheets DB', `กำลังลงทะเบียนผู้ป่วยใหม่: ${newPatientName}...`, 'pending');
    try {
      const sheetsService = new SheetsService(token);
      
      // Append patient and the activity entry
      const pSuccess = await sheetsService.addPatient(newPatient);
      const aSuccess = await sheetsService.addActivity(newActivity);

      if (pSuccess && aSuccess) {
        addLog('Sheets DB', `ลงทะเบียนผู้ป่วยใหม่ ${newPatientName} (${newId}) ลงใน Google Sheet เรียบร้อย`, 'success');
        await fetchData(token);

        // Reset
        setNewPatientName('');
        setNewPatientAddress('');
        setNewPatientPhone('');
        setNewPatientVital('');
        setNewPatientCaregiver('');
        setIsModalOpen(false);
      } else {
        throw new Error('API write operations incomplete');
      }
    } catch (error: any) {
      console.error(error);
      addLog('Sheets DB', `ล้มเหลวในการลงทะเบียนผู้ป่วยใหม่: ${error.message}`, 'error');
      alert('ลงทะเบียนคนไข้ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSyncing(false);
    }
  };

  const openEditPatient = (p: Patient) => {
    setSelectedPatientId(p.id);
    setEditPatientId(p.id);
    setEditPatientName(p.name);
    setEditPatientCategory(p.category);
    setEditPatientAddress(p.address);
    setEditPatientPhone(p.phone || '');
    setEditPatientVital(p.vitalSigns);
    setEditPatientCaregiver(p.caregiver);
    setModalType('edit-patient');
    setIsModalOpen(true);
  };

  const submitEditPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'public') {
      alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุขและ อสม. เท่านั้นที่ได้รับอนุญาตให้แก้ไขข้อมูลผู้ป่วยได้');
      return;
    }
    if (!editPatientId || !editPatientName) return;

    setSyncing(true);

    const originalPatient = patients.find(p => p.id === editPatientId);
    if (!originalPatient) {
      setSyncing(false);
      return;
    }

    const updatedPatient: Patient = {
      ...originalPatient,
      name: editPatientName,
      category: editPatientCategory,
      address: editPatientAddress || 'ต.ไผ่ต่ำ อ.วิหารแดง',
      vitalSigns: editPatientVital || 'ปกติ',
      caregiver: editPatientCaregiver || originalPatient.caregiver,
      phone: editPatientPhone || '08x-xxx-xxxx',
    };

    const editActivity: Activity = {
      timestamp: 'เมื่อสักครู่',
      patientName: editPatientName,
      caregiverName: user?.displayName || 'อสม. ผู้ดูแล',
      type: 'เข้าเยี่ยม',
      description: `แก้ไขข้อมูลผู้ป่วย: ชื่อ ${editPatientName}, กลุ่ม ${editPatientCategory}, ที่อยู่ ${editPatientAddress || 'N/A'}, อาการ ${editPatientVital || 'N/A'}`,
      status: 'Normal',
    };

    if (!token || token === 'mock-staff-token') {
      addLog('Local DB', `กำลังแก้ไขข้อมูลผู้ป่วย (จำลอง): ${editPatientName}...`, 'pending');
      setTimeout(() => {
        const updatedPatients = patients.map(p => p.id === editPatientId ? updatedPatient : p);
        const updatedActivities = [editActivity, ...activities];
        
        setPatients(updatedPatients);
        setActivities(updatedActivities);
        localStorage.setItem('stitchsync_patients', JSON.stringify(updatedPatients));
        localStorage.setItem('stitchsync_activities', JSON.stringify(updatedActivities));

        addLog('Local DB', `แก้ไขข้อมูลผู้ป่วยคุณ ${editPatientName} สำเร็จลงใน Sandbox เรียบร้อย`, 'success');
        
        setIsModalOpen(false);
        setSyncing(false);
      }, 300);
      return;
    }

    addLog('Sheets DB', `กำลังอัปเดตข้อมูลผู้ป่วยใน Google Sheets: ${editPatientName}...`, 'pending');
    try {
      const sheetsService = new SheetsService(token);
      
      const pSuccess = await sheetsService.updatePatient(updatedPatient);
      const aSuccess = await sheetsService.addActivity(editActivity);

      if (pSuccess && aSuccess) {
        addLog('Sheets DB', `แก้ไขข้อมูลผู้ป่วย ${editPatientName} (${editPatientId}) ใน Google Sheets เรียบร้อย`, 'success');
        await fetchData(token);
        setIsModalOpen(false);
      } else {
        throw new Error('API update operations incomplete');
      }
    } catch (error: any) {
      console.error(error);
      addLog('Sheets DB', `ล้มเหลวในการแก้ไขข้อมูลผู้ป่วย: ${error.message}`, 'error');
      alert('แก้ไขข้อมูลคนไข้ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSyncing(false);
    }
  };

  // Helper Stats Calculation
  const totalPopulation = patients.length || 2450;
  const bedboundCount = patients.filter(p => p.category === 'ติดเตียง').length || 12;
  const homeboundCount = patients.filter(p => p.category === 'ติดบ้าน').length || 28;
  const socialCount = patients.filter(p => p.category === 'ติดสังคม').length || 60;

  const bedboundPercent = Math.round((bedboundCount / (patients.length || 1)) * 100) || 12;
  const homeboundPercent = Math.round((homeboundCount / (patients.length || 1)) * 100) || 28;
  const socialPercent = Math.round((socialCount / (patients.length || 1)) * 100) || 60;

  // Filtered patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.vitalSigns.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ทั้งหมด' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Login View screen
  if (needsAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden font-sans text-slate-900">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-8 flex flex-col items-center relative z-10"
        >
          {/* Header Icon */}
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white mb-4 shadow-md shadow-blue-600/10">
            <span className="material-symbols-outlined text-2xl">hub</span>
          </div>
          
          <h1 className="text-xl font-bold text-slate-900 text-center tracking-tight mb-1">
            StitchSync • ระบบสุขภาพไผ่ต่ำ
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono text-center mb-6 font-bold">
            PHAI TAM HEALTHCARE HUB
          </p>

          {/* Tab selection buttons */}
          <div className="w-full flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setLoginTab('staff')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginTab === 'staff'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">shield_person</span>
              <span>เจ้าหน้าที่ / อสม.</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginTab('public')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginTab === 'public'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">groups</span>
              <span>บุคคลทั่วไป / ผู้มาเยือน</span>
            </button>
          </div>

          <div className="w-full border-t border-slate-100 my-1 py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-6 text-center">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                <p className="text-[11px] text-slate-400">กำลังเข้าสู่ระบบและประสานฐานข้อมูล...</p>
              </div>
            ) : loginTab === 'staff' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 text-center mb-6 px-4 leading-relaxed">
                  สำหรับเจ้าหน้าที่ รพ.สต., แพทย์, พยาบาล และ อสม. เพื่อใช้งานลงทะเบียนผู้ป่วยและรายงานผลการเยี่ยมบ้านแบบเรียลไทม์
                </p>

                {/* Google Sign-In */}
                <button 
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center space-x-3 py-2.5 px-6 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all rounded-lg shadow-sm text-xs font-bold text-slate-700 hover:shadow active:scale-98 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>ล็อกอินเจ้าหน้าที่ด้วย Google Gmail</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-[9px] text-slate-300 uppercase font-bold tracking-widest">หรือเข้าสู่ระบบทดลองจำลอง</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* Mock staff login form */}
                <form onSubmit={handleMockStaffLogin} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ชื่อเจ้าหน้าที่ (สำหรับจำลองระบบ)</label>
                    <input
                      type="text"
                      placeholder="เช่น อสม. สมเกียรติ สุขสบาย"
                      value={mockStaffName}
                      onChange={(e) => setMockStaffName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-all cursor-pointer border border-blue-100"
                  >
                    เข้าสู่ระบบจำลอง (เจ้าหน้าที่สาธารณสุข)
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 text-center mb-6 px-4 leading-relaxed">
                  สำหรับประชาชนทั่วไป, อสม. และญาติผู้ป่วย เพื่อใช้เข้าดูสถิติ แผนที่จำแนกสัญลักษณ์ระดับสี และรายงานภาพรวมตำบลไผ่ต่ำ (ดูอย่างเดียว)
                </p>

                <form onSubmit={handlePublicLogin} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ชื่อผู้เข้าชมทั่วไป</label>
                    <input
                      type="text"
                      placeholder="ระบุชื่อของคุณ (เช่น คุณสมศรี มีสุข)"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-lg transition-all cursor-pointer shadow"
                  >
                    เข้าใช้งานระบบ (บุคคลทั่วไป / View-Only)
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="mt-6 text-center border-t border-slate-100 w-full pt-4">
            <p className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              © 2026 STITCHSYNC CO. • ระบบตำบลนำร่องความปลอดภัยสูง
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active dashboard view
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans select-none relative">
      
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col z-40">
        
        {/* Title Header */}
        <div className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 tracking-tight leading-none">StitchSync</h1>
              <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider mt-1">ระบบสุขภาพไผ่ต่ำ</p>
            </div>
          </div>
        </div>

        {/* Syncing State Indicator */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600">
            <span className={`w-2 h-2 rounded-full ${syncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="font-medium text-[11px]">{syncing ? 'กำลังดึงฐานข้อมูล...' : 'ฐานข้อมูลเสถียรเรียลไทม์'}</span>
          </div>
          <button 
            onClick={handleRefresh}
            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="อัปเดตข้อมูลตอนนี้"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Navigation Tab links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-xs transition-colors cursor-pointer text-left ${
              currentTab === 'dashboard' 
                ? 'bg-blue-50 text-blue-700 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 opacity-80 shrink-0"></span>
            <span>แผงควบคุมหลัก (Dashboard)</span>
          </button>

          <button 
            onClick={() => setCurrentTab('map')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-xs transition-colors cursor-pointer text-left ${
              currentTab === 'map' 
                ? 'bg-blue-50 text-blue-700 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
            <span>แผนที่สีสาธารณสุข (Map View)</span>
          </button>

          <button 
            onClick={() => setCurrentTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-xs transition-colors cursor-pointer text-left ${
              currentTab === 'analytics' 
                ? 'bg-blue-50 text-blue-700 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
            <span>วิเคราะห์ประชากร (Analytics)</span>
          </button>

          <button 
            onClick={() => setCurrentTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-xs transition-colors cursor-pointer text-left ${
              currentTab === 'logs' 
                ? 'bg-blue-50 text-blue-700 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
            <span>ประวัติระบบส่งข้อมูล (Logs)</span>
          </button>

          <button 
            onClick={() => setCurrentTab('team')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-xs transition-colors cursor-pointer text-left ${
              currentTab === 'team' 
                ? 'bg-blue-50 text-blue-700 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
            <span>ตั้งค่าฐานข้อมูล (Settings)</span>
          </button>

          <button 
            onClick={() => setCurrentTab('import')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-xs transition-colors cursor-pointer text-left ${
              currentTab === 'import' 
                ? 'bg-blue-50 text-blue-700 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span className="flex items-center justify-between w-full">
              <span>เชื่อมต่อ Google My Maps</span>
              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[8px] rounded border border-amber-200 uppercase font-extrabold scale-90">NEW</span>
            </span>
          </button>

          {/* New sidebar logout button for easy navigation */}
          <div className="pt-2 border-t border-slate-100 mt-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
              <span>ออกจากระบบ (Log Out)</span>
            </button>
          </div>
        </nav>

        {/* CTA "New Report" button */}
        <div className="p-4 border-t border-slate-100">
          {(userRole !== 'staff' && userRole !== 'caregiver') ? (
            <button 
              onClick={() => {
                alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุข, อสม. และผู้ดูแล Caregiver เท่านั้นที่ได้รับอนุญาตให้บันทึกรายงานผลการเข้าเยี่ยมบ้านได้');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 border border-slate-200 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>รายงานเข้าเยี่ยมบ้าน (ล็อกสิทธิ์)</span>
            </button>
          ) : (
            <button 
              onClick={() => {
                setModalType('visit');
                setIsModalOpen(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>รายงานเข้าเยี่ยมบ้าน</span>
            </button>
          )}
        </div>

        {/* Environment status widget matching the theme exactly */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[9px] uppercase font-bold text-slate-400 mb-2 px-1">Environment</div>
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono text-slate-500">ID: 15869...249</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
              userRole === 'staff' ? 'bg-blue-100 text-blue-700' :
              userRole === 'caregiver' ? 'bg-emerald-100 text-emerald-700' :
              userRole === 'dependent' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {userRole === 'staff' ? 'STAFF_PROD' :
               userRole === 'caregiver' ? 'CAREGIVER_PROD' :
               userRole === 'dependent' ? 'DEPENDENT_PROD' :
               'GUEST_VIEW'}
            </span>
          </div>
        </div>
      </aside>


      {/* Main Content Pane */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-full">
        
        {/* Header bar matching Professional Polish */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full ${syncing ? 'bg-amber-400 opacity-75' : 'bg-emerald-400 opacity-75'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${syncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-xs font-medium text-slate-600">
                {userRole === 'staff' ? 'สิทธิ์เจ้าหน้าที่ / อสม. (แก้ไขได้)' :
                 userRole === 'caregiver' ? 'สิทธิ์ผู้ดูแล Caregiver (บันทึกรายงานเยี่ยมได้)' :
                 userRole === 'dependent' ? 'สิทธิ์ผู้ป่วย/ญาติ (ดูรายงานและสถิติ)' :
                 'โหมดบุคคลทั่วไป (ดูข้อมูลเท่านั้น)'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Inline Search Bar */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 px-3 h-9 w-64 rounded-lg transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs flex-1 placeholder:text-slate-400 text-slate-800 h-full w-full" 
                placeholder="ค้นหาคนไข้, บ้านเลขที่, อาการ..." 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-200/50 rounded-full cursor-pointer">
                  <X className="w-2.5 h-2.5 text-slate-500" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right flex flex-col items-end">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 leading-tight">
                  <span>{user?.displayName || 'Chaiwat Somchai'}</span>
                  {userRole === 'staff' ? (
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-extrabold rounded border border-blue-100 uppercase">
                      เจ้าหน้าที่ อสม.
                    </span>
                  ) : userRole === 'caregiver' ? (
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-extrabold rounded border border-emerald-100 uppercase">
                      ผู้ดูแล Caregiver
                    </span>
                  ) : userRole === 'dependent' ? (
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[8px] font-extrabold rounded border border-amber-100 uppercase">
                      ผู้ป่วยภาวะพึ่งพิง
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-extrabold rounded border border-slate-200 uppercase">
                      บุคคลทั่วไป
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{user?.email || 'chaiwat.s@gmail.com'}</div>
              </div>
              <div className="w-8 h-8 bg-slate-100 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 font-bold overflow-hidden shrink-0">
                {user?.photoURL ? (
                  <img src={user.photoURL} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Profile" />
                ) : (
                  (user?.displayName || 'CS').substring(0, 2).toUpperCase()
                )}
              </div>

              {/* Quick Header Logout Icon Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Tab-based Content Rendering */}
        <div className="flex-1 w-full h-full relative z-10 overflow-hidden bg-slate-50">
          <AnimatePresence mode="wait">
            
            {/* Dashboard Tab: My Maps integration + Overlay Widgets */}
            {currentTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                {/* Fullscreen embedded Google My Maps as background */}
                <div className="absolute inset-0 z-0">
                  <iframe 
                    src="https://www.google.com/maps/d/embed?mid=1EJn-6UCajvEy2clWRRGHMw7ZG0xWhQE" 
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    title="ระบบแผนที่จำแนกกลุ่มตำบลไผ่ต่ำ"
                  />
                </div>

                {/* Left Floating Info Overlay Widget (Active Users / caregivers) */}
                <div className="absolute bottom-16 left-6 z-20 w-80">
                  <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl border border-slate-200 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                          การปฏิบัติงานล่าสุด
                        </h3>
                        <p className="text-2xl font-extrabold text-blue-600 tracking-tighter">
                          100%
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="text-slate-600 font-medium">เชื่อมต่อคลาวด์คีย์</span>
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">สำเร็จ</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1">
                        <div className="bg-blue-600 h-1 rounded-full" style={{ width: '100%' }}></div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-slate-600 font-medium">พิกัดระบบติดตามตำบล</span>
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">เรียลไทม์</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1">
                        <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Floating Activity Feed Widget */}
                <div className="absolute right-6 top-6 bottom-16 z-20 w-80 flex flex-col space-y-4 pointer-events-none">
                  
                  {/* Activities list card */}
                  <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl border border-slate-200 shadow-lg flex-1 flex flex-col overflow-hidden pointer-events-auto max-h-[380px]">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                      <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                        <Bell className="w-3.5 h-3.5 text-blue-600" />
                        <span>กิจกรรมเข้าเยี่ยมล่าสุด</span>
                      </h3>
                      <button 
                        onClick={() => setCurrentTab('logs')}
                        className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        ประวัติทั้งหมด
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
                      {activities.length === 0 ? (
                        <div className="text-center py-10 text-xs text-slate-400">
                          ไม่พบบันทึกกิจกรรมล่าสุด
                        </div>
                      ) : (
                        activities.slice(0, 10).map((act, idx) => (
                          <div 
                            key={idx}
                            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                              act.status === 'Danger' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                              act.status === 'Warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {act.type === 'แจ้งเตือน' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
                               act.type === 'นัดหมาย' ? <Calendar className="w-3.5 h-3.5" /> : <ActivityIcon className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-slate-800 leading-snug">
                                {act.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-0.5 text-[9px] text-slate-400">
                                <span>โดย {act.caregiverName}</span>
                                <span>•</span>
                                <span>{act.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Patients Categorization widget */}
                  <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl border border-slate-200 shadow-lg flex flex-col pointer-events-auto">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                      <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                          ประชากรเป้าหมายในพื้นที่
                        </h3>
                        <p className="text-2xl font-extrabold text-blue-600 tracking-tighter">
                          {patients.length} คน
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {/* Bedbound */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-0.5">
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2" />ติดเตียง (Bedbound)</span>
                          <span className="font-bold text-slate-800">{bedboundCount} ราย ({bedboundPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1">
                          <div className="bg-rose-500 h-1 rounded-full" style={{ width: `${bedboundPercent}%` }} />
                        </div>
                      </div>

                      {/* Homebound */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-0.5">
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />ติดบ้าน (Homebound)</span>
                          <span className="font-bold text-slate-800">{homeboundCount} ราย ({homeboundPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1">
                          <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${homeboundPercent}%` }} />
                        </div>
                      </div>

                      {/* Social-active */}
                      <div>
                        <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-0.5">
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />ติดสังคม (Social-active)</span>
                          <span className="font-bold text-slate-800">{socialCount} ราย ({socialPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1">
                          <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${socialPercent}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Add New Patient Shortcut Button */}
                <div className="absolute left-6 top-6 z-20">
                  {userRole === 'public' ? (
                    <button 
                      onClick={() => {
                        alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุขและ อสม. เท่านั้นที่ได้รับอนุญาตให้ลงทะเบียนผู้ป่วยใหม่ในพื้นที่ได้');
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold px-4 py-2 rounded-lg shadow border border-slate-200 transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>ลงทะเบียนคนไข้ใหม่ (เฉพาะเจ้าหน้าที่)</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setModalType('patient');
                        setIsModalOpen(true);
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg shadow-md border border-slate-200 transition-all cursor-pointer flex items-center space-x-2"
                    >
                      <Plus className="w-3.5 h-3.5 text-blue-600" />
                      <span>ลงทะเบียนผู้ป่วยใหม่ในพื้นที่</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Map View Tab: Full Map with full layout controls */}
            {currentTab === 'map' && (
              <motion.div 
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                <div className="absolute inset-0 z-0">
                  <iframe 
                    src="https://www.google.com/maps/d/embed?mid=1EJn-6UCajvEy2clWRRGHMw7ZG0xWhQE" 
                    className="w-full h-full border-0"
                    allowFullScreen
                    title="ระบบจำแนกสีตำบลไผ่ต่ำ"
                  />
                </div>
                {/* Floating legend overlay */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 w-64 shadow-lg">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">สัญลักษณ์จำแนกผู้ป่วย</h4>
                  <div className="space-y-2 text-[11px] text-slate-600">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                      <span className="font-medium">สีแดง - กลุ่มติดเตียง (ช่วยเหลือตัวเองไม่ได้)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                      <span className="font-medium">สีเหลือง - กลุ่มติดบ้าน (ช่วยเหลือตัวเองได้บ้าง)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                      <span className="font-medium">สีเขียว - กลุ่มติดสังคม (มีส่วนร่วมกิจกรรมชุมชน)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab: Table, Charts, and Population Filter */}
            {currentTab === 'analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full h-full p-6 overflow-y-auto flex flex-col space-y-6 bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">วิเคราะห์ข้อมูลประชากรสุขภาพ</h2>
                    <p className="text-xs text-slate-400">รายงานข้อมูลสถานะผู้ป่วยและประวัติการเยี่ยมสะสม</p>
                  </div>

                  {/* Filtering pill */}
                  <div className="flex space-x-1 bg-slate-200/60 p-1 rounded-lg text-xs font-medium">
                    {(['ทั้งหมด', 'ติดเตียง', 'ติดบ้าน', 'ติดสังคม'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                          categoryFilter === cat 
                            ? 'bg-blue-600 text-white shadow-sm font-bold' 
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Roster Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px]">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      รายชื่อผู้ป่วยทั้งหมด ({filteredPatients.length} ราย)
                    </span>
                    {userRole === 'public' ? (
                      <button 
                        onClick={() => {
                          alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุขและ อสม. เท่านั้นที่ได้รับอนุญาตให้ลงทะเบียนคนไข้ใหม่ได้');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-bold flex items-center space-x-1 border border-slate-200 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>ลงทะเบียนคนไข้ใหม่ (เฉพาะเจ้าหน้าที่)</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setModalType('patient');
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ลงทะเบียนคนไข้ใหม่</span>
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-100">
                          <th className="p-4 pl-6 font-bold">รหัสประจำตัว (ID)</th>
                          <th className="p-4 font-bold">ชื่อ-นามสกุล</th>
                          <th className="p-4 font-bold">กลุ่มสถานะ</th>
                          <th className="p-4 font-bold">ที่อยู่ปัจจุบัน</th>
                          <th className="p-4 font-bold">ผลวัดระดับอาการล่าสุด</th>
                          <th className="p-4 font-bold">อสม. ผู้ดูแล</th>
                          <th className="p-4 font-bold">เข้าเยี่ยมล่าสุด</th>
                          <th className="p-4 text-center font-bold">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPatients.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-10 text-center text-slate-400 text-xs">
                              ไม่พบข้อมูลผู้ป่วยตามตัวกรองและการค้นหา
                            </td>
                          </tr>
                        ) : (
                          filteredPatients.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 pl-6 font-mono text-[11px] font-bold text-slate-500">{p.id}</td>
                              <td className="p-4 font-bold text-slate-800">{p.name}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.category === 'ติดเตียง' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                  p.category === 'ติดบ้าน' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  {p.category}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500 max-w-xs truncate">{p.address}</td>
                              <td className="p-4 text-slate-600">{p.vitalSigns}</td>
                              <td className="p-4 font-medium text-slate-700">{p.caregiver}</td>
                              <td className="p-4 text-slate-400">{p.lastVisited}</td>
                              <td className="p-4 text-center">
                                <div className="flex flex-col items-center gap-1.5 justify-center">
                                  <button 
                                    onClick={() => {
                                      if (userRole === 'public') {
                                        alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุขและ อสม. เท่านั้นที่ได้รับอนุญาตให้บันทึกรายงานผลการเข้าเยี่ยมบ้านได้');
                                        return;
                                      }
                                      setSelectedPatientId(p.id);
                                      setModalType('visit');
                                      setIsModalOpen(true);
                                    }}
                                    className={`text-[11px] font-bold cursor-pointer ${
                                      userRole === 'public' 
                                        ? 'text-slate-400 hover:text-slate-500 hover:underline' 
                                        : 'text-blue-600 hover:text-blue-800 hover:underline'
                                    }`}
                                  >
                                    {userRole === 'public' ? 'รายงานผลเยี่ยม (ล็อก)' : 'รายงานผลเยี่ยม'}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (userRole === 'public') {
                                        alert('⚠️ สิทธิ์การใช้งานจำกัด: เฉพาะเจ้าหน้าที่สาธารณสุขและ อสม. เท่านั้นที่ได้รับอนุญาตให้แก้ไขข้อมูลผู้ป่วยได้');
                                        return;
                                      }
                                      openEditPatient(p);
                                    }}
                                    className={`text-[11px] font-bold cursor-pointer ${
                                      userRole === 'public' 
                                        ? 'text-slate-400 hover:text-slate-500 hover:underline' 
                                        : 'text-amber-600 hover:text-amber-800 hover:underline'
                                    }`}
                                  >
                                    {userRole === 'public' ? 'แก้ไขข้อมูล (ล็อก)' : 'แก้ไขข้อมูล'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Network Logs Tab: Showing real-time cloud operations */}
            {currentTab === 'logs' && (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full h-full p-6 overflow-y-auto flex flex-col space-y-6 bg-slate-50"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">ระบบประมวลผลและการซิงค์ (Network Logs)</h2>
                  <p className="text-xs text-slate-400">ประวัติการเรียกเขียน-อ่านข้อมูลลง Google Sheets ในแบบเรียลไทม์</p>
                </div>

                <div className="bg-slate-900 rounded-xl p-6 font-mono text-xs text-slate-300 shadow-xl flex-1 flex flex-col overflow-hidden max-h-[500px] border border-slate-800">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4 shrink-0">
                    <span className="text-slate-400 text-[10px] tracking-widest uppercase font-bold flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>REALTIME SYNC TERMINAL</span>
                    </span>
                    <button 
                      onClick={() => setNetworkLogs([])}
                      className="text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase transition-colors cursor-pointer"
                    >
                      ล้างประวัติ
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar font-mono text-[11px] leading-relaxed">
                    {networkLogs.length === 0 ? (
                      <div className="text-slate-600 text-center py-20 italic">
                        [ไม่มีบันทึกข้อมูลการซิงค์ล่าสุด]
                      </div>
                    ) : (
                      networkLogs.map((log, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-slate-500 shrink-0">{log.time}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                            log.type === 'Auth' ? 'bg-cyan-950 text-cyan-400 border border-cyan-900' :
                            log.type === 'Sheets DB' ? 'bg-blue-950 text-blue-400 border border-blue-900' : 'bg-slate-800 text-slate-400'
                          }`}>
                            [{log.type}]
                          </span>
                          <span className={`flex-1 ${
                            log.status === 'success' ? 'text-emerald-400' :
                            log.status === 'error' ? 'text-rose-400' : 'text-amber-400 animate-pulse'
                          }`}>
                            {log.details}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Team Settings Tab */}
            {currentTab === 'team' && (
              <motion.div 
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full h-full p-6 overflow-y-auto flex flex-col space-y-6 bg-slate-50"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">ตั้งค่าและตรวจสอบสิทธิ์ระบบ</h2>
                  <p className="text-xs text-slate-400">ข้อมูลผู้ดูแลระบบและตารางฐานข้อมูลที่เชื่อมต่อ</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account detail card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">ผู้ใช้งานปัจจุบัน</h3>
                    <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <img 
                        src={user?.photoURL} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                        alt="Profile"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-sm text-slate-800 leading-tight">{user?.displayName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      <p><strong>ประเภทการล็อกอิน:</strong> บัญชีผู้ใช้ร่วม (Gmail ผ่านทางความปลอดภัย Google)</p>
                      <p><strong>ขอบเขตสิทธิ์ (Scopes):</strong> อ่าน เขียน ค้นหา แฟ้มเอกสารและตารางคำนวณใน Google Drive ทั้งหมดที่แอปนี้สร้างขึ้น</p>
                    </div>
                  </div>

                  {/* Connected Database info */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">ข้อมูล Google Sheets ฐานข้อมูลคลาวด์</h3>
                    <div className="space-y-4">
                      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center space-x-3 text-emerald-800">
                        <FileSpreadsheet className="w-8 h-8 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold text-xs">ตำบลไผ่ต่ำ - ระบบจัดการสุขภาพ</p>
                          <p className="text-[10px] text-emerald-600 font-mono mt-0.5">บันทึกออนไลน์แบบเรียลไทม์ใน Google Drive ของคุณ</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                        <p><strong>ตำแหน่งจัดเก็บ:</strong> แฟ้มเอกสารตารางคำนวณ (Spreadsheet) บันทึกตารางประชากรคนไข้ และตารางบันทึกกิจกรรมล่าสุดเพื่ออัปเดตแบบทันทีทันใด</p>
                        <p><strong>ลิงก์นำส่งภายนอก (Stitch):</strong> ข้อมูลจะทำงานสัมพันธ์แบบอัปสตรีมกับระบบ Stitch matching profile <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono">#15869037384118607249</code></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Whitelist Management Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-850">👥 รายชื่อ Gmail ของเจ้าหน้าที่ที่ได้รับการอนุมัติสิทธิ์ (Staff Whitelist)</h3>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>คำอธิบายระบบรักษาความปลอดภัย:</strong> บัญชีผู้ใช้ที่ล็อกอินด้วย Google Sign-In จะถูกตรวจสอบสิทธิ์กับรายชื่อด้านล่างนี้โดยอัตโนมัติ 
                    หากอีเมลตรงกับรายการที่กำหนด จะได้รับสิทธิ์ <span className="text-emerald-600 font-bold">"เจ้าหน้าที่ (Staff)"</span> ซึ่งสามารถเพิ่ม/แก้ไขคนไข้ และเขียนรายงานผลเยี่ยมได้ 
                    แต่หากล็อกอินด้วยอีเมลอื่น ๆ ที่ไม่มีในรายชื่อ ระบบจะล็อกสิทธิ์ให้ใช้งานในฐานะ <span className="text-amber-600 font-bold">"บุคคลทั่วไป (Guest)"</span> ทันที ซึ่งสามารถเรียกดูรายงานและแผนที่ได้ แต่จะแก้ไขหรือบันทึกข้อมูลใด ๆ ไม่ได้เลย
                  </p>

                  <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Email Form */}
                    <div className="md:col-span-1 space-y-3">
                      <h4 className="text-xs font-bold text-slate-700">อนุมัติอีเมลเจ้าหน้าที่เพิ่ม</h4>
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const email = newAuthEmail.trim().toLowerCase();
                          if (!email) return;
                          
                          if (!email.includes('@')) {
                            alert('กรุณากรอกอีเมลให้ถูกต้องตามรูปแบบบัญชี Google (เช่น name@gmail.com)');
                            return;
                          }
                          
                          if (authorizedEmails.some(e => e.toLowerCase() === email)) {
                            alert('อีเมลนี้ได้รับสิทธิ์อนุมัติเรียบร้อยแล้ว');
                            return;
                          }
                          
                          const newList = [...authorizedEmails, email];
                          setAuthorizedEmails(newList);
                          setNewAuthEmail('');
                          addLog('System', `เพิ่มอีเมลอนุมัติสิทธิ์สำเร็จ: ${email}`, 'success');
                          
                          // If current logged-in google user matches the newly added email, refresh role immediately
                          if (user && user.email && user.email.toLowerCase() === email) {
                            setUserRole('staff');
                            localStorage.setItem('stitchsync_role', 'staff');
                            addLog('System', `อัปเกรดสิทธิ์ของคุณเป็น [เจ้าหน้าที่] เรียบร้อยแล้ว`, 'success');
                          }
                        }}
                        className="space-y-2"
                      >
                        <input
                          type="email"
                          value={newAuthEmail}
                          onChange={(e) => setNewAuthEmail(e.target.value)}
                          placeholder="ระบุ Gmail เช่น sombat@gmail.com"
                          className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-white text-slate-800"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center space-x-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>อนุมัติสิทธิ์ใช้งาน</span>
                        </button>
                      </form>
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-[10.5px] text-amber-700 leading-relaxed">
                        💡 <strong>คำแนะนำเพิ่มเติม:</strong> นอกจากการอนุมัติสิทธิ์ในแผงควบคุมนี้แล้ว ท่านจำเป็นต้องกดแชร์ Google Sheets แผ่นงานฐานข้อมูล (ตำบลไผ่ต่ำ - ระบบจัดการสุขภาพ) ใน Google Drive ของท่านแบบ "Editor (สิทธิ์ผู้แก้ไข)" ไปยังบัญชี Gmail ของเจ้าหน้าที่ดังกล่าวด้วย เพื่อให้ Google Sheets API อนุญาตให้อีเมลนั้นอ่าน/เขียนข้อมูลได้สมบูรณ์แบบ
                      </div>
                    </div>

                    {/* Email Whitelist Table/List */}
                    <div className="md:col-span-2 space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>รายชื่อที่ได้รับอนุมัติในระบบ ({authorizedEmails.length})</span>
                        <span className="text-[10px] text-slate-400 font-normal">* บันทึกถาวรในระดับ Sandbox ท้องถิ่น</span>
                      </h4>
                      
                      <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 max-h-[220px] overflow-y-auto bg-slate-50">
                        {authorizedEmails.map((email) => {
                          const isCurrentUser = user && user.email && user.email.toLowerCase() === email.toLowerCase();
                          return (
                            <div key={email} className="flex items-center justify-between p-2.5 bg-white text-xs text-slate-700">
                              <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="font-mono text-slate-700">{email}</span>
                                {isCurrentUser && (
                                  <span className="bg-blue-50 border border-blue-200 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                    คุณใช้งานอยู่นี้
                                  </span>
                                )}
                              </div>
                              
                              <button
                                type="button"
                                disabled={isCurrentUser}
                                onClick={() => {
                                  if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการยกเลิกอนุมัติสิทธิ์สำหรับอีเมล ${email}?`)) {
                                    const newList = authorizedEmails.filter(e => e !== email);
                                    setAuthorizedEmails(newList);
                                    addLog('System', `ยกเลิกสิทธิ์อนุมัติเรียบร้อย: ${email}`, 'success');
                                    
                                    // If we revoke our own email, set role to public
                                    if (user && user.email && user.email.toLowerCase() === email.toLowerCase()) {
                                      setUserRole('public');
                                      localStorage.setItem('stitchsync_role', 'public');
                                    }
                                  }
                                }}
                                className={`text-[10px] font-bold ${
                                  isCurrentUser 
                                    ? 'text-slate-300 cursor-not-allowed' 
                                    : 'text-rose-500 hover:text-rose-700 cursor-pointer hover:underline'
                                }`}
                              >
                                {isCurrentUser ? 'ไม่สามารถเพิกถอนสิทธิ์ตนเองได้' : 'เพิกถอนสิทธิ์'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Sign Out Button in settings to be nice */}
                <div className="border-t border-slate-200 pt-6 flex justify-end">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบจัดการสุขภาพ</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Importer Tab with dual Sheets & My Maps sub-tabs */}
            {currentTab === 'import' && (() => {
              const filteredImportedPatients = importedPatients.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(importSearchQuery.toLowerCase()) || 
                                      p.caregiver.toLowerCase().includes(importSearchQuery.toLowerCase()) ||
                                      p.address.toLowerCase().includes(importSearchQuery.toLowerCase());
                const matchesCategory = importCategoryFilter === 'ทั้งหมด' || p.category === importCategoryFilter;
                return matchesSearch && matchesCategory;
              });

              return (
                <motion.div 
                  key="import"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full p-6 overflow-y-auto flex flex-col space-y-6 bg-slate-50"
                >
                  {/* Tab Selector inside Import page */}
                  <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
                    <button
                      onClick={() => setSheetsImportTab('sheets')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        sheetsImportTab === 'sheets'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>ดึงข้อมูลรายชื่อผู้พึ่งพิง 69 ราย (Google Sheets)</span>
                    </button>
                    <button
                      onClick={() => setSheetsImportTab('mymaps')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        sheetsImportTab === 'mymaps'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>เชื่อมโยง Google My Maps พิกัดแผนที่ตำบล</span>
                    </button>
                  </div>

                  {sheetsImportTab === 'sheets' ? (
                    <>
                      {/* Google Sheets Header Card */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                            </span>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">ดึงข้อมูลผู้พึ่งพิงจาก Google Sheets</h2>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            ระบบกำลังทำงานสัมพันธ์แบบอัปสตรีมกับลิงก์ตารางข้อมูลของท่าน เพื่อถอดรายชื่อผู้มีภาวะพึ่งพิง 69 ราย พร้อมวิเคราะห์ระดับอาการ ข้อมูลสัญญาณชีพ และจัดพิกัดลงแผนที่
                          </p>
                          
                          {/* Input fields for sheet URL and sheet name */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                              </span>
                              <input
                                type="text"
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                                placeholder="วางลิงก์ Google Sheets..."
                                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                              />
                            </div>

                            {/* Sheet Selection dropdown */}
                            {sheetList.length > 0 && (
                              <select
                                value={selectedSheetName}
                                onChange={(e) => {
                                  setSelectedSheetName(e.target.value);
                                  handleFetchGoogleSheet(sheetUrl, e.target.value);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-xs bg-slate-50 font-bold text-slate-700"
                              >
                                {sheetList.map((name) => (
                                  <option key={name} value={name}>{name}</option>
                                ))}
                              </select>
                            )}

                            <button
                              onClick={() => handleFetchGoogleSheet()}
                              disabled={loadingSheet}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {loadingSheet ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>กำลังดึงข้อมูล...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span>สแกนข้อมูลใหม่</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 md:self-end">
                          <button
                            onClick={handleSaveSheetPatients}
                            disabled={syncing || sheetPatients.length === 0 || userRole === 'public'}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                          >
                            {syncing ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>กำลังบันทึก...</span>
                              </>
                            ) : (
                              <>
                                <Database className="w-3.5 h-3.5" />
                                <span>ซิงค์รายชื่อทั้งหมดเข้าระบบหลัก ({sheetPatients.length} ราย)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {sheetError && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 shadow-sm flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">เกิดข้อผิดพลาดในการโหลด</p>
                            <p className="text-rose-700 mt-1">{sheetError}</p>
                            <p className="text-[10px] text-rose-500 mt-2 font-semibold">
                              คำแนะนำ: โปรดตรวจสอบว่า ตาราง Google Sheets ของท่านได้รับการตั้งค่าแบบ "ทุกคนที่มีลิงก์มีสิทธิ์อ่าน" (Anyone with the link can view) เรียบร้อยแล้ว เพื่อให้ระบบดึงข้อมูลรายชื่อได้อย่างทันท่วงที
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Stat Cards for Google Sheet */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">รายชื่อผู้มีภาวะพึ่งพิงทั้งหมด</p>
                            <p className="text-xl font-bold text-slate-800">{sheetPatients.length} ราย</p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                            <Heart className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">กลุ่มติดเตียง (Bedridden)</p>
                            <p className="text-xl font-bold text-slate-800">
                              {sheetPatients.filter(p => p.category === 'ติดเตียง').length} ราย
                            </p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">กลุ่มติดบ้าน (Homebound)</p>
                            <p className="text-xl font-bold text-slate-800">
                              {sheetPatients.filter(p => p.category === 'ติดบ้าน').length} ราย
                            </p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">บันทึกเชื่อมโยงสำเร็จ</p>
                            <p className="text-xl font-bold text-slate-800">
                              {sheetPatients.filter(p => patients.some(mainP => mainP.name === p.name)).length} / {sheetPatients.length} ราย
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Search and Filters inside loaded Sheet rows */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                          </span>
                          <input
                            type="text"
                            value={importSearchQuery}
                            onChange={(e) => setImportSearchQuery(e.target.value)}
                            placeholder="ค้นหารายชื่อ, ที่อยู่ หรือ อสม. ในชีท..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                          />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 shrink-0">
                            <Filter className="w-3.5 h-3.5" />
                            <span>กรองกลุ่มสุขภาพ:</span>
                          </span>
                          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                            {(['ทั้งหมด', 'ติดเตียง', 'ติดบ้าน', 'ติดสังคม'] as const).map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setImportCategoryFilter(cat)}
                                className={`px-3 py-1 text-[11px] rounded-md font-bold transition-all cursor-pointer ${
                                  importCategoryFilter === cat
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Main Sheet records list table */}
                      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">รายชื่อผู้พึ่งพิงตรวจรับจาก Google Sheets</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">พบตรงตามค้นหาจำนวน {sheetPatients.filter(p => {
                              const matchesSearch = p.name.toLowerCase().includes(importSearchQuery.toLowerCase()) || 
                                                    p.caregiver.toLowerCase().includes(importSearchQuery.toLowerCase()) ||
                                                    p.address.toLowerCase().includes(importSearchQuery.toLowerCase());
                              const matchesCategory = importCategoryFilter === 'ทั้งหมด' || p.category === importCategoryFilter;
                              return matchesSearch && matchesCategory;
                            }).length} รายการ</p>
                          </div>
                        </div>

                        {sheetPatients.length === 0 ? (
                          <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
                            <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mb-2" />
                            <p className="text-xs font-bold text-slate-500">กำลังดาวน์โหลดข้อมูลรายชื่อ 69 รายการเพื่อจัดทำข้อมูลสุขภาพ...</p>
                            <p className="text-[10px] text-slate-400">ระบบเชื่อมโยงพิกัดแบบปลอดภัยอัตโนมัติภายในอำเภอวิหารแดง จังหวัดสระบุรี</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50/50 text-slate-400 font-mono border-b border-slate-100">
                                  <th className="p-4 pl-6 font-bold">ชื่อ-นามสกุลผู้รับบริการ</th>
                                  <th className="p-4 font-bold">กลุ่มภาวะพึ่งพิง</th>
                                  <th className="p-4 font-bold">ผู้ดูแล / อสม.</th>
                                  <th className="p-4 font-bold">ที่อยู่</th>
                                  <th className="p-4 font-bold">พิกัดในเขตตำบล (Lat, Lng)</th>
                                  <th className="p-4 font-bold">อาการวัดระดับหรือสัญญาณชีพ</th>
                                  <th className="p-4 pr-6 font-bold text-right">สถานะระบบหลัก</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {sheetPatients
                                  .filter(p => {
                                    const matchesSearch = p.name.toLowerCase().includes(importSearchQuery.toLowerCase()) || 
                                                          p.caregiver.toLowerCase().includes(importSearchQuery.toLowerCase()) ||
                                                          p.address.toLowerCase().includes(importSearchQuery.toLowerCase());
                                    const matchesCategory = importCategoryFilter === 'ทั้งหมด' || p.category === importCategoryFilter;
                                    return matchesSearch && matchesCategory;
                                  })
                                  .map((p, idx) => {
                                    const isAlreadySynced = patients.some(mainP => mainP.name === p.name);
                                    return (
                                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 pl-6 font-bold text-slate-800">{p.name}</td>
                                        <td className="p-4">
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            p.category === 'ติดเตียง' 
                                              ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                              : p.category === 'ติดบ้าน'
                                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                          }`}>
                                            {p.category}
                                          </span>
                                        </td>
                                        <td className="p-4">
                                          <div className="space-y-0.5">
                                            <p className="text-slate-600 font-bold">{p.caregiver}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{p.phone}</p>
                                          </div>
                                        </td>
                                        <td className="p-4 text-slate-500 max-w-[200px] truncate" title={p.address}>
                                          {p.address}
                                        </td>
                                        <td className="p-4 text-slate-500 font-mono">
                                          <div className="flex flex-col">
                                            <span>{p.lat.toFixed(6)}, {p.lng.toFixed(6)}</span>
                                            <span className="text-[9px] text-blue-500 font-sans font-semibold">✨ สุ่มพิกัดปลอดภัยในเขตสระบุรี</span>
                                          </div>
                                        </td>
                                        <td className="p-4 text-slate-600 max-w-xs truncate" title={p.vitalSigns}>
                                          {p.vitalSigns}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                          {isAlreadySynced ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-1 rounded-md">
                                              <Check className="w-3 h-3" />
                                              <span>เชื่อมโยงแล้ว</span>
                                            </span>
                                          ) : (
                                            <button
                                              disabled={userRole === 'public' || syncing}
                                              onClick={async () => {
                                                setSyncing(true);
                                                addLog('Sheets Import', `กำลังนำเข้าผู้พึ่งพิงใหม่ ${p.name}...`, 'pending');
                                                try {
                                                  if (!token || token === 'mock-staff-token') {
                                                    const updatedPatients = [p, ...patients];
                                                    setPatients(updatedPatients);
                                                    localStorage.setItem('stitchsync_patients', JSON.stringify(updatedPatients));
                                                    addLog('Local DB', `นำเข้าข้อมูลและพิกัดแผนที่ของ ${p.name} ลงระบบจำลองสำเร็จ!`, 'success');
                                                    alert(`นำเข้าคุณ ${p.name} สำเร็จ!`);
                                                  } else {
                                                    const sheetsService = new SheetsService(token);
                                                    const ok = await sheetsService.addPatient(p);
                                                    if (ok) {
                                                      addLog('Sheets DB', `เขียนข้อมูลของ ${p.name} ลง Google Sheets สำเร็จ`, 'success');
                                                      await fetchData(token);
                                                      alert(`นำเข้าคุณ ${p.name} ลง Google Sheets สำเร็จ!`);
                                                    } else {
                                                      throw new Error('ไม่สามารถเขียนข้อมูลลงไฟล์ Sheets ได้');
                                                    }
                                                  }
                                                } catch (error: any) {
                                                  addLog('Import DB', `ข้อผิดพลาดในการนำเข้าคนไข้รายบุคคล: ${error.message}`, 'error');
                                                  alert(`เกิดข้อผิดพลาด: ${error.message}`);
                                                } finally {
                                                  setSyncing(false);
                                                }
                                              }}
                                              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-150 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                                            >
                                              <Plus className="w-3 h-3" />
                                              <span>นำเข้าระบบ</span>
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* My Maps Importer Header Card */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">เชื่อมต่อ Google My Maps แผนที่ตำบลไผ่ต่ำ</h2>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            ระบบได้ทำการดึงพิกัดรายชื่อและข้อมูลสุขภาพของผู้ป่วยติดเตียง/ติดบ้าน และ อสม. ผู้รับผิดชอบจากลิงก์แผนที่ My Maps โดยตรงอัตโนมัติ
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              Map ID: 1EJn-6UCajvEy2clWRRGHMw7ZG0xWhQE
                            </span>
                            <a 
                              href="https://www.google.com/maps/d/edit?mid=1EJn-6UCajvEy2clWRRGHMw7ZG0xWhQE" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                            >
                              เปิดดูแผนที่หลักบน Google Maps <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleCopyToClipboard(filteredImportedPatients)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] sm:text-xs font-bold rounded-lg border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            title="คัดลอกข้อมูลผู้ป่วยทั้งหมดเพื่อไปวางใน Excel/Google Sheets"
                          >
                            <Clipboard className="w-3.5 h-3.5 text-slate-500" />
                            <span>คัดลอกข้อมูลตาราง</span>
                          </button>

                          <button
                            onClick={() => handleDownloadCSV(filteredImportedPatients)}
                            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold rounded-lg border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            title="ดาวน์โหลดตารางข้อมูลเป็นไฟล์ .csv เปิดใน Excel"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ดาวน์โหลดไฟล์ Excel/CSV</span>
                          </button>

                          <button
                            onClick={handleSaveImportedPatients}
                            disabled={syncing || userRole === 'public'}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                          >
                            {syncing ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>กำลังซิงค์...</span>
                              </>
                            ) : (
                              <>
                                <Database className="w-3.5 h-3.5" />
                                <span>ซิงค์เข้าระบบหลัก ({filteredImportedPatients.length} ราย)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Info Bento Grid Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">รายชื่อบน My Maps ทั้งหมด</p>
                            <p className="text-xl font-bold text-slate-800">{importedPatients.length} ราย</p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                            <Heart className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">กลุ่มติดเตียง (Bedridden)</p>
                            <p className="text-xl font-bold text-slate-800">
                              {importedPatients.filter(p => p.category === 'ติดเตียง').length} ราย
                            </p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">กลุ่มติดบ้าน (Homebound)</p>
                            <p className="text-xl font-bold text-slate-800">
                              {importedPatients.filter(p => p.category === 'ติดบ้าน').length} ราย
                            </p>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ซิงค์กับฐานข้อมูลหลักแล้ว</p>
                            <p className="text-xl font-bold text-slate-800">
                              {importedPatients.filter(p => patients.some(mainP => mainP.name === p.name)).length} / {importedPatients.length} ราย
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Filter and Search controls */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                          </span>
                          <input
                            type="text"
                            value={importSearchQuery}
                            onChange={(e) => setImportSearchQuery(e.target.value)}
                            placeholder="ค้นหารายชื่อคนไข้, ที่อยู่ หรือ อสม. ผู้ดูแลบน My Maps..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                          />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 shrink-0">
                            <Filter className="w-3.5 h-3.5" />
                            <span>กรองกลุ่มสุขภาพ:</span>
                          </span>
                          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                            {(['ทั้งหมด', 'ติดเตียง', 'ติดบ้าน', 'ติดสังคม'] as const).map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setImportCategoryFilter(cat)}
                                className={`px-3 py-1 text-[11px] rounded-md font-bold transition-all cursor-pointer ${
                                  importCategoryFilter === cat
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Main list table */}
                      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">รายชื่อและสถิติบุคคลจาก Google My Maps</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">พบคู่ตรงตามเงื่อนไขการค้นหาจำนวน {filteredImportedPatients.length} รายการ</p>
                          </div>
                        </div>

                        {filteredImportedPatients.length === 0 ? (
                          <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
                            <Search className="w-8 h-8 text-slate-300" />
                            <p className="text-xs font-bold text-slate-500">ไม่พบคู่ข้อมูลที่ตรงตามเงื่อนไขการค้นหาของคุณ</p>
                            <p className="text-[10px] text-slate-400">กรุณาลองเปลี่ยนคำค้นหาหรือตัวกรองประเภทกลุ่มสุขภาพอีกครั้ง</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50/50 text-slate-400 font-mono border-b border-slate-100">
                                  <th className="p-4 pl-6 font-bold">ชื่อ-นามสกุลผู้สูงอายุ</th>
                                  <th className="p-4 font-bold">กลุ่มสุขภาพ</th>
                                  <th className="p-4 font-bold">ผู้ดูแล / อสม.</th>
                                  <th className="p-4 font-bold">ที่อยู่</th>
                                  <th className="p-4 font-bold">พิกัดละติจูด, ลองจิจูด</th>
                                  <th className="p-4 font-bold">อาการวัดระดับล่าสุด</th>
                                  <th className="p-4 pr-6 font-bold text-right">สถานะระบบหลัก</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {filteredImportedPatients.map((p, idx) => {
                                  const isAlreadySynced = patients.some(mainP => mainP.name === p.name);
                                  return (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="p-4 pl-6 font-bold text-slate-800">{p.name}</td>
                                      <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          p.category === 'ติดเตียง' 
                                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                            : p.category === 'ติดบ้าน'
                                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        }`}>
                                          {p.category}
                                        </span>
                                      </td>
                                      <td className="p-4">
                                        <div className="space-y-0.5">
                                          <p className="text-slate-600 font-bold">{p.caregiver}</p>
                                          <p className="text-[10px] text-slate-400 font-mono">{p.phone}</p>
                                        </div>
                                      </td>
                                      <td className="p-4 text-slate-500 max-w-[200px] truncate" title={p.address}>
                                        {p.address}
                                      </td>
                                      <td className="p-4 text-slate-500 font-mono">
                                        {p.lat.toFixed(6)}, {p.lng.toFixed(6)}
                                      </td>
                                      <td className="p-4 text-slate-600 max-w-xs truncate" title={p.vitalSigns}>
                                        {p.vitalSigns}
                                      </td>
                                      <td className="p-4 pr-6 text-right">
                                        {isAlreadySynced ? (
                                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-1 rounded-md">
                                            <Check className="w-3 h-3" />
                                            <span>เชื่อมโยงแล้ว</span>
                                          </span>
                                        ) : (
                                          <button
                                            disabled={userRole === 'public' || syncing}
                                            onClick={async () => {
                                              setSyncing(true);
                                              addLog('My Maps Import', `กำลังนำเข้าคนไข้ใหม่ ${p.name}...`, 'pending');
                                              try {
                                                if (!token || token === 'mock-staff-token') {
                                                  // Save locally
                                                  const updatedPatients = [p, ...patients];
                                                  setPatients(updatedPatients);
                                                  localStorage.setItem('stitchsync_patients', JSON.stringify(updatedPatients));
                                                  addLog('Local DB', `นำเข้าข้อมูลและพิกัดแผนที่ของ ${p.name} ลงระบบจำลองสำเร็จ!`, 'success');
                                                  alert(`นำเข้าคุณ ${p.name} สำเร็จ!`);
                                                } else {
                                                  const sheetsService = new SheetsService(token);
                                                  const ok = await sheetsService.addPatient(p);
                                                  if (ok) {
                                                    addLog('Sheets DB', `เขียนข้อมูลของ ${p.name} ลง Google Sheets สำเร็จ`, 'success');
                                                    await fetchData(token);
                                                    alert(`นำเข้าคุณ ${p.name} ลง Google Sheets สำเร็จ!`);
                                                  } else {
                                                    throw new Error('ไม่สามารถเขียนข้อมูลลงไฟล์ Sheets ได้');
                                                  }
                                                }
                                              } catch (error: any) {
                                                addLog('Import DB', `ข้อผิดพลาดในการนำเข้าคนไข้รายบุคคล: ${error.message}`, 'error');
                                                alert(`เกิดข้อผิดพลาด: ${error.message}`);
                                              } finally {
                                                setSyncing(false);
                                              }
                                            }}
                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-150 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                                          >
                                            <Plus className="w-3 h-3" />
                                            <span>นำเข้าระบบ</span>
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Public View Mode Notice */}
                  {userRole === 'public' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800 shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">โหมดบุคคลทั่วไป (Public Access Restricted)</p>
                        <p className="text-amber-700/90 leading-relaxed">
                          ท่านกำลังใช้งานในโหมดสิทธิ์ผู้มาเยือน สามารถสืบค้นรายชื่อและดูตำแหน่งพิกัดแผนที่ได้เพื่อประโยชน์ทางการสาธารณสุข แต่จะไม่สามารถทำการเขียน/นำเข้าข้อมูลผู้ป่วยคนใหม่ไปยังแผ่นงาน Google Sheets ตัวจริงได้เพื่อความปลอดภัยของข้อมูล
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}

          </AnimatePresence>
        </div>

        {/* Footer Taskbar compliant with layout structure */}
        <footer className="h-10 bg-white border-t border-slate-200 px-8 flex justify-between items-center z-30 shrink-0 text-[10px] text-slate-400">
          <p className="font-mono font-medium">© 2026 StitchSync Healthcare Co. ระบบสุขภาพระดับตำบลความปลอดภัยสูง</p>
          <div className="flex space-x-4">
            <span className="font-medium text-slate-300">|</span>
            <span className="font-mono">Google API Connected</span>
          </div>
        </footer>

      </main>

      {/* Slide-over Modal Backdrop & Modal view */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end select-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-white shadow-2xl p-6 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {modalType === 'visit' ? 'เขียนบันทึกรายงานการเข้าเยี่ยม' : 
                     modalType === 'patient' ? 'ลงทะเบียนผู้ป่วยสุขภาพใหม่ในชุมชน' :
                     'แก้ไขข้อมูลผู้ป่วยในชุมชน'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalType === 'visit' ? 'ข้อมูลจะอัปเดตลงตาราง Google Sheets แบบเรียลไทม์ทันที' : 
                     modalType === 'patient' ? 'เพิ่มประชากรกลุ่มเป้าหมายตำบลไผ่ต่ำ' :
                     'ปรับปรุงรายละเอียดคนไข้และบันทึกขึ้นระบบเรียลไทม์'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content switcher */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                
                {modalType === 'visit' ? (
                  /* Form: New Visit Report */
                  <form onSubmit={submitNewVisit} className="space-y-4 text-xs text-slate-700">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">เลือกชื่อผู้ป่วยติดเตียง / ติดบ้าน / ติดสังคม</label>
                      <select 
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-xs font-medium text-slate-800"
                        required
                      >
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.category} - {p.address})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">ผลระดับอาการ / ข้อมูลสัญญาณชีพด่วน</label>
                      <input 
                        type="text" 
                        value={visitVitalSigns}
                        onChange={(e) => setVisitVitalSigns(e.target.value)}
                        placeholder="เช่น ความดันปกติ 120/80 ชีพจร 76 หรือ ปวดหัวเล็กน้อย"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">สรุปอาการและรายละเอียดผลเยี่ยม</label>
                      <textarea 
                        value={visitDescription}
                        onChange={(e) => setVisitDescription(e.target.value)}
                        placeholder="ระบุข้อแนะนำที่มอบให้คนไข้ รายละเอียดเยี่ยมบ้าน หรือการนัดติดตามยารักษาโรค..."
                        rows={4}
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">ประเมินระดับความเร่งด่วน</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['Normal', 'Warning', 'Danger'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setVisitStatus(st)}
                            className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center cursor-pointer ${
                              visitStatus === st 
                                ? st === 'Danger' ? 'bg-rose-50 border-rose-300 text-rose-600 ring-1 ring-rose-200' :
                                  st === 'Warning' ? 'bg-amber-50 border-amber-300 text-amber-600 ring-1 ring-amber-200' :
                                  'bg-emerald-50 border-emerald-300 text-emerald-600 ring-1 ring-emerald-200'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {st === 'Normal' ? 'ปกติ (Normal)' : st === 'Warning' ? 'เฝ้าระวัง (Warning)' : 'ฉุกเฉิน (Danger)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={syncing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow transition-all cursor-pointer disabled:opacity-50"
                      >
                        {syncing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>กำลังบันทึกส่งข้อมูล...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>บันทึกส่งรายงานเข้าเยี่ยม</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : modalType === 'patient' ? (
                  /* Form: New Patient Register */
                  <form onSubmit={submitNewPatient} className="space-y-4 text-xs text-slate-700">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">ชื่อ-นามสกุล คนไข้</label>
                      <input 
                        type="text" 
                        value={newPatientName}
                        onChange={(e) => setNewPatientName(e.target.value)}
                        placeholder="ระบุคำนำหน้าชื่อ และชื่อ-สกุล"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">กลุ่มประชากรจำแนกสี</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['ติดเตียง', 'ติดบ้าน', 'ติดสังคม'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewPatientCategory(cat)}
                            className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center cursor-pointer ${
                              newPatientCategory === cat 
                                ? cat === 'ติดเตียง' ? 'bg-rose-50 border-rose-300 text-rose-600 ring-1 ring-rose-200' :
                                  cat === 'ติดบ้าน' ? 'bg-amber-50 border-amber-300 text-amber-600 ring-1 ring-amber-200' :
                                  'bg-emerald-50 border-emerald-300 text-emerald-600 ring-1 ring-emerald-200'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">ที่อยู่อาศัย (บ้านเลขที่และหมู่)</label>
                      <input 
                        type="text" 
                        value={newPatientAddress}
                        onChange={(e) => setNewPatientAddress(e.target.value)}
                        placeholder="เช่น 12/3 หมู่ 1 ต.ไผ่ต่ำ อ.วิหารแดง"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">เบอร์โทรศัพท์ติดต่อด่วน</label>
                      <input 
                        type="tel" 
                        value={newPatientPhone}
                        onChange={(e) => setNewPatientPhone(e.target.value)}
                        placeholder="เช่น 081-234-5678"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">อาการประเมินเบื้องต้น</label>
                      <input 
                        type="text" 
                        value={newPatientVital}
                        onChange={(e) => setNewPatientVital(e.target.value)}
                        placeholder="เช่น ปกติ / ปวดแข้งปวดขาเดินเหินไม่สะดวก"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">ระบุชื่อ อสม. ผู้รับผิดชอบดูแล</label>
                      <input 
                        type="text" 
                        value={newPatientCaregiver}
                        onChange={(e) => setNewPatientCaregiver(e.target.value)}
                        placeholder="ชื่อ อสม. สมศรี (ค่าเริ่มต้น: ชื่อของคุณ)"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                      />
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={syncing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow transition-all cursor-pointer disabled:opacity-50"
                      >
                        {syncing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>กำลังซิงค์ขึ้นฐานข้อมูล...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>ลงทะเบียนและบันทึกผู้ป่วยสุขภาพ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Form: Edit Patient Details */
                  <form onSubmit={submitEditPatient} className="space-y-4 text-xs text-slate-700">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">ชื่อ-นามสกุล คนไข้</label>
                      <input 
                        type="text" 
                        value={editPatientName}
                        onChange={(e) => setEditPatientName(e.target.value)}
                        placeholder="ระบุคำนำหน้าชื่อ และชื่อ-สกุล"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">กลุ่มประชากรจำแนกสี</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['ติดเตียง', 'ติดบ้าน', 'ติดสังคม'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setEditPatientCategory(cat)}
                            className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center cursor-pointer ${
                              editPatientCategory === cat 
                                ? cat === 'ติดเตียง' ? 'bg-rose-50 border-rose-300 text-rose-600 ring-1 ring-rose-200' :
                                  cat === 'ติดบ้าน' ? 'bg-amber-50 border-amber-300 text-amber-600 ring-1 ring-amber-200' :
                                  'bg-emerald-50 border-emerald-300 text-emerald-600 ring-1 ring-emerald-200'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">ที่อยู่อาศัย (บ้านเลขที่และหมู่)</label>
                      <input 
                        type="text" 
                        value={editPatientAddress}
                        onChange={(e) => setEditPatientAddress(e.target.value)}
                        placeholder="เช่น 12/3 หมู่ 1 ต.ไผ่ต่ำ อ.วิหารแดง"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">เบอร์โทรศัพท์ติดต่อด่วน</label>
                      <input 
                        type="tel" 
                        value={editPatientPhone}
                        onChange={(e) => setEditPatientPhone(e.target.value)}
                        placeholder="เช่น 081-234-5678"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">อาการประเมินเบื้องต้น / อาการสำคัญ</label>
                      <input 
                        type="text" 
                        value={editPatientVital}
                        onChange={(e) => setEditPatientVital(e.target.value)}
                        placeholder="เช่น ปกติ / ปวดแข้งปวดขาเดินเหินไม่สะดวก"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">ระบุชื่อ อสม. ผู้รับผิดชอบดูแล</label>
                      <input 
                        type="text" 
                        value={editPatientCaregiver}
                        onChange={(e) => setEditPatientCaregiver(e.target.value)}
                        placeholder="ชื่อ อสม. สมศรี"
                        className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-800 bg-white"
                      />
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={syncing}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow transition-all cursor-pointer disabled:opacity-50"
                      >
                        {syncing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>กำลังบันทึกข้อมูลปรับปรุง...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>บันทึกการแก้ไขข้อมูลผู้ป่วย</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* Form type switcher at the very bottom */}
              <div className="border-t border-slate-100 pt-4 flex justify-between text-xs text-blue-600 font-bold shrink-0">
                <button 
                  type="button" 
                  onClick={() => setModalType(modalType === 'edit-patient' ? 'visit' : modalType === 'visit' ? 'patient' : 'visit')}
                  className="hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>
                    {modalType === 'edit-patient' 
                      ? 'สลับไปรายงานการเยี่ยมบ้าน' 
                      : modalType === 'visit' 
                        ? 'สลับไปลงทะเบียนคนไข้ใหม่' 
                        : 'สลับไปรายงานการเยี่ยมบ้าน'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
