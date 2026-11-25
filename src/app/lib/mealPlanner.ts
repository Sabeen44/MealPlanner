
import type { Recipe } from "./recipes";

export function getApprovedRecipes(
  recipes: Recipe[]
): Recipe[] {
  return recipes.filter(
    (recipe) => recipe.status === "approved"
  );
}


export function getRecipesByMealType(
  recipes: Recipe[],
  mealType: Recipe["mealTypes"][number]
): Recipe[] {
  return getApprovedRecipes(recipes).filter(
    (recipe) => recipe.mealTypes.includes(mealType)
  );
}


export function calculatePortionNutrition(
  recipe: Recipe,
  portions: number
) {
  if (!Number.isFinite(portions) || portions <= 0) {
    throw new Error("Portions must be a positive number.");
  }

  return {
    calories: recipe.calories * portions,
    protein: recipe.protein * portions,
    carbs: recipe.carbs * portions,
    fat: recipe.fat * portions,
  };
}


export type MealItem = {
  recipe: Recipe;
  portions: number;
};

export function calculateMealNutrition(items: MealItem[]) {
  if (items.length === 0) {
    throw new Error("A meal must contain at least one item.");
  }

  return items.reduce(
    (total, item) => {
      const nutrition = calculatePortionNutrition(
        item.recipe,
        item.portions
      );

      return {
        calories: total.calories + nutrition.calories,
        protein: total.protein + nutrition.protein,
        carbs: total.carbs + nutrition.carbs,
        fat: total.fat + nutrition.fat,
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );
}


export type DailyMealPlan = {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
};

export function calculateDailyNutrition(
  plan: DailyMealPlan
) {
  const meals = [
    plan.breakfast,
    plan.lunch,
    plan.dinner,
    plan.snacks,
  ];

  return meals.reduce(
    (total, items) => {
      if (items.length === 0) return total;

      const nutrition = calculateMealNutrition(items);

      return {
        calories: total.calories + nutrition.calories,
        protein: total.protein + nutrition.protein,
        carbs: total.carbs + nutrition.carbs,
        fat: total.fat + nutrition.fat,
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );
}


export const mealDistribution = {
  breakfast: { target: 0.25, min: 0.20, max: 0.30 },
  lunch: { target: 0.35, min: 0.30, max: 0.40 },
  dinner: { target: 0.30, min: 0.25, max: 0.35 },
  snacks: { target: 0.10, min: 0.05, max: 0.15 },
} as const;

export function calculateMealCalorieTargets(
  dailyCalories: number
) {
  if (!Number.isFinite(dailyCalories) || dailyCalories <= 0) {
    throw new Error("Daily calories must be positive.");
  }

  return Object.fromEntries(
    Object.entries(mealDistribution).map(
      ([meal, distribution]) => [
        meal,
        {
          target: dailyCalories * distribution.target,
          min: dailyCalories * distribution.min,
          max: dailyCalories * distribution.max,
        },
      ]
    )
  ) as Record<
    keyof typeof mealDistribution,
    { target: number; min: number; max: number }
  >;
}


export type PortionLimits = {
  min: number;
  max: number;
  step: number;
};

export const defaultPortionLimits: PortionLimits = {
  min: 0.5,
  max: 1.5,
  step: 0.25,
};

export function getAllowedPortions(
  limits: PortionLimits = defaultPortionLimits
): number[] {
  const { min, max, step } = limits;

  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    !Number.isFinite(step) ||
    min <= 0 ||
    max < min ||
    step <= 0
  ) {
    throw new Error("Invalid portion limits.");
  }

  const portions: number[] = [];

  for (
    let index = 0;
    min + index * step <= max + 1e-9;
    index++
  ) {
    portions.push(
      Number((min + index * step).toFixed(4))
    );
  }

  return portions;
}

export function findBestPortion(
  recipe: Recipe,
  calorieTarget: number,
  limits: PortionLimits = defaultPortionLimits
) {
  if (
    !Number.isFinite(calorieTarget) ||
    calorieTarget <= 0
  ) {
    throw new Error("Calorie target must be positive.");
  }

  if (
    !Number.isFinite(recipe.calories) ||
    recipe.calories <= 0
  ) {
    throw new Error("Recipe calories must be positive.");
  }

  const allowedPortions = getAllowedPortions(limits);

  const bestPortion = allowedPortions.reduce((best, current) => {
    const bestDifference = Math.abs(
      recipe.calories * best - calorieTarget
    );

    const currentDifference = Math.abs(
      recipe.calories * current - calorieTarget
    );

    return currentDifference < bestDifference
      ? current
      : best;
  });

  return {
    portions: bestPortion,
    nutrition: calculatePortionNutrition(
      recipe,
      bestPortion
    ),
    calorieDifference:
      recipe.calories * bestPortion - calorieTarget,
  };
}


export function selectRecipeForMeal(
  recipes: Recipe[],
  mealType: Recipe["mealTypes"][number],
  calorieTarget: number
) {
  if (!Number.isFinite(calorieTarget) || calorieTarget <= 0) {
    throw new Error("Calorie target must be positive.");
  }

  const eligibleRecipes = getRecipesByMealType(
    recipes,
    mealType
  );

  if (eligibleRecipes.length === 0) {
    return null;
  }

  const candidates = eligibleRecipes.map((recipe) => ({
    recipe,
    ...findBestPortion(recipe, calorieTarget),
  }));

  return candidates.reduce((best, current) =>
    Math.abs(current.calorieDifference) <
    Math.abs(best.calorieDifference)
      ? current
      : best
  );
}


export function selectMealCombination(
  recipes: Recipe[],
  mealType: Recipe["mealTypes"][number],
  calorieTarget: number
) {
  if (!Number.isFinite(calorieTarget) || calorieTarget <= 0) {
    throw new Error("Calorie target must be positive.");
  }

  const eligible = getRecipesByMealType(recipes, mealType);

  const mains = eligible.filter(
    (recipe) => recipe.category === "main"
  );

  const sides = eligible.filter(
    (recipe) => recipe.category === "side"
  );

  if (mains.length === 0 || sides.length === 0) {
    return null;
  }

  const portions = getAllowedPortions();

  let best:
    | {
        items: MealItem[];
        nutrition: ReturnType<typeof calculateMealNutrition>;
        calorieDifference: number;
      }
    | null = null;

  for (const main of mains) {
    for (const side of sides) {
      for (const mainPortion of portions) {
        for (const sidePortion of portions) {
          const items: MealItem[] = [
            { recipe: main, portions: mainPortion },
            { recipe: side, portions: sidePortion },
          ];

          const nutrition = calculateMealNutrition(items);

          const calorieDifference =
            nutrition.calories - calorieTarget;

          if (
            best === null ||
            Math.abs(calorieDifference) <
              Math.abs(best.calorieDifference)
          ) {
            best = {
              items,
              nutrition,
              calorieDifference,
            };
          }
        }
      }
    }
  }

  return best;
}



export type GeneratedDailyMealPlan = {
  plan: DailyMealPlan;
  nutrition: ReturnType<typeof calculateDailyNutrition>;
  calorieTarget: number;
  calorieDifference: number;
  evaluation: DailyPlanEvaluation;
  proteinEvaluation?: ProteinEvaluation;
};


export function generateDailyMealPlan(
  recipes: Recipe[],
  dailyCalorieTarget: number,
   proteinTarget?: number
): GeneratedDailyMealPlan | null {
  const targets = calculateMealCalorieTargets(
    dailyCalorieTarget
  );
   

  function selectMeal(
    mealType: Recipe["mealTypes"][number],
    target: number
  ): MealItem[] | null {
    const combination = selectMealCombination(
      recipes,
      mealType,
      target
    );

    const single = selectRecipeForMeal(
      recipes,
      mealType,
      target
    );

    if (
      combination &&
      (!single ||
        Math.abs(combination.calorieDifference) <
          Math.abs(single.calorieDifference))
    ) {
      return combination.items;
    }

    if (single) {
      return [
        {
          recipe: single.recipe,
          portions: single.portions,
        },
      ];
    }

    return null;
  }

  const breakfast = selectMeal(
    "breakfast",
    targets.breakfast.target
  );

  const lunch = selectMeal(
    "lunch",
    targets.lunch.target
  );

  const dinner = selectMeal(
    "dinner",
    targets.dinner.target
  );

  const snacks = selectMeal(
    "snack",
    targets.snacks.target
  );

  // All four meal slots are required in this first version.
  if (!breakfast || !lunch || !dinner || !snacks) {
    return null;
  }

  const plan: DailyMealPlan = {
    breakfast,
    lunch,
    dinner,
    snacks,
  };



const balancedPlan = rebalanceDailyMealPlan(
  plan,
  dailyCalorieTarget
);

const nutrition = calculateDailyNutrition(balancedPlan);

const evaluation = evaluateDailyMealPlan(
  balancedPlan,
  dailyCalorieTarget
);

const proteinEvaluation =
  proteinTarget === undefined
    ? undefined
    : evaluateProteinTarget(nutrition.protein, proteinTarget);

return {
  plan: balancedPlan,
  nutrition,
  calorieTarget: dailyCalorieTarget,
  calorieDifference: nutrition.calories - dailyCalorieTarget,
  evaluation,
  proteinEvaluation,
};
}


export type MealEvaluation = {
  calories: number;
  target: number;
  min: number;
  max: number;
  withinRange: boolean;
};

export type DailyPlanEvaluation = {
  totalCalories: number;
  dailyTarget: number;
  calorieDifference: number;
  percentageDifference: number;
  withinDailyTolerance: boolean;
  meals: Record<keyof DailyMealPlan, MealEvaluation>;
  allMealsWithinRange: boolean;
};

export function evaluateDailyMealPlan(
  plan: DailyMealPlan,
  dailyCalorieTarget: number
): DailyPlanEvaluation {
  const targets = calculateMealCalorieTargets(
    dailyCalorieTarget
  );

  const nutrition = calculateDailyNutrition(plan);

  const mealNames: (keyof DailyMealPlan)[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
  ];

  const meals = {} as Record<
    keyof DailyMealPlan,
    MealEvaluation
  >;

  for (const mealName of mealNames) {
    const items = plan[mealName];

    const calories =
      items.length > 0
        ? calculateMealNutrition(items).calories
        : 0;

    const target = targets[mealName];

    meals[mealName] = {
      calories,
      target: target.target,
      min: target.min,
      max: target.max,
      withinRange:
        calories >= target.min &&
        calories <= target.max,
    };
  }

  const calorieDifference =
    nutrition.calories - dailyCalorieTarget;

  const percentageDifference =
    (calorieDifference / dailyCalorieTarget) * 100;

  // Initial V1 tolerance: within 5% of daily target.
  const withinDailyTolerance =
    Math.abs(percentageDifference) <= 5;

  return {
    totalCalories: nutrition.calories,
    dailyTarget: dailyCalorieTarget,
    calorieDifference,
    percentageDifference,
    withinDailyTolerance,
    meals,
    allMealsWithinRange: mealNames.every(
      (mealName) => meals[mealName].withinRange
    ),
  };
}


export function rebalanceDailyMealPlan(
  plan: DailyMealPlan,
  dailyCalorieTarget: number
): DailyMealPlan {
  // Validate the target and all existing portions.
  const targets = calculateMealCalorieTargets(
    dailyCalorieTarget
  );

  calculateDailyNutrition(plan);

  const mealNames: (keyof DailyMealPlan)[] = [
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
  ];

  // Copy the plan so the original is not modified.
  const balancedPlan: DailyMealPlan = {
    breakfast: plan.breakfast.map((item) => ({ ...item })),
    lunch: plan.lunch.map((item) => ({ ...item })),
    dinner: plan.dinner.map((item) => ({ ...item })),
    snacks: plan.snacks.map((item) => ({ ...item })),
  };

  const initialDifference = Math.abs(
    calculateDailyNutrition(balancedPlan).calories -
      dailyCalorieTarget
  );

  let bestDifference = initialDifference;

  // Continue until no single portion change improves
  // the daily calorie difference.
  let improved = true;

  while (improved) {
    improved = false;

    for (const mealName of mealNames) {
      const meal = balancedPlan[mealName];

      for (let index = 0; index < meal.length; index++) {
        const item = meal[index];

        for (const portions of getAllowedPortions()) {
          const candidateMeal = meal.map(
            (currentItem, currentIndex) =>
              currentIndex === index
                ? { ...currentItem, portions }
                : { ...currentItem }
          );

          const mealCalories =
            calculateMealNutrition(candidateMeal).calories;

          const range = targets[mealName];

          // Keep the adjusted meal within its range.
          if (
            mealCalories < range.min ||
            mealCalories > range.max
          ) {
            continue;
          }

          const candidatePlan: DailyMealPlan = {
            ...balancedPlan,
            [mealName]: candidateMeal,
          };

          const candidateDifference = Math.abs(
            calculateDailyNutrition(candidatePlan).calories -
              dailyCalorieTarget
          );

          if (candidateDifference < bestDifference - 1e-9) {
            bestDifference = candidateDifference;
            meal[index] = { ...item, portions };
            improved = true;
          }
        }
      }
    }
  }

  return balancedPlan;
}


export type ProteinEvaluation = {
  actualProtein: number;
  targetProtein: number;
  difference: number;
  meetsTarget: boolean;
  percentageOfTarget: number;
};

export function evaluateProteinTarget(
  actualProtein: number,
  targetProtein: number
): ProteinEvaluation {
  if (
    !Number.isFinite(actualProtein) ||
    actualProtein < 0 ||
    !Number.isFinite(targetProtein) ||
    targetProtein <= 0
  ) {
    throw new Error("Invalid protein values.");
  }

  return {
    actualProtein,
    targetProtein,
    difference: actualProtein - targetProtein,
    meetsTarget: actualProtein >= targetProtein,
    percentageOfTarget:
      (actualProtein / targetProtein) * 100,
  };
}


export type ProteinGoal = "lose" | "maintain" | "gain";

export const proteinFactors: Record<ProteinGoal, number> = {
  lose: 1.2,
  maintain: 1.0,
  gain: 1.4,
};

export function calculateProteinTarget(
  weightKg: number,
  goal: ProteinGoal
): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Weight must be a positive number.");
  }

  if (!Object.prototype.hasOwnProperty.call(proteinFactors, goal)) {
    throw new Error("Invalid protein goal.");
  }

  return Math.round(weightKg * proteinFactors[goal]);
}
