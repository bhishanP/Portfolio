import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      
      {/* Image Container with Overlay */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.thumbnail_url} 
          alt={project.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <Link to={`/projects/${project.slug}`} className="text-white font-semibold flex items-center gap-2 hover:underline">
            View Details <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {project.summary}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.slice(0, 3).map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 3 && (
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;