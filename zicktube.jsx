import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
//  BACKEND — in-memory database + auth + business logic
// ═══════════════════════════════════════════════════════════════
const DB = {
  users: [
    { id: "owner", name: "ZickTube Owner", email: "isaacadiele51@gmail.com", password: "isaac123$#", isOwner: true, enrolled: [], templates: [], videos: [] },
  ],
  videos: [
    { id: "v1", title: "Build a Full Stack App in 1 Hour", creator: "CodeWithZick", creatorId: "owner", views: 1200000, likes: 48200, duration: "1:02:14", thumb: "https://picsum.photos/seed/v1/640/360", category: "learn", description: "Complete guide to building a full-stack web application from scratch." },
    { id: "v2", title: "How I Got 1M Followers in 30 Days", creator: "ViralKing", creatorId: "u2", views: 892000, likes: 31000, duration: "14:22", thumb: "https://picsum.photos/seed/v2/640/360", category: "watch", description: "My exact strategy to grow massively on social media." },
    { id: "v3", title: "React 2026 — New Features Explained", creator: "TechZick", creatorId: "u3", views: 540000, likes: 19800, duration: "28:45", thumb: "https://picsum.photos/seed/v3/640/360", category: "learn", description: "Everything new in React for 2026 explained clearly." },
    { id: "v4", title: "AI Changed My Life — Here's How", creator: "FutureNow", creatorId: "u4", views: 2100000, likes: 87400, duration: "22:10", thumb: "https://picsum.photos/seed/v4/640/360", category: "watch", description: "How I used AI tools to completely transform my workflow." },
    { id: "v5", title: "CSS Glassmorphism Masterclass", creator: "DesignZick", creatorId: "u5", views: 310000, likes: 12300, duration: "45:00", thumb: "https://picsum.photos/seed/v5/640/360", category: "learn", description: "Master modern CSS glassmorphism design effects." },
    { id: "v6", title: "Node.js Backend from Zero to Hero", creator: "BackendBoss", creatorId: "u6", views: 760000, likes: 28900, duration: "2:15:00", thumb: "https://picsum.photos/seed/v6/640/360", category: "learn", description: "Build powerful backends with Node.js and Express." },
    { id: "v7", title: "My Viral TikTok Strategy Revealed", creator: "ClickQueen", creatorId: "u7", views: 1800000, likes: 66000, duration: "18:30", thumb: "https://picsum.photos/seed/v7/640/360", category: "watch", description: "The exact playbook behind my viral TikTok content." },
    { id: "v8", title: "Python for AI & Automation", creator: "PyMaster", creatorId: "u8", views: 420000, likes: 15700, duration: "55:20", thumb: "https://picsum.photos/seed/v8/640/360", category: "learn", description: "Learn Python to build AI tools and automate everything." },
  ],
  courses: [
    { id: "c1", title: "JavaScript Mastery 2026", lessons: 48, hours: "24h", level: "Beginner → Pro", price: 29, thumb: "https://picsum.photos/seed/c1/640/360", tag: "Best Seller", description: "Go from zero to JavaScript pro with 48 video lessons." },
    { id: "c2", title: "React & Next.js Full Course", lessons: 62, hours: "38h", level: "Intermediate", price: 39, thumb: "https://picsum.photos/seed/c2/640/360", tag: "New", description: "Build real-world apps with React and Next.js." },
    { id: "c3", title: "Python for AI & Automation", lessons: 55, hours: "30h", level: "Beginner", price: 35, thumb: "https://picsum.photos/seed/c3/640/360", tag: "Hot", description: "Use Python to automate tasks and build AI projects." },
    { id: "c4", title: "Full Stack Web Dev Bootcamp", lessons: 120, hours: "80h", level: "All Levels", price: 79, thumb: "https://picsum.photos/seed/c4/640/360", tag: "Complete", description: "The most comprehensive full-stack course on ZickTube." },
  ],
  templates: [
    { id: "t1", title: "NeonPortfolio", category: "Portfolio", price: 15, preview: "https://picsum.photos/seed/t1/640/400", tag: "Popular", description: "A stunning neon-themed portfolio for developers and creatives." },
    { id: "t2", title: "CyberStore", category: "E-Commerce", price: 25, preview: "https://picsum.photos/seed/t2/640/400", tag: "Premium", description: "A futuristic e-commerce store template with cart and checkout." },
    { id: "t3", title: "SaaSLaunch", category: "SaaS", price: 35, preview: "https://picsum.photos/seed/t3/640/400", tag: "Hot", description: "Launch your SaaS product with this conversion-optimised page." },
    { id: "t4", title: "AgencyBlack", category: "Agency", price: 20, preview: "https://picsum.photos/seed/t4/640/400", tag: "New", description: "Bold agency website with dark theme and animations." },
    { id: "t5", title: "BlogMatrix", category: "Blog", price: 0, preview: "https://picsum.photos/seed/t5/640/400", tag: "Free", description: "A clean, modern blog template — completely free." },
    { id: "t6", title: "StartupFusion", category: "Startup", price: 30, preview: "https://picsum.photos/seed/t6/640/400", tag: "Featured", description: "The ultimate startup landing page with hero, features & pricing." },
  ],
};

// ── Auth functions ──────────────────────────────────────────────
const Backend = {
  login(email, password) {
    const user = DB.users.find(u => u.email === email && u.password === password);
    if (!user) return { error: "Invalid email or password." };
    return { user: { ...user, password: undefined } };
  },
  signup(name, email, password) {
    if (DB.users.find(u => u.email === email)) return { error: "Email already registered." };
    if (password.length < 6) return { error: "Password must be at least 6 characters." };
    const newUser = { id: "u" + Date.now(), name, email, password, isOwner: false, enrolled: [], templates: [], videos: [] };
    DB.users.push(newUser);
    return { user: { ...newUser, password: undefined } };
  },
  postVideo(userId, video) {
    const v = { ...video, id: "v" + Date.now(), creatorId: userId, views: 0, likes: 0, thumb: "https://picsum.photos/seed/" + Date.now() + "/640/360" };
    DB.videos.push(v);
    return { video: v };
  },
  enrollCourse(userId, courseId) {
    const user = DB.users.find(u => u.id === userId);
    if (user && !user.enrolled.includes(courseId)) user.enrolled.push(courseId);
    return { success: true };
  },
  downloadTemplate(userId, templateId) {
    const user = DB.users.find(u => u.id === userId);
    if (user && !user.templates.includes(templateId)) user.templates.push(templateId);
    return { success: true };
  },
  getUser(userId) {
    return DB.users.find(u => u.id === userId);
  },
};

