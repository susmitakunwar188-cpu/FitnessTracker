function HomePage({ showLogin }) {
  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">
          Fitness Tracker
        </h1>

        <div className="space-x-5">
          <button>Home</button>
          <button>About</button>
          <button onClick={showLogin}>
            Login
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <div className="text-center mt-20">
        <h2 className="text-4xl font-bold">
          Welcome to Fitness Tracker
        </h2>

        <p className="mt-4 text-gray-600">
          Track your workouts and stay healthy.
        </p>

        <button
          onClick={showLogin}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HomePage;