import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import Resume from '../components/Resume';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Research', 'Industry'

  useEffect(() => {
    Promise.all([
      api.get('/api/projects').catch(err => { console.error("Error fetching projects:", err); return { data: [] }; }),
      api.get('/api/profile').catch(err => { console.error("Error fetching profile:", err); return { data: null }; })
    ]).then(([projRes, profRes]) => {
      setProjects(projRes.data || []);
      if (profRes.data) setProfile(profRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleHeroTrackSelect = (track) => {
    setActiveFilter(track);
    const element = document.getElementById('projects');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter projects by track
  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Research') return p.track === 'Research' || p.track === 'Both';
    if (activeFilter === 'Industry') return p.track === 'Industry' || p.track === 'Both';
    return true;
  });

  const researchCount = projects.filter(p => p.track === 'Research' || p.track === 'Both').length;
  const industryCount = projects.filter(p => p.track === 'Industry' || p.track === 'Both').length;

  return (
    <div className="bg-slate-50">
      <Hero onSelectTrack={handleHeroTrackSelect} />
      
      {/* Research Collaboration & Focus Banner */}
      {profile && profile.show_collab_banner !== false && (
        <section id="collaboration" className="py-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="container mx-auto px-6 relative z-10 max-w-5xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold tracking-wide border border-purple-400/30">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                  Academic & Open-Source Collaboration
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white">
                  {profile.collab_banner_title || "Interested in Research Collaboration?"}
                </h2>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="space-y-1.5 my-2.5 list-disc list-inside text-slate-300 pl-1">{children}</ul>,
                      ol: ({ children }) => <ol className="space-y-1.5 my-2.5 list-decimal list-inside text-slate-300 pl-1">{children}</ol>,
                      li: ({ children }) => <li className="text-slate-300 leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200 transition">
                          {children}
                        </a>
                      ),
                      code: ({ children }) => (
                        <code className="px-1.5 py-0.5 bg-purple-900/60 rounded text-purple-200 text-xs font-mono border border-purple-700/50">
                          {children}
                        </code>
                      )
                    }}
                  >
                    {profile.collab_banner_text || "I am actively seeking researchers, co-authors, and lab collaborators for empirical machine learning studies, paper submissions, and open-source benchmarks."}
                  </ReactMarkdown>
                </div>

                {/* Research Interests Chips */}
                {profile.research_interests && profile.research_interests.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs uppercase tracking-wider text-purple-300 font-bold mb-2.5">
                      Current Research Domains:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {profile.research_interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium rounded-lg border border-white/15 transition backdrop-blur-sm">
                          🔬 {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Call to action button */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                <a 
                  href={`mailto:${profile.contact_email || 'bhishanpangeni2003@gmail.com'}?subject=Research%20Collaboration%20Inquiry`}
                  className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-center transition-all shadow-lg shadow-purple-600/40 hover:-translate-y-0.5 text-sm"
                >
                  Propose Collaboration &rarr;
                </a>
                <a 
                  href="#contact" 
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-center font-medium border border-white/20 transition text-sm"
                >
                  Send a Message
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section with Dual-Track Filter */}
      <section id="projects" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
             <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3">
               Dual-Track Portfolio
             </div>
             <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Featured Projects & Research</h2>
             <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
             <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-base">
               Explore production-grade software engineering, applied deep learning research, and interactive AI systems.
             </p>

             {/* Interactive Track Filter Tabs */}
             <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
               <button
                 onClick={() => setActiveFilter('All')}
                 className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                   activeFilter === 'All'
                     ? 'bg-slate-900 text-white shadow-md'
                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                 }`}
               >
                 ✨ All Projects ({projects.length})
               </button>
               
               <button
                 onClick={() => setActiveFilter('Research')}
                 className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
                   activeFilter === 'Research'
                     ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                     : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
                 }`}
               >
                 <span>🔬 AI & Research</span>
                 <span className={`text-xs px-2 py-0.5 rounded-full ${activeFilter === 'Research' ? 'bg-purple-700 text-white' : 'bg-purple-200 text-purple-800'}`}>
                   {researchCount}
                 </span>
               </button>

               <button
                 onClick={() => setActiveFilter('Industry')}
                 className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
                   activeFilter === 'Industry'
                     ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                     : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
                 }`}
               >
                 <span>🏢 Industry & Engineering</span>
                 <span className={`text-xs px-2 py-0.5 rounded-full ${activeFilter === 'Industry' ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800'}`}>
                   {industryCount}
                 </span>
               </button>
             </div>
          </header>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                  <div className="h-60 bg-slate-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                      <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-lg">No projects found in this track.</p>
                <button 
                  onClick={() => setActiveFilter('All')} 
                  className="mt-3 text-blue-600 hover:underline text-sm font-semibold"
                >
                  View all projects
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Skills />
      <Resume />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
