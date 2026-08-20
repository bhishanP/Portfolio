import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <div className="absolute">
         <h2 className="text-3xl font-bold text-slate-800">Page Not Found</h2>
         <p className="text-slate-500 mt-2">The page you are looking for doesn't exist or has been moved.</p>
         <Link to="/" className="mt-8 inline-block btn-primary">
            Go Back Home
         </Link>
      </div>
    </div>
  );
};

export default NotFound;