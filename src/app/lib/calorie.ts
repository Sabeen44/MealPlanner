
export type BiologicalSexForEquation = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "high";

export type WeightGoal = "lose" | "maintain" | "gain";

export type CalorieInputs = {
  age: number;
  heightCm: number;
  weightKg: number;
  sexForEquation: BiologicalSexForEquation;
  activity: ActivityLevel;
  goal: WeightGoal;
};

export type CalorieEstimate = {
  restingCalories: number;
  maintenanceCalories: number;
  targetCalories: number;
};

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
};

// Prototype adjustments only; validate with a qualified
// nutrition professional before using in a public product.
const GOAL_ADJUSTMENTS: Record<WeightGoal, number> = {
  lose: -0.10,
  maintain: 0,
  gain: 0.10,
};

export function estimateCalories(
  input: CalorieInputs
): CalorieEstimate {
  const {
    age,
    heightCm,
    weightKg,
    sexForEquation,
    activity,
    goal,
  } = input;

  if (!Number.isFinite(age) || age < 18 || age > 100) {
    throw new Error("Age must be between 18 and 100.");
  }

  if (
    !Number.isFinite(heightCm) ||
    heightCm < 100 ||
    heightCm > 250
  ) {
    throw new Error("Height must be between 100 and 250 cm.");
  }

  if (
    !Number.isFinite(weightKg) ||
    weightKg < 30 ||
    weightKg > 350
  ) {
    throw new Error("Weight must be between 30 and 350 kg.");
  }

  if (!(sexForEquation in { male: true, female: true })) {
    throw new Error("Invalid equation input.");
  }

  if (!(activity in ACTIVITY_FACTORS)) {
    throw new Error("Invalid activity level.");
  }

  if (!(goal in GOAL_ADJUSTMENTS)) {
    throw new Error("Invalid goal.");
  }

  // Mifflin–St Jeor resting energy expenditure equation.
  const restingCalories =
    10 * weightKg +
    6.25 * heightCm -
    5 * age +
    (sexForEquation === "male" ? 5 : -161);

  const maintenanceCalories =
    restingCalories * ACTIVITY_FACTORS[activity];

  const targetCalories =
    maintenanceCalories * (1 + GOAL_ADJUSTMENTS[goal]);

  return {
    restingCalories: Math.round(restingCalories),
    maintenanceCalories: Math.round(maintenanceCalories),
    targetCalories: Math.round(targetCalories),
  };
}
