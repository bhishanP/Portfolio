import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest resume URL
    axios.get(`${API_URL}/api/resume`)
      .then(res => {
        if(res.data.url) setResumeUrl(res.data.url);
        console.log("Fetched resume URL:", res.data.url);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching resume:", err);
        setLoading(false);
      });
  }, []);

  // Function to Force Download
  const handleDownload = async () => {
    if (!resumeUrl) return;
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename or default to "Bhishan_Pangeni_Resume.pdf"
      link.setAttribute('download', 'Bhishan_Pangeni_Resume.pdf'); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed, opening in new tab instead", error);
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <section id="resume" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">My Resume</h2>
        <div className="w-20 h-1.5 bg-blue-500 mx-auto rounded-full mb-8"></div>
        
        <p className="mb-10 text-lg text-slate-300 max-w-2xl mx-auto">
           Check out my resume to learn more about my experience, education, and technical skills.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
           {/* VIEW BUTTON */}
           <button 
             onClick={() => setShowViewer(!showViewer)}
             className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all border-2 ${showViewer ? 'bg-white text-slate-900 border-white' : 'border-slate-500 text-slate-300 hover:border-white hover:text-white'}`}
           >
             {showViewer ? (
               <>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 Close Viewer
               </>
             ) : (
               <>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                 View Resume
               </>
             )}
           </button>

           {/* DOWNLOAD BUTTON */}
           <button 
             onClick={handleDownload}
             className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-1"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
             Download Resume
           </button>
        </div>

        {/* PDF VIEWER AREA */}
        {showViewer && (
          <div className="w-full max-w-5xl mx-auto h-[800px] bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 animate-fade-in-up">
             {resumeUrl ? (
               <iframe 
                 src={`${resumeUrl}#view=FitH`} 
                 title="Resume Viewer"
                 className="w-full h-full" 
               />
             ) : (
               <div className="flex items-center justify-center h-full text-slate-400">
                 {loading ? "Loading Resume..." : "No Resume Uploaded Yet"}
               </div>
             )}
          </div>
        )}

      </div>
    </section>
  );
};

export default Resume;