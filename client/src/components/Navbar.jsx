import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setIsOpen(false);
    if (!isHome) {
      navigate(`/#${id}`);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-slate-950/95 backdrop-blur-md text-white shadow-lg border-b border-slate-800/80">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-black tracking-wider hover:text-blue-400 transition flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>BHISHAN PANGENI</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none p-2 rounded-lg hover:bg-slate-800 transition">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
           </svg>
        </button>

        {/* Desktop Links */}
        <ul className={`md:flex md:items-center md:space-x-8 absolute md:static bg-slate-950 md:bg-transparent w-full md:w-auto left-0 transition-all duration-300 ease-in-out ${isOpen ? 'top-16 opacity-100 p-6 border-b border-slate-800 md:border-0' : '-top-96 opacity-0 md:opacity-100'}`}>
          <li>
            <button onClick={() => scrollToSection('top')} className="block py-2 text-slate-300 hover:text-blue-400 font-medium transition text-sm">
              Home
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('projects')} className="block py-2 text-slate-300 hover:text-blue-400 font-medium transition text-sm">
              Projects & Work
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('collaboration')} className="block py-2 text-purple-300 hover:text-purple-200 font-medium transition text-sm flex items-center gap-1.5">
              <span>🔬</span> Research
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('skills')} className="block py-2 text-slate-300 hover:text-blue-400 font-medium transition text-sm">
              Skills
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('resume')} className="block py-2 text-slate-300 hover:text-blue-400 font-medium transition text-sm">
              Resume
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')} className="block py-2 text-slate-300 hover:text-blue-400 font-medium transition text-sm">
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
