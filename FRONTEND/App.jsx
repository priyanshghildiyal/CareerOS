import React, { useState } from 'react';
import OpportunityPage from './OpportunityPage.jsx';
import CareerWorkspace, { normalizeCareerWorkspace } from './CareerWorkspace.jsx';
import './style.css';
import './opportunity.css';

const Icon = ({ name, size = 20 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/><circle cx="12" cy="12" r="10"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7 4.7-2.3Z"/></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 18a2.5 2.5 0 0 1 2.5-2.5H20"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z"/><path d="M13 3v7h7M8 15h8M8 18h5"/></>,
    trophy: <><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 7H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    alert: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5m0 4h.01"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
  };
  return <svg {...common}>{paths[name] || paths.spark}</svg>;
};

const navGroups = [
  { label: 'WORKSPACE', items: [{ id: 'Overview', icon: 'grid' }, { id: 'My profile', icon: 'user' }, { id: 'Career goals', icon: 'target' }] },
  { label: 'OPPORTUNITY INTELLIGENCE', items: [{ id: 'Government jobs', icon: 'briefcase' }, { id: 'Private-sector jobs', icon: 'compass' }, { id: 'My applications', icon: 'file' }] },
  { label: 'BUILD YOUR CAREER', items: [{ id: 'Career roadmap', icon: 'map' }, { id: 'Skills & evidence', icon: 'spark' }, { id: 'Projects & portfolio', icon: 'trophy' }, { id: 'Learning resources', icon: 'book' }] },
];

const quickLinks = [
  { title: 'Government jobs', detail: 'Official recruitment notices', icon: 'briefcase', tint: 'blue' },
  { title: 'Private-sector jobs', detail: 'Roles, internships & more', icon: 'compass', tint: 'violet' },
  { title: 'Eligibility check', detail: 'Understand your fit', icon: 'target', tint: 'mint' },
  { title: 'Career roadmap', detail: 'Your next steps, connected', icon: 'map', tint: 'amber' },
  { title: 'Skills & evidence', detail: 'Build a stronger profile', icon: 'spark', tint: 'rose' },
  { title: 'My applications', detail: 'Keep every application on track', icon: 'file', tint: 'blue' },
];

const defaultProfile = { name: 'Student', goal: '' };
const defaultPreferences = { deadlineReminders: true, productUpdates: false };
const defaultCareerWorkspace = { skills: [], tasks: [], projects: [], resources: [] };

function storageKeyForUser(key) {
  if (key === 'careeros-demo-session' || key === 'careeros-accounts') return key;
  try {
    const email = localStorage.getItem('careeros-demo-session');
    return email && email !== 'active' ? `${key}:${email}` : key;
  } catch {
    return key;
  }
}

function readStoredValue(key) {
  try { return localStorage.getItem(storageKeyForUser(key)); }
  catch { return null; }
}

function readStoredJson(key, fallback, normalize) {
  try {
    const stored = localStorage.getItem(storageKeyForUser(key));
    return stored ? normalize(JSON.parse(stored)) : fallback;
  } catch {
    return fallback;
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(value) {
  return new Uint8Array(value.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)));
}

async function derivePasswordVerifier(password, saltHex) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure password hashing is unavailable in this browser.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: 210000, hash: 'SHA-256' }, key, 256);
  return bytesToHex(new Uint8Array(bits));
}

function readLocalAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem('careeros-accounts') || '[]');
    return Array.isArray(accounts) ? accounts.filter((account) => account && typeof account.email === 'string' && typeof account.salt === 'string' && typeof account.verifier === 'string') : [];
  } catch {
    return [];
  }
}

function normalizeProfile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaultProfile;
  return {
    name: typeof value.name === 'string' && value.name.trim() ? value.name.trim().slice(0, 40) : 'Student',
    goal: typeof value.goal === 'string' ? value.goal.slice(0, 100) : '',
  };
}

function normalizePreferences(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaultPreferences;
  return {
    deadlineReminders: typeof value.deadlineReminders === 'boolean' ? value.deadlineReminders : true,
    productUpdates: typeof value.productUpdates === 'boolean' ? value.productUpdates : false,
  };
}

