import { useState } from "react";
function HomePage({ showLogin, showRegister }) {
  const [message, setMessage] = useState("");
  const handleSubmit = () => {
  setMessage("Inquiry submitted successfully!");

  setTimeout(() => {
    setMessage("");
  }, 2000);
};
  return (
    <div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 border-b">
        <h1 className="text-2xl font-bold">
          Fitness Tracker
        </h1>

        <div className="space-x-5">
          <button>Home</button>
          <button>About</button>

          <button onClick={showLogin}>
            Login
          </button>

          <button
            onClick={showRegister}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Landing */}

      <section className="text-center py-24 px-10">

        <h2 className="text-5xl font-bold mb-5">
          Your Fitness Journey Starts Here
        </h2>

        <p className="text-gray-600">
          Track your workouts, monitor your BMI and stay healthy.
        </p>

        <button
          onClick={showRegister}
          className="mt-8 bg-blue-500 text-white px-5 py-3 rounded"
        >
          Get Started
        </button>

      </section>


      {/* About */}

      <section className="px-12 py-16">

        <h2 className="text-3xl font-bold text-center mb-10">
          About
        </h2>

        <div className="flex gap-5">

          <div className="border p-6 flex-1 rounded">
            <h3 className="font-bold">Track Progress</h3>
            <p>Keep track of your fitness journey.</p>
          </div>

          <div className="border p-6 flex-1 rounded">
            <h3 className="font-bold">BMI Calculator</h3>
            <p>Know your current fitness level.</p>
          </div>

          <div className="border p-6 flex-1 rounded">
            <h3 className="font-bold">Workout Plans</h3>
            <p>Get suggested workouts.</p>
          </div>

        </div>

      </section>


      {/* Contact */}

      <section className="px-12 py-16">

        <h2 className="text-3xl font-bold mb-5">
          Contact Us
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4"
        />

        <textarea
          placeholder="Inquiry"
          className="border p-3 w-full mb-4 h-32"
        />

        <button
  onClick={handleSubmit}
  className="bg-blue-500 text-white px-5 py-2 rounded"
>
  Send
</button>
{message && (
  <p className="text-green-600 mt-4">
    {message}
  </p>
)}

      </section>

    </div>
  );
}

export default HomePage;