// ── Fake sales popups ───────────────────────────────────────────
const FAKE_SALES = [
  "James O. just enrolled in JavaScript Mastery 2026",
  "Amara K. just downloaded AgencyBlack template",
  "David N. just enrolled in React & Next.js Full Course",
  "Fatima B. just purchased CyberStore template",
  "Samuel T. just enrolled in Python for AI",
  "Grace E. just downloaded SaaSLaunch template",
  "Chidi M. enrolled in Full Stack Bootcamp",
  "Ngozi A. just purchased NeonPortfolio template",
  "Emmanuel R. just enrolled in JavaScript Mastery",
  "Blessing O. just downloaded StartupFusion template",
];

// ═══════════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const G = {
  bg: "#04060f",
  surface: "#080d1a",
  card: "#0c1120",
  cardHover: "#101828",
  border: "#182035",
  borderGlow: "rgba(0,245,255,0.35)",
  cyan: "#00f5ff",
  purple: "#7c3aed",
  pink: "#f000b8",
  green: "#00ff88",
  yellow: "#ffd700",
  text: "#e2e8f0",
  muted: "#5a6a85",
  gradient: "linear-gradient(135deg, #00f5ff 0%, #7c3aed 50%, #f000b8 100%)",
  gradientSoft: "linear-gradient(135deg, rgba(0,245,255,0.15) 0%, rgba(124,58,237,0.15) 50%, rgba(240,0,184,0.15) 100%)",
};

// ═══════════════════════════════════════════════════════════════
//  GLOBAL CSS
// ═══════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { background: ${G.bg}; color: ${G.text}; font-family: 'Inter', sans-serif; overflow-x: hidden; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: ${G.surface}; }
::-webkit-scrollbar-thumb { background: ${G.purple}; border-radius: 3px; }

/* ── Buttons ── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 22px; border-radius: 10px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.22s; font-family: 'Inter', sans-serif; white-space: nowrap; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: ${G.gradient}; color: #fff; box-shadow: 0 0 24px rgba(0,245,255,0.25); }
.btn-primary:hover:not(:disabled) { box-shadow: 0 0 40px rgba(0,245,255,0.45); transform: translateY(-2px); }
.btn-ghost { background: transparent; color: ${G.text}; border: 1px solid ${G.border}; }
.btn-ghost:hover { border-color: ${G.cyan}; color: ${G.cyan}; background: rgba(0,245,255,0.05); }
.btn-outline { background: transparent; color: ${G.cyan}; border: 1px solid ${G.cyan}; }
.btn-outline:hover { background: rgba(0,245,255,0.1); box-shadow: 0 0 20px rgba(0,245,255,0.2); }
.btn-danger { background: rgba(255,50,80,0.15); color: #ff3250; border: 1px solid rgba(255,50,80,0.3); }
.btn-sm { padding: 7px 14px; font-size: 12px; border-radius: 8px; }
.btn-lg { padding: 15px 36px; font-size: 16px; border-radius: 12px; }
.btn-xl { padding: 18px 48px; font-size: 18px; border-radius: 14px; }
.btn-full { width: 100%; }

/* ── Forms ── */
.field { margin-bottom: 20px; }
.field label { display: block; font-size: 11px; font-weight: 700; color: ${G.muted}; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.8px; }
.field input, .field textarea, .field select {
  width: 100%; background: rgba(255,255,255,0.03); border: 1px solid ${G.border};
  border-radius: 10px; padding: 13px 16px; color: ${G.text}; font-size: 14px; font-family: 'Inter', sans-serif;
  transition: all 0.2s; outline: none;
}
.field input:focus, .field textarea:focus, .field select:focus {
  border-color: ${G.cyan}; box-shadow: 0 0 0 3px rgba(0,245,255,0.07);
}
.field input::placeholder, .field textarea::placeholder { color: ${G.muted}; }
.field textarea { resize: vertical; min-height: 110px; }
.field select option { background: ${G.card}; }

/* ── Cards ── */
.card {
  background: ${G.card}; border: 1px solid ${G.border}; border-radius: 16px; overflow: hidden;
  transition: all 0.28s; cursor: pointer;
}
.card:hover { border-color: ${G.borderGlow}; transform: translateY(-5px); box-shadow: 0 24px 64px rgba(0,0,0,0.45), 0 0 32px rgba(0,245,255,0.08); }
.card-thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
.card-body { padding: 16px; }
.card-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; line-height: 1.45; }
.card-meta { font-size: 12px; color: ${G.muted}; display: flex; gap: 12px; flex-wrap: wrap; }
.card-tag {
  position: absolute; top: 10px; left: 10px; padding: 3px 10px; border-radius: 100px;
  font-size: 11px; font-weight: 700; background: ${G.gradient}; color: #fff;
}
.card-duration {
  position: absolute; bottom: 8px; right: 8px; padding: 2px 8px; border-radius: 6px;
  font-size: 11px; font-weight: 600; background: rgba(0,0,0,0.85); color: #fff;
}

/* ── Modal ── */
.overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.82); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal {
  background: ${G.card}; border: 1px solid ${G.border}; border-radius: 22px;
  width: 100%; max-width: 500px; max-height: 92vh; overflow-y: auto; padding: 38px;
  box-shadow: 0 48px 120px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.15);
}
.modal-lg { max-width: 720px; }
.modal-title { font-family: 'Orbitron', monospace; font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.modal-sub { color: ${G.muted}; font-size: 13px; margin-bottom: 28px; line-height: 1.6; }

/* ── Grids ── */
.grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }

