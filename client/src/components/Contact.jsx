const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        <header className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Get In Touch</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
            Have a project in mind or just want to say hi? I'd love to hear from you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
             <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Email Me</h4>
                        <a href="mailto:bhishanpangeni2003@gmail.com" className="text-slate-600 hover:text-blue-600 transition">bhishanpangeni2003@gmail.com</a>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">Location</h4>
                        <p className="text-slate-600">Bengaluru, Karnataka, India</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Let's Connect</h3>
                <p className="text-slate-300 mb-6">
                  I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
                </p>
             </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
            
            <form action="https://formspree.io/f/xvgzqdvp" method="POST" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700 ml-1">Your Name</label>
                   <input 
                     type="text" name="name" placeholder="John Doe" required 
                     className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                   <input 
                     type="email" name="email" placeholder="john@example.com" required 
                     className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                   />
                </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 ml-1">Subject</label>
                 <input 
                   type="text" name="subject" placeholder="Project Inquiry" required 
                   className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700 ml-1">Message</label>
                 <textarea 
                   name="message" placeholder="Tell me about your project..." required rows="5"
                   className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none"
                 ></textarea>
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-600/30">
                  Send Message
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;