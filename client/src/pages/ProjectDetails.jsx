import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your Render Backend URL
    axios.get(`http://localhost:8000/api/projects/${slug}`)
      .then(res => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching project", err);
        setLoading(false);
      });
  }, [slug]);

  // --- Helper to fix lists that might be single strings with \n ---
  const parseList = (list) => {
    if (!list) return [];
    if (Array.isArray(list)) {
       // Handle case where array items might themselves contain newlines
       return list.flatMap(item => item.split('\n')).filter(item => item.trim() !== '');
    }
    if (typeof list === 'string') {
       return list.split('\n').filter(item => item.trim() !== '');
    }
    return [];
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
  
  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h2 className="text-4xl font-bold text-slate-800 mb-4">Project not found</h2>
      <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center gap-2">
        <span>&larr;</span> Return Home
      </Link>
    </div>
  );

  // Process lists for display
  const notableFeatures = parseList(project.notable_features);
  const futureImprovements = parseList(project.future_improvements);
  const highlights = parseList(project.project_highlights);
  const accomplishments = parseList(project.accomplishments); // <--- Parsed as list

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Section */}
        <header className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase rounded-full mb-6 shadow-sm">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             Project Showcase
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
            {project.summary}
          </p>
        </header>

        {/* Main Hero Image */}
        <div className="group relative bg-white p-3 rounded-3xl shadow-2xl shadow-slate-200/50 mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition duration-700"></div>
          <img 
            src={project.thumbnail_url} 
            alt={project.title} 
            className="relative w-full h-auto rounded-2xl object-cover max-h-[700px] border border-slate-100"
          />
        </div>

        {/* Grid Layout for Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* Left Column: Tech Stack (Sticky) */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl lg:sticky lg:top-32">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                    {project.tech_stack && project.tech_stack.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>
                
                {/* Quick Actions in Sidebar */}
                <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col gap-3">
                   {project.live_link && (
                    <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-500 transition font-bold shadow-lg shadow-blue-900/50">
                      Live Demo ↗
                    </a>
                   )}
                   {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-3 rounded-xl hover:bg-slate-700 transition font-bold">
                      View Source Code
                    </a>
                   )}
                </div>
             </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* --- ACCOMPLISHMENTS (Now a List) --- */}
            {accomplishments.length > 0 && (
                <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-600">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        Key Accomplishments
                    </h2>
                    <ul className="space-y-4">
                        {accomplishments.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-4">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                <span className="text-lg text-slate-700 leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* --- HIGHLIGHTS --- */}
            {highlights.length > 0 && (
               <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                       <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                       </span>
                       Project Highlights
                   </h2>
                   <ul className="grid sm:grid-cols-2 gap-6">
                      {highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <span className="text-orange-500 mt-0.5 font-bold">✓</span>
                              <span className="text-slate-700 text-sm font-medium leading-relaxed">{highlight}</span>
                          </li>
                      ))}
                   </ul>
               </section>
            )}

            {/* --- FEATURES & IMPROVEMENTS GRID --- */}
            {(notableFeatures.length > 0 || futureImprovements.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                  {notableFeatures.length > 0 && (
                      <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                          <h3 className="font-bold text-xl mb-6 text-blue-800">Notable Features</h3>
                          <ul className="space-y-3">
                              {notableFeatures.map((f, i) => (
                                  <li key={i} className="flex items-start gap-3 text-slate-700">
                                      <span className="text-blue-500 font-bold">•</span>
                                      <span>{f}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
                  
                  {futureImprovements.length > 0 && (
                      <div className="bg-purple-50/50 p-8 rounded-3xl border border-purple-100">
                          <h3 className="font-bold text-xl mb-6 text-purple-800">Future Roadmap</h3>
                          <ul className="space-y-3">
                              {futureImprovements.map((f, i) => (
                                  <li key={i} className="flex items-start gap-3 text-slate-700">
                                      <span className="text-purple-500 font-bold">→</span>
                                      <span>{f}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Video Demo Section */}
        {project.video_url && (
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px bg-slate-200 flex-1"></div>
               <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                   <span className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-lg">▶</span>
                   Video Demo
               </h2>
               <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="bg-slate-900 p-2 rounded-3xl shadow-2xl">
                 <div className="rounded-2xl overflow-hidden aspect-video relative">
                     <video controls src={project.video_url} className="w-full h-full object-contain bg-black" />
                 </div>
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {project.gallery_images && project.gallery_images.length > 0 && (
             <section className="mb-24">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <h2 className="text-3xl font-bold text-slate-800">Project Gallery</h2>
                    <div className="h-px bg-slate-200 flex-1"></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {project.gallery_images.map((img, i) => (
                         <div key={i} className="group overflow-hidden rounded-2xl border border-slate-200 shadow-sm relative">
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition z-10 pointer-events-none"></div>
                             <img src={img} alt={`Gallery ${i}`} className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-700"/>
                         </div>
                     ))}
                 </div>
             </section>
        )}

        {/* Bottom Navigation */}
        <div className="text-center pt-12 border-t border-slate-200">
             <Link to="/#projects" className="inline-flex items-center gap-3 text-slate-500 hover:text-blue-600 font-bold text-lg transition-all hover:-translate-x-1">
               <span>&larr;</span> Back to All Projects
             </Link>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;