const applicationStages = ['Saved', 'Preparing', 'Applied', 'Interview', 'Closed'];
const checklistTemplate = ['Review the original listing', 'Confirm eligibility and requirements', 'Prepare required documents'];

function isValidCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeOpportunities(value) {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set();
  return value.reduce((normalized, item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)
      || typeof item.id !== 'string'
      || typeof item.title !== 'string' || !item.title.trim()
      || typeof item.organization !== 'string' || !item.organization.trim()
      || !isSafeSourceUrl(item.sourceUrl)) return normalized;

    const id = item.id.trim().slice(0, 80);
    if (!id || seenIds.has(id)) return normalized;
    seenIds.add(id);
    normalized.push({
      id,
      kind: item.kind === 'government' ? 'government' : 'private',
      title: item.title.trim().slice(0, 120),
      organization: item.organization.trim().slice(0, 120),
      location: typeof item.location === 'string' ? item.location.trim().slice(0, 100) : '',
      sourceUrl: item.sourceUrl.trim(),
      deadline: isValidCalendarDate(item.deadline) ? item.deadline : '',
      notes: typeof item.notes === 'string' ? item.notes.slice(0, 1000) : '',
      stage: applicationStages.includes(item.stage) ? item.stage : 'Saved',
      checklist: Array.isArray(item.checklist) ? checklistTemplate.map((label, index) => item.checklist[index] === true) : [false, false, false],
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : '',
    });
    return normalized;
  }, []);
}

function isSafeSourceUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function writeStoredValue(key, value) {
  try { localStorage.setItem(storageKeyForUser(key), value); return true; }
  catch { return false; }
}

function removeStoredValue(key) {
  try { localStorage.removeItem(storageKeyForUser(key)); return true; }
  catch { return false; }
}

