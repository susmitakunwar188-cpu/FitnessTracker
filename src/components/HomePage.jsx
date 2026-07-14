import { useState } from "react";

const BrandIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M8 3.5c1.2 0 2.3 1 2.3 2.2 0 1.7-1.4 2.9-2.3 4.3-.9-1.4-2.3-2.6-2.3-4.3C5.7 4.5 6.8 3.5 8 3.5Z" />
    <path d="M16 3.5c1.2 0 2.3 1 2.3 2.2 0 1.7-1.4 2.9-2.3 4.3-.9-1.4-2.3-2.6-2.3-4.3C13.7 4.5 14.8 3.5 16 3.5Z" />
    <path d="M6 11c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v5c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4v-5Z" />
    <path d="M10 15h4" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m12 2 1.3 4.7L18 8l-4.7 1.3L12 14l-1.3-4.7L6 8l4.7-1.3L12 2Z" />
    <path d="m18 14 0.7 2.3L21 17l-2.3 0.7L18 20l-0.7-2.3L15 17l2.3-0.7L18 14Z" />
  </svg>
);

const ProgressIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19h16" />
    <path d="M7 15v-4" />
    <path d="M12 15V8" />
    <path d="M17 15V5" />
  </svg>
);

const BmiIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="5" width="16" height="14" rx="3" />
    <path d="M8 10h8" />
    <path d="M8 14h5" />
  </svg>
);

const WorkoutIcon = () => (
  <svg viewBox="0 0 24 24" className="h-9 w-9 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 8h12" />
    <path d="M7 12h10" />
    <path d="M8 16h8" />
    <path d="M4 8v8" />
    <path d="M20 8v8" />
  </svg>
);

