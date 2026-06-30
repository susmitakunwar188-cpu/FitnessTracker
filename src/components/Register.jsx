function Register({ nextPage, goHome }) {
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded">

      <button onClick={goHome}>
        ← Back
      </button>

      <h2 className="text-3xl font-bold my-5">
        Register
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-3 w-full mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-3 w-full mb-4"
      />

      <button className="border w-full py-2 mb-4">
        Continue with Google
      </button>

      <button
        onClick={nextPage}
        className="bg-blue-500 text-white w-full py-2 rounded"
      >
        Next
      </button>

    </div>
  );
}

export default Register;