function App() {
  const [active, setActive] = useState('Overview');
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState(() => readStoredJson('careeros-profile', defaultProfile, normalizeProfile));
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftGoal, setDraftGoal] = useState(profile.goal);
  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [signedIn, setSignedIn] = useState(() => {
    const session = readStoredValue('careeros-demo-session');
    return Boolean(session && session !== 'active');
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [accountPreferences, setAccountPreferences] = useState(() => readStoredJson('careeros-preferences', defaultPreferences, normalizePreferences));
  const [opportunities, setOpportunities] = useState(() => readStoredJson('careeros-opportunities', [], normalizeOpportunities));
  const [careerWorkspace, setCareerWorkspace] = useState(() => readStoredJson('careeros-career-workspace', defaultCareerWorkspace, normalizeCareerWorkspace));

  const saveCareerWorkspace = (next) => {
    const normalized = normalizeCareerWorkspace(next);
    const saved = writeStoredValue('careeros-career-workspace', JSON.stringify(normalized));
    setCareerWorkspace(normalized);
    setNotice(saved
      ? 'Your career workspace was saved on this device.'
      : 'Your changes are available for this visit, but browser storage is unavailable.');
    return saved;
  };
  const saveOpportunities = (next) => {
    const normalized = normalizeOpportunities(next);
    const saved = writeStoredValue('careeros-opportunities', JSON.stringify(normalized));
    setOpportunities(normalized);
    setNotice(saved
      ? 'Your opportunity workspace was saved on this device.'
      : 'Your changes are available for this visit, but browser storage is unavailable.');
    return saved;
  };
  const openSection = (name) => { setActive(name); setMobileNav(false); setNotice(''); };
  const handleAuth = async ({ email, password, name, mode }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 10) {
      setLoginError('Enter a valid email and a password of at least 10 characters.');
      return;
    }

    try {
      const accounts = readLocalAccounts();
      let account = accounts.find((item) => item.email === normalizedEmail);
      if (mode === 'register') {
        if (account) {
          setLoginError('An account with this email already exists. Sign in instead.');
          return;
        }
        if (!name.trim()) {
          setLoginError('Enter your name to create an account.');
          return;
        }
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = bytesToHex(salt);
        account = { email: normalizedEmail, salt: saltHex, verifier: await derivePasswordVerifier(password, saltHex), createdAt: new Date().toISOString() };
        localStorage.setItem('careeros-accounts', JSON.stringify([...accounts, account]));
      } else {
        if (!account) {
          setLoginError('No account was found for this email. Create an account first.');
          return;
        }
        const verifier = await derivePasswordVerifier(password, account.salt);
        if (verifier !== account.verifier) {
          setLoginError('The email or password is incorrect.');
          return;
        }
      }

      localStorage.setItem('careeros-demo-session', normalizedEmail);
      if (mode === 'register' && !readStoredJson('careeros-profile', null, normalizeProfile)) {
        writeStoredValue('careeros-profile', JSON.stringify(normalizeProfile({ name, goal: '' })));
      }
      setProfile(readStoredJson('careeros-profile', mode === 'register' ? normalizeProfile({ name, goal: '' }) : defaultProfile, normalizeProfile));
      setAccountPreferences(readStoredJson('careeros-preferences', defaultPreferences, normalizePreferences));
      setOpportunities(readStoredJson('careeros-opportunities', [], normalizeOpportunities));
      setCareerWorkspace(readStoredJson('careeros-career-workspace', defaultCareerWorkspace, normalizeCareerWorkspace));
      setSignedIn(true);
      setLoginPassword('');
      setLoginError('');
      setActive('Overview');
      setNotice('');
    } catch {
      setLoginError('Could not save or verify this local account. Check browser storage and try again.');
    }
  };
  const handleLogout = () => {
    removeStoredValue('careeros-demo-session');
    setSignedIn(false);
    setMobileNav(false);
    setEditingProfile(false);
    setNotice('');
  };
  const savePreferences = (next) => {
    const normalized = normalizePreferences(next);
    const saved = writeStoredValue('careeros-preferences', JSON.stringify(normalized));
    setAccountPreferences(normalized);
    setNotice(saved
      ? 'Notification preferences saved on this device.'
      : 'Preferences were updated for this visit, but browser storage is unavailable.');
    return saved;
  };
  const exportProfile = () => {
    try {
      const blob = new Blob([JSON.stringify({ profile, preferences: accountPreferences, opportunities, careerWorkspace }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'careeros-workspace.json';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice('Your local profile, preferences, opportunity records, and career workspace have been exported.');
    } catch {
      setNotice('The export could not be created. Please try again.');
    }
  };
  const deleteLocalData = () => {
    if (!window.confirm('Clear your locally saved profile, preferences, opportunity records, and career workspace? This cannot be undone.')) return;
    const profileRemoved = removeStoredValue('careeros-profile');
    const preferencesRemoved = removeStoredValue('careeros-preferences');
    const opportunitiesRemoved = removeStoredValue('careeros-opportunities');
    const careerWorkspaceRemoved = removeStoredValue('careeros-career-workspace');
    setOpportunities([]);
    setCareerWorkspace(defaultCareerWorkspace);
    setAccountPreferences(defaultPreferences);
    setProfile(defaultProfile);
    setDraftName(defaultProfile.name);
    setDraftGoal(defaultProfile.goal);
    setNotice(profileRemoved && preferencesRemoved && opportunitiesRemoved && careerWorkspaceRemoved
      ? 'Your local profile, preferences, opportunities, and career workspace have been reset.'
      : 'This workspace was reset for this visit, but browser storage could not be fully updated.');
  };
  const saveProfile = (event) => {
    event.preventDefault();
    const next = normalizeProfile({ name: draftName, goal: draftGoal });
    const saved = writeStoredValue('careeros-profile', JSON.stringify(next));
    setProfile(next);
    setEditingProfile(false);
    setNotice(saved
      ? 'Your profile has been saved on this device.'
      : 'Your profile was updated for this visit, but browser storage is unavailable.');
  };
  const filteredLinks = quickLinks.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase()));
  const savedOpportunityCount = opportunities.filter((item) => item.stage !== 'Closed').length;
  const activeApplicationCount = opportunities.filter((item) => ['Preparing', 'Applied', 'Interview'].includes(item.stage)).length;
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const reminderWindowEnd = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 14)).toISOString().slice(0, 10);
  const upcomingDeadlineCount = opportunities.filter((item) => item.stage !== 'Closed'
    && item.deadline && item.deadline >= todayIso && item.deadline <= reminderWindowEnd).length;
  const noticeIsWarning = /unavailable|could not|only;|not be fully/i.test(notice);

  if (!signedIn) return <AuthPage email={loginEmail} password={loginPassword} error={loginError} setError={setLoginError} setEmail={setLoginEmail} setPassword={setLoginPassword} onSubmit={handleAuth} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <button className="brand" onClick={() => openSection('Overview')} aria-label="CareerOS overview">
          <span className="brand-mark"><Icon name="compass" size={23} /></span><span>Career<span className="brand-os">OS</span></span>
        </button>
        <div className="workspace-label">PERSONAL WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navGroups.map((group) => <div className="nav-group" key={group.label}>
            <p className="nav-heading">{group.label}</p>
            {group.items.map((item) => <button key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => openSection(item.id)}>
              <Icon name={item.icon} size={18} /><span>{item.id}</span>{item.id === 'Government jobs' && <span className="nav-arrow">↗</span>}
            </button>)}
          </div>)}
        </nav>
        <div className="sidebar-bottom">
          <button className={`nav-item ${active === 'Settings' ? 'active' : ''}`} onClick={() => openSection('Settings')}><Icon name="settings" size={18} /><span>Account settings</span></button>
          <button className="nav-item logout-nav" onClick={handleLogout}><Icon name="close" size={18} /><span>Log out</span></button>
          <div className="side-user"><span className="avatar">{profile.name.slice(0, 1).toUpperCase()}</span><span className="side-user-copy"><b>{profile.name}</b><small>Personal workspace</small></span><button className="more-button" aria-label="Edit profile" onClick={() => { setDraftName(profile.name); setDraftGoal(profile.goal); setEditingProfile(true); }}>···</button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation">☰</button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><b>{active}</b></div>
          <div className="top-actions">
            <label className="global-search"><Icon name="search" size={17} /><input aria-label="Filter quick access shortcuts" placeholder="Find a shortcut" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice(!accountPreferences.deadlineReminders
              ? 'Deadline reminders are turned off in account settings.'
              : upcomingDeadlineCount
                ? `${upcomingDeadlineCount} saved opportunit${upcomingDeadlineCount === 1 ? 'y has' : 'ies have'} a deadline within the next 14 days. Review the original listing to confirm dates.`
                : 'No saved opportunity deadlines are due within the next 14 days. CareerOS does not send push or email reminders.') }><Icon name="bell" size={19} /><i /></button>
            <button className="top-avatar" aria-label="Edit profile" onClick={() => { setDraftName(profile.name); setDraftGoal(profile.goal); setEditingProfile(true); }}>{profile.name.slice(0, 1).toUpperCase()}</button>
          </div>
        </header>

        <div className="page-content">
          {notice && <div role={noticeIsWarning ? 'alert' : 'status'} className={`toast ${noticeIsWarning ? 'toast-warning' : ''}`}><Icon name={noticeIsWarning ? 'alert' : 'check'} size={17} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><Icon name="close" size={15} /></button></div>}
          {active === 'Overview' ? <>
            <section className="welcome-row">
              <div><div className="eyebrow"><span className="live-dot" /> YOUR CAREER, IN FOCUS</div><h1>Good morning, {profile.name}.</h1><p className="welcome-subtitle">A clearer path from where you are to where you want to be.</p></div>
              <button className="primary-button" onClick={() => { setDraftName(profile.name); setDraftGoal(profile.goal); setEditingProfile(true); }}><Icon name="plus" size={17} /> Set up your profile</button>
            </section>

            <section className="goal-banner">
              <div className="goal-icon"><Icon name="target" size={21} /></div>
              <div className="goal-copy"><span className="micro-label">CURRENT CAREER GOAL</span><strong>{profile.goal || 'Your next chapter starts with a goal'}</strong><p>{profile.goal ? 'Your career workspace can now connect opportunities to this direction.' : 'Choose a direction to personalize opportunities, skills, and next steps.'}</p></div>
              <button className="text-button" onClick={() => { setDraftName(profile.name); setDraftGoal(profile.goal); setEditingProfile(true); }}>{profile.goal ? 'Edit goal' : 'Add a goal'} <Icon name="arrow" size={16} /></button>
              <div className="banner-orb orb-one"/><div className="banner-orb orb-two"/>
            </section>

            <section className="section-block">
              <div className="section-heading"><div><h2>Quick access</h2><p>Pick up where your career journey needs you.</p></div><span className="section-caption">{filteredLinks.length} SHORTCUTS</span></div>
              {filteredLinks.length ? <div className="quick-grid">{filteredLinks.map((item) => <button className="quick-card" key={item.title} onClick={() => openSection(item.title)}><span className={`quick-icon ${item.tint}`}><Icon name={item.icon} size={21} /></span><span className="quick-title">{item.title}</span><span className="quick-detail">{item.detail}</span><span className="card-arrow"><Icon name="arrow" size={16} /></span></button>)}</div> : <div className="empty-search">No shortcuts match “{query}”. Try another search.</div>}
            </section>

            <section className="insight-grid">
              <article className="panel opportunity-panel">
                <div className="panel-head"><div className="panel-title-icon purple"><Icon name="compass" size={19} /></div><div><h2>Opportunity intelligence</h2><p>Source-linked listings saved for your review.</p></div><button className="quiet-link" onClick={() => openSection('Government jobs')}>Explore <Icon name="arrow" size={15} /></button></div>
                <div className="panel-empty"><span className="empty-illustration"><Icon name="briefcase" size={25} /></span><div><strong>{savedOpportunityCount ? `${savedOpportunityCount} saved listing${savedOpportunityCount === 1 ? '' : 's'}` : 'Your opportunity workspace is ready to grow'}</strong><p>{savedOpportunityCount ? 'Your saved listings and preparation checklists are available in the opportunity workspace.' : 'No live source integrations are configured. Save a listing from its original source to start your own checklist.'}</p><button className="small-button" onClick={() => openSection('Government jobs')}>{savedOpportunityCount ? 'Review saved listings' : 'Explore opportunities'} <Icon name="arrow" size={14} /></button></div></div>
                <div className="source-note"><span className="status-dot"/> Live source integrations are not configured <span className="source-info" title="No current vacancy data is shown unless a verified source is connected.">ⓘ</span></div>
              </article>

              <article className="panel next-panel">
                <div className="panel-head"><div className="panel-title-icon blue"><Icon name="spark" size={19} /></div><div><h2>Your next step</h2><p>Build momentum with one useful action.</p></div></div>
                <div className="next-action"><div className="action-number">01</div><div><span className="action-tag">START HERE</span><strong>{profile.goal ? 'Add your skills and qualifications' : 'Set a career direction'}</strong><p>{profile.goal ? 'A more complete profile makes opportunity matching more transparent.' : 'A goal gives your roadmap and recommendations a starting point.'}</p></div></div>
                <button className="next-button" onClick={() => openSection(profile.goal ? 'My profile' : 'Career goals')}>{profile.goal ? 'Complete your profile' : 'Choose a career goal'} <Icon name="arrow" size={16} /></button>
              </article>
            </section>

            <section className="bottom-grid">
              <article className="panel progress-panel"><div className="panel-head"><div className="panel-title-icon mint"><Icon name="map" size={19} /></div><div><h2>Career roadmap</h2><p>A practical plan, shaped around your goal.</p></div><button className="more-button" aria-label="Open career roadmap" onClick={() => openSection('Career roadmap')}>···</button></div><div className="roadmap-empty"><div className="road-line"><span/></div><div><strong>{careerWorkspace.tasks.length ? `${careerWorkspace.tasks.filter((task) => task.done).length} of ${careerWorkspace.tasks.length} milestones complete` : 'No milestones yet'}</strong><p>{careerWorkspace.tasks.length ? 'Milestone progress reflects tasks you marked complete.' : 'Choose a career goal to start creating meaningful milestones.'}</p><button className="inline-link" onClick={() => openSection('Career roadmap')}>{careerWorkspace.tasks.length ? 'Manage your roadmap' : 'Create a first milestone'} <Icon name="arrow" size={14}/></button></div></div></article>
              <article className="panel applications-panel"><div className="panel-head"><div className="panel-title-icon amber"><Icon name="file" size={19} /></div><div><h2>Application tracker</h2><p>Keep important steps and dates in one place.</p></div><button className="quiet-link" onClick={() => openSection('My applications')}>View all <Icon name="arrow" size={15} /></button></div><div className="application-empty"><span className="empty-calendar"><Icon name="clock" size={22}/></span><div><strong>{activeApplicationCount ? `${activeApplicationCount} in-progress application${activeApplicationCount === 1 ? '' : 's'}` : 'No applications in progress'}</strong><p>{activeApplicationCount ? 'Stages are based on the progress you entered in your tracker.' : 'Move a saved opportunity to Preparing, Applied, or Interview to track it here.'}</p><button className="inline-link" onClick={() => openSection('My applications')}>Open application tracker <Icon name="arrow" size={14}/></button></div></div></article>
            </section>
            <footer className="page-footer"><span>CareerOS <span className="footer-dot">·</span> Career intelligence, with clarity.</span><span>Opportunity details should always be checked against the original source.</span></footer>
          </> : active === 'My profile' ? <ProfilePage profile={profile} onSave={(next) => {
            const normalized = normalizeProfile(next);
            const saved = writeStoredValue('careeros-profile', JSON.stringify(normalized));
            setProfile(normalized);
            setNotice(saved
              ? 'Your profile has been saved on this device.'
              : 'Your profile was updated for this visit, but browser storage is unavailable.');
            return saved;
          }} /> : active === 'Settings' ? <SettingsPage profile={profile} preferences={accountPreferences} onPreferencesChange={savePreferences} onExport={exportProfile} onDeleteLocalData={deleteLocalData} onLogout={handleLogout} /> : ['Career roadmap', 'Skills & evidence', 'Projects & portfolio', 'Learning resources'].includes(active) ? <CareerWorkspace key={active} name={active} workspace={careerWorkspace} onSave={saveCareerWorkspace} /> : ['Government jobs', 'Private-sector jobs', 'My applications'].includes(active) ? <OpportunityPage key={active} name={active} opportunities={opportunities} onSave={saveOpportunities} /> : <SectionPage name={active} onBack={() => openSection('Overview')} onProfile={() => { setDraftName(profile.name); setDraftGoal(profile.goal); setEditingProfile(true); }} />}
        </div>
      </main>

      {mobileNav && <button aria-label="Close navigation" className="mobile-overlay" onClick={() => setMobileNav(false)} />}
      {editingProfile && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditingProfile(false); }}><form className="profile-modal" onSubmit={saveProfile}>
        <div className="modal-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Your career profile</h2></div><button type="button" className="icon-button" aria-label="Close" onClick={() => setEditingProfile(false)}><Icon name="close" size={19}/></button></div>
        <label className="field-label">What should we call you?<input autoFocus maxLength="40" value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Your name" /></label>
        <label className="field-label">What career direction are you exploring?<input maxLength="100" value={draftGoal} onChange={(e) => setDraftGoal(e.target.value)} placeholder="e.g. Biotechnology research" /></label>
        <p className="privacy-note">Your profile is saved locally in this browser. No account or external service is connected.</p>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setEditingProfile(false)}>Cancel</button><button type="submit" className="primary-button">Save profile</button></div>
      </form></div>}
    </div>
  );
}

