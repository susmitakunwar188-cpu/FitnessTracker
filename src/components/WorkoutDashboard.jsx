import { useState, useEffect } from "react";
import { api } from "../utils/api";

const DumbbellIcon = ({ className = "h-8 w-8 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11M12 6.5v11M3 10v4M21 10v4M6.5 5v14M17.5 5v14" />
  </svg>
);

const ScaleIcon = ({ className = "h-8 w-8 text-brand-pink" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12h6M12 9v6M3 9h18M3 15h18" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-400 inline-block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-pink inline-block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const GridIcon = ({ className = "h-6 w-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const BrandIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M8 3.5c1.2 0 2.3 1 2.3 2.2 0 1.7-1.4 2.9-2.3 4.3-.9-1.4-2.3-2.6-2.3-4.3C5.7 4.5 6.8 3.5 8 3.5Z" />
    <path d="M16 3.5c1.2 0 2.3 1 2.3 2.2 0 1.7-1.4 2.9-2.3 4.3-.9-1.4-2.3-2.6-2.3-4.3C13.7 4.5 14.8 3.5 16 3.5Z" />
    <path d="M6 11c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v5c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4v-5Z" />
    <path d="M10 15h4" />
  </svg>
);

function WorkoutDashboard({ user, setUser, logout, startWorkout }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  // Navigation tab state: "overview", "workouts", "bmi", "profile"
  const [activeTab, setActiveTab] = useState("overview");
  const [profileForm, setProfileForm] = useState({
    username: user?.username || user?.email?.split("@")[0] || "Athlete",
    avatarUrl: user?.avatarUrl || "",
    bio: user?.bio || ""
  });

  // BMI form states
  const [age, setAge] = useState(user?.age || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [height, setHeight] = useState(user?.height || "");
  
  // Local active menu states
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingExercises, setEditingExercises] = useState([]);

  // Add Workout states
  const [addingWorkout, setAddingWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");

  // Load workouts on mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await api.getWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load workouts:", err);
        setError("Could not load workouts from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Sync BMI input states if user object changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user) {
      setAge(user.age || "");
      setWeight(user.weight || "");
      setHeight(user.height || "");
      setProfileForm({
        username: user.username || user.email?.split("@")[0] || "Athlete",
        avatarUrl: user.avatarUrl || "",
        bio: user.bio || ""
      });
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Add Workout
  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!newWorkoutName.trim()) {
      alert("Please enter a workout name.");
      return;
    }

    try {
      const newW = await api.createWorkout(newWorkoutName.trim(), "4 Exercises");
      setWorkouts([...workouts, newW]);
      setNewWorkoutName("");
      setAddingWorkout(false);
      setActiveTab("workouts");
    } catch (err) {
      alert(err.message || "Failed to create workout.");
    }
  };

  // Delete Workout
  const handleDeleteWorkout = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    try {
      await api.deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w.id !== id));
      setMenuOpen(null);
    } catch (err) {
      alert(err.message || "Failed to delete workout.");
    }
  };

  // Edit Workout
  const startEdit = (workout) => {
    setEditingId(workout.id);
    setEditingName(workout.name);
    const clonedExercises = Array.isArray(workout.exercises)
      ? workout.exercises.map(ex => ({ ...ex }))
      : [];
    setEditingExercises(clonedExercises);
    setMenuOpen(null);
  };

  const saveEdit = async () => {
    if (!editingName.trim()) {
      alert("Workout name cannot be empty");
      return;
    }
    const cleanedExercises = editingExercises
      .map(ex => ({
        name: ex.name.trim(),
        sets: ex.sets.toString().trim(),
        reps: ex.reps.toString().trim()
      }))
      .filter(ex => ex.name !== "");

    try {
      const updated = await api.updateWorkout(editingId, editingName.trim(), cleanedExercises);
      setWorkouts(workouts.map((w) => (w.id === editingId ? updated : w)));
      setEditingId(null);
      setEditingName("");
      setEditingExercises([]);
    } catch (err) {
      alert(err.message || "Failed to save edit.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingExercises([]);
  };

  // BMI calculation & save
  const calculateBMI = async () => {
    if (!weight || !height) {
      alert("Please enter weight and height.");
      return;
    }
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    let status;
    let goal;

    if (bmiValue < 18.5) {
      status = "Underweight";
      goal = "Gain healthy weight with proper nutrition.";
    } else if (bmiValue < 25) {
      status = "Healthy Weight";
      goal = "Maintain your current weight with regular exercise.";
    } else if (bmiValue < 30) {
      status = "Overweight";
      goal = "Lose weight with exercise and healthy eating.";
    } else {
      status = "Obese";
      goal = "Focus on gradual weight loss with professional guidance.";
    }

    try {
      const updatedUser = await api.updateProfile({
        age,
        weight,
        height,
        bmi: bmiValue,
        status,
        goal
      });
      setUser(updatedUser);
    } catch (err) {
      alert(err.message || "Failed to save BMI profile data to server.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await api.updateProfile({
        age: user?.age || "",
        weight: user?.weight || "",
        height: user?.height || "",
        bmi: user?.bmi ?? null,
        status: user?.status || "",
        goal: user?.goal || "",
        username: profileForm.username.trim() || user?.email?.split("@")[0] || "Athlete",
        avatarUrl: profileForm.avatarUrl.trim(),
        bio: profileForm.bio.trim()
      });
      setUser(updatedUser);
      setProfileMessage("Profile updated successfully.");
      setActiveTab("overview");
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    }
  };

  const userDisplayName = user?.username || (user?.email ? user.email.split("@")[0] : "Athlete");
  const profilePlaceholder = "https://i.pinimg.com/1200x/4e/6f/a8/4e6fa8c1d410ae7d30d8c79b8728a56b.jpg";

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row text-white font-sans">
      
      {/* 1. Bigger Navigation Sidebar */}
      <aside className="w-full md:w-96 bg-sidebar-gradient border-b md:border-b-0 md:border-r border-border-pink/40 flex flex-col shrink-0">
        
        {/* Brand header with larger text and icon */}
        <div className="p-8 border-b border-border-pink/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BrandIcon />
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-white leading-none">Fitique</span>
              <span className="text-[10px] text-brand-pink tracking-[0.22em] font-quick font-bold uppercase mt-1 leading-none">light weight baby</span>
            </div>
          </div>
        </div>

        {/* User profile section with larger photo and text */}
        <div className="p-8 border-b border-border-pink/30">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-pink/70 shadow-lg shadow-brand-pink/20 bg-bg-dark/70">
                <img
                  src={user?.avatarUrl || profilePlaceholder}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="absolute bottom-1 right-1 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card-dark" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-xl text-white truncate">{userDisplayName}</h3>
              <p className="font-sans text-text-muted text-sm mt-1 font-semibold truncate">
                {user?.bio || "Premium Member"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setProfileForm({
                username: user?.username || user?.email?.split("@")[0] || "Athlete",
                avatarUrl: user?.avatarUrl || "",
                bio: user?.bio || ""
              });
              setProfileMessage("");
              setActiveTab("profile");
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-brand-cocoa/40 bg-brand-cocoa/10 px-4 py-2.5 text-sm font-display font-bold text-brand-cocoa-light hover:text-white transition hover:bg-brand-cocoa/20 cursor-pointer"
          >
            <EditIcon />
            Edit Profile
          </button>
        </div>

        {/* Navigation list with larger padding and font sizes */}
        <nav className="flex-1 p-6 space-y-3.5 mt-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-xl font-display text-base font-bold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === "overview"
                ? "bg-brand-cocoa/20 border-l-4 border-brand-pink text-brand-pink shadow-[inset_0_0_12px_rgba(226,109,133,0.08)]"
                : "text-text-muted hover:bg-brand-cocoa/10 hover:text-white"
            }`}
          >
            <GridIcon className="h-6 w-6" />
            <span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("workouts")}
            className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-xl font-display text-base font-bold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === "workouts"
                ? "bg-brand-cocoa/20 border-l-4 border-brand-pink text-brand-pink shadow-[inset_0_0_12px_rgba(226,109,133,0.08)]"
                : "text-text-muted hover:bg-brand-cocoa/10 hover:text-white"
            }`}
          >
            <DumbbellIcon className="h-6 w-6" />
            <span>Workouts Log</span>
          </button>

          <button
            onClick={() => setActiveTab("bmi")}
            className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-xl font-display text-base font-bold tracking-wide transition duration-200 cursor-pointer ${
              activeTab === "bmi"
                ? "bg-brand-cocoa/20 border-l-4 border-brand-pink text-brand-pink shadow-[inset_0_0_12px_rgba(226,109,133,0.08)]"
                : "text-text-muted hover:bg-brand-cocoa/10 hover:text-white"
            }`}
          >
            <ScaleIcon className="h-6 w-6" />
            <span>BMI Analytics</span>
          </button>
        </nav>

        {/* Logout bottom with larger font */}
        <div className="p-6 border-t border-border-pink/30">
          <button
            onClick={logout}
            className="w-full flex items-center gap-5 px-6 py-4 rounded-xl text-red-400 hover:bg-red-500/10 font-display text-base font-bold transition duration-200 cursor-pointer"
          >
            <LogoutIcon />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content area (wide container layout) */}
      <main className="flex-1 p-8 md:p-12 lg:p-16 overflow-y-auto max-w-[1440px]">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 font-medium">
            ⚠️ {error}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                Profile Editor
              </h1>
              <p className="font-sans text-text-muted text-base mt-2">
                Update your profile details and personalize your experience.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <form onSubmit={handleSaveProfile} className="bg-card-dark/90 rounded-[2rem] border border-brand-cocoa/40 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                {profileMessage && (
                  <div className="mb-6 rounded-xl border border-brand-pink/30 bg-brand-pink/10 px-4 py-3 text-sm text-brand-pink">
                    {profileMessage}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                      Username
                    </label>
                    <input
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      placeholder="Enter a display name"
                      className="glow-input w-full rounded-xl border border-border-pink/40 bg-bg-dark px-4 py-3.5 text-white outline-none focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-center bg-bg-dark p-4 rounded-xl border border-border-pink/40">
                      <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-brand-pink bg-card-dark flex items-center justify-center">
                        {profileForm.avatarUrl ? (
                          <img src={profileForm.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-text-muted">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert("Image is too large. Please upload an image smaller than 2MB.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setProfileForm({ ...profileForm, avatarUrl: event.target.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-cocoa/20 file:text-brand-cocoa-light hover:file:bg-brand-cocoa/30 file:cursor-pointer"
                        />
                        <p className="text-[10px] text-text-muted mt-1">Accepts JPG, PNG, GIF. Max size 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                        Bio
                      </label>
                      <span className={`text-xs font-bold ${profileForm.bio.length >= 140 ? 'text-brand-pink animate-pulse' : 'text-text-muted'}`}>
                        {profileForm.bio.length}/150
                      </span>
                    </div>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value.slice(0, 150) })}
                      placeholder="Tell others about your fitness vibe"
                      rows={4}
                      maxLength={150}
                      className="glow-input w-full resize-none rounded-xl border border-border-pink/40 bg-bg-dark px-4 py-3.5 text-white outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-pink px-8 py-3.5 font-display font-bold text-white transition hover:bg-brand-pink-hover cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className="rounded-xl border border-border-pink/40 bg-bg-dark/70 px-8 py-3.5 font-display font-bold text-text-muted transition hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="rounded-[2rem] border border-border-pink/40 bg-card-dark/80 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-text-muted">
                  Profile Preview
                </p>
                <div className="rounded-[1.6rem] border border-border-pink/30 bg-bg-dark/70 p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={profileForm.avatarUrl || profilePlaceholder}
                      alt="Preview avatar"
                      className="h-20 w-20 rounded-full border-2 border-brand-pink/70 object-cover object-center bg-card-dark"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-2xl font-bold text-white truncate">
                        {profileForm.username || userDisplayName}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-text-muted break-words leading-relaxed">
                        {profileForm.bio || "Premium Member"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="font-sans text-text-muted text-base mt-2">
                Keep tabs on your key metrics and dynamic statistics
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-card-dark to-[#251715]/40 rounded-3xl p-8 border border-brand-cocoa/30 hover:border-brand-pink/40 hover:-translate-y-1 transition duration-300 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-quick text-xs font-bold text-text-muted tracking-widest uppercase mb-1">Total Workouts</p>
                    <h3 className="font-display text-5xl font-bold text-white">
                      {loading ? "..." : workouts.length}
                    </h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-brand-cocoa/20 border border-brand-cocoa/30 text-brand-pink">
                    <DumbbellIcon />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card-dark to-[#251715]/40 rounded-3xl p-8 border border-brand-cocoa/30 hover:border-brand-pink/40 hover:-translate-y-1 transition duration-300 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-quick text-xs font-bold text-text-muted tracking-widest uppercase mb-1">Current BMI</p>
                    <h3 className="font-display text-5xl font-bold text-white">
                      {user?.bmi || "—"}
                    </h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-brand-cocoa/20 border border-brand-cocoa/30 text-brand-pink">
                    <ScaleIcon />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-card-dark to-[#251715]/40 rounded-3xl p-8 border border-brand-cocoa/30 hover:border-brand-pink/40 hover:-translate-y-1 transition duration-300 shadow-xl shadow-black/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-quick text-xs font-bold text-text-muted tracking-widest uppercase mb-1">Weekly Goal</p>
                    <h3 className="font-display text-5xl font-bold text-white">
                      {workouts.length > 0 ? `${Math.min(workouts.length, 7)}/7` : "0/7"}
                    </h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-brand-cocoa/20 border border-brand-cocoa/30 text-brand-pink">
                    <TargetIcon />
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Workouts */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 tracking-tight">
                Recommended Workouts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {["Upper Body", "Cardio", "HIIT"].map((workout) => (
                  <div key={workout} className="bg-card-dark rounded-3xl p-6 border border-brand-cocoa/30 flex items-center justify-between shadow-md">
                    <span className="font-display font-bold text-white text-lg">{workout}</span>
                    <span className="bg-brand-cocoa/20 border border-brand-cocoa/30 text-brand-cocoa-light text-xs font-bold px-3 py-1.5 rounded-full uppercase font-quick">
                      Recommended
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Short quick link summary */}
            <div className="bg-card-dark rounded-3xl p-8 border border-brand-cocoa/30 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Customize Your Routine</h3>
                <p className="font-sans text-text-muted text-sm mt-1">Add, edit, or remove workout categories inside the Log panel.</p>
              </div>
              <button
                onClick={() => setActiveTab("workouts")}
                className="glow-button font-display font-bold px-8 py-3.5 rounded-xl text-sm cursor-pointer"
              >
                Open Workouts Log
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: WORKOUTS LOG (CRUD) */}
        {activeTab === "workouts" && (
          <div className="animate-fadeIn">
            {/* Title + Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                  Workouts Log
                </h1>
                <p className="font-sans text-text-muted text-base mt-2">Create and edit your custom workout routines</p>
              </div>
              {!addingWorkout && (
                <button
                  onClick={() => setAddingWorkout(true)}
                  className="bg-brand-cocoa/20 hover:bg-brand-cocoa/35 border border-brand-cocoa/40 hover:border-brand-cocoa text-white font-display font-bold text-base px-6 py-3 rounded-xl transition duration-200 cursor-pointer"
                >
                  + Add Workout
                </button>
              )}
            </div>

            {/* Add Workout Form Inline */}
            {addingWorkout && (
              <form onSubmit={handleAddWorkout} className="bg-card-dark rounded-3xl p-6 border-2 border-brand-cocoa/40 mb-8 animate-fadeIn">
                <h3 className="text-lg font-display font-bold text-white mb-4">Add New Workout Category</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-2">
                  <input
                    type="text"
                    required
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                    placeholder="e.g. Back Day, Shoulder Burner"
                    className="glow-input font-sans border-2 border-border-pink rounded-xl p-3.5 bg-bg-dark text-white text-base focus:border-brand-pink focus:outline-none flex-1"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="glow-button font-display font-bold px-6 py-3.5 rounded-xl text-sm cursor-pointer"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewWorkoutName("");
                        setAddingWorkout(false);
                      }}
                      className="bg-bg-dark hover:bg-card-dark text-text-muted border border-border-pink/80 hover:text-white font-display font-bold px-6 py-3.5 rounded-xl text-sm transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Edit Workout Block */}
            {editingId && (
              <div className="bg-card-dark rounded-[2rem] p-6 md:p-8 mb-8 border border-brand-cocoa/45 shadow-2xl animate-fadeIn">
                <h3 className="text-xl font-display font-bold text-white mb-6 border-b border-border-pink/30 pb-4">
                  Edit Workout Plan
                </h3>
                
                <div className="space-y-6">
                  {/* Workout Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2.5 tracking-widest uppercase font-quick">Workout Name</label>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white text-base focus:border-brand-pink focus:outline-none"
                      placeholder="e.g. Leg Day Burner"
                      autoFocus
                    />
                  </div>

                  {/* Exercises List in Form */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-semibold text-text-muted tracking-widest uppercase font-quick">Exercises</label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExercises([
                            ...editingExercises,
                            { name: "", sets: "", reps: "" }
                          ]);
                        }}
                        className="text-xs bg-brand-cocoa/20 hover:bg-brand-cocoa/30 text-brand-cocoa-light hover:text-white font-display font-bold px-3 py-1.5 rounded-xl border border-brand-cocoa/30 transition cursor-pointer"
                      >
                        + Add Exercise
                      </button>
                    </div>

                    {editingExercises.length === 0 ? (
                      <div className="text-center py-6 bg-bg-dark/50 rounded-2xl border border-border-pink/20">
                        <p className="text-sm font-sans text-text-muted">No exercises added. Click "+ Add Exercise" to start building your routine.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editingExercises.map((exercise, index) => (
                          <div key={index} className="flex flex-col md:flex-row items-center gap-3 bg-bg-dark/40 p-4 rounded-2xl border border-border-pink/25 animate-fadeIn">
                            {/* Exercise Name */}
                            <div className="flex-1 w-full">
                              <input
                                type="text"
                                placeholder="Exercise Name (e.g. Bench Press)"
                                value={exercise.name}
                                onChange={(e) => {
                                  const updated = [...editingExercises];
                                  updated[index].name = e.target.value;
                                  setEditingExercises(updated);
                                }}
                                className="glow-input font-sans border-2 border-border-pink rounded-xl p-3.5 w-full bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none"
                              />
                            </div>
                            
                            {/* Sets */}
                            <div className="w-full md:w-28 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Sets"
                                value={exercise.sets}
                                onChange={(e) => {
                                  const updated = [...editingExercises];
                                  updated[index].sets = e.target.value;
                                  setEditingExercises(updated);
                                }}
                                className="glow-input font-sans border-2 border-border-pink rounded-xl p-3.5 w-full bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none text-center"
                              />
                              <span className="text-xs text-text-muted md:hidden font-quick font-bold uppercase">sets</span>
                            </div>

                            {/* Reps */}
                            <div className="w-full md:w-28 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Reps"
                                value={exercise.reps}
                                onChange={(e) => {
                                  const updated = [...editingExercises];
                                  updated[index].reps = e.target.value;
                                  setEditingExercises(updated);
                                }}
                                className="glow-input font-sans border-2 border-border-pink rounded-xl p-3.5 w-full bg-bg-dark text-white text-sm focus:border-brand-pink focus:outline-none text-center"
                              />
                              <span className="text-xs text-text-muted md:hidden font-quick font-bold uppercase">reps</span>
                            </div>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingExercises(editingExercises.filter((_, idx) => idx !== index));
                              }}
                              className="p-3 text-red-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-xl transition cursor-pointer"
                              title="Delete Exercise Row"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save and Cancel buttons */}
                <div className="mt-8 flex justify-end gap-3.5 border-t border-border-pink/30 pt-6">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="glow-button font-display font-bold px-8 py-3.5 rounded-xl text-sm cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-bg-dark hover:bg-card-dark text-text-muted border border-border-pink/80 hover:text-white font-display font-bold px-8 py-3.5 rounded-xl text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Workouts List */}
            {loading ? (
              <div className="text-center py-12 bg-card-dark rounded-3xl border border-brand-cocoa/30">
                <div className="w-10 h-10 border-4 border-t-brand-pink border-r-transparent border-b-brand-pink border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-sans text-text-muted">Loading workouts list...</p>
              </div>
            ) : workouts.length === 0 ? (
              <div className="text-center py-16 bg-card-dark rounded-3xl border border-brand-cocoa/30">
                <div className="mb-4">
                  <DumbbellIcon className="h-16 w-16 text-text-muted mx-auto filter drop-shadow-[0_0_8px_rgba(226,109,133,0.2)] animate-pulse" />
                </div>
                <p className="font-display font-bold text-lg text-white mb-2">No workouts logged yet</p>
                <p className="font-sans text-text-muted text-sm max-w-sm mx-auto mb-6">
                  Create your first customized workout category by clicking the "+ Add Workout" button above.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="bg-card-dark rounded-[1.8rem] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-brand-cocoa/30 hover:border-brand-pink/20 hover:shadow-lg hover:shadow-brand-cocoa/5 transition duration-200 gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-20 bg-gradient-to-br from-brand-pink/15 to-brand-cocoa/10 rounded-2xl flex items-center justify-center border border-brand-cocoa/20">
                        <DumbbellIcon />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                          {workout.name}
                        </h2>
                        <p className="font-sans text-brand-cocoa-light text-sm mt-1 font-semibold">
                          {Array.isArray(workout.exercises) ? `${workout.exercises.length} Exercises` : '0 Exercises'}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-center gap-4 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => startWorkout(workout)}
                        className="glow-button font-display font-bold px-6 py-2.5 rounded-full text-sm shadow-md cursor-pointer"
                      >
                        Start Workout
                      </button>
                      <button
                        onClick={() => setMenuOpen(menuOpen === workout.id ? null : workout.id)}
                        className="text-2xl px-3 py-1 hover:bg-border-pink/40 text-text-muted hover:text-white rounded-full transition cursor-pointer"
                      >
                        ⋮
                      </button>
                      {menuOpen === workout.id && (
                        <div className="absolute right-0 top-12 bg-bg-dark rounded-2xl shadow-2xl border border-brand-cocoa/40 w-44 overflow-hidden z-20">
                          <button
                            onClick={() => startEdit(workout)}
                            className="w-full text-left px-5 py-3.5 font-sans text-sm hover:bg-card-dark text-white hover:text-brand-pink transition flex items-center gap-2.5 cursor-pointer"
                          >
                            <EditIcon />
                            <span>Edit Workout</span>
                          </button>
                          <button
                            onClick={() => handleDeleteWorkout(workout.id)}
                            className="w-full text-left px-5 py-3.5 font-sans text-sm text-red-400 hover:bg-card-dark transition flex items-center gap-2.5 cursor-pointer"
                          >
                            <TrashIcon />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BMI ANALYTICS */}
        {activeTab === "bmi" && (
          <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                BMI Analytics
              </h1>
              <p className="font-sans text-text-muted text-base mt-2">Track weight goals and check body mass indexes</p>
            </div>

            {/* Split Grid to eliminate empty wide margins */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              
              {/* Left Column: Calculator inputs */}
              <div className="lg:col-span-7 bg-gradient-to-br from-card-dark to-[#251715]/65 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-brand-cocoa/30 shadow-xl flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 tracking-tight">
                    BMI Calculator
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-xs font-bold text-text-muted mb-2.5 uppercase font-quick tracking-wider">Age</label>
                      <input
                        type="number"
                        placeholder="Years"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white text-base focus:border-brand-pink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-muted mb-2.5 uppercase font-quick tracking-wider">Weight (kg)</label>
                      <input
                        type="number"
                        placeholder="kg"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white text-base focus:border-brand-pink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-muted mb-2.5 uppercase font-quick tracking-wider">Height (cm)</label>
                      <input
                        type="number"
                        placeholder="cm"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="glow-input font-sans border-2 border-border-pink rounded-xl p-4 w-full bg-bg-dark text-white text-base focus:border-brand-pink focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={calculateBMI}
                  className="glow-button font-display font-bold px-8 py-4 rounded-xl text-base w-full sm:w-auto cursor-pointer"
                >
                  Calculate & Save BMI
                </button>
              </div>

              {/* Right Column: Standard Guidelines reference table */}
              <div className="lg:col-span-5 bg-card-dark/95 backdrop-blur-md rounded-3xl p-8 border border-brand-cocoa/25 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-4">BMI Standards Reference</h3>
                  <p className="font-sans text-text-muted text-sm mb-6 leading-relaxed">
                    Body Mass Index (BMI) is a simplified measurement using height and weight to assess weight categories.
                  </p>
                  
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-dark/40 border border-brand-cocoa/20">
                      <span className="font-sans text-sm text-white">Underweight</span>
                      <span className="font-display font-bold text-brand-pink text-sm">&lt; 18.5</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-dark/40 border border-brand-cocoa/20">
                      <span className="font-sans text-sm text-white">Normal Weight</span>
                      <span className="font-display font-bold text-green-400 text-sm">18.5 – 24.9</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-dark/40 border border-brand-cocoa/20">
                      <span className="font-sans text-sm text-white">Overweight</span>
                      <span className="font-display font-bold text-orange-400 text-sm">25.0 – 29.9</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-bg-dark/40 border border-brand-cocoa/20">
                      <span className="font-sans text-sm text-white">Obese</span>
                      <span className="font-display font-bold text-red-400 text-sm">&ge; 30.0</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Calculated BMI Display Card */}
            {user?.bmi && (
              <div className="bg-gradient-to-br from-[#3D2320] via-[#2A1816] to-[#1C1211] rounded-3xl p-8 md:p-12 border border-brand-cocoa/40 shadow-2xl animate-fadeIn">
                <div className="text-center">
                  <p className="font-quick text-xs font-bold text-brand-pink tracking-widest uppercase">YOUR BODY MASS INDEX</p>
                  <h1 className="text-6xl md:text-7xl font-display font-extrabold text-white my-3 tracking-tight">
                    {user.bmi}
                  </h1>
                  <p className="font-display text-2xl font-bold text-brand-pink mb-6">
                    {user.status}
                  </p>
                  <div className="bg-[#160E0D] rounded-2xl p-5 border border-brand-cocoa/30 max-w-md mx-auto">
                    <p className="font-display font-bold text-white text-sm tracking-wider uppercase mb-1">Recommended Goal</p>
                    <p className="font-sans text-text-muted text-sm md:text-base leading-relaxed">{user.goal}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkoutDashboard;