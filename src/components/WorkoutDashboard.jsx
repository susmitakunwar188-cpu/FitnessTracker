import { useState } from "react";
function WorkoutDashboard({ next }) {
  const [age, setAge] = useState("");
const [weight, setWeight] = useState("");
const [height, setHeight] = useState("");

const [bmi, setBmi] = useState(null);
const [status, setStatus] = useState("");
const [goal, setGoal] = useState("");
const [menuOpen, setMenuOpen] = useState(null);
const [editingId, setEditingId] = useState(null);
const [editingName, setEditingName] = useState("");

const [workouts, setWorkouts] = useState([
  { id: 1, name: "Biceps Workout", exercises: "4 Exercises" },
  { id: 2, name: "Chest Workout", exercises: "4 Exercises" },
  { id: 3, name: "Legs Workout", exercises: "4 Exercises" },
  { id: 4, name: "Core Workout", exercises: "4 Exercises" },
]);

const deleteWorkout = (id) => {
  const updatedWorkouts = workouts.filter((workout) => workout.id !== id);
  setWorkouts(updatedWorkouts);
  setMenuOpen(null);
};

const startEdit = (id, currentName) => {
  setEditingId(id);
  setEditingName(currentName);
  setMenuOpen(null);
};

const saveEdit = () => {
  if (editingName.trim() === "") {
    alert("Workout name cannot be empty");
    return;
  }

  const updatedWorkouts = workouts.map((workout) =>
    workout.id === editingId
      ? { ...workout, name: editingName }
      : workout
  );
  
  setWorkouts(updatedWorkouts);
  setEditingId(null);
  setEditingName("");
};

const cancelEdit = () => {
  setEditingId(null);
  setEditingName("");
};
const calculateBMI = () => {
  if (!weight || !height) {
    alert("Please enter weight and height.");
    return;
  }

  const heightInMeters = height / 100;
  const bmiValue = weight / (heightInMeters * heightInMeters);

  setBmi(bmiValue.toFixed(1));

  if (bmiValue < 18.5) {
    setStatus("Underweight");
    setGoal("Gain healthy weight.");
  } else if (bmiValue < 25) {
    setStatus("Healthy Weight");
    setGoal("Maintain your current weight.");
  } else if (bmiValue < 30) {
    setStatus("Overweight");
    setGoal("Lose weight with exercise and healthy eating.");
  } else {
    setStatus("Obese");
    setGoal("Focus on gradual weight loss.");
  }
};
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
  value={age}
  onChange={(e) => setAge(e.target.value)}
  className="border p-3 w-full mb-4"
/>

<input
  type="number"
  placeholder="Weight (kg)"
  value={weight}
  onChange={(e) => setWeight(e.target.value)}
  className="border p-3 w-full mb-4"
/>
<input
  type="number"
  placeholder="Height (cm)"
  value={height}
  onChange={(e) => setHeight(e.target.value)}
  className="border p-3 w-full mb-5"
/>
<button
  onClick={calculateBMI}
  className="bg-blue-500 text-white px-5 py-2 rounded"
>
  Calculate BMI
</button>
{bmi && (
  <div className="border rounded p-6 mb-10">

    <h2 className="text-2xl font-bold mb-4">
      Your BMI
    </h2>

    <h1 className="text-5xl font-bold mb-3">
      {bmi}
    </h1>

    <p className="mb-5">
      {status}
    </p>

    <h3 className="font-bold">
      Goal
    </h3>

    <p>
      {goal}
    </p>

  </div>
)}
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

{editingId && (
  <div className="border border-blue-500 rounded p-6 mb-10 bg-blue-50">
    <h3 className="text-xl font-bold mb-4">Edit Workout</h3>
    <input
      type="text"
      value={editingName}
      onChange={(e) => setEditingName(e.target.value)}
      className="border p-3 w-full mb-4"
      placeholder="Enter workout name"
      autoFocus
    />
    <div className="flex gap-3">
      <button
        onClick={saveEdit}
        className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
      >
        Save
      </button>
      <button
        onClick={cancelEdit}
        className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {workouts.map((workout) => (

  <div
    key={workout.id}
    className="border rounded p-5 flex items-center justify-between mb-5"
  >

    <div className="flex items-center gap-5">

      <div className="w-36 h-24 border flex items-center justify-center">
        {/* IMAGE HERE */}
      </div>

      <div>

        <h2 className="text-xl font-semibold">
          {workout.name}
        </h2>

        <p>
          {workout.exercises}
        </p>

      </div>

    </div>

    <div className="relative flex items-center gap-3">

      <button
        onClick={next}
        className="bg-blue-500 text-white px-5 py-2 rounded"
      >
        Start
      </button>

      <button
        onClick={() =>
          setMenuOpen(
            menuOpen === workout.id ? null : workout.id
          )
        }
        className="text-2xl px-2"
      >
        ⋮
      </button>

      {menuOpen === workout.id && (

        <div className="absolute right-0 top-12 bg-white border rounded shadow-lg w-32">

          <button
            onClick={() => startEdit(workout.id, workout.name)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={() => deleteWorkout(workout.id)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>

        </div>

      )}

    </div>

  </div>

))}
    </div>
  );
}

export default WorkoutDashboard;