function AuthPage({ email, password, error, setError, setEmail, setPassword, onSubmit }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const registering = mode === 'register';
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ email, password, name, mode });
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="auth-shell"><section className="auth-card" aria-labelledby="auth-title">
    <div className="auth-brand" aria-label="CareerOS"><span className="brand-mark"><Icon name="compass" size={23} /></span><span>Career<span className="brand-os">OS</span></span></div>
    <span className="eyebrow auth-eyebrow">YOUR CAREER, IN FOCUS</span>
    <h1 id="auth-title">{registering ? 'Create your account' : 'Welcome back'}</h1>
    <p className="auth-intro">{registering ? 'Start a personal career workspace on this device.' : 'Sign in to continue to your personal career workspace.'}</p>
    <div className="demo-notice" role="note"><strong>Local account demo</strong><span>Accounts and workspace data are stored in this browser only. Passwords are locally hashed, but there is no server, account recovery, or secure multi-device sign-in.</span></div>
    <form className="auth-form" onSubmit={submit}>
      {registering && <label className="field-label">Your name<input autoComplete="name" required maxLength="40" value={name} onChange={(event) => { setName(event.target.value); setError(''); }} placeholder="Your name" /></label>}
      <label className="field-label">Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} placeholder="you@example.com" /></label>
      <label className="field-label">Password<input type="password" autoComplete={registering ? 'new-password' : 'current-password'} required minLength="10" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} placeholder="At least 10 characters" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="primary-button auth-submit" disabled={submitting}>{submitting ? 'Please wait…' : registering ? 'Create local account' : 'Sign in'} {!submitting && <Icon name="arrow" size={16} />}</button>
    </form>
    <p className="auth-switch">{registering ? 'Already registered?' : 'First time here?'} <button type="button" disabled={submitting} onClick={() => { setMode(registering ? 'login' : 'register'); setError(''); }}>{registering ? 'Sign in' : 'Create an account'}</button></p>
    <p className="auth-footnote">Your account, profile, and settings stay in this browser only.</p>
  </section></main>;
}

