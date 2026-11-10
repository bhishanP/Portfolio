import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

// --- Icons ---
const UploadIcon = () => <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const TrashIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

const EMPTY_FORM = {
  title: '', slug: '', summary: '', thumbnail_url: '',
  tech_stack: '', accomplishments: [], notable_features: [],
  future_improvements: [], project_highlights: [],
  live_link: '', github_link: '', video_url: '',
  gallery_images: [],
  track: 'Both',
  paper_link: ''
};

const DEFAULT_PROFILE = {
  availability_badge: "Available for Hire",
  collaboration_status: "Actively Searching for Researcher for collaboration",
  current_status: "Open to Work & Research",
  hero_title_prefix: "Hi, I'm",
  hero_name: "Bhishan",
  hero_subtitle: "AI Engineer & Machine Learning Researcher",
  hero_bio: "Bridging production-grade software engineering and applied machine learning research. Building intelligent systems from conceptual research to scalable deployment.",
  industry_summary: "Full-stack development, scalable backend architecture, and production-ready machine learning services engineered for industry scale.",
  research_summary: "Exploring natural language processing, LLM domain fine-tuning (PEFT/LoRA), retrieval-augmented architectures, and clinical AI diagnostics.",
  research_interests: [
    "LLMs & Parameter-Efficient Fine-Tuning (PEFT/LoRA)",
    "Domain-Specific Retrieval-Augmented Generation (RAG)",
    "Constitutional AI & Domain Adaptation",
    "Clinical & Medical AI Diagnostics",
    "Cryptographic Integrity & Decentralized Systems"
  ],
  stats: [
    { label: "Years Coding", value: "4+" },
    { label: "Projects Done", value: "11+" },
    { label: "Research Domains", value: "4+" }
  ],
  hero_image_url: "https://bhishanpangeni.com.np/images/BhishanPangeni_photo_half.jpg",
  show_collab_banner: true,
  collab_banner_title: "Interested in Research Collaboration?",
  collab_banner_text: "I am actively seeking researchers, co-authors, and lab collaborators for empirical machine learning studies, paper submissions, and open-source benchmarks. If you're working on NLP, healthcare AI, or applied deep learning, let's talk!",
  contact_email: "bhishanpangeni2003@gmail.com"
};

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'projects', 'add', 'skills', 'resume'
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [editingProjectSlug, setEditingProjectSlug] = useState(null);
  const hideTimeout = useRef(null);
  
  // Profile State
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  // Resume & Skills State
  const [currentResume, setCurrentResume] = useState(null);
  const [skills, setSkills] = useState([]);

  // Project Form State
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchProjects();
    fetchResume();
    fetchSkills();

    return () => { if (hideTimeout.current) clearTimeout(hideTimeout.current); };
  }, [navigate]);

  // --- Fetch Functions ---
  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile');
      if (res.data && Object.keys(res.data).length > 0) {
        setProfile(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const fetchResume = async () => {
    try {
      const res = await api.get('/api/resume');
      setCurrentResume(res.data.url);
    } catch (err) {
      console.error("Error fetching resume", err);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get('/api/skills');
      const formatted = res.data.map(s => ({
        category: s.category,
        itemsString: s.items.join(', ')
      }));
      setSkills(formatted);
    } catch (err) {
      console.error("Error fetching skills", err);
    }
  };

  // --- Profile Handlers ---
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index, field, value) => {
    setProfile(prev => {
      const updated = [...prev.stats];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, stats: updated };
    });
  };

  const addStat = () => {
    setProfile(prev => ({
      ...prev,
      stats: [...prev.stats, { label: "New Metric", value: "1+" }]
    }));
  };

  const removeStat = (index) => {
    setProfile(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handleInterestChange = (index, value) => {
    setProfile(prev => {
      const updated = [...prev.research_interests];
      updated[index] = value;
      return { ...prev, research_interests: updated };
    });
  };

  const addInterest = () => {
    setProfile(prev => ({
      ...prev,
      research_interests: [...prev.research_interests, "New Research Domain"]
    }));
  };

  const removeInterest = (index) => {
    setProfile(prev => ({
      ...prev,
      research_interests: prev.research_interests.filter((_, i) => i !== index)
    }));
  };

  const saveProfile = async () => {
    const toastId = toast.loading("Saving profile settings...");
    try {
      await api.post('/api/profile', profile);
      toast.success("Profile & Hero settings updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to save profile settings.", { id: toastId });
      console.error(err);
    }
  };

  const handleHeroPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      const res = await api.post('/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, hero_image_url: res.data.url }));
      toast.success("Photo uploaded and updated!", { id: toastId });
    } catch (err) {
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // --- Skill Handlers ---
  const handleSkillChange = (index, field, value) => {
    setSkills(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSkillCategory = () => {
    setSkills(prev => [...prev, { category: "New Category", itemsString: "" }]);
  };

  const removeSkillCategory = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const saveSkills = async () => {
    const toastId = toast.loading("Saving skills...");
    try {
      const payload = skills.map(s => ({
        category: s.category,
        items: s.itemsString.split(',').map(i => i.trim()).filter(Boolean)
      }));
      await api.post('/api/skills', payload);
      toast.success("Skills saved successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to save skills.", { id: toastId });
      console.error(err);
    }
  };

  // --- Standard Handlers ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setSidebarVisible(false), 2000);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    const toastId = toast.loading("Uploading file...");

    try {
      const res = await api.post('/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (field === 'gallery_images') {
        setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, res.data.url] }));
      } else {
        setFormData(prev => ({ ...prev, [field]: res.data.url }));
      }
      toast.success("File uploaded!", { id: toastId });
    } catch (error) {
      toast.error("Upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    const toastId = toast.loading("Uploading resume...");
    try {
      const res = await api.post('/api/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentResume(res.data.url);
      toast.success("Resume updated successfully!", { id: toastId });
    } catch (err) {
      toast.error("Resume upload failed.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
    };
    const toastId = toast.loading(editingProjectSlug ? "Updating project..." : "Publishing project...");
    try {
      if (editingProjectSlug) {
        await api.put(`/api/projects/${editingProjectSlug}`, payload);
        toast.success("Project updated!", { id: toastId });
        handleCancelEdit();
      } else {
        await api.post('/api/projects', payload);
        toast.success("Project published!", { id: toastId });
        setFormData({ ...EMPTY_FORM });
      }
      setActiveTab('projects');
      fetchProjects();
    } catch (err) {
      toast.error("Failed to save project.", { id: toastId });
    }
  };

  const handleDelete = async (slug) => {
    toast((t) => (
      <span className="flex items-center gap-3">
        <span>Delete <strong>{slug}</strong>?</span>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            const toastId = toast.loading("Deleting...");
            try {
              await api.delete(`/api/projects/${slug}`);
              fetchProjects();
              toast.success("Project deleted.", { id: toastId });
            } catch {
              toast.error("Delete failed.", { id: toastId });
            }
          }}
          className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg"
        >
          Confirm
        </button>
        <button onClick={() => toast.dismiss(t.id)} className="text-slate-500 text-xs font-medium">
          Cancel
        </button>
      </span>
    ), { duration: 6000 });
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      thumbnail_url: project.thumbnail_url,
      tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      track: project.track || 'Both',
      paper_link: project.paper_link || '',
      accomplishments: project.accomplishments || [],
      notable_features: project.notable_features || [],
      future_improvements: project.future_improvements || [],
      project_highlights: project.project_highlights || [],
      live_link: project.live_link || '',
      github_link: project.github_link || '',
      video_url: project.video_url || '',
      gallery_images: project.gallery_images || []
    });
    setEditingProjectSlug(project.slug);
    setActiveTab('add');
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const handleCancelEdit = () => {
    setEditingProjectSlug(null);
    setFormData({ ...EMPTY_FORM });
  };

  // Helper: Add/Remove points from lists
  const addPoint = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removePoint = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updatePoint = (field, index, value) => {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  // Point list UI component
  const PointsList = ({ field, label, placeholder }) => (
    <div>
      <label className="admin-label">{label}</label>
      <div className="space-y-2">
        {formData[field].map((point, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={point}
              onChange={(e) => updatePoint(field, idx, e.target.value)}
              placeholder={placeholder}
              className="admin-input-field flex-1"
            />
            <button
              type="button"
              onClick={() => removePoint(field, idx)}
              className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => addPoint(field)}
        className="mt-2 w-full py-2 border border-dashed border-blue-300 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition text-sm"
      >
        + Add {label}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside
        onMouseEnter={() => { if (hideTimeout.current) { clearTimeout(hideTimeout.current); hideTimeout.current = null; } setSidebarVisible(true); }}
        onMouseLeave={() => { if (hideTimeout.current) clearTimeout(hideTimeout.current); setSidebarVisible(false); }}
        className={`w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-10 transform transition-transform duration-300 ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-slate-800">
             <h1 className="font-bold text-xl tracking-wider text-blue-400">ADMIN PANEL</h1>
             <p className="text-xs text-slate-500 mt-1">Dual-Track Portfolio Control</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <button onClick={() => handleNavClick('profile')} className={`nav-btn ${activeTab === 'profile' ? 'active bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}>
            ⚙️ Profile & Status
          </button>
          <button onClick={() => handleNavClick('projects')} className={`nav-btn ${activeTab === 'projects' ? 'active bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}>
            📋 Projects & Research
          </button>
          <button onClick={() => handleNavClick('add')} className={`nav-btn ${activeTab === 'add' ? 'active bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}>
            ➕ Add New Project
          </button>
          <button onClick={() => handleNavClick('skills')} className={`nav-btn ${activeTab === 'skills' ? 'active bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}>
            ⭐ Manage Skills
          </button>
          <button onClick={() => handleNavClick('resume')} className={`nav-btn ${activeTab === 'resume' ? 'active bg-slate-800 text-blue-400' : 'hover:bg-slate-800 text-slate-300'}`}>
            📄 Resume Manager
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200">
                <LogoutIcon /> Logout
            </button>
        </div>
      </aside>

      {/* left-edge hover zone */}
      <div
        onMouseEnter={() => { if (hideTimeout.current) { clearTimeout(hideTimeout.current); hideTimeout.current = null; } setSidebarVisible(true); }}
        className={`fixed top-0 left-0 h-full ${sidebarVisible ? 'w-0' : 'w-5'} z-50`}
        aria-hidden
      />

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 p-10 overflow-y-auto transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'}`}>
        
        {/* TAB: PROFILE & STATUS SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Profile, Hero & Status Control</h2>
                <p className="text-slate-500 text-sm mt-1">Configure your real-time availability badges, research collaboration callouts, and dual-track copy.</p>
              </div>
              <button 
                onClick={saveProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
              >
                💾 Save Profile Settings
              </button>
            </div>

            {/* Availability Badges Card */}
            <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest border-b pb-3">Real-Time Badges & Status Pills</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="admin-label">Primary Availability Badge</label>
                  <input 
                    className="admin-input-field" 
                    value={profile.availability_badge} 
                    onChange={e => handleProfileChange('availability_badge', e.target.value)} 
                    placeholder="e.g. Available for Hire"
                  />
                  <p className="text-xs text-slate-400 mt-1">Shown at the top of Hero (blue pill)</p>
                </div>

                <div>
                  <label className="admin-label">Collaboration Status Badge</label>
                  <input 
                    className="admin-input-field" 
                    value={profile.collaboration_status} 
                    onChange={e => handleProfileChange('collaboration_status', e.target.value)} 
                    placeholder="e.g. Actively Searching for Researcher for collaboration"
                  />
                  <p className="text-xs text-slate-400 mt-1">Shown next to availability badge (purple pill)</p>
                </div>
              </div>

              <div>
                <label className="admin-label">Current Status Tag (Photo Pill)</label>
                <input 
                  className="admin-input-field" 
                  value={profile.current_status} 
                  onChange={e => handleProfileChange('current_status', e.target.value)} 
                  placeholder="e.g. Open to Work & Research"
                />
                <p className="text-xs text-slate-400 mt-1">Float badge over your hero picture</p>
              </div>
            </div>

            {/* Hero Main Copy */}
            <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-3">Hero Content</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="admin-label">Greeting Prefix</label>
                  <input 
                    className="admin-input-field" 
                    value={profile.hero_title_prefix} 
                    onChange={e => handleProfileChange('hero_title_prefix', e.target.value)} 
                  />
                </div>
                <div>
                  <label className="admin-label">Display Name</label>
                  <input 
                    className="admin-input-field font-bold" 
                    value={profile.hero_name} 
                    onChange={e => handleProfileChange('hero_name', e.target.value)} 
                  />
                </div>
                <div>
                  <label className="admin-label">Subtitle / Roles</label>
                  <input 
                    className="admin-input-field" 
                    value={profile.hero_subtitle} 
                    onChange={e => handleProfileChange('hero_subtitle', e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Hero Bio Summary</label>
                <textarea 
                  rows="3"
                  className="admin-input-field" 
                  value={profile.hero_bio} 
                  onChange={e => handleProfileChange('hero_bio', e.target.value)} 
                />
              </div>

              <div>
                <label className="admin-label">Hero Image URL</label>
                <div className="flex items-center gap-4">
                  <input 
                    className="admin-input-field flex-1" 
                    value={profile.hero_image_url} 
                    onChange={e => handleProfileChange('hero_image_url', e.target.value)} 
                  />
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition border border-slate-200 flex-shrink-0">
                    {uploading ? 'Uploading...' : 'Upload New'}
                    <input type="file" accept="image/*" onChange={handleHeroPhotoUpload} className="hidden" />
                  </label>
                  {profile.hero_image_url && (
                    <img src={profile.hero_image_url} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                  )}
                </div>
              </div>
            </div>

            {/* Dual Track Cards Configuration */}
            <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b pb-3">Dual-Track Presentation (Industry vs. Research)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <span className="font-bold text-blue-900 text-sm">🏢 Industry Experience Card Copy</span>
                  <textarea 
                    rows="3"
                    className="admin-input-field text-sm" 
                    value={profile.industry_summary} 
                    onChange={e => handleProfileChange('industry_summary', e.target.value)} 
                  />
                  <p className="text-xs text-blue-600">Summarizes your engineering & full-stack focus</p>
                </div>

                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                  <span className="font-bold text-purple-900 text-sm">🔬 Academic & AI Research Card Copy</span>
                  <textarea 
                    rows="3"
                    className="admin-input-field text-sm" 
                    value={profile.research_summary} 
                    onChange={e => handleProfileChange('research_summary', e.target.value)} 
                  />
                  <p className="text-xs text-purple-600">Summarizes your research, papers & NLP/LLM focus</p>
                </div>
              </div>
            </div>

            {/* Research Interests Tags */}
            <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xs font-bold text-purple-800 uppercase tracking-widest">Research Interests & Focus Domains</h3>
                <button 
                  type="button"
                  onClick={addInterest}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200"
                >
                  + Add Research Interest
                </button>
              </div>

              <div className="space-y-2">
                {profile.research_interests.map((interest, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      type="text"
                      className="admin-input-field flex-1 text-sm"
                      value={interest}
                      onChange={e => handleInterestChange(idx, e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeInterest(idx)}
                      className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Counters */}
            <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Hero Stat Counters</h3>
                <button 
                  type="button"
                  onClick={addStat}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200"
                >
                  + Add Stat Counter
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.stats.map((stat, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative group">
                    <button 
                      type="button" 
                      onClick={() => removeStat(idx)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-500 text-xs font-bold"
                    >
                      ✕
                    </button>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Value (e.g. 4+)</label>
                      <input 
                        className="admin-input-field text-lg font-black"
                        value={stat.value}
                        onChange={e => handleStatChange(idx, 'value', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Label (e.g. Years Coding)</label>
                      <input 
                        className="admin-input-field text-xs font-medium"
                        value={stat.label}
                        onChange={e => handleStatChange(idx, 'label', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Collaboration Section Banner Settings */}
            <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-widest border-b pb-3">Dedicated Research Collaboration Banner</h3>
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="show_collab" 
                  checked={profile.show_collab_banner} 
                  onChange={e => handleProfileChange('show_collab_banner', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="show_collab" className="text-sm font-bold text-slate-800 cursor-pointer">
                  Display Research Collaboration Section on Home Page
                </label>
              </div>

              <div>
                <label className="admin-label">Banner Title</label>
                <input 
                  className="admin-input-field font-bold" 
                  value={profile.collab_banner_title} 
                  onChange={e => handleProfileChange('collab_banner_title', e.target.value)} 
                />
              </div>

              <div>
                <label className="admin-label">
                  Banner Pitch & Call to Action <span className="text-xs text-purple-600 font-normal">(Markdown Supported: **bold**, - bullet points, links, etc.)</span>
                </label>
                <textarea 
                  rows="6"
                  className="admin-input-field font-mono text-sm leading-relaxed" 
                  value={profile.collab_banner_text} 
                  onChange={e => handleProfileChange('collab_banner_text', e.target.value)} 
                  placeholder="I am actively looking to collaborate on:&#10;- Benchmark evaluations&#10;- **Trustworthy agentic workflows**&#10;- AI for Education"
                />
              </div>

              <div>
                <label className="admin-label">Collaboration Contact Email</label>
                <input 
                  type="email"
                  className="admin-input-field" 
                  value={profile.contact_email} 
                  onChange={e => handleProfileChange('contact_email', e.target.value)} 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={saveProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
              >
                💾 Save All Profile & Hero Settings
              </button>
            </div>

          </div>
        )}

        {/* TAB: PROJECTS LIST */}
        {activeTab === 'projects' && (
             <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Your Projects & Research</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage both industry solutions and research preprints.</p>
                  </div>
                  <button onClick={() => setActiveTab('add')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition">
                    + Add New Project
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-5">Project Name</th>
                                <th className="p-5">Track</th>
                                <th className="p-5">Slug</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {projects.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50">
                                    <td className="p-5 font-medium text-slate-900 flex items-center gap-3">
                                        <img src={p.thumbnail_url} loading="lazy" className="w-10 h-10 rounded object-cover" alt="" />
                                        <span>{p.title}</span>
                                    </td>
                                    <td className="p-5">
                                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                        p.track === 'Research' ? 'bg-purple-100 text-purple-700' :
                                        p.track === 'Industry' ? 'bg-blue-100 text-blue-700' :
                                        'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        {p.track || 'Both'}
                                      </span>
                                    </td>
                                    <td className="p-5 text-slate-500">{p.slug}</td>
                                    <td className="p-5 text-right flex items-center justify-end gap-2">
                                        <button onClick={() => handleEdit(p)} className="text-blue-500 hover:bg-blue-50 px-4 py-2 rounded-lg transition text-sm font-medium">Edit</button>
                                        <button onClick={() => handleDelete(p.slug)} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition text-sm font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {projects.length === 0 && <div className="p-10 text-center text-gray-500">No projects found.</div>}
                </div>
             </div>
        )}
        
        {/* TAB: ADD PROJECT */}
        {activeTab === 'add' && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{editingProjectSlug ? 'Edit Project / Research' : 'Add New Project / Research'}</h2>
              {editingProjectSlug && (
                <button onClick={handleCancelEdit} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                  ✕ Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Compulsory Section */}
              <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4">Compulsory Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div className="md:col-span-2">
                    <label className="admin-label">Project Title</label>
                    <input required className="admin-input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="admin-label">Category / Track</label>
                    <select 
                      className="admin-input-field" 
                      value={formData.track} 
                      onChange={e => setFormData({...formData, track: e.target.value})}
                    >
                      <option value="Both">✨ Both (Research & Engineering)</option>
                      <option value="Research">🔬 Academic & AI Research</option>
                      <option value="Industry">🏢 Industry & Production</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="admin-label">Slug (URL)</label>
                    <input required className="admin-input-field" placeholder="e.g. autism-prediction" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                  </div>
                  <div>
                    <label className="admin-label">Research Paper / Preprint Link (Optional)</label>
                    <input className="admin-input-field" placeholder="https://arxiv.org/abs/..." value={formData.paper_link} onChange={e => setFormData({...formData, paper_link: e.target.value})} />
                  </div>
                </div>

                <div className="mb-4">
                   <label className="admin-label">Short Summary (Home Page)</label>
                   <textarea required rows="3" className="admin-input-field" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
                </div>
                <div className="mb-4">
                   <label className="admin-label">Tech Stack (Comma Separated)</label>
                   <input required placeholder="Python, React, MongoDB" className="admin-input-field" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} />
                </div>
                <div>
                   <label className="admin-label">Thumbnail Image</label>
                   <div className="flex items-center gap-4 mt-2">
                     <input type="file" onChange={(e) => handleFileUpload(e, 'thumbnail_url')} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 text-sm text-slate-500"/>
                     {formData.thumbnail_url && <img src={formData.thumbnail_url} loading="lazy" className="h-12 w-12 rounded object-cover shadow-sm" alt="Thumbnail preview" />}
                   </div>
                </div>
              </div>

              {/* Optional Section */}
              <div className="p-6 bg-gray-50/50 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Detailed Information (Optional)</h3>
                <div className="space-y-4">
                    <PointsList field="accomplishments" label="Accomplishments / Findings" placeholder="e.g. Fine-tuned Gemma model on legal text..." />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <PointsList field="notable_features" label="Notable Features / Methodology" placeholder="e.g. FAISS semantic retrieval" />
                        <PointsList field="future_improvements" label="Future Roadmap & Research Directions" placeholder="e.g. Evaluate against human benchmarks" />
                    </div>

                    <PointsList field="project_highlights" label="Project Highlights" placeholder="e.g. Presented at academic symposium" />

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="admin-label">Live Demo Link</label>
                            <input className="admin-input-field" value={formData.live_link} onChange={e => setFormData({...formData, live_link: e.target.value})} />
                        </div>
                        <div>
                            <label className="admin-label">GitHub Repo Link</label>
                            <input className="admin-input-field" value={formData.github_link} onChange={e => setFormData({...formData, github_link: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-2">
                        <div>
                            <label className="admin-label mb-2 block">Demo Video (Upload)</label>
                            <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video_url')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"/>
                            {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                            {formData.video_url && <p className="text-xs text-green-600 font-bold mt-1">Video Attached ✓</p>}
                        </div>
                        <div>
                             <label className="admin-label mb-2 block">Gallery Images</label>
                             <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery_images')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"/>
                             <div className="flex gap-2 mt-2 flex-wrap">
                               {formData.gallery_images.map((img, i) => (
                                 <img key={i} src={img} loading="lazy" className="w-10 h-10 rounded object-cover border border-slate-300" alt={`Gallery ${i + 1}`} />
                               ))}
                             </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="pt-4">
                  <button disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    {uploading ? 'Uploading Files...' : editingProjectSlug ? '💾 Update Project' : '🚀 Publish Project'}
                  </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: SKILLS MANAGER */}
        {activeTab === 'skills' && (
             <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                     <h2 className="text-3xl font-bold text-slate-800">Manage Skills</h2>
                     <button onClick={saveSkills} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-green-600/30 transition">
                         Save Changes
                     </button>
                </div>

                <div className="grid gap-6">
                    {skills.map((skill, index) => (
                        <div key={skill.category || index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group">
                            <button onClick={() => removeSkillCategory(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition">
                                <TrashIcon />
                            </button>
                            
                            <div className="mb-4">
                                <label className="admin-label text-slate-500 uppercase tracking-wider text-xs">Category Name</label>
                                <input 
                                    value={skill.category} 
                                    onChange={(e) => handleSkillChange(index, 'category', e.target.value)} 
                                    className="text-xl font-bold text-slate-800 border-b-2 border-transparent focus:border-blue-500 outline-none w-full bg-transparent placeholder-slate-300 transition"
                                    placeholder="e.g. Programming Languages"
                                />
                            </div>
                            
                            <div>
                                <label className="admin-label text-slate-500 uppercase tracking-wider text-xs">Skills List (Comma Separated)</label>
                                <textarea 
                                    value={skill.itemsString} 
                                    onChange={(e) => handleSkillChange(index, 'itemsString', e.target.value)} 
                                    rows="2"
                                    className="w-full mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="e.g. Python, Java, C++"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={addSkillCategory} className="mt-8 w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition">
                    + Add New Skill Category
                </button>
             </div>
        )}

        {/* TAB: RESUME */}
        {activeTab === 'resume' && (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-100 mt-10">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Resume Manager</h2>
            <p className="text-slate-500 mb-8">Update the PDF that users download from your site.</p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 hover:bg-slate-50 transition duration-300 group">
               <div className="flex justify-center"><UploadIcon /></div>
               <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" id="resume-upload" />
               <label htmlFor="resume-upload" className="cursor-pointer inline-block mt-4 bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-full font-semibold shadow-sm group-hover:border-blue-500 group-hover:text-blue-600 transition">
                 {uploading ? "Uploading..." : "Select New PDF"}
               </label>
            </div>

            {currentResume && (
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100 inline-flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-green-800 font-medium text-sm">Active Resume Available</p>
                <a href={currentResume} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline hover:text-blue-800 ml-2">View</a>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
