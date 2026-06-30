function WorkoutDashboard({ next }) {
  return (
    <div className="max-w-5xl mx-auto p-10">

     <h1 className="text-4xl font-bold">
  Welcome Back, Suna!
</h1>

<p className="mb-10 text-gray-600">
  Let's calculate your BMI before starting your workout.
</p>
<div className="border rounded p-6 mb-10">

  <h2 className="text-2xl font-bold mb-5">
    BMI Calculator
  </h2>

  <input
    type="number"
    placeholder="Age"
    className="border p-3 w-full mb-4"
  />

  <input
    type="number"
    placeholder="Weight (kg)"
    className="border p-3 w-full mb-4"
  />

  <input
    type="number"
    placeholder="Height (cm)"
    className="border p-3 w-full mb-5"
  />

  <button className="bg-blue-500 text-white px-5 py-2 rounded">
    Calculate BMI
  </button>

</div>
<div className="border rounded p-6 mb-10">

  <h2 className="text-2xl font-bold mb-4">
    Your BMI
  </h2>

  <h1 className="text-5xl font-bold mb-3">
    22.4
  </h1>

  <p className="mb-5">
    Healthy Weight
  </p>

  <h3 className="font-bold">
    Goal
  </h3>

  <p>
    Maintain your current weight.
  </p>

</div>
<h2 className="text-2xl font-bold mb-6">
  Recommended Workouts
</h2>

<ul className="list-disc ml-6 mb-10">
  <li>Upper Body</li>
  <li>Cardio</li>
  <li>HIIT</li>
</ul>
<h2 className="text-2xl font-bold mb-6">
  All Workouts
</h2>

      {/* Workout Card */}

      <div className="border rounded p-5 flex items-center justify-between mb-5">

        <div className="flex items-center gap-5">

          <div className="w-36 h-24 border flex items-center justify-center">

            {/* IMAGE HERE */}

          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Biceps Workout
            </h2>

            <p>
              4 Exercises
            </p>

          </div>

        </div>

        <button
          onClick={next}
          className="bg-blue-500 text-white px-5 py-2 rounded"
        >
          Start
        </button>

      </div>

      <div className="border rounded p-5 flex items-center justify-between mb-5">

        <div className="flex items-center gap-5">

          <div className="w-36 h-24 border flex items-center justify-center">

            {/* IMAGE HERE */}

          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Chest Workout
            </h2>

            <p>
              4 Exercises
            </p>

          </div>

        </div>

        <button
          onClick={next}
          className="bg-blue-500 text-white px-5 py-2 rounded"
        >
          Start
        </button>

      </div>

      <div className="border rounded p-5 flex items-center justify-between mb-5">

        <div className="flex items-center gap-5">

          <div className="w-36 h-24 border flex items-center justify-center">

            {/* IMAGE HERE */}

          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Legs Workout
            </h2>

            <p>
              4 Exercises
            </p>

          </div>

        </div>

        <button
          onClick={next}
          className="bg-blue-500 text-white px-5 py-2 rounded"
        >
          Start
        </button>

      </div>

      <div className="border rounded p-5 flex items-center justify-between">

        <div className="flex items-center gap-5">

          <div className="w-36 h-24 border flex items-center justify-center">

            {/* IMAGE HERE */}

          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Core Workout
            </h2>

            <p>
              4 Exercises
            </p>

          </div>

        </div>

        <button
          onClick={next}
          className="bg-blue-500 text-white px-5 py-2 rounded"
        >
          Start
        </button>

      </div>

    </div>
  );
}

export default WorkoutDashboard;