function ProfilePage({ profile, onSave }) {
  const [name, setName] = useState(profile.name || '');
  const [goal, setGoal] = useState(profile.goal || '');
  const [saveMessage, setSaveMessage] = useState('');
  const submit = (event) => {
    event.preventDefault();
    const persisted = onSave({ name: name.trim() || 'Student', goal: goal.trim() }) !== false;
    setSaveMessage(persisted ? 'Saved on this device.' : 'Updated for this visit only; browser storage is unavailable.');
  };
  return <section className="section-page"><div className="eyebrow"><span className="live-dot"/> PERSONAL WORKSPACE</div><h1>Your profile</h1><p className="welcome-subtitle">Keep your career direction and personal details up to date.</p>
    <form className="panel settings-card profile-edit-form" onSubmit={submit}>
      <div className="settings-card-heading"><div><h2>Career profile</h2><p>These details personalize your workspace and recommendations.</p></div><span className="local-badge">Local-only profile</span></div>
      <label className="field-label">Name<input maxLength="40" value={name} onChange={(event) => { setName(event.target.value); setSaveMessage(''); }} placeholder="Your name" /></label>
      <label className="field-label">Career direction<input maxLength="100" value={goal} onChange={(event) => { setGoal(event.target.value); setSaveMessage(''); }} placeholder="e.g. Biotechnology research" /></label>
      <div className="profile-form-footer"><p className="privacy-note">No account service is connected. This information is stored in this browser and is not synced.</p><div className="profile-save-row">{saveMessage && <span className={saveMessage.startsWith('Saved') ? 'save-confirmation' : 'save-warning'} role="status">{saveMessage}</span>}<button className="primary-button" type="submit">Save profile</button></div></div>
    </form>
  </section>;
}

