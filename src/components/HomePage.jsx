import { useState } from "react";
import { toast } from "../utils/toast";
import { confirmDialog } from "../utils/confirm";

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
      toast.error("Please fill in both email and inquiry.");
      return;
    }
    setMessage("Inquiry submitted successfully!");
    setEmail("");
    setInquiry("");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleLogoutClick = async () => {
    const ok = await confirmDialog({
      title: "Log out?",
      message: "Are you sure you want to log out of your account?",
      confirmText: "Log Out"
    });
    if (!ok) return;
    logout();
  };

  return (
    <div className="page-shell text-text-primary">
      <nav className="sticky top-0 z-50 border-b border-border-pink bg-bg-dark/75 px-6 py-4 backdrop-blur-xl md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <h1 className="flex cursor-pointer items-center gap-3 text-2xl font-display font-bold tracking-tight text-text-primary md:text-3xl">
            <BrandIcon />
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-text-primary to-text-muted bg-clip-text text-transparent leading-none">Fitique</span>
              <span className="mt-1 text-[11px] font-quick font-bold uppercase leading-none tracking-[0.22em] text-brand-pink">light weight baby</span>
            </div>
          </h1>
          <div className="flex items-center gap-5 md:gap-8">
            <a href="#about" className="nav-link text-sm font-display font-semibold md:text-base">
              About
            </a>
            <a href="#contact" className="nav-link text-sm font-display font-semibold md:text-base">
              Contact
            </a>
          {user ? (
            <>
              <button
                onClick={goDashboard}
                className="text-sm font-display font-semibold text-brand-pink transition hover:underline md:text-base"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogoutClick}
                className="rounded-full border border-border-pink bg-card-dark/70 px-6 py-2.5 font-display text-sm font-semibold text-text-primary transition duration-300 hover:bg-card-dark md:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={showLogin}
                className="nav-link text-sm font-display font-semibold md:text-base"
              >
                Login
              </button>
              <button
                onClick={showRegister}
                className="rounded-full bg-brand-pink px-6 py-2.5 font-display text-sm font-bold text-text-primary shadow-md transition duration-300 hover:bg-brand-pink-hover md:text-base"
              >
                Register
              </button>
            </>
          )}
        </div>
        </div>
      </nav>

      {/* Huge Hero Section */}
      <section className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-16 px-6 py-20 md:px-10 md:py-28 lg:flex-row lg:px-16 lg:py-32">
        <div className="flex-[1.2] text-center lg:text-left">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border-pink bg-card-dark/70 px-4 py-2 shadow-inner">
            <SparkIcon />
            <span className="font-quick text-xs font-bold uppercase tracking-[0.25em] text-brand-pink md:text-sm">
              Your fitness glow-up starts now
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-display font-extrabold leading-[1.05] tracking-tight text-text-primary md:text-6xl lg:text-7xl">
            Your Fitness <br />
            <span className="bg-gradient-to-r from-brand-pink to-brand-cocoa bg-clip-text text-transparent">Journey Starts Here</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl font-sans text-lg leading-relaxed text-text-muted md:text-xl lg:mx-0">
            Track your workouts, calories, and momentum with a calm, focused planner designed for steady progress.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <span className="soft-pill">Daily planning</span>
            <span className="soft-pill">Progress tracking</span>
            <span className="soft-pill">Minimal focus</span>
          </div>
          <button
            onClick={user ? goDashboard : showRegister}
            className="glow-button rounded-full px-10 py-4 font-display text-base font-bold md:text-lg"
          >
            {user ? "Go to Dashboard" : "Get Started Now"}
          </button>
        </div>
        
        <div className="flex w-full flex-1 justify-center lg:w-auto">
          <div className="glass-panel group relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-2xl border border-border-pink lg:max-w-3xl">
            <img
              src="https://i.pinimg.com/736x/3c/56/b7/3c56b7bef8716d87e304c1eab3d3c23e.jpg"
              alt="Fitness motivation dumbbell artwork"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />
          </div>
        </div>
      </section>

      {/* Massive About Section */}
      <section id="about" className="border-y border-border-pink bg-black/20 px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 text-center">
            <h2 className="section-title mb-4">Why Fitique?</h2>
            <p className="section-subtitle mx-auto text-lg md:text-xl">
              Unlock a refined wellness suite designed to keep your training grounded, clear, and motivating.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="surface-card flex min-h-[20rem] flex-col items-start rounded-2xl p-8 transition duration-300 hover:-translate-y-2 hover:border-brand-pink/40">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-border-pink/30 border border-brand-pink/20">
              <ProgressIcon />
            </div>
            <h3 className="font-display text-2xl font-bold text-text-primary mb-4">Track Progress</h3>
            <p className="font-sans text-text-muted leading-relaxed text-base">
              Register an account to securely save and track your workout routines dynamically, anywhere, anytime.
            </p>
          </div>
            <div className="surface-card flex min-h-[20rem] flex-col items-start rounded-2xl p-8 transition duration-300 hover:-translate-y-2 hover:border-brand-pink/40">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-pink/20 bg-border-pink/20">
                <BmiIcon />
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold text-text-primary">BMI Calculator</h3>
              <p className="font-sans text-base leading-relaxed text-text-muted">
                Keep tabs on weight status. Calculate body mass index in real-time, matching goals to your dynamic stats.
              </p>
            </div>
            <div className="surface-card flex min-h-[20rem] flex-col items-start rounded-2xl p-8 transition duration-300 hover:-translate-y-2 hover:border-brand-pink/40">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-pink/20 bg-border-pink/20">
                <WorkoutIcon />
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold text-text-primary">Workout Plans</h3>
              <p className="font-sans text-base leading-relaxed text-text-muted">
                Edit, delete, and add custom workout categories. Securely backend-sync your customized exercise directories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Contact Section */}
      <section id="contact" className="mx-auto max-w-5xl px-6 py-24 md:px-10">
        <div className="mb-10 text-center">
          <h2 className="section-title mb-4">Contact Us</h2>
          <p className="section-subtitle mx-auto text-lg md:text-xl">
            Want to say hello or ask a question? We’d love to hear from you.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl border border-border-pink p-8 md:p-12">
          <div className="mb-8">
            <label className="block text-sm font-bold text-text-muted mb-3 tracking-widest font-quick uppercase">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="glow-input font-sans border-2 border-border-pink rounded-2xl p-5 w-full bg-bg-dark text-text-primary text-lg transition focus:border-brand-pink focus:outline-none"
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
              className="glow-input font-sans border-2 border-border-pink rounded-2xl p-5 w-full bg-bg-dark text-text-primary text-lg transition focus:border-brand-pink focus:outline-none h-44 resize-none"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <button
              type="submit"
              className="glow-button font-display font-bold px-10 py-4.5 rounded-full text-lg w-full md:w-auto"
            >
              Send Inquiry
            </button>
            {message && (
              <p className="text-brand-pink font-sans font-bold text-xl text-center md:text-left tracking-wide">
                {message}
              </p>
            )}
          </div>
        </form>
      </section>

      {/* Massive Footer */}
      <footer className="border-t border-border-pink bg-bg-dark/80 px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <h2 className="flex items-center gap-4 text-3xl md:text-4xl font-display font-bold text-text-primary mb-8">
              <BrandIcon />
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-text-primary to-text-muted bg-clip-text text-transparent leading-none">Fitique</span>
                <span className="text-[11px] text-brand-pink tracking-[0.22em] font-quick font-bold uppercase mt-1 leading-none">light weight baby</span>
              </div>
            </h2>
            <p className="font-sans text-text-muted text-lg max-w-md leading-relaxed mb-8">
              A premium, secure ecosystem built to assist dedicated fitness enthusiasts in logging metrics, structuring schedules, and exceeding expectations.
            </p>
          </div>
          <div>
            <h3 className="font-display font-bold text-text-primary text-lg mb-8 uppercase tracking-wider border-b border-border-pink/20 pb-2">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">Home</a></li>
              <li><a href="#about" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">About Fitique</a></li>
              <li><a href="#contact" className="font-sans text-text-muted hover:text-brand-pink text-base transition duration-200">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display font-bold text-text-primary text-lg mb-8 uppercase tracking-wider border-b border-border-pink/20 pb-2">Community</h3>
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