/* ── Topbar ── */
.topbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 60px; background: rgba(4,6,15,0.9); backdrop-filter: blur(20px);
  border-bottom: 1px solid ${G.border};
  display: flex; align-items: center; padding: 0 28px; gap: 16px;
}
.zt-logo { font-family: 'Orbitron', monospace; font-weight: 900; font-size: 20px; letter-spacing: 2px; cursor: pointer; background: ${G.gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; flex-shrink: 0; }
.topbar-back { display: flex; align-items: center; gap: 8px; color: ${G.muted}; font-size: 13px; cursor: pointer; border: none; background: none; padding: 6px 12px; border-radius: 8px; transition: all 0.2s; }
.topbar-back:hover { color: ${G.cyan}; background: rgba(0,245,255,0.07); }
.topbar-title { font-family: 'Orbitron', monospace; font-size: 15px; font-weight: 700; color: ${G.text}; }
.topbar-user { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.owner-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 100px; background: ${G.gradient}; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; }

/* ── Page wrapper ── */
.page-wrap { padding-top: 60px; min-height: 100vh; }
.page-inner { max-width: 1240px; margin: 0 auto; padding: 40px 24px; }
.page-title { font-family: 'Orbitron', monospace; font-size: clamp(22px, 4vw, 30px); font-weight: 700; margin-bottom: 6px; background: ${G.gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-sub { color: ${G.muted}; font-size: 14px; margin-bottom: 32px; }

/* ── Sales toast ── */
.sales-toast {
  position: fixed; bottom: 24px; left: 24px; z-index: 999;
  background: ${G.card}; border: 1px solid rgba(0,245,255,0.25); border-radius: 16px;
  padding: 14px 18px; display: flex; align-items: center; gap: 14px; max-width: 310px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,245,255,0.08);
  animation: toastIn 0.4s cubic-bezier(.22,1,.36,1);
}
.sales-toast.out { animation: toastOut 0.35s ease forwards; }
.toast-avatar { width: 38px; height: 38px; border-radius: 50%; background: ${G.gradient}; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.toast-body { font-size: 12px; line-height: 1.55; }
.toast-name { color: ${G.cyan}; font-weight: 700; }
.toast-time { font-size: 11px; color: ${G.muted}; margin-top: 3px; }
@keyframes toastIn { from { transform: translateX(-110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes toastOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-110%); opacity: 0; } }

/* ── AI Chat ── */
.chat-box { background: ${G.surface}; border: 1px solid ${G.border}; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; height: 520px; }
.chat-msgs { flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; gap: 18px; }
.msg { max-width: 80%; }
.msg-ai { align-self: flex-start; }
.msg-user { align-self: flex-end; }
.msg-label { font-size: 11px; color: ${G.muted}; margin-bottom: 5px; }
.msg-bubble { padding: 13px 17px; border-radius: 14px; font-size: 14px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
.msg-ai .msg-bubble { background: ${G.card}; border: 1px solid ${G.border}; }
.msg-user .msg-bubble { background: ${G.gradient}; color: #fff; }
.chat-bar { display: flex; gap: 10px; padding: 16px; border-top: 1px solid ${G.border}; }
.chat-input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid ${G.border}; border-radius: 10px; padding: 12px 16px; color: ${G.text}; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; }
.chat-input:focus { border-color: ${G.cyan}; }

/* ── Upload zone ── */
.drop-zone {
  border: 2px dashed ${G.border}; border-radius: 18px; padding: 64px 24px; text-align: center;
  transition: all 0.25s; cursor: pointer; margin-bottom: 28px;
}
.drop-zone:hover { border-color: ${G.cyan}; background: rgba(0,245,255,0.03); }

/* ── Payment modal ── */
.pay-info { background: rgba(0,245,255,0.05); border: 1px solid rgba(0,245,255,0.18); border-radius: 14px; padding: 18px; margin: 16px 0; }
.pay-methods { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 14px 0; }
.pay-opt { padding: 14px; border-radius: 12px; border: 2px solid ${G.border}; cursor: pointer; text-align: center; font-size: 13px; font-weight: 600; transition: all 0.2s; color: ${G.muted}; }
.pay-opt:hover { border-color: rgba(0,245,255,0.4); color: ${G.text}; }
.pay-opt.on { border-color: ${G.cyan}; background: rgba(0,245,255,0.08); color: ${G.cyan}; }
.transfer-box { background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.3); border-radius: 12px; padding: 18px; }

/* ── Tabs ── */
.tabs { display: flex; gap: 4px; background: ${G.surface}; border: 1px solid ${G.border}; border-radius: 12px; padding: 4px; width: fit-content; margin-bottom: 28px; }
.tab { padding: 8px 18px; border-radius: 9px; cursor: pointer; font-size: 13px; font-weight: 600; color: ${G.muted}; border: none; background: none; transition: all 0.2s; }
.tab.on { background: ${G.gradient}; color: #fff; }

/* ── Spinner ── */
.spin { width: 18px; height: 18px; border: 2px solid rgba(0,245,255,0.2); border-top-color: ${G.cyan}; border-radius: 50%; animation: rot 0.75s linear infinite; display: inline-block; }
@keyframes rot { to { transform: rotate(360deg); } }

/* ── Error / Success ── */
.err { color: #ff4466; font-size: 13px; margin-bottom: 14px; padding: 10px 14px; background: rgba(255,68,102,0.08); border-radius: 8px; border: 1px solid rgba(255,68,102,0.2); }
.success-box { text-align: center; padding: 24px 0; }

/* ── Misc ── */
.divider { height: 1px; background: ${G.border}; margin: 24px 0; }
.glow-line { height: 1px; background: ${G.gradient}; opacity: 0.18; }
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
.badge-green { background: rgba(0,255,136,0.12); color: ${G.green}; border: 1px solid rgba(0,255,136,0.25); }
.badge-cyan { background: rgba(0,245,255,0.1); color: ${G.cyan}; border: 1px solid rgba(0,245,255,0.25); }

@media (max-width: 640px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .pay-methods { grid-template-columns: 1fr; }
  .modal { padding: 24px; }
  .page-inner { padding: 24px 16px; }
}
`;

// ═══════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── Sales Toast ─────────────────────────────────────────────────
function SalesToast() {
  const [toast, setToast] = useState(null);
  const [out, setOut] = useState(false);
  const idx = useRef(0);
  useEffect(() => {
    const show = () => {
      setOut(false);
      setToast(FAKE_SALES[idx.current % FAKE_SALES.length]);
      idx.current++;
      setTimeout(() => setOut(true), 4600);
      setTimeout(() => setToast(null), 5100);
    };
    const t = setTimeout(show, 3000);
    const iv = setInterval(show, 60000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);
  if (!toast) return null;
  const [who, ...rest] = toast.split(" just ");
  return (
    <div className={`sales-toast${out ? " out" : ""}`}>
      <div className="toast-avatar">🎉</div>
      <div className="toast-body">
        <div className="toast-name">{who}</div>
        <div>just {rest.join(" just ")}</div>
        <div className="toast-time">Just now · ZickTube</div>
      </div>
    </div>
  );
}

// ── Topbar ──────────────────────────────────────────────────────
function Topbar({ user, onBack, backLabel, pageTitle, onLogout }) {
  return (
    <nav className="topbar">
      <div className="zt-logo">ZICKTUBE</div>
      {onBack && (
        <button className="topbar-back" onClick={onBack}>
          ← {backLabel || "Home"}
        </button>
      )}
      {pageTitle && <div className="topbar-title">{pageTitle}</div>}
      <div className="topbar-user">
        {user?.isOwner && <span className="owner-badge">👑 Owner</span>}
        <span style={{ fontSize: 13, color: G.muted }}>{user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={onLogout}>Sign Out</button>
      </div>
    </nav>
  );
}

// ── Flutterwave Payment Modal ────────────────────────────────────
const FLW_PUBLIC_KEY = "FLWPUBK_TEST-4474399b53352406e4f6f0e25c973c43-X";

function PayModal({ item, onClose, onSuccess, user }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(!!window.FlutterwaveCheckout);

  useEffect(() => {
    if (window.FlutterwaveCheckout) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.flutterwave.com/v3.js";
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);

  const pay = () => {
    if (!ready || !window.FlutterwaveCheckout) { alert("Payment loading, try again shortly."); return; }
    setLoading(true);
    window.FlutterwaveCheckout({
      public_key: FLW_PUBLIC_KEY,
      tx_ref: "ZT-" + Date.now(),
      amount: item.price * 1600,
      currency: "NGN",
      payment_options: "card, banktransfer, ussd",
      customer: {
        email: user?.email || "customer@zicktube.com",
        name: user?.name || "ZickTube User",
      },
      customizations: { title: "ZickTube", description: item.title },
      callback: (response) => {
        setLoading(false);
        if (response.status === "successful" || response.status === "completed") {
          setDone(true);
          setTimeout(() => { onSuccess(); }, 2000);
        } else {
          alert("Payment not completed. Please try again.");
          onClose();
        }
      },
      onclose: () => { setLoading(false); },
    });
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {done ? (
          <div className="success-box">
            <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
            <div className="modal-title" style={{ color: G.green, marginBottom: 8 }}>Payment Successful!</div>
            <div className="modal-sub">Your access to <strong>{item.title}</strong> is now unlocked!</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div className="modal-title">Complete Purchase</div>
                <div className="modal-sub" style={{ marginBottom: 0 }}>{item.title}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
            </div>

            <div className="pay-info">
              <div style={{ fontSize: 12, color: G.muted, marginBottom: 6 }}>Total Amount</div>
              <div style={{ fontFamily: "Orbitron, monospace", fontSize: 30, fontWeight: 900, color: G.cyan }}>
                ₦{(item.price * 1600).toLocaleString()}
                <span style={{ fontSize: 13, color: G.muted, marginLeft: 10, fontFamily: "Inter, sans-serif" }}>(~${item.price} USD)</span>
              </div>
            </div>

            <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: G.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>What you get</div>
              <div style={{ fontSize: 14, color: G.text, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: G.green, fontWeight: 700 }}>✓</span> {item.title}
              </div>
              <div style={{ fontSize: 12, color: G.muted, marginTop: 6 }}>Lifetime access · Instant unlock after payment</div>
            </div>

            <div style={{ background: "rgba(243,140,0,0.06)", border: "1px solid rgba(243,140,0,0.2)", borderRadius: 12, padding: 14, marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>🔒</span>
              <div style={{ fontSize: 12, color: G.muted, lineHeight: 1.6 }}>
                Secured by <strong style={{ color: "#f38c00" }}>Flutterwave</strong> — pay with card, bank transfer, or USSD. Supports GTB, Access, Zenith, UBA & more.
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={pay} disabled={loading || !ready}>
              {loading ? <><span className="spin" /> Opening payment…</>
               : !ready  ? <><span className="spin" /> Loading…</>
               : `Pay ₦${(item.price * 1600).toLocaleString()} with Flutterwave →`}
            </button>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: G.muted }}>
              SSL Encrypted · Safe & Secure · Powered by Flutterwave
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════
//  SCREEN 1 — LOGIN / SIGNUP
// ═══════════════════════════════════════════════════════════════
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    setErr("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = mode === "login"
        ? Backend.login(form.email, form.password)
        : Backend.signup(form.name, form.email, form.password);
      if (res.error) { setErr(res.error); return; }
      onAuth(res.user);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 70% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(0,245,255,0.1) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(240,0,184,0.1) 0%, transparent 55%)` }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: 36, background: G.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 3, marginBottom: 10 }}>
            ZICKTUBE
          </div>
          <div style={{ color: G.muted, fontSize: 14 }}>Watch · Create · Learn · Build AI</div>
        </div>

        {/* Card */}
        <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 22, padding: 40, boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.12)` }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", background: G.surface, borderRadius: 12, padding: 4, marginBottom: 28, border: `1px solid ${G.border}` }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "Inter, sans-serif", transition: "all 0.2s", background: mode === m ? G.gradient : "transparent", color: mode === m ? "#fff" : G.muted }}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div className="field"><label>Full Name</label><input placeholder="Your full name" value={form.name} onChange={f("name")} /></div>
          )}
          <div className="field"><label>Email Address</label><input type="email" placeholder="you@email.com" value={form.email} onChange={f("email")} /></div>
          <div className="field"><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={f("password")} onKeyDown={e => e.key === "Enter" && submit()} /></div>

          {err && <div className="err">{err}</div>}

          <button className="btn btn-primary btn-full btn-lg" onClick={submit} disabled={loading}>
            {loading ? <><span className="spin" /> {mode === "login" ? "Signing in…" : "Creating account…"}</> : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: G.muted }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: G.cyan, cursor: "pointer", fontWeight: 600 }} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(""); }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: G.muted }}>
          🔒 Secure login · Your data is protected
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN 2 — DASHBOARD (5 big cards)
// ═══════════════════════════════════════════════════════════════
const MENU = [
  { id: "watch",     icon: "📺", label: "Watch Videos",           desc: "Discover trending videos from creators worldwide",         color: "#00f5ff" },
  { id: "post",      icon: "🚀", label: "Post Videos",            desc: "Upload your videos and go viral on ZickTube",              color: "#7c3aed" },
  { id: "ai",        icon: "🤖", label: "ZickTube AI",            desc: "Ask anything — powered by Claude AI",                     color: "#f000b8" },
  { id: "templates", icon: "🎨", label: "Website Templates",      desc: "Download futuristic website templates",                   color: "#ffd700" },
  { id: "learn",     icon: "💻", label: "Videos to Learn to Code","desc": "Step-by-step coding video courses",                    color: "#00ff88" },
  { id: "about",     icon: "ℹ️", label: "About ZickTube",         desc: "Learn about ZickTube and the founder",                   color: "#00f5ff" },
];

function Dashboard({ user, onNavigate, onLogout }) {
  return (
    <>
      <Topbar user={user} onLogout={onLogout} />
      <div className="page-wrap">
        <div className="page-inner">
          {/* Welcome */}
          <div style={{ textAlign: "center", marginBottom: 52, paddingTop: 12 }}>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, background: G.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10 }}>
              Welcome back, {user.name.split(" ")[0]}
            </div>
            <div style={{ color: G.muted, fontSize: 15 }}>What do you want to do today?</div>
          </div>

          {/* 5 big menu cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
            {MENU.map((m, i) => (
              <div
                key={m.id}
                onClick={() => onNavigate(m.id)}
                style={{
                  background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: "36px 32px",
                  cursor: "pointer", transition: "all 0.28s", position: "relative", overflow: "hidden",
                  animation: `fadeUp 0.5s ease ${i * 0.07}s both`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + "66"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 28px 70px rgba(0,0,0,0.45), 0 0 36px ${m.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle, ${m.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ fontSize: 48, marginBottom: 18 }}>{m.icon}</div>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: 18, fontWeight: 700, color: m.color, marginBottom: 10 }}>{m.label}</div>
                <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.6, marginBottom: 20 }}>{m.desc}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: m.color }}>
                  Open <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAGE — WATCH VIDEOS
// ═══════════════════════════════════════════════════════════════
function WatchPage({ user, onBack }) {
  const [watching, setWatching] = useState(null);
  const [filter, setFilter] = useState("all");
  const vids = filter === "all" ? DB.videos : DB.videos.filter(v => v.category === filter);

  if (watching) return (
    <>
      <Topbar user={user} onBack={() => setWatching(null)} backLabel="Back to Videos" pageTitle="Watch Videos" onLogout={() => {}} />
      <div className="page-wrap"><div className="page-inner">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
          <div>
            <div style={{ background: "#000", borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", position: "relative", marginBottom: 20 }}>
              <img src={watching.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: `2px solid ${G.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: G.cyan, cursor: "pointer" }}>▶</div>
              </div>
            </div>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 20, fontWeight: 700, marginBottom: 14 }}>{watching.title}</div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ color: G.muted, fontSize: 13 }}>👤 {watching.creator}</span>
              <span style={{ color: G.muted, fontSize: 13 }}>👁 {(watching.views / 1000).toFixed(0)}K views</span>
              <button className="btn btn-outline btn-sm">👍 {(watching.likes / 1000).toFixed(1)}K</button>
              <button className="btn btn-ghost btn-sm">↗ Share</button>
            </div>
            <div style={{ background: G.surface, borderRadius: 12, padding: 16, fontSize: 13, color: G.muted, border: `1px solid ${G.border}` }}>{watching.description}</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: G.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Up Next</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DB.videos.filter(v => v.id !== watching.id).map(v => (
                <div key={v.id} className="card" style={{ display: "flex", gap: 12, padding: 10 }} onClick={() => setWatching(v)}>
                  <img src={v.thumb} alt="" style={{ width: 110, height: 65, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: G.muted }}>{v.creator} · {v.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div></div>
    </>
  );

  return (
    <>
      <Topbar user={user} onBack={onBack} backLabel="Home" pageTitle="Watch Videos" onLogout={onBack} />
      <div className="page-wrap"><div className="page-inner">
        <div className="page-title">📺 Watch Videos</div>
        <div className="page-sub">Trending videos from creators around the world</div>
        <div className="tabs">
          {[["all", "All"], ["watch", "🔥 Trending"], ["learn", "💻 Coding"]].map(([v, l]) => (
            <button key={v} className={`tab${filter === v ? " on" : ""}`} onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
        <div className="grid-4">
          {vids.map(v => (
            <div className="card" key={v.id} onClick={() => setWatching(v)}>
              <div style={{ position: "relative" }}>
                <img src={v.thumb} alt={v.title} className="card-thumb" />
                <div className="card-duration">{v.duration}</div>
              </div>
              <div className="card-body">
                <div className="card-title">{v.title}</div>
                <div className="card-meta">
                  <span>👤 {v.creator}</span>
                  <span>👁 {(v.views / 1000).toFixed(0)}K</span>
                  <span>❤ {(v.likes / 1000).toFixed(1)}K</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div></div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAGE — POST VIDEOS
// ═══════════════════════════════════════════════════════════════
function PostPage({ user, onBack }) {
  const [form, setForm] = useState({ title: "", desc: "", tags: "", category: "watch" });
  const [done, setDone] = useState(false);
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const post = () => {
    if (!form.title) return;
    Backend.postVideo(user.id, { ...form, creator: user.name });
    setDone(true);
  };

  return (
    <>
      <Topbar user={user} onBack={onBack} backLabel="Home" pageTitle="Post Videos" onLogout={onBack} />
      <div className="page-wrap"><div className="page-inner" style={{ maxWidth: 760 }}>
        <div className="page-title">🚀 Post Videos</div>
        <div className="page-sub">Upload your video and reach millions of viewers worldwide</div>
        {done ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 26, color: G.green, marginBottom: 12 }}>Video Published!</div>
            <div style={{ color: G.muted, marginBottom: 32 }}>Your video is live and ready to go viral</div>
            <button className="btn btn-primary btn-lg" onClick={() => { setDone(false); setForm({ title: "", desc: "", tags: "", category: "watch" }); }}>Post Another Video</button>
          </div>
        ) : (
          <>
            <div className="drop-zone">
              <div style={{ fontSize: 52, marginBottom: 14 }}>🎬</div>
              <div style={{ fontFamily: "Orbitron, monospace", fontSize: 18, marginBottom: 8 }}>Drop your video here</div>
              <div style={{ color: G.muted, fontSize: 13, marginBottom: 18 }}>MP4, MOV, AVI — up to 4GB</div>
              <button className="btn btn-primary">Browse Files</button>
            </div>
            <div className="field"><label>Video Title *</label><input placeholder="Give your video a catchy title…" value={form.title} onChange={f("title")} /></div>
            <div className="field"><label>Description</label><textarea placeholder="Tell viewers what your video is about…" value={form.desc} onChange={f("desc")} /></div>
            <div className="field"><label>Tags</label><input placeholder="viral, trending, tech, coding…" value={form.tags} onChange={f("tags")} /></div>
            <div className="field"><label>Category</label>
              <select value={form.category} onChange={f("category")}>
                <option value="watch">🔥 Trending / Entertainment</option>
                <option value="learn">💻 Coding / Tech</option>
                <option value="business">📈 Business</option>
                <option value="lifestyle">✨ Lifestyle</option>
              </select>
            </div>
            <button className="btn btn-primary btn-lg" onClick={post} disabled={!form.title}>🚀 Publish Video</button>
          </>
        )}
      </div></div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAGE — ZICKTUBE AI
// ═══════════════════════════════════════════════════════════════
function AIPage({ user, onBack }) {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Hi! I'm ZickTube AI, powered by Claude.\n\nI can answer absolutely any question — coding, business, science, life, creativity, math, writing — anything at all. I can also help you build websites, write code, and brainstorm ideas.\n\nWhat can I help you with? 🚀" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useRef([]);
  const bottom = useRef(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: q }]);
    history.current.push({ role: "user", content: q });
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are ZickTube AI — the intelligent assistant built into ZickTube, a futuristic video, coding, and AI platform. You are powered by Claude and can answer any question on absolutely any topic. Be genuinely helpful, thorough, and friendly. You can discuss coding, science, business, creativity, math, writing, life advice, history — everything. When relevant, mention ZickTube features like video upload, coding courses, website templates, and the AI builder. Never refuse a reasonable question.",
          messages: history.current,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, something went wrong. Please try again.";
      history.current.push({ role: "assistant", content: reply });
      setMsgs(p => [...p, { role: "ai", text: reply }]);
    } catch {
      setMsgs(p => [...p, { role: "ai", text: "Connection error. Please check your internet and try again." }]);
    }
    setLoading(false);
  };

  const prompts = ["Build me a portfolio website", "Explain how AI works", "Write a Python web scraper", "How do I go viral on social media?", "What is machine learning?", "Help me write a cover letter"];

  return (
    <>
      <Topbar user={user} onBack={onBack} backLabel="Home" pageTitle="ZickTube AI" onLogout={onBack} />
      <div className="page-wrap"><div className="page-inner" style={{ maxWidth: 860 }}>
        <div className="page-title">🤖 ZickTube AI</div>
        <div className="page-sub">Powered by Claude — Ask me anything on any topic</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {prompts.map(p => (
            <button key={p} className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: G.cyan, borderColor: "rgba(0,245,255,0.25)" }} onClick={() => send(p)}>{p}</button>
          ))}
        </div>
        <div className="chat-box">
          <div className="chat-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`msg msg-${m.role}`}>
                <div className="msg-label">{m.role === "ai" ? "🤖 ZickTube AI" : "👤 You"}</div>
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg msg-ai">
                <div className="msg-label">🤖 ZickTube AI</div>
                <div className="msg-bubble" style={{ display: "flex", alignItems: "center", gap: 10 }}><span className="spin" /> Thinking…</div>
              </div>
            )}
            <div ref={bottom} />
          </div>
          <div className="chat-bar">
            <input className="chat-input" placeholder="Ask me anything…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} />
            <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()}>
              {loading ? <span className="spin" /> : "Send →"}
            </button>
          </div>
        </div>
      </div></div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAGE — WEBSITE TEMPLATES
// ═══════════════════════════════════════════════════════════════
function TemplatesPage({ user, onBack }) {
  const [payItem, setPayItem] = useState(null);
  const [owned, setOwned] = useState(user.isOwner ? DB.templates.map(t => t.id) : []);
  const [preview, setPreview] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [templates, setTemplates] = useState(DB.templates);
  const [uploadForm, setUploadForm] = useState({ title: "", category: "Portfolio", price: "", tag: "New", description: "", downloadUrl: "", previewUrl: "" });
  const [uploadDone, setUploadDone] = useState(false);
  const [previewImgErr, setPreviewImgErr] = useState(false);

  const uf = k => e => setUploadForm(p => ({ ...p, [k]: e.target.value }));

  const submitUpload = () => {
    if (!uploadForm.title || !uploadForm.downloadUrl) return;
    const newT = {
      id: "t" + Date.now(),
      title: uploadForm.title,
      category: uploadForm.category,
      price: parseFloat(uploadForm.price) || 0,
      tag: uploadForm.tag,
      description: uploadForm.description,
      preview: uploadForm.previewUrl || `https://picsum.photos/seed/${Date.now()}/640/400`,
      downloadUrl: uploadForm.downloadUrl,
    };
    DB.templates.push(newT);
    setTemplates([...DB.templates]);
    setUploadDone(true);
    setTimeout(() => {
      setUploadDone(false);
      setShowUpload(false);
      setUploadForm({ title: "", category: "Portfolio", price: "", tag: "New", description: "", downloadUrl: "", previewUrl: "" });
    }, 2000);
  };

  const handle = (t) => {
    if (t.price === 0 || owned.includes(t.id) || user.isOwner) {
      if (t.downloadUrl) {
        window.open(t.downloadUrl, "_blank");
      } else {
        alert("⬇ Download link not set for this template yet.");
      }
    } else {
      setPayItem(t);
    }
  };

  const deleteTemplate = (id) => {
    if (!window.confirm("Delete this template?")) return;
    const idx = DB.templates.findIndex(t => t.id === id);
    if (idx > -1) DB.templates.splice(idx, 1);
    setTemplates([...DB.templates]);
  };

  return (
    <>
      <Topbar user={user} onBack={onBack} backLabel="Home" pageTitle="Website Templates" onLogout={onBack} />
      <div className="page-wrap"><div className="page-inner">

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <div className="page-title">🎨 Website Templates</div>
            <div className="page-sub">Futuristic templates ready to deploy · {templates.length} available</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {user.isOwner && <span className="owner-badge">👑 Owner — All Free</span>}
            {user.isOwner && (
              <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                + Upload Template
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {templates.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎨</div>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 20, marginBottom: 10 }}>No Templates Yet</div>
            <div style={{ color: G.muted, marginBottom: 24 }}>Upload your first template to get started</div>
            {user.isOwner && <button className="btn btn-primary btn-lg" onClick={() => setShowUpload(true)}>+ Upload First Template</button>}
          </div>
        )}

        {/* Templates grid */}
        <div className="grid-3">
          {templates.map(t => {
            const have = owned.includes(t.id) || user.isOwner;
            const free = t.price === 0;
            return (
              <div className="card" key={t.id}>
                <div style={{ position: "relative" }}>
                  <img
                    src={t.preview}
                    alt={t.title}
                    className="card-thumb"
                    onClick={() => setPreview(t)}
                    onError={e => { e.target.src = `https://picsum.photos/seed/${t.id}/640/400`; }}
                  />
                  <div className="card-tag">{t.tag}</div>
                  {user.isOwner && (
                    <button
                      onClick={e => { e.stopPropagation(); deleteTemplate(t.id); }}
                      style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,50,80,0.85)", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", cursor: "pointer" }}
                    >✕ Delete</button>
                  )}
                </div>
                <div className="card-body">
                  <div className="card-title">{t.title}</div>
                  <div className="card-meta" style={{ marginBottom: 16 }}>
                    <span>📁 {t.category}</span>
                    {have && <span className="badge badge-green">✓ Owned</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "Orbitron, monospace", fontSize: 18, fontWeight: 800, color: free ? G.green : G.cyan }}>
                      {free ? "FREE" : `$${t.price}`}
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => handle(t)}>
                      {have || free ? "⬇ Download" : "Buy & Download"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div></div>

      {/* Upload Modal — owner only */}
      {showUpload && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowUpload(false)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            {uploadDone ? (
              <div className="success-box">
                <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
                <div className="modal-title" style={{ color: G.green, marginBottom: 8 }}>Template Uploaded!</div>
                <div className="modal-sub">It is now live in the store for users to buy.</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <div className="modal-title">Upload Template</div>
                    <div className="modal-sub" style={{ marginBottom: 0 }}>Add a new template to the store</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowUpload(false)}>✕</button>
                </div>

                <div className="field"><label>Template Name *</label>
                  <input placeholder="e.g. NeonPortfolio" value={uploadForm.title} onChange={uf("title")} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field"><label>Category</label>
                    <select value={uploadForm.category} onChange={uf("category")}>
                      {["Portfolio","E-Commerce","SaaS","Agency","Blog","Startup","Landing Page","Dashboard"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field"><label>Tag</label>
                    <select value={uploadForm.tag} onChange={uf("tag")}>
                      {["New","Hot","Popular","Premium","Featured","Free"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field"><label>Price (USD) — set 0 for free</label>
                  <input type="number" placeholder="e.g. 15" value={uploadForm.price} onChange={uf("price")} min="0" />
                </div>

                <div className="field"><label>Description</label>
                  <textarea placeholder="Describe what this template includes…" value={uploadForm.description} onChange={uf("description")} style={{ minHeight: 80 }} />
                </div>

                <div className="field">
                  <label>Download Link * (Google Drive / GitHub / Dropbox)</label>
                  <input placeholder="https://drive.google.com/file/..." value={uploadForm.downloadUrl} onChange={uf("downloadUrl")} />
                  <div style={{ fontSize: 11, color: G.muted, marginTop: 6 }}>Paste the direct download link to your template ZIP file</div>
                </div>

                <div className="field">
                  <label>Preview Image URL (optional)</label>
                  <input placeholder="https://... (leave blank to use auto image)" value={uploadForm.previewUrl} onChange={uf("previewUrl")} />
                  <div style={{ fontSize: 11, color: G.muted, marginTop: 6 }}>Paste a screenshot/preview image URL from your template</div>
                </div>

                {uploadForm.previewUrl ? (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: G.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>Preview</div>
                    <img
                      src={uploadForm.previewUrl}
                      alt="preview"
                      style={{ width: "100%", borderRadius: 10, border: `1px solid ${G.border}` }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  </div>
                ) : null}

                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={submitUpload}
                  disabled={!uploadForm.title || !uploadForm.downloadUrl}
                >
                  🚀 Upload Template to Store
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pay modal */}
      {payItem && <PayModal item={payItem} user={user} onClose={() => setPayItem(null)} onSuccess={() => { Backend.downloadTemplate(user.id, payItem.id); setOwned(p => [...p, payItem.id]); setPayItem(null); }} />}

      {/* Preview modal */}
      {preview && (
        <div className="overlay" onClick={() => setPreview(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div className="modal-title">{preview.title}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)}>✕</button>
            </div>
            <img src={preview.preview} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: 16 }} onError={e => { e.target.src = `https://picsum.photos/seed/${preview.id}/640/400`; }} />
            <div style={{ color: G.muted, fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>{preview.description}</div>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 20 }}>📁 {preview.category} · {preview.price === 0 ? <span style={{ color: G.green }}>FREE</span> : <span style={{ color: G.cyan }}>${preview.price}</span>}</div>
            <button className="btn btn-primary btn-full" onClick={() => { setPreview(null); handle(preview); }}>
              {preview.price === 0 || owned.includes(preview.id) || user.isOwner ? "⬇ Download Free" : `Buy for $${preview.price}`}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAGE — LEARN TO CODE
// ═══════════════════════════════════════════════════════════════
function LearnPage({ user, onBack }) {
  const [payItem, setPayItem] = useState(null);
  const [enrolled, setEnrolled] = useState(user.isOwner ? DB.courses.map(c => c.id) : []);
  const [open, setOpen] = useState(null);

  const handle = (c) => {
    if (enrolled.includes(c.id) || user.isOwner) { setOpen(c); }
    else { setPayItem(c); }
  };

  if (open) return (
    <>
      <Topbar user={user} onBack={() => setOpen(null)} backLabel="Back to Courses" pageTitle={open.title} onLogout={onBack} />
      <div className="page-wrap"><div className="page-inner" style={{ maxWidth: 900 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
          <div>
            <div style={{ background: "#000", borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", position: "relative", marginBottom: 20 }}>
              <img src={open.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: `2px solid ${G.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: G.cyan }}>▶</div>
              </div>
            </div>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{open.title}</div>
            <div style={{ color: G.muted, fontSize: 13, lineHeight: 1.7 }}>{open.description}</div>
          </div>
          <div>
            <div style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 13 }}>Course Content</div>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: i < 7 ? `1px solid ${G.border}` : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? G.gradient : G.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? "#fff" : G.muted, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 12, color: i === 0 ? G.text : G.muted }}>Lesson {i + 1}: {["Introduction", "Setup", "Core Concepts", "Building", "Advanced", "Projects", "Testing", "Deployment"][i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div></div>
    </>
  );

  return (
    <>
      <Topbar user={user} onBack={onBack} backLabel="Home" pageTitle="Learn to Code" onLogout={onBack} />
      <div className="page-wrap"><div className="page-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 0 }}>
          <div>
            <div className="page-title">💻 Videos to Learn to Code</div>
            <div className="page-sub">Step-by-step coding courses taught by real developers</div>
          </div>
          {user.isOwner && <span className="owner-badge">👑 Owner — All Free</span>}
        </div>
        <div className="grid-3">
          {DB.courses.map(c => {
            const have = enrolled.includes(c.id) || user.isOwner;
            return (
              <div className="card" key={c.id}>
                <div style={{ position: "relative" }}>
                  <img src={c.thumb} alt={c.title} className="card-thumb" />
                  <div className="card-tag">{c.tag}</div>
                </div>
                <div className="card-body">
                  <div className="card-title">{c.title}</div>
                  <div className="card-meta" style={{ marginBottom: 16 }}>
                    <span>📚 {c.lessons} lessons</span>
                    <span>⏱ {c.hours}</span>
                    <span>📊 {c.level}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "Orbitron, monospace", fontSize: 18, fontWeight: 800, color: have ? G.green : G.cyan }}>
                      {have ? <span className="badge badge-green">✓ Enrolled</span> : `$${c.price}`}
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => handle(c)}>
                      {have ? "▶ Watch Now" : "Enroll Now"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div></div>
      {payItem && <PayModal item={payItem} user={user} onClose={() => setPayItem(null)} onSuccess={() => { Backend.enrollCourse(user.id, payItem.id); setEnrolled(p => [...p, payItem.id]); setPayItem(null); }} />}
    </>
  );
}


// ═══════════════════════════════════════════════════════════════
//  PAGE — ABOUT
// ═══════════════════════════════════════════════════════════════
function AboutPage({ user, onBack }) {
  return (
    <>
      <Topbar user={user} onBack={onBack} backLabel="Home" pageTitle="About" onLogout={onBack} />
      <div className="page-wrap">
        <div className="page-inner" style={{ maxWidth: 860 }}>

          {/* Hero banner */}
          <div style={{ textAlign: "center", padding: "48px 24px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 24, marginBottom: 36, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(0,245,255,0.1) 0%, transparent 55%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "clamp(36px,8vw,72px)", background: G.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12, letterSpacing: 3 }}>ZICKTUBE</div>
              <div style={{ color: G.muted, fontSize: 16, fontStyle: "italic" }}>Watch · Create · Learn · Go Viral · Build</div>
            </div>
          </div>

          {/* About ZickTube */}
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: 36, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: G.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🌐</div>
              <div style={{ fontFamily: "Orbitron, monospace", fontSize: 20, fontWeight: 700, background: G.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>About ZickTube</div>
            </div>
            <div style={{ fontSize: 15, color: G.text, lineHeight: 1.9 }}>
              ZickTube is a <strong style={{ color: G.cyan }}>multipurpose platform</strong> where you can make videos, watch videos, learn how to code, go viral, and also make websites. You can buy premium website templates and use our powerful AI to build your dream website.
            </div>
            <div style={{ marginTop: 20, padding: 20, background: `rgba(0,245,255,0.05)`, border: `1px solid rgba(0,245,255,0.15)`, borderRadius: 14 }}>
              <div style={{ fontSize: 15, color: G.text, lineHeight: 1.9, fontStyle: "italic" }}>
                "When you start using ZickTube, you go viral in seconds and beat the next trending thing. So we advise you to join ZickTube — pay for everything and you'll be the next trending thing." 🚀
              </div>
            </div>

            {/* Features grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginTop: 24 }}>
              {[
                { icon: "📺", label: "Watch Videos", color: G.cyan },
                { icon: "🚀", label: "Go Viral Fast", color: G.purple },
                { icon: "💻", label: "Learn to Code", color: G.green },
                { icon: "🤖", label: "ZickTube AI", color: G.pink },
                { icon: "🎨", label: "Website Templates", color: G.yellow },
                { icon: "🌍", label: "Global Community", color: G.cyan },
              ].map(f => (
                <div key={f.label} style={{ background: G.surface, border: `1px solid ${G.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{f.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: f.color }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About the Owner */}
          <div style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: 36, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: G.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👑</div>
              <div style={{ fontFamily: "Orbitron, monospace", fontSize: 20, fontWeight: 700, background: G.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>About the Owner</div>
            </div>

            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ width: 100, height: 100, borderRadius: "50%", background: G.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, border: `3px solid rgba(0,245,255,0.3)`, boxShadow: `0 0 30px rgba(0,245,255,0.2)` }}>👨‍💼</div>
              </div>

              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: 20, fontWeight: 800, color: G.cyan, marginBottom: 4 }}>Adiele Okwuchukwu Isaac</div>
                <div style={{ fontSize: 13, color: G.muted, marginBottom: 16 }}>Founder & CEO of ZickTube</div>
                <div style={{ fontSize: 15, color: G.text, lineHeight: 1.9 }}>
                  Adiele Okwuchukwu Isaac is the owner of ZickTube. He is a <strong style={{ color: G.cyan }}>secondary school graduate</strong> aiming to help people who have the dream to own a website and also be the next trending thing.
                </div>
                <div style={{ marginTop: 16, fontSize: 15, color: G.text, lineHeight: 1.9 }}>
                  His dream is to <strong style={{ color: G.purple }}>help people find their inner self</strong> — and ZickTube is the platform he built to make that happen.
                </div>
                <div style={{ marginTop: 20, padding: 16, background: `rgba(124,58,237,0.08)`, border: `1px solid rgba(124,58,237,0.2)`, borderRadius: 12, fontSize: 14, color: G.text, fontStyle: "italic", lineHeight: 1.8 }}>
                  "Thank you for being here — and join ZickTube today. The next trending thing is YOU." 🌟
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "40px 24px", background: G.card, border: `1px solid ${G.border}`, borderRadius: 20 }}>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 22, fontWeight: 700, marginBottom: 12, background: G.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ready to Go Viral?</div>
            <div style={{ color: G.muted, fontSize: 14, marginBottom: 24 }}>Join thousands of creators already on ZickTube</div>
            <button className="btn btn-primary btn-lg" onClick={onBack}>🚀 Start Now</button>
          </div>

        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  APP ROOT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const logout = () => { setUser(null); setPage("dashboard"); };
  const go = (p) => setPage(p);
  const back = () => setPage("dashboard");

  const pageMap = {
    watch:     <WatchPage user={user} onBack={back} />,
    post:      <PostPage user={user} onBack={back} />,
    ai:        <AIPage key="ai" user={user} onBack={back} />,
    templates: <TemplatesPage user={user} onBack={back} />,
    learn:     <LearnPage user={user} onBack={back} />,
    about:     <AboutPage user={user} onBack={back} />,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {!user
        ? <AuthScreen onAuth={u => { setUser(u); setPage("dashboard"); }} />
        : page === "dashboard"
          ? <Dashboard user={user} onNavigate={go} onLogout={logout} />
          : pageMap[page] || <Dashboard user={user} onNavigate={go} onLogout={logout} />
      }
      {user && <SalesToast />}
    </>
  );
}
