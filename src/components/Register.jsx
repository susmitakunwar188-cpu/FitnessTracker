import { useState } from "react";
import { api } from "../utils/api";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V8a4 4 0 1 1 8 0v2" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const RegisterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.48 0-6.3-2.82-6.3-6.3s2.82-6.3 6.3-6.3c1.55 0 2.96.56 4.07 1.49l3.22-3.22C19.16 2.03 15.93 1 12.24 1 6.04 1 12.24 6.04 12.24 12.24s5.04 11.24 11.24 11.24c6.48 0 11.24-4.56 11.24-11.24 0-.76-.08-1.5-.22-2.22h-11.02z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function Register({ onRegisterSuccess, goHome, showLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Client-side letters + numbers validation matching backend
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      setError("Password must contain both letters and numbers.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.register(email, password);
      onRegisterSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || "Registration failed. Email might already be registered.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Continue with Google is currently a demo option.");
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 md:p-12 lg:p-16">
      {/* Centered, Split Card with Less Corner Radius */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border-pink/40 bg-card-dark flex min-h-[660px] flex-col lg:flex-row shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
        
        {/* Floating Close Button at top-right corner to exit/go home */}
        <button
          onClick={goHome}
          className="absolute top-6 right-6 text-text-muted hover:text-brand-pink transition duration-200 z-30 p-2 hover:bg-border-pink/30 rounded-xl"
          title="Close and Return to Home"
        >
          <CloseIcon />
        </button>

        {/* Left Image Panel */}
        <div className="hidden lg:block w-[45%] relative border-r border-border-pink/40">
          <img
            src="https://i.pinimg.com/736x/f7/cf/bc/f7cfbc3af4e9948806d113a4c6005a4c.jpg"
            alt="Fitness motivation weights"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/85 via-bg-dark/30 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 z-10">
            <p className="font-display text-2xl font-bold text-white mb-2 drop-shadow-md">Forge Your Legacy</p>
            <p className="font-sans text-brand-cocoa-light text-sm font-semibold">Join thousands of athletes track their daily progression.</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-14 lg:p-16">
          <div className="w-full max-w-md">

            {/* Notices */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4.5 rounded-xl mb-8 text-sm font-medium flex items-start gap-3 animate-fadeIn">
                <WarningIcon />
                <span>{error}</span>
              </div>
            )}

            <div className="text-left mb-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cocoa/20 border border-brand-cocoa/30 shadow-inner">
                <RegisterIcon />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 tracking-tight">
                Create Account
              </h2>
              <p className="font-sans text-text-muted text-base">
                Join <span className="text-brand-pink font-semibold">Fitique</span> to begin monitoring your workouts
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2.5 tracking-widest uppercase font-quick">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pr-3 pointer-events-none">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 pl-12 w-full bg-bg-dark text-white text-base transition focus:border-brand-pink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2.5 tracking-widest uppercase font-quick">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pr-3 pointer-events-none">
                    <LockIcon />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars with letters & numbers"
                    className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 pl-12 w-full bg-bg-dark text-white text-base transition focus:border-brand-pink focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glow-button font-display font-bold w-full py-4 rounded-xl text-base mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div className="mt-4.5">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-brand-cocoa/10 hover:bg-brand-cocoa/20 text-white border border-brand-cocoa/40 hover:border-brand-cocoa py-4 rounded-xl font-display text-sm font-semibold transition duration-200 flex items-center justify-center gap-3.5 shadow-md shadow-brand-cocoa/5 cursor-pointer"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Footer Navigation */}
            <div className="mt-10 text-center border-t border-border-pink/30 pt-8">
              <p className="font-sans text-text-muted text-sm">
                Already have an account?{" "}
                <button
                  onClick={showLogin}
                  className="text-brand-pink hover:text-brand-pink-hover font-bold font-display hover:underline transition cursor-pointer"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;