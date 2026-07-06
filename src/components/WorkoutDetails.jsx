const DumbbellIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand-pink filter drop-shadow-[0_0_8px_rgba(255,74,139,0.4)] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11M12 6.5v11M3 10v4M21 10v4M6.5 5v14M17.5 5v14" />
  </svg>
);

function WorkoutDetails({ workout, goDashboard }) {
  const workoutName = workout?.name || "Workout Session";

  // Generate dynamic exercises based on workout name
  const getExercises = (name) => {
    const n = name.toLowerCase();
    if (n.includes("bicep") || n.includes("arm")) {
      return [
        { name: "Dumbbell Bicep Curl", sets: "3 Sets × 12 Reps" },
        { name: "Hammer Curl", sets: "3 Sets × 10 Reps" },
        { name: "Concentration Curl", sets: "3 Sets × 12 Reps" },
        { name: "EZ-Bar Preacher Curl", sets: "4 Sets × 8 Reps" },
      ];
    } else if (n.includes("chest") || n.includes("push")) {
      return [
        { name: "Flat Barbell Bench Press", sets: "4 Sets × 10 Reps" },
        { name: "Incline Dumbbell Press", sets: "3 Sets × 12 Reps" },
        { name: "Cable Chest Fly", sets: "3 Sets × 15 Reps" },
        { name: "Bodyweight Push-up", sets: "3 Sets × Max Reps" },
      ];
    } else if (n.includes("leg") || n.includes("squat")) {
      return [
        { name: "Barbell Back Squat", sets: "4 Sets × 8 Reps" },
        { name: "Leg Press Machine", sets: "3 Sets × 12 Reps" },
        { name: "Dumbbell Romanian Deadlift", sets: "3 Sets × 10 Reps" },
        { name: "Seated Calf Raise", sets: "4 Sets × 15 Reps" },
      ];
    } else if (n.includes("core") || n.includes("abs") || n.includes("belly")) {
      return [
        { name: "Forearm Plank Hold", sets: "3 Sets × 60 Secs" },
        { name: "Hanging Leg Raise", sets: "3 Sets × 12 Reps" },
        { name: "Weighted Russian Twist", sets: "3 Sets × 20 Reps" },
        { name: "Ab Wheel Rollout", sets: "3 Sets × 10 Reps" },
      ];
    } else if (n.includes("back") || n.includes("pull")) {
      return [
        { name: "Barbell Conventional Deadlift", sets: "4 Sets × 5 Reps" },
        { name: "Wide-Grip Pull-up", sets: "3 Sets × Max Reps" },
        { name: "Single-Arm Dumbbell Row", sets: "3 Sets × 10 Reps" },
        { name: "Lat Pulldown Machine", sets: "3 Sets × 12 Reps" },
      ];
    } else if (n.includes("shoulder") || n.includes("press")) {
      return [
        { name: "Seated Overhead Dumbbell Press", sets: "4 Sets × 10 Reps" },
        { name: "Dumbbell Lateral Raise", sets: "4 Sets × 12 Reps" },
        { name: "Bent-Over Rear Delt Fly", sets: "3 Sets × 15 Reps" },
        { name: "Cable Face Pull", sets: "3 Sets × 15 Reps" },
      ];
    } else if (n.includes("cardio") || n.includes("hiit") || n.includes("run")) {
      return [
        { name: "High-Intensity Burpees", sets: "4 Sets × 45 Secs" },
        { name: "Mountain Climbers", sets: "4 Sets × 50 Secs" },
        { name: "Bodyweight Air Squats", sets: "4 Sets × 20 Reps" },
        { name: "Jumping Jacks", sets: "3 Sets × 60 Secs" },
      ];
    } else {
      // Default standard workout list
      return [
        { name: "Bodyweight Air Squat", sets: "4 Sets × 15 Reps" },
        { name: "Incline Push-up", sets: "3 Sets × 12 Reps" },
        { name: "Plank Shoulder Tap", sets: "3 Sets × 20 Reps" },
        { name: "Jumping Jack Cardio Boost", sets: "3 Sets × 45 Secs" },
      ];
    }
  };

  const exercises = getExercises(workoutName);

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 md:p-10">
      <div className="max-w-3xl w-full bg-card-dark rounded-[2.5rem] shadow-[0_20px_55px_rgba(0,0,0,0.5)] border border-border-pink/40 p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-pink/30">
          <DumbbellIcon />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
            {workoutName}
          </h1>
        </div>

        {/* Exercises list */}
        <div className="space-y-6 mb-10">
          {exercises.map((exercise) => (
            <div
              key={exercise.name}
              className="pb-6 border-b border-border-pink/20 last:border-0"
            >
              <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                {exercise.name}
              </h2>
              <p className="font-sans text-text-muted text-sm md:text-base">{exercise.sets}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={goDashboard}
            className="bg-card-dark border border-border-pink hover:bg-border-pink text-white font-display font-bold px-8 py-3 rounded-full shadow-lg transition duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutDetails;