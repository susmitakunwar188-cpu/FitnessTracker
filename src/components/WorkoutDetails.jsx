function WorkoutDetails({ goDashboard }) {
  return (
    <div className="max-w-3xl mx-auto mt-20 p-8 border rounded">

      <h1 className="text-3xl font-bold mb-8">
        Biceps Workout
      </h1>

      <div className="mb-5 border-b pb-3">
        <h2 className="font-semibold">
          Dumbbell Curl
        </h2>

        <p>
          3 Sets × 12 Reps
        </p>
      </div>

      <div className="mb-5 border-b pb-3">
        <h2 className="font-semibold">
          Hammer Curl
        </h2>

        <p>
          3 Sets × 10 Reps
        </p>
      </div>

      <div className="mb-5 border-b pb-3">
        <h2 className="font-semibold">
          Concentration Curl
        </h2>

        <p>
          3 Sets × 12 Reps
        </p>
      </div>

      <div className="mb-8 border-b pb-3">
        <h2 className="font-semibold">
          Barbell Curl
        </h2>

        <p>
          4 Sets × 8 Reps
        </p>
      </div>

      <button
        onClick={goDashboard}
        className="border px-5 py-2 rounded"
      >
        Back
      </button>

    </div>
  );
}

export default WorkoutDetails;