function UserLogin({ goHome }) {
  return (
    <div className="p-5">

      <button
        onClick={goHome}
        className="mb-4 bg-gray-300 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Fitness Tracker Login
      </h2>

      <input
        type="text"
        placeholder="Username"
        className="border p-2 mb-3 block"
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-3 block"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
}

export default UserLogin;