function SettingsPage({ profile, preferences, onPreferencesChange, onExport, onDeleteLocalData, onLogout }) {
  const update = (key) => onPreferencesChange({ ...preferences, [key]: !preferences[key] });
  return <section className="section-page"><div className="eyebrow"><span className="live-dot"/> WORKSPACE PREFERENCES</div><h1>Account settings</h1><p className="welcome-subtitle">Manage your local preferences and CareerOS demo session.</p>
    <div className="settings-stack">
      <section className="panel settings-card"><div className="settings-card-heading"><div><h2>Profile summary</h2><p>Personal details currently stored in this browser.</p></div><span className="local-badge">Local only</span></div><div className="account-summary"><span className="avatar account-avatar">{(profile.name || 'S').slice(0, 1).toUpperCase()}</span><div><strong>{profile.name || 'Student'}</strong><span>{profile.goal || 'No career direction added'}</span></div></div></section>
      <section className="panel settings-card"><div className="settings-card-heading"><div><h2>Notifications</h2><p>Choose which reminders this demo workspace displays.</p></div></div><label className="preference-row"><span><strong>Deadline reminders</strong><small>Show reminders for saved opportunity deadlines when supported.</small></span><input type="checkbox" checked={Boolean(preferences.deadlineReminders)} onChange={() => update('deadlineReminders')} /></label><label className="preference-row"><span><strong>Product updates</strong><small>Opt in to product update preferences. No email service is connected.</small></span><input type="checkbox" checked={Boolean(preferences.productUpdates)} onChange={() => update('productUpdates')} /></label></section>
      <section className="panel settings-card"><div className="settings-card-heading"><div><h2>Data and privacy</h2><p>Export or clear your profile, preferences, saved opportunities, skills, roadmap milestones, projects, and learning links stored on this device.</p></div></div><div className="settings-actions"><button className="secondary-button" type="button" onClick={onExport}>Export my local data</button><button className="danger-button" type="button" onClick={onDeleteLocalData}>Clear local data</button></div><p className="privacy-note">This demo does not provide cloud backup, account recovery, or server-side data deletion.</p></section>
      <section className="panel settings-card"><div className="settings-card-heading"><div><h2>Session</h2><p>End the current demo session on this device.</p></div></div><button className="secondary-button" type="button" onClick={onLogout}>Log out</button><p className="privacy-note">Demo session state is stored locally and is not a secure authentication token.</p></section>
    </div>
  </section>;
}

