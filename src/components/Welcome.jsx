const WelcomeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-16 w-16 text-brand-pink mx-auto mb-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function Welcome({ next, user }) {
  const userEmail = user?.email || "Friend";
  const userDisplayName = userEmail.split("@")[0];

  return (
    <div className="page-shell relative flex items-center justify-center overflow-hidden p-6 md:p-12 lg:p-16">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-brand-pink/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-brand-cocoa/5 blur-[150px]" />
      </div>

      <div className="glass-panel-strong z-10 w-full max-w-2xl rounded-[2rem] border border-border-pink/40 p-10 text-center shadow-[0_25px_60px_rgba(0,0,0,0.7)] animate-fadeIn md:p-20">
        <WelcomeIcon />
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6 tracking-tight">
          Welcome, <span className="text-brand-pink capitalize">{userDisplayName}</span>!
        </h1>
        <p className="font-sans text-text-muted text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Your account has been created successfully.<br />
          Let's setup your goals and log your first exercises!
        </p>
        <button
          onClick={next}
          className="glow-button font-display font-bold px-12 py-5 rounded-full text-base md:text-lg cursor-pointer"
        >
          Start Workout Dashboard →
        </button>
      </div>
    </div>
  );
}

export default Welcome;