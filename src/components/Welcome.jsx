const WelcomeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-16 w-16 text-brand-pink mx-auto mb-8 filter drop-shadow-[0_0_8px_rgba(255,74,139,0.4)] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function Welcome({ next, user }) {
  const userEmail = user?.email || "Friend";
  const userDisplayName = userEmail.split("@")[0];

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 md:p-10">
      <div className="max-w-2xl w-full bg-card-dark rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-border-pink/40 p-10 md:p-16 text-center">
        <WelcomeIcon />
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
          Welcome, <span className="text-brand-pink capitalize">{userDisplayName}</span>!
        </h1>
        <p className="font-sans text-text-muted text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Your account has been created successfully.<br />
          Let's setup your goals and log your first exercises!
        </p>
        <button
          onClick={next}
          className="glow-button font-display font-bold px-10 py-4 rounded-full text-base md:text-lg shadow-lg shadow-brand-pink/20 hover:shadow-brand-pink/45 transition duration-300"
        >
          Start Workout Dashboard →
        </button>
      </div>
    </div>
  );
}

export default Welcome;