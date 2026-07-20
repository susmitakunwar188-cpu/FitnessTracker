import { useState, useEffect, useRef } from "react";

const DumbbellIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10 text-brand-pink filter drop-shadow-[0_0_8px_rgba(255,74,139,0.4)] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11M12 6.5v11M3 10v4M21 10v4M6.5 5v14M17.5 5v14" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const getWorkoutVisual = (workout) => {
  if (workout?.imageUrl) return workout.imageUrl;

  const name = (workout?.name || "").toLowerCase();
  if (name.includes("leg") || name.includes("squat") || name.includes("glute")) {
    return "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80";
  }
  if (name.includes("back") || name.includes("pull")) {
    return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80";
  }
  if (name.includes("chest") || name.includes("push") || name.includes("upper")) {
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80";
  }
  if (name.includes("core") || name.includes("abs") || name.includes("cardio") || name.includes("hiit")) {
    return "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80";
  }
  return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80";
};

function WorkoutDetails({ workout, goDashboard }) {
  const workoutName = workout?.name || "Workout Session";

  // Stopwatch states
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  // Countdown states
  const [countdownTime, setCountdownTime] = useState(60);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [initialCountdown, setInitialCountdown] = useState(60);
  const [timerAlert, setTimerAlert] = useState(false);

  // Checklist state
  const [completedExercises, setCompletedExercises] = useState({});

  // Refs for intervals
  const stopwatchIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Stopwatch Timer effect
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchIntervalRef.current);
    }
    return () => clearInterval(stopwatchIntervalRef.current);
  }, [isStopwatchRunning]);

  // Countdown Timer effect
  useEffect(() => {
    if (isCountdownRunning) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            setIsCountdownRunning(false);
            setTimerAlert(true);
            // Play a synthetic beep using Web Audio API!
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const oscillator = audioCtx.createOscillator();
              const gainNode = audioCtx.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.type = "sine";
              oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
              gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
              oscillator.start();
              oscillator.stop(audioCtx.currentTime + 0.4);
            } catch (e) {
              console.log("Audio play failed:", e);
            }
            // Auto hide visual alert
            setTimeout(() => setTimerAlert(false), 5000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownIntervalRef.current);
    }
    return () => clearInterval(countdownIntervalRef.current);
  }, [isCountdownRunning]);

  // Format time (seconds -> MM:SS)
  const formatTime = (timeInSeconds) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate dynamic legacy exercises if database list is empty
  const getLegacyExercises = (name) => {
    const n = name.toLowerCase();
    if (n.includes("bicep") || n.includes("arm")) {
      return [
        { name: "Dumbbell Bicep Curl", sets: "3", reps: "12" },
        { name: "Hammer Curl", sets: "3", reps: "10" },
        { name: "Concentration Curl", sets: "3", reps: "12" },
        { name: "EZ-Bar Preacher Curl", sets: "4", reps: "8" },
      ];
    } else if (n.includes("chest") || n.includes("push")) {
      return [
        { name: "Flat Barbell Bench Press", sets: "4", reps: "10" },
        { name: "Incline Dumbbell Press", sets: "3", reps: "12" },
        { name: "Cable Chest Fly", sets: "3", reps: "15" },
        { name: "Bodyweight Push-up", sets: "3", reps: "Max" },
      ];
    } else if (n.includes("leg") || n.includes("squat")) {
      return [
        { name: "Barbell Back Squat", sets: "4", reps: "8" },
        { name: "Leg Press Machine", sets: "3", reps: "12" },
        { name: "Dumbbell Romanian Deadlift", sets: "3", reps: "10" },
        { name: "Seated Calf Raise", sets: "4", reps: "15" },
      ];
    } else if (n.includes("core") || n.includes("abs") || n.includes("belly")) {
      return [
        { name: "Forearm Plank Hold", sets: "3", reps: "60s" },
        { name: "Hanging Leg Raise", sets: "3", reps: "12" },
        { name: "Weighted Russian Twist", sets: "3", reps: "20" },
        { name: "Ab Wheel Rollout", sets: "3", reps: "10" },
      ];
    } else {
      return [
        { name: "Bodyweight Air Squat", sets: "4", reps: "15" },
        { name: "Incline Push-up", sets: "3", reps: "12" },
        { name: "Plank Shoulder Tap", sets: "3", reps: "20" },
        { name: "Jumping Jack Cardio Boost", sets: "3", reps: "45s" },
      ];
    }
  };

  const exercises = Array.isArray(workout?.exercises) && workout.exercises.length > 0
    ? workout.exercises
    : getLegacyExercises(workoutName);

  const toggleCompleted = (idx) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSetPreset = (seconds) => {
    setIsCountdownRunning(false);
    setInitialCountdown(seconds);
    setCountdownTime(seconds);
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 md:p-12 lg:p-16">
      <div className="max-w-5xl w-full bg-gradient-to-br from-card-dark via-[#1D1312] to-[#251715] rounded-[2.5rem] shadow-[0_25px_65px_rgba(0,0,0,0.7)] border border-brand-cocoa/40 p-8 md:p-12">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border-pink/30 flex-wrap">
          <div className="flex items-center gap-4">
            <DumbbellIcon />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              {workoutName}
            </h1>
          </div>
          <button
            onClick={goDashboard}
            className="glow-button-cocoa font-display font-bold px-8 py-3 rounded-full shadow-lg transition duration-200 cursor-pointer text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="mb-8 overflow-hidden rounded-[2rem] border border-brand-cocoa/30 bg-[#1b1212] shadow-lg">
          <img
            src={getWorkoutVisual(workout)}
            alt={`${workoutName} workout preview`}
            className="h-56 w-full object-cover"
          />
        </div>

        {timerAlert && (
          <div className="bg-brand-pink/20 border-2 border-brand-pink text-white px-6 py-4.5 rounded-2xl mb-8 font-display font-bold text-center tracking-wide shadow-lg shadow-brand-pink/20 animate-pulse animate-fadeIn">
            🔔 Rest Over! Time to start the next set! 💪
          </div>
        )}

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Exercises checklist */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-xs font-semibold text-text-muted tracking-widest uppercase font-quick mb-2">Exercise Routine Checklist</h3>
            {exercises.map((exercise, idx) => (
              <div
                key={idx}
                onClick={() => toggleCompleted(idx)}
                className={`p-5 rounded-2xl border transition duration-300 cursor-pointer flex items-center justify-between gap-4 select-none ${
                  completedExercises[idx]
                    ? "bg-[#181211]/30 border-brand-cocoa/20 shadow-inner"
                    : "bg-[#1E1516]/80 border-border-pink/40 hover:border-brand-pink/25 shadow-md"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-lg md:text-xl font-display font-bold transition duration-200 truncate ${
                      completedExercises[idx]
                        ? "line-through text-text-muted/50"
                        : "text-white"
                    }`}
                  >
                    {exercise.name}
                  </h2>
                  <p
                    className={`font-sans text-xs md:text-sm transition duration-200 mt-0.5 ${
                      completedExercises[idx] ? "text-text-muted/40" : "text-brand-cocoa-light font-semibold"
                    }`}
                  >
                    {exercise.sets} Sets × {exercise.reps} Reps
                  </p>
                </div>
                
                {/* Completed Checkbox */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    completedExercises[idx]
                      ? "bg-green-500 border-green-500 text-white scale-110 shadow-lg shadow-green-500/20"
                      : "border-border-pink/80 hover:border-brand-pink"
                  }`}
                >
                  {completedExercises[idx] && (
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Timer panel widgets */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-semibold text-text-muted tracking-widest uppercase font-quick mb-2">Workout Companion Timers</h3>
            
            {/* Stopwatch Widget */}
            <div className="bg-[#181110]/90 rounded-3xl border border-brand-cocoa/40 p-6 shadow-xl flex flex-col justify-between">
              <div className="mb-4">
                <p className="font-quick text-xs font-bold text-text-muted tracking-widest uppercase">Workout Time</p>
                <div className="font-mono text-4xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
                  {formatTime(stopwatchTime)}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                  className={`flex-1 flex items-center justify-center gap-2 font-display font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md ${
                    isStopwatchRunning
                      ? "bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30"
                      : "bg-brand-pink hover:bg-brand-pink-hover text-white"
                  }`}
                >
                  {isStopwatchRunning ? (
                    <>
                      <PauseIcon />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon />
                      <span>Resume</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsStopwatchRunning(false);
                    setStopwatchTime(0);
                  }}
                  className="bg-bg-dark hover:bg-card-dark text-text-muted hover:text-white border border-border-pink/80 p-3 rounded-xl transition cursor-pointer"
                  title="Reset Stopwatch"
                >
                  <ResetIcon />
                </button>
              </div>
            </div>

            {/* Rest Countdown Timer Widget */}
            <div className="bg-[#181110]/90 rounded-3xl border border-brand-cocoa/40 p-6 shadow-xl flex flex-col justify-between">
              <div className="mb-5">
                <p className="font-quick text-xs font-bold text-text-muted tracking-widest uppercase mb-2">Rest Interval Timer</p>
                
                {/* Preset intervals */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[30, 60, 90, 120].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => handleSetPreset(sec)}
                      className={`text-xs font-display font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border ${
                        initialCountdown === sec
                          ? "bg-brand-cocoa border-brand-cocoa text-white shadow-md shadow-brand-cocoa/25"
                          : "bg-bg-dark/60 border-brand-cocoa/20 text-text-muted hover:text-white hover:border-brand-cocoa/40"
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-4xl md:text-5xl font-extrabold text-brand-pink tracking-tight">
                    {formatTime(countdownTime)}
                  </div>
                  <span className="text-xs text-text-muted font-sans font-semibold">
                    Preset: {formatTime(initialCountdown)}
                  </span>
                </div>
                
                {/* Horizontal simple progress bar */}
                <div className="w-full h-1.5 bg-bg-dark rounded-full mt-4.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-cocoa to-brand-pink transition-all duration-300"
                    style={{ width: `${initialCountdown > 0 ? (countdownTime / initialCountdown) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCountdownRunning(!isCountdownRunning)}
                  className={`flex-1 flex items-center justify-center gap-2 font-display font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md ${
                    isCountdownRunning
                      ? "bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30"
                      : "bg-brand-cocoa hover:bg-brand-cocoa-hover text-white shadow-lg shadow-brand-cocoa/20"
                  }`}
                  disabled={countdownTime === 0}
                >
                  {isCountdownRunning ? (
                    <>
                      <PauseIcon />
                      <span>Pause Rest</span>
                    </>
                  ) : (
                    <>
                      <PlayIcon />
                      <span>Start Rest</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsCountdownRunning(false);
                    setCountdownTime(initialCountdown);
                  }}
                  className="bg-bg-dark hover:bg-card-dark text-text-muted hover:text-white border border-border-pink/80 p-3 rounded-xl transition cursor-pointer"
                  title="Reset Countdown"
                >
                  <ResetIcon />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default WorkoutDetails;