function SectionPage({ name, onBack, onProfile }) {
  const sectionCopy = {
    'Government jobs': ['Government recruitment intelligence', 'Explore recruitment notices and check every requirement against the original official notification.'],
    'Private-sector jobs': ['Private-sector opportunities', 'Explore roles from employer career pages and authorized feeds, with links back to the original listing.'],
    'Eligibility check': ['Understand your eligibility', 'Compare published requirements with your profile. Unclear or missing details should always stay marked for verification.'],
    'Career roadmap': ['Your career roadmap', 'Connect a career goal to practical skills, learning, project evidence, and next steps.'],
    'Skills & evidence': ['Skills & evidence', 'See what you can demonstrate today and where stronger evidence could help.'],
    'My applications': ['Application tracker', 'Organize saved opportunities, preparation checklists, and application progress in one place.'],
    'My profile': ['Your career profile', 'Add qualifications and experience to make future opportunity assessments more useful.'],
    'Career goals': ['Choose your direction', 'Set a career goal to connect the opportunities you explore with the skills you want to build.'],
    'Projects & portfolio': ['Projects & portfolio', 'Build project evidence that connects your work to the competencies you want to demonstrate.'],
    'Learning resources': ['Learning resources', 'Connect focused learning to the requirements of your next role.'],
    'Settings': ['Workspace settings', 'Manage your personal CareerOS workspace preferences.'],
  };
  const [title, description] = sectionCopy[name] || [name, 'Your CareerOS workspace.'];
  return <section className="section-page"><div className="eyebrow"><span className="live-dot"/> CAREEROS WORKSPACE</div><h1>{title}</h1><p className="welcome-subtitle">{description}</p><div className="section-placeholder panel"><div className="placeholder-icon"><Icon name={name.toLowerCase().includes('job') ? 'briefcase' : 'spark'} size={24}/></div><span className="micro-label">HONEST BY DESIGN</span><h2>This workspace is ready for your information</h2><p>There’s no connected data source or saved information here yet. CareerOS won’t invent job listings, deadlines, qualifications, or progress.</p><div className="placeholder-actions"><button className="primary-button" onClick={name === 'My profile' || name === 'Career goals' ? onProfile : onBack}>{name === 'My profile' || name === 'Career goals' ? 'Set up your profile' : 'Back to overview'} <Icon name="arrow" size={15}/></button>{(name === 'Government jobs' || name === 'Private-sector jobs') && <span className="unavailable-tag"><span className="status-dot"/> Source integrations not configured</span>}</div></div></section>;
}

export default App;
