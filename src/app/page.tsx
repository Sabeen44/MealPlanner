
"use client";

import { estimateCalories } from "./lib/calorie";
import Link from "next/link";

import { useState, type FormEvent } from "react";

type Goal = "lose" | "maintain" | "gain";
type Activity = "sedentary" | "light" | "moderate" | "high";
type HeightUnit = "cm" | "ft";
type WeightUnit = "kg" | "lb";
type SexForEquation = "male" | "female";

type Profile = {
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
  sexForEquation: SexForEquation;
  restingCalories: number;
  maintenanceCalories: number;
  targetCalories: number;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

const labelClass = "text-sm font-medium text-stone-700";

const activities: { value: Activity; label: string }[] = [
  { value: "sedentary", label: "Mostly sitting, little exercise" },
  { value: "light", label: "Light activity, 1–3 days/week" },
  { value: "moderate", label: "Moderate activity, 3–5 days/week" },
  { value: "high", label: "Very active most days" },
];

const goals: { value: Goal; label: string; description: string }[] = [
  { value: "lose", label: "Lose weight", description: "Work toward weight loss" },
  { value: "maintain", label: "Maintain", description: "Stay around my current weight" },
  { value: "gain", label: "Gain weight", description: "Work toward weight gain" },
];

export default function Home() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [sexForEquation, setSexForEquation] =useState<SexForEquation | "">("");

  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<Activity | "">("");
  const [goal, setGoal] = useState<Goal | "">("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profile, setProfile] = useState<Profile | null>(null);


    function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  console.log("Form submitted!");

    const nextErrors: Record<string, string> = {};

    const ageValue = Number(age);
    const weightValue = Number(weight);

    let heightCm = 0;

    if (heightUnit === "cm") {
      heightCm = Number(height);
    } else {
      heightCm = (Number(feet) * 12 + Number(inches)) * 2.54;
    }

    const weightKg =
      weightUnit === "kg" ? weightValue : weightValue / 2.2046226218;

    if (!age || !Number.isInteger(ageValue) || ageValue < 18 || ageValue > 100) {
      nextErrors.age = "Enter an age between 18 and 100.";
    }

    if (heightUnit === "cm") {
      if (!height || !Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) {
        nextErrors.height = "Enter a height between 100 and 250 cm.";
      }
    } else {
      const feetValue = Number(feet);
      const inchesValue = Number(inches);

      if (
        feet === "" ||
        inches === "" ||
        !Number.isInteger(feetValue) ||
        !Number.isFinite(inchesValue) ||
        feetValue < 3 ||
        feetValue > 8 ||
        inchesValue < 0 ||
        inchesValue >= 12 ||
        heightCm < 100 ||
        heightCm > 250
      ) {
        nextErrors.height = "Enter a valid height in feet and inches.";
      }
    }

    if (
      !weight ||
      !Number.isFinite(weightValue) ||
      weightValue <= 0 ||
      weightKg < 30 ||
      weightKg > 350
    ) {
      nextErrors.weight = "Enter a weight between 30 and 350 kg (or equivalent).";
    }

    if (!activity) {
      nextErrors.activity = "Please select your activity level.";
    }

    if (!goal) {
      nextErrors.goal = "Please choose your goal.";
    }

      if (!sexForEquation) {
  nextErrors.sexForEquation = "Choose a calculation setting.";
}

    setErrors(nextErrors);

    console.log("Validation errors:", nextErrors);
console.log("Selected values:", {
  activity,
  goal,
  sexForEquation,
});

  

    if (
  Object.keys(nextErrors).length > 0 ||
  !activity ||
  !goal ||
  !sexForEquation
) {
  return;
}

const estimate = estimateCalories({
  age: ageValue,
  heightCm,
  weightKg,
  sexForEquation,
  activity,
  goal,
});

  setProfile({
  age: ageValue,
  heightCm: Math.round(heightCm * 10) / 10,
  weightKg: Math.round(weightKg * 10) / 10,
  activity,
  goal,
  sexForEquation,
  restingCalories: estimate.restingCalories,
  maintenanceCalories: estimate.maintenanceCalories,
  targetCalories: estimate.targetCalories,
});

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleEdit() {
    setProfile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchHeightUnit(unit: HeightUnit) {
    if (unit === heightUnit) return;

    if (unit === "ft" && height !== "") {
      const totalInches = Number(height) / 2.54;
      setFeet(String(Math.floor(totalInches / 12)));
      setInches(String(Math.round((totalInches % 12) * 10) / 10));
    } else if (unit === "cm" && feet !== "" && inches !== "") {
      setHeight(
        String(
          Math.round((Number(feet) * 12 + Number(inches)) * 2.54 * 10) / 10
        )
      );
    }

    setHeightUnit(unit);
    setErrors((previous) => {
      const next = { ...previous };
      delete next.height;
      return next;
    });
  }

  function switchWeightUnit(unit: WeightUnit) {
    if (unit === weightUnit) return;

    if (weight !== "") {
      const converted =
        unit === "lb" ? Number(weight) * 2.2046226218 : Number(weight) / 2.2046226218;
      setWeight(String(Math.round(converted * 10) / 10));
    }

    setWeightUnit(unit);
    setErrors((previous) => {
      const next = { ...previous };
      delete next.weight;
      return next;
    });
  }

  const selectedGoal = goals.find((item) => item.value === profile?.goal);
  const selectedActivity = activities.find(
    (item) => item.value === profile?.activity
  );

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-stone-900">
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-xl text-white">
            ✳
          </div>
          <div>
            <p className="font-semibold tracking-tight">Meal Planner</p>
            <p className="text-xs text-stone-500">
              Pakistani food, made balanced
            </p>
          </div>
        </Link>
        <span className="hidden text-sm text-stone-500 sm:block">
          Your journey starts here
        </span>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900">
            Healthy meals. Pakistani flavours.
          </span>

          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Eat better without giving up the food you love.
          </h1>

          <p className="max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
            Get a personalized 7-day meal plan built around familiar Pakistani
            meals, sensible portions, and your daily nutrition goals.
          </p>

          <div className="space-y-4 pt-2">
            {[
              "Everyday Pakistani meals",
              "Calories and macros made simple",
              "Your portion of a shared family meal",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                  ✓
                </span>
                <span className="text-sm text-stone-700 sm:text-base">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="hidden rounded-2xl border border-stone-200 bg-white p-5 lg:block">
            <p className="text-sm font-medium text-stone-500">OUR APPROACH</p>
            <p className="mt-2 text-lg font-medium">
              Keep the food. Find your balance.
            </p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              From daal and roti to biryani, healthy eating should fit your life
              and your table.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          {profile ? (
            <div>
              <div className="mb-7">
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-900">
                  STEP COMPLETE
                </span>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  Your profile is ready
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Review your details before we build the next part of your
                  meal-planning experience.
                </p>
              </div>

              <dl className="divide-y divide-stone-100 rounded-2xl border border-stone-200 px-4">
                {[
                  ["Age", `${profile.age} years`],
                  ["Height", `${profile.heightCm} cm`],
                  ["Weight", `${profile.weightKg} kg`],
                  ["Activity", selectedActivity?.label ?? ""],
                  ["Goal", selectedGoal?.label ?? ""],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-4"
                  >
                    <dt className="text-sm text-stone-500">{label}</dt>
                    <dd className="max-w-[65%] text-right text-sm font-medium">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              
<div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
  <p className="text-sm font-medium text-emerald-900">
    Your estimated daily calories
  </p>

  <p className="mt-2 text-3xl font-semibold text-emerald-950">
    {profile.targetCalories.toLocaleString()} kcal
  </p>

  <p className="mt-2 text-sm leading-6 text-stone-600">
    This is an initial estimate based on your profile, activity level,
    and goal—not a measurement or a medical recommendation.
  </p>

  <div className="mt-4 border-t border-emerald-100 pt-4 text-sm text-stone-700">
    <div className="flex justify-between gap-4 py-1">
      <span>Estimated resting calories</span>
      <span className="font-medium">
        {profile.restingCalories.toLocaleString()} kcal
      </span>
    </div>

    <div className="flex justify-between gap-4 py-1">
      <span>Estimated maintenance calories</span>
      <span className="font-medium">
        {profile.maintenanceCalories.toLocaleString()} kcal
      </span>
    </div>
  </div>
</div>
</div>


          ) : (
            <>
              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between text-xs text-stone-500">
                  <span>YOUR PERSONAL PLAN</span>
                  <span>STEP 1 OF 1</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full w-1/3 rounded-full bg-emerald-800" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                  Let’s get started
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Tell us a little about yourself so we can prepare your
                  personalized plan.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="age" className={labelClass}>
                    Age
                  </label>
                  <div className="relative">
                    <input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      step="1"
                      inputMode="numeric"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      aria-invalid={!!errors.age}
                      aria-describedby={errors.age ? "age-error" : undefined}
                      placeholder="e.g. 32"
                      className={inputClass}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                      years
                    </span>
                  </div>
                  {errors.age && (
                    <p id="age-error" role="alert" className="mt-2 text-sm text-red-700">
                      {errors.age}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label className={labelClass}>Height</label>
                    <div className="flex rounded-lg bg-stone-100 p-1">
                      {(["cm", "ft"] as const).map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => switchHeightUnit(unit)}
                          aria-pressed={heightUnit === unit}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            heightUnit === unit
                              ? "bg-white text-emerald-900 shadow-sm"
                              : "text-stone-500"
                          }`}
                        >
                          {unit === "cm" ? "cm" : "ft / in"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {heightUnit === "cm" ? (
                    <div className="relative">
                      <input
                        id="height-cm"
                        type="number"
                        min="100"
                        max="250"
                        step="0.1"
                        inputMode="decimal"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g. 165"
                        aria-label="Height in centimetres"
                        aria-invalid={!!errors.height}
                        className={inputClass}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                        cm
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type="number"
                          min="3"
                          max="8"
                          step="1"
                          inputMode="numeric"
                          value={feet}
                          onChange={(e) => setFeet(e.target.value)}
                          placeholder="5"
                          aria-label="Height in feet"
                          aria-invalid={!!errors.height}
                          className={inputClass}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                          ft
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="11.9"
                          step="0.1"
                          inputMode="decimal"
                          value={inches}
                          onChange={(e) => setInches(e.target.value)}
                          placeholder="5"
                          aria-label="Additional height in inches"
                          aria-invalid={!!errors.height}
                          className={inputClass}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                          in
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.height && (
                    <p role="alert" className="mt-2 text-sm text-red-700">
                      {errors.height}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="weight" className={labelClass}>
                      Current weight
                    </label>
                    <div className="flex rounded-lg bg-stone-100 p-1">
                      {(["kg", "lb"] as const).map((unit) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() => switchWeightUnit(unit)}
                          aria-pressed={weightUnit === unit}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            weightUnit === unit
                              ? "bg-white text-emerald-900 shadow-sm"
                              : "text-stone-500"
                          }`}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      id="weight"
                      type="number"
                      min={weightUnit === "kg" ? "30" : "66"}
                      max={weightUnit === "kg" ? "350" : "772"}
                      step="0.1"
                      inputMode="decimal"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder={weightUnit === "kg" ? "e.g. 72" : "e.g. 159"}
                      aria-invalid={!!errors.weight}
                      className={inputClass}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                      {weightUnit}
                    </span>
                  </div>
                  {errors.weight && (
                    <p role="alert" className="mt-2 text-sm text-red-700">
                      {errors.weight}
                    </p>
                  )}
                </div>

                <div>
  <label htmlFor="sexForEquation" className={labelClass}>
    Calorie calculation setting
  </label>

  <select
    id="sexForEquation"
    value={sexForEquation}
    onChange={(e) =>
      setSexForEquation(e.target.value as SexForEquation | "")
    }
    aria-invalid={!!errors.sexForEquation}
    className={inputClass}
  >
    <option value="">Choose a setting</option>
    <option value="female">Female coefficient</option>
    <option value="male">Male coefficient</option>
  </select>

  {errors.sexForEquation && (
    <p role="alert" className="mt-2 text-sm text-red-700">
      {errors.sexForEquation}
    </p>
  )}
</div>

                <div>
                  <label htmlFor="activity" className={labelClass}>
                    Activity level
                  </label>
                  <select
                    id="activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as Activity | "")}
                    aria-invalid={!!errors.activity}
                    className={inputClass}
                  >
                    <option value="">Select your activity level</option>
                    {activities.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.activity && (
                    <p role="alert" className="mt-2 text-sm text-red-700">
                      {errors.activity}
                    </p>
                  )}
                </div>

                <fieldset>
                  <legend className={labelClass}>What is your goal?</legend>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {goals.map((item) => (
                      <label
                        key={item.value}
                        className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition hover:border-emerald-700 ${
                          goal === item.value
                            ? "border-emerald-800 bg-emerald-50"
                            : "border-stone-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="goal"
                          value={item.value}
                          checked={goal === item.value}
                          onChange={() => setGoal(item.value)}
                          className="mt-1 accent-emerald-800"
                        />
                        <span className="text-sm">
                          <span className="block font-medium">{item.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-stone-500">
                            {item.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.goal && (
                    <p role="alert" className="mt-2 text-sm text-red-700">
                      {errors.goal}
                    </p>
                  )}
                </fieldset>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-800 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                >
                  Continue to my plan <span aria-hidden="true">→</span>
                </button>

                <p className="text-center text-xs leading-5 text-stone-400">
                  Your information stays in this page for now. No account or
                  database is connected yet.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-stone-200 px-5 py-5 text-center text-xs text-stone-500">
        Made for real life, real food, and balanced eating.
      </footer>
    </main>
  );
}
