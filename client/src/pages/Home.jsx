import { useEffect, useState } from 'react';
import axios from 'axios';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import Resume from '../components/Resume';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // 1. Fetch Projects
    axios.get(`${API_URL}/api/projects`)
      .then(res => setProjects(res.data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  return (
    <div className="bg-slate-50">
      <Hero />
      <Skills />

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <header className="text-center mb-16">
             <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Featured Projects</h2>
             <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
             <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
               A selection of my recent work in Data Science, AI, and Full Stack Development.
             </p>
          </header>
          
          {/* Grid using the ProjectCard Component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading awesome projects...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Resume />

      <Contact />
      <Footer />
    </div>
  );
};

export default Home;