function HomePage({ user, showLogin, showRegister, goDashboard, logout }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !inquiry) {
      alert("Please fill in both email and inquiry.");
      return;
    }
    setMessage("Inquiry submitted successfully!");
    setEmail("");
    setInquiry("");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="bg-bg-dark text-white min-h-screen">
      {/* Huge Navbar */}
      <nav className="flex justify-between items-center h-32 px-8 md:px-20 lg:px-32 bg-bg-dark/95 backdrop-blur-md sticky top-0 z-50 border-b border-border-pink/50">
        <h1 className="flex items-center gap-4 text-3xl md:text-4xl font-display font-bold text-white tracking-tight cursor-pointer">
          <BrandIcon />
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-white to-text-muted bg-clip-text text-transparent leading-none">Fitique</span>
            <span className="text-[10px] text-brand-pink tracking-[0.22em] font-quick font-bold uppercase mt-1 leading-none">light weight baby</span>
          </div>
        </h1>
        <div className="flex items-center gap-6 md:gap-10">
          <a href="#about" className="text-base md:text-lg font-display font-semibold text-text-muted hover:text-brand-pink transition duration-200">
            About
          </a>
          <a href="#contact" className="text-base md:text-lg font-display font-semibold text-text-muted hover:text-brand-pink transition duration-200">
            Contact
          </a>
          {user ? (
            <>
              <button
                onClick={goDashboard}
                className="text-base md:text-lg font-display font-semibold text-brand-pink hover:underline transition"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="bg-card-dark border-2 border-border-pink hover:bg-border-pink text-white font-display text-base md:text-lg px-8 py-3 rounded-full transition duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={showLogin}
                className="text-base md:text-lg font-display font-semibold text-text-muted hover:text-brand-pink transition duration-200"
              >
                Login
              </button>
              <button
                onClick={showRegister}
                className="bg-brand-pink hover:bg-brand-pink-hover text-white font-display font-bold text-base md:text-lg px-8 py-3 rounded-full shadow-lg shadow-brand-pink/20 hover:shadow-brand-pink/40 hover:-translate-y-0.5 transition duration-300"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Huge Hero Section */}
      <section className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between py-24 md:py-32 lg:py-40 px-8 md:px-20 lg:px-32 gap-16 lg:gap-24">
        <div className="flex-[1.2] text-center lg:text-left">
          <div className="inline-flex items-center gap-3 rounded-full bg-border-pink/40 border border-border-pink/80 px-6 py-2.5 mb-10 shadow-inner">
            <SparkIcon />
            <span className="text-xs md:text-sm font-bold text-brand-pink tracking-widest uppercase font-quick">
              Your fitness glow-up starts now
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-white mb-8 leading-[1.05] tracking-tight">
            Your Fitness <br />
            <span className="text-brand-pink bg-gradient-to-r from-brand-pink to-[#FFA2C5] bg-clip-text text-transparent">Journey Starts Here</span>
          </h1>
          <p className="font-sans text-text-muted text-xl md:text-2xl mb-12 max-w-xl leading-relaxed mx-auto lg:mx-0">
            Track your workouts, calories, and reach your full potential with our fitness planner. One percent better EVERY. SINGLE. DAY.
          </p>
          <button
            onClick={user ? goDashboard : showRegister}
            className="glow-button font-display font-bold px-12 py-5 rounded-full text-lg md:text-xl shadow-xl shadow-brand-pink/20"
          >
            {user ? "Go to Dashboard" : "Get Started Now"}
          </button>
        </div>
        
        {/* Massive Image Container */}
        <div className="flex-1 flex justify-center w-full lg:w-auto">
          <div className="relative w-full max-w-2xl lg:max-w-3xl aspect-[4/3] rounded-[2.5rem] shadow-[0_25px_70px_rgba(255,74,139,0.22)] border-2 border-border-pink overflow-hidden group">
            <img
              src="https://i.pinimg.com/736x/3c/56/b7/3c56b7bef8716d87e304c1eab3d3c23e.jpg"
              alt="Fitness motivation dumbbell artwork"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent opacity-85" />
          </div>
        </div>
      </section>

      {/* Massive About Section */}
      <section id="about" className="px-8 md:px-20 lg:px-32 py-32 bg-card-dark/30 border-y border-border-pink/40">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white text-center mb-6">
          Why Fitique?
        </h2>
        <p className="text-center text-text-muted text-lg md:text-xl mb-24 max-w-3xl mx-auto leading-relaxed">
          Unlock a comprehensive health suite designed to log your gains and visualize your path to victory.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1440px] mx-auto">
          <div className="bg-card-dark rounded-[2.2rem] p-10 border border-border-pink/50 hover:border-brand-pink/50 hover:-translate-y-2 transition duration-300 flex flex-col items-start min-h-[20rem] shadow-lg">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-border-pink/30 border border-brand-pink/20">
              <ProgressIcon />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-4">Track Progress</h3>
            <p className="font-sans text-text-muted leading-relaxed text-base">
              Register an account to securely save and track your workout routines dynamically, anywhere, anytime.
            </p>
          </div>
          <div className="bg-card-dark rounded-[2.2rem] p-10 border border-border-pink/50 hover:border-brand-pink/50 hover:-translate-y-2 transition duration-300 flex flex-col items-start min-h-[20rem] shadow-lg">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-border-pink/30 border border-brand-pink/20">
              <BmiIcon />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-4">BMI Calculator</h3>
            <p className="font-sans text-text-muted leading-relaxed text-base">
              Keep tabs on weight status. Calculate body mass index in real-time, matching goals to your dynamic stats.
            </p>
          </div>
          <div className="bg-card-dark rounded-[2.2rem] p-10 border border-border-pink/50 hover:border-brand-pink/50 hover:-translate-y-2 transition duration-300 flex flex-col items-start min-h-[20rem] shadow-lg">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-border-pink/30 border border-brand-pink/20">
              <WorkoutIcon />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-4">Workout Plans</h3>
            <p className="font-sans text-text-muted leading-relaxed text-base">
              Edit, delete, and add custom workout categories. Securely backend-sync your customized exercise directories.
            </p>
          </div>
        </div>
      </section>

      {/* Massive Contact Section */}
      <section id="contact" className="px-8 py-32 max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 text-center">
          Contact Us
        </h2>
        <p className="text-center text-text-muted text-lg md:text-xl mb-16">
          Want to say hello or ask a question? We’d love to hear from you.
        </p>
        <form onSubmit={handleSubmit} className="bg-card-dark rounded-[2.5rem] p-10 md:p-16 border border-border-pink/50 shadow-2xl shadow-black/60">
          <div className="mb-8">
            <label className="block text-sm font-bold text-text-muted mb-3 tracking-widest font-quick uppercase">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="glow-input font-sans border-2 border-border-pink rounded-2xl p-5 w-full bg-bg-dark text-white text-lg transition focus:border-brand-pink focus:outline-none"
            />
          </div>
          <div className="mb-10">
            <label className="block text-sm font-bold text-text-muted mb-3 tracking-widest font-quick uppercase">YOUR INQUIRY</label>
            <textarea
              required
              rows="5"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder="How can we help you on your fitness journey?"
              className="glow-input font-sans border-2 border-border-pink rounded-2xl p-5 w-full bg-bg-dark text-white text-lg transition focus:border-brand-pink focus:outline-none h-44 resize-none"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <button
              type="submit"
              className="glow-button font-display font-bold px-10 py-4.5 rounded-full text-lg w-full md:w-auto shadow-lg"
            >
              Send Inquiry
            </button>
            {message && (
              <p className="text-brand-pink font-sans font-bold text-xl text-center md:text-left tracking-wide animate-pulse">
                {message}
              </p>
            )}
          </div>
        </form>
      </section>

      {/* Massive Footer */}
      <footer className="bg-[#060405] border-t border-border-pink/55 py-24 px-8 md:px-20 lg:px-32">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <h2 className="flex items-center gap-4 text-3xl md:text-4xl font-display font-bold text-white mb-8">
              <BrandIcon />
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-white to-text-muted bg-clip-text text-transparent leading-none">Fitique</span>
                <span className="text-[10px] text-brand-pink tracking-[0.22em] font-quick font-bold uppercase mt-1 leading-none">light weight baby</span>
              </div>
            </h2>
            <p className="font-sans text-text-muted text-lg max-w-md leading-relaxed mb-8">
              A premium, secure ecosystem built to assist dedicated fitness enthusiasts in logging metrics, structuring schedules, and exceeding expectations.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-8 uppercase tracking-wider border-b border-border-pink/20 pb-2">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">Home</a></li>
              <li><a href="#about" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">About Fitique</a></li>
              <li><a href="#contact" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-8 uppercase tracking-wider border-b border-border-pink/20 pb-2">Community</h3>
            <ul className="space-y-4">
              <li><a href="#" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">Instagram</a></li>
              <li><a href="#" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">Discord Channel</a></li>
              <li><a href="#" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">Workout Blogs</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto border-t border-border-pink/20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-text-muted text-base">
            &copy; {new Date().getFullYear()} Fitique Ecosystem. All rights reserved.
          </p>
          <p className="font-sans text-text-muted text-base flex gap-8">
            <a href="#" className="hover:text-brand-pink transition duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-brand-pink transition duration-200">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;