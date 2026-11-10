import { useState, useEffect } from 'react';
import api from '../api';

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
  hero_image_url: "https://bhishanpangeni.com.np/images/BhishanPangeni_photo_half.jpg"
};

const Hero = ({ onSelectTrack }) => {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    api.get('/api/profile')
      .then(res => {
        if (res.data && Object.keys(res.data).length > 0) {
          setProfile(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(err => console.error("Error loading profile:", err));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-20 pb-16">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (Main Information) */}
        <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
          
          {/* Status Badges: Availability & Research Collaboration */}
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start items-center">
            {profile.availability_badge && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 text-blue-700 font-semibold text-xs tracking-wide uppercase shadow-sm border border-blue-200/60">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                {profile.availability_badge}
              </span>
            )}
            
            {profile.collaboration_status && (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-700 font-semibold text-xs tracking-wide shadow-sm border border-purple-200/60">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                🔬 {profile.collaboration_status}
              </span>
            )}
          </div>

          {/* Main Title & Subtitle */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              {profile.hero_title_prefix}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                {profile.hero_name}
              </span>.
            </h1>
            <p className="mt-2 text-xl font-semibold text-slate-800">
              {profile.hero_subtitle}
            </p>
          </div>

          {/* Bio Paragraph */}
          <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            {profile.hero_bio}
          </p>

          {/* Dual Track Cards: Industry vs Research preview */}
          <div className="grid sm:grid-cols-2 gap-5 pt-2">
            
            {/* Industry Track Card */}
            <div 
              onClick={() => onSelectTrack && onSelectTrack('Industry')}
              className="group p-5 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/90 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-xl">🏢</span>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">Industry Experience</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {profile.industry_summary}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-4 group-hover:translate-x-1 transition-transform">
                Explore Industry Projects &rarr;
              </span>
            </div>

            {/* Research Track Card */}
            <div 
              onClick={() => onSelectTrack && onSelectTrack('Research')}
              className="group p-5 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/90 hover:border-purple-500 hover:shadow-xl transition-all duration-300 text-left cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="text-xl">🔬</span>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition">Academic & AI Research</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {profile.research_summary}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 mt-4 group-hover:translate-x-1 transition-transform">
                Explore Research Work &rarr;
              </span>
            </div>

          </div>
          
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <a href="#projects" className="btn-primary flex items-center justify-center gap-2">
              <span>View All Projects</span>
              <span>&darr;</span>
            </a>
            <a 
              href="#collaboration" 
              className="px-6 py-3 rounded-xl border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-400 text-purple-800 font-semibold transition-all text-center flex items-center justify-center gap-2"
            >
              <span>🔬 Research Collaboration</span>
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 rounded-xl border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 font-medium transition-all text-slate-600 text-center"
            >
              Contact Me
            </a>
          </div>
          
          {/* Dynamic Social Proof / Stats */}
          {profile.stats && profile.stats.length > 0 && (
            <div className="pt-6 flex flex-wrap gap-8 justify-center lg:justify-start border-t border-slate-200/60">
              {profile.stats.map((stat, idx) => (
                <div key={idx}>
                  <span className="block text-2xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Hero Image Card */}
        <div className="lg:col-span-5 relative animate-float hidden md:block max-w-md mx-auto">
          <div className="glass p-5 rounded-3xl rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl">
            <img 
              src={profile.hero_image_url} 
              alt={profile.hero_name} 
              loading="eager"
              className="rounded-2xl w-full h-[460px] object-cover shadow-inner"
            />
            {profile.current_status && (
              <div className="absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Status</p>
                  <p className="text-sm font-bold text-slate-800">{profile.current_status}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
