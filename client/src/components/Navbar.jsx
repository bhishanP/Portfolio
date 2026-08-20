import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Helper to determine if we are on the homepage for scrolling vs routing
  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    if (!isHome) return; // If not on home, Link to "/" will handle it
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wider hover:text-blue-400 transition">
          BHISHAN PANGENI
        </Link>
        
        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden focus:outline-none">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
           </svg>
        </button>

        {/* Desktop Links */}
        <ul className={`md:flex md:items-center md:space-x-8 absolute md:static bg-gray-900 w-full md:w-auto left-0 transition-all duration-300 ease-in-out ${isOpen ? 'top-16 opacity-100' : '-top-96 opacity-0 md:opacity-100'}`}>
          <li>
            <Link to="/" onClick={() => scrollToSection('top')} className="block px-4 py-2 hover:text-blue-400">Home</Link>
          </li>
          <li>
            <a href="#skills" onClick={() => scrollToSection('skills')} className="block px-4 py-2 hover:text-blue-400 cursor-pointer">Skills</a>
          </li>
          <li>
             {/* If on home, scroll to projects. If on detail page, go back home. */}
            <Link to="/#projects" onClick={() => scrollToSection('projects')} className="block px-4 py-2 hover:text-blue-400">Projects</Link>
          </li>
          <li>
            <a href="#resume" onClick={() => scrollToSection('resume')} className="block px-4 py-2 hover:text-blue-400 cursor-pointer">Resume</a>
          </li>
          <li>
            <a href="#contact" onClick={() => scrollToSection('contact')} className="block px-4 py-2 hover:text-blue-400 cursor-pointer">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;