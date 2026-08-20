import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

// --- Icons ---
const UploadIcon = () => <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;
const TrashIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'add', 'resume', 'skills'
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [editingProjectSlug, setEditingProjectSlug] = useState(null);
  const hideTimeout = useRef(null);
  
  // Resume & Skills State
  const [currentResume, setCurrentResume] = useState(null);
  const [skills, setSkills] = useState([]); // Array of { category: "", items: [] }

  // Project Form State
  const [formData, setFormData] = useState({
    title: '', slug: '', summary: '', thumbnail_url: '', 
    tech_stack: '', accomplishments: [], notable_features: [], 
    future_improvements: [], project_highlights: [],
    live_link: '', github_link: '', video_url: '',
    gallery_images: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }
    
    // Initial Data Fetch
    fetchProjects();
    fetchResume();
    fetchSkills();

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [navigate]);

  // --- Fetch Functions ---
  const fetchProjects = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/projects`);
        setProjects(res.data);
    } catch (err) { console.error("Error fetching projects", err); }
  };

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/resume`);
      setCurrentResume(res.data.url);
    } catch (err) { console.error("Error fetching resume", err); }
  };

  const fetchSkills = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/skills`);
        // Backend returns items as array, we convert to string for the textarea
        const formattedSkills = res.data.map(s => ({
            category: s.category,
            itemsString: s.items.join(', ') 
        }));
        setSkills(formattedSkills);
    } catch (err) { console.error("Error fetching skills", err); }
  };

  // --- Skill Handlers ---
  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const addSkillCategory = () => {
    setSkills([...skills, { category: "New Category", itemsString: "" }]);
  };

  const removeSkillCategory = (index) => {
    if (!window.confirm("Remove this category?")) return;
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const saveSkills = async () => {
    try {
        const token = localStorage.getItem('token');
        // Convert string back to array for backend
        const payload = skills.map(s => ({
            category: s.category,
            items: s.itemsString.split(',').map(i => i.trim()).filter(i => i)
        }));
        
        await axios.post(`${API_URL}/api/skills`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Skills Saved Successfully!");
    } catch (err) {
        alert("Error saving skills");
        console.error(err);
    }
  };

  // --- Standard Handlers ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      navigate('/login');
    }
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

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/upload`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (field === 'gallery_images') {
        setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, res.data.url] }));
      } else {
        setFormData(prev => ({ ...prev, [field]: res.data.url }));
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/resume`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setCurrentResume(res.data.url);
      alert("Resume updated!");
    } catch (err) { alert("Failed"); }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map(s => s.trim()),
    };

    try {
      const token = localStorage.getItem('token');
      if (editingProjectSlug) {
        // Update existing project
        await axios.put(`${API_URL}/api/projects/${editingProjectSlug}`, payload, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        alert("Project Updated!");
        handleCancelEdit();
      } else {
        // Create new project
        await axios.post(`${API_URL}/api/projects`, payload, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        alert("Project Created!");
        setFormData({
          title: '', slug: '', summary: '', thumbnail_url: '', 
          tech_stack: '', accomplishments: [], notable_features: [], 
          future_improvements: [], project_highlights: [],
          live_link: '', github_link: '', video_url: '',
          gallery_images: []
        });
      }
      setActiveTab('projects');
      fetchProjects();
    } catch (err) { alert("Error saving project"); }
  };

  const handleDelete = async (slug) => {
    if(!window.confirm("Delete this project?")) return;
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/projects/${slug}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchProjects();
    } catch(err) { alert("Delete failed"); }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      thumbnail_url: project.thumbnail_url,
      tech_stack: project.tech_stack.join(', '),
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
    // Scroll to form
    setTimeout(() => window.scrollTo(0, 0), 100);
  };

  const handleCancelEdit = () => {
    setEditingProjectSlug(null);
    setFormData({
      title: '', slug: '', summary: '', thumbnail_url: '', 
      tech_stack: '', accomplishments: [], notable_features: [], 
      future_improvements: [], project_highlights: [],
      live_link: '', github_link: '', video_url: '',
      gallery_images: []
    });
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
      <label className="label-text">{label}</label>
      <div className="space-y-2">
        {formData[field].map((point, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={point}
              onChange={(e) => updatePoint(field, idx, e.target.value)}
              placeholder={placeholder}
              className="input-field flex-1"
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
             <p className="text-xs text-slate-500 mt-1">Manage your portfolio</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <button onClick={() => handleNavClick('projects')} className={`nav-btn ${activeTab === 'projects' ? 'active bg-slate-800' : 'hover:bg-slate-800'}`}>
            📋 Projects List
          </button>
          <button onClick={() => handleNavClick('add')} className={`nav-btn ${activeTab === 'add' ? 'active bg-slate-800' : 'hover:bg-slate-800'}`}>
            ➕ Add New Project
          </button>
          <button onClick={() => handleNavClick('skills')} className={`nav-btn ${activeTab === 'skills' ? 'active bg-slate-800' : 'hover:bg-slate-800'}`}>
            ⭐ Manage Skills
          </button>
          <button onClick={() => handleNavClick('resume')} className={`nav-btn ${activeTab === 'resume' ? 'active bg-slate-800' : 'hover:bg-slate-800'}`}>
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
        
        {/* TAB: PROJECTS LIST */}
        {activeTab === 'projects' && (
             <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Your Projects</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-5">Project Name</th>
                                <th className="p-5">Slug</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {projects.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50">
                                    <td className="p-5 font-medium text-slate-900 flex items-center gap-3">
                                        <img src={p.thumbnail_url} className="w-10 h-10 rounded object-cover" alt="" />
                                        {p.title}
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
              <h2 className="text-2xl font-bold text-slate-800">{editingProjectSlug ? 'Edit Project' : 'Add New Project'}</h2>
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
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="label-text">Project Title</label>
                    <input required className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="label-text">Slug (URL)</label>
                    <input required className="input-field" placeholder="e.g. autism-prediction" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                  </div>
                </div>
                <div className="mb-4">
                   <label className="label-text">Short Summary (Home Page)</label>
                   <textarea required rows="3" className="input-field" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
                </div>
                <div className="mb-4">
                   <label className="label-text">Tech Stack (Comma Separated)</label>
                   <input required placeholder="Python, React, MongoDB" className="input-field" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} />
                </div>
                <div>
                   <label className="label-text">Thumbnail Image</label>
                   <div className="flex items-center gap-4 mt-2">
                     <input type="file" onChange={(e) => handleFileUpload(e, 'thumbnail_url')} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 text-sm text-slate-500"/>
                     {formData.thumbnail_url && <img src={formData.thumbnail_url} className="h-12 w-12 rounded object-cover shadow-sm" />}
                   </div>
                </div>
              </div>

              {/* Optional Section */}
              <div className="p-6 bg-gray-50/50 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Detailed Information (Optional)</h3>
                <div className="space-y-4">
                    <PointsList field="accomplishments" label="Accomplishments" placeholder="e.g. Built a machine learning model..." />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <PointsList field="notable_features" label="Notable Features" placeholder="e.g. Real-time data sync" />
                        <PointsList field="future_improvements" label="Future Improvements" placeholder="e.g. Add mobile support" />
                    </div>

                    <PointsList field="project_highlights" label="Project Highlights" placeholder="e.g. Won first place in competition" />

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="label-text">Live Demo Link</label>
                            <input className="input-field" value={formData.live_link} onChange={e => setFormData({...formData, live_link: e.target.value})} />
                        </div>
                        <div>
                            <label className="label-text">GitHub Repo Link</label>
                            <input className="input-field" value={formData.github_link} onChange={e => setFormData({...formData, github_link: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-2">
                        <div>
                            <label className="label-text mb-2 block">Demo Video (Upload)</label>
                            <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video_url')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"/>
                            {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                            {formData.video_url && <p className="text-xs text-green-600 font-bold mt-1">Video Attached ✓</p>}
                        </div>
                        <div>
                             <label className="label-text mb-2 block">Gallery Images</label>
                             <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery_images')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"/>
                             <div className="flex gap-2 mt-2 flex-wrap">
                               {formData.gallery_images.map((img, i) => (
                                 <img key={i} src={img} className="w-10 h-10 rounded object-cover border border-slate-300" />
                               ))}
                             </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="pt-4">
                  <button disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5">
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
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group">
                            <button onClick={() => removeSkillCategory(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition">
                                <TrashIcon />
                            </button>
                            
                            <div className="mb-4">
                                <label className="label-text text-slate-500 uppercase tracking-wider text-xs">Category Name</label>
                                <input 
                                    value={skill.category} 
                                    onChange={(e) => handleSkillChange(index, 'category', e.target.value)} 
                                    className="text-xl font-bold text-slate-800 border-b-2 border-transparent focus:border-blue-500 outline-none w-full bg-transparent placeholder-slate-300 transition"
                                    placeholder="e.g. Programming Languages"
                                />
                            </div>
                            
                            <div>
                                <label className="label-text text-slate-500 uppercase tracking-wider text-xs">Skills List (Comma Separated)</label>
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

// CSS Injection for cleaner JSX
const style = document.createElement('style');
style.textContent = `
  .nav-btn { 
    @apply w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center; 
    position: relative;
  }
  
  .nav-btn.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #3b82f6, #1e40af);
    border-radius: 0 4px 4px 0;
  }
  
  .input-field { @apply w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white; }
  .label-text { @apply block text-sm font-semibold text-slate-700 mb-1; }
`;
document.head.appendChild(style);

export default Admin;