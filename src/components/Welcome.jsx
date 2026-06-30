function Welcome({ next }) {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 border rounded text-center">

      <h1 className="text-4xl font-bold mb-5">
        Welcome!
      </h1>

      <p className="mb-8">
        Your account has been created successfully.
      </p>

      <button
        onClick={next}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        Continue
      </button>

    </div>
  );
}

export default Welcome;