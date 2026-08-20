import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="space-y-8 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm tracking-wide uppercase">
            Available for Hire
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Bhishan</span>.
          </h1>
          <p className="text-xl text-slate-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
            An AI Engineer & Data Scientist transforming complex data into intelligent solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#projects" className="btn-primary">View My Work</a>
            <a href="#contact" className="px-6 py-3 rounded-xl border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 font-medium transition-all text-slate-600">
              Contact Me
            </a>
          </div>
          
          {/* Social Proof / Stats */}
          <div className="pt-8 flex gap-8 justify-center md:justify-start border-t border-slate-200/60">
            <div>
              <span className="block text-2xl font-bold text-slate-900">4+</span>
              <span className="text-sm text-slate-500">Years Coding</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-slate-900">10+</span>
              <span className="text-sm text-slate-500">Projects Done</span>
            </div>
          </div>
        </div>

        {/* Hero Image Card */}
        <div className="relative animate-float hidden md:block">
           <div className="glass p-6 rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://bhishanpangeni.com.np/images/BhishanPangeni_photo_half.jpg" 
                alt="Bhishan Pangeni" 
                className="rounded-xl w-full h-[500px] object-cover shadow-inner"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500">Current Status</p>
                   <p className="text-sm font-bold text-gray-800">Open to Work</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;