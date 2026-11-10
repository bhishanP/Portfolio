import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const getTrackBadge = (track) => {
    switch (track) {
      case 'Research':
        return { label: '🔬 Research & AI', bg: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'Industry':
        return { label: '🏢 Industry', bg: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'Both':
      default:
        return { label: '✨ Research & Engineering', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
  };

  const badge = getTrackBadge(project.track);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between">
      
      <div>
        {/* Image Container with Overlay */}
        <div className="relative h-60 overflow-hidden bg-slate-100">
          <img 
            src={project.thumbnail_url} 
            alt={project.title} 
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Track Tag pill on the top right */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${badge.bg}`}>
              {badge.label}
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <Link to={`/projects/${project.slug}`} className="text-white font-semibold flex items-center gap-2 hover:underline text-sm">
              View Detailed Case Study <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </div>

          <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.tech_stack && project.tech_stack.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg font-medium border border-slate-200/80">
                {tech}
              </span>
            ))}
            {project.tech_stack && project.tech_stack.length > 3 && (
              <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded-lg font-medium border border-slate-200/80">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer link row */}
      <div className="px-6 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
        <Link to={`/projects/${project.slug}`} className="text-blue-600 font-semibold hover:text-blue-800 transition">
          Full Details &rarr;
        </Link>
        {project.github_link && (
          <a 
            href={project.github_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            GitHub
          </a>
        )}
      </div>

    </div>
  );
};

export default ProjectCard;
