
import { describe, expect, it } from "vitest";
import { getApprovedRecipes, getRecipesByMealType, calculatePortionNutrition,calculateMealNutrition,calculateDailyNutrition, getAllowedPortions,findBestPortion,selectRecipeForMeal,selectMealCombination,generateDailyMealPlan} from "./mealPlanner";
import { chickenKarahi, masoorDaal, wholeWheatRoti, andaParatha,
fruitChaat,} from "./recipes";

describe("getApprovedRecipes", () => {
  it("returns only approved recipes", () => {
    const testRecipes = [
      { ...chickenKarahi, status: "approved" as const },
      masoorDaal,
    ];

    const result = getApprovedRecipes(testRecipes);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("chicken-karahi");
  });

  it("returns an empty array when none are approved", () => {
    const result = getApprovedRecipes([
      chickenKarahi,
      masoorDaal,
    ]);

    expect(result).toEqual([]);
  });

  it("does not modify the original recipe list", () => {
    const testRecipes = [
      { ...chickenKarahi, status: "approved" as const },
      masoorDaal,
    ];

    const result = getApprovedRecipes(testRecipes);

    expect(testRecipes).toHaveLength(2);
    expect(result).toHaveLength(1);
  });
});


describe("getRecipesByMealType", () => {
  const testRecipes = [
    { ...chickenKarahi, status: "approved" as const },
    { ...masoorDaal, status: "approved" as const },
  ];

  it("returns approved dinner recipes", () => {
    const result = getRecipesByMealType(
      testRecipes,
      "dinner"
    );

    expect(result).toHaveLength(2);
  });

  it("returns no breakfast recipes when none match", () => {
    const result = getRecipesByMealType(
      testRecipes,
      "breakfast"
    );

    expect(result).toEqual([]);
  });

  it("excludes draft recipes", () => {
    const result = getRecipesByMealType(
      [chickenKarahi, masoorDaal],
      "dinner"
    );

    expect(result).toEqual([]);
  });
});


describe("calculatePortionNutrition", () => {
  it("calculates nutrition for one serving", () => {
    const result = calculatePortionNutrition(
      chickenKarahi,
      1
    );

    expect(result).toEqual({
      calories: 350,
      protein: 32,
      carbs: 10,
      fat: 20,
    });
  });

  it("calculates nutrition for half a serving", () => {
    const result = calculatePortionNutrition(
      chickenKarahi,
      0.5
    );

    expect(result).toEqual({
      calories: 175,
      protein: 16,
      carbs: 5,
      fat: 10,
    });
  });

  it("calculates nutrition for 1.5 servings", () => {
    const result = calculatePortionNutrition(
      chickenKarahi,
      1.5
    );

    expect(result.calories).toBe(525);
    expect(result.protein).toBe(48);
  });

  it("rejects invalid portions", () => {
    expect(() =>
      calculatePortionNutrition(chickenKarahi, 0)
    ).toThrow();

    expect(() =>
      calculatePortionNutrition(chickenKarahi, -1)
    ).toThrow();

    expect(() =>
      calculatePortionNutrition(chickenKarahi, NaN)
    ).toThrow();
  });
});


describe("calculateMealNutrition", () => {
  it("calculates nutrition for multiple foods", () => {
    const result = calculateMealNutrition([
      { recipe: chickenKarahi, portions: 1 },
      { recipe: masoorDaal, portions: 0.5 },
    ]);

    expect(result).toEqual({
      calories: 490,
      protein: 39.5,
      carbs: 27.5,
      fat: 24.5,
    });
  });

  it("calculates nutrition for a single food", () => {
    const result = calculateMealNutrition([
      { recipe: chickenKarahi, portions: 1 },
    ]);

    expect(result.calories).toBe(350);
  });

  it("rejects an empty meal", () => {
    expect(() => calculateMealNutrition([])).toThrow(
      "A meal must contain at least one item."
    );
  });

  it("rejects invalid portions within a meal", () => {
    expect(() =>
      calculateMealNutrition([
        { recipe: chickenKarahi, portions: 0 },
      ])
    ).toThrow();
  });
});


describe("calculateDailyNutrition", () => {
  it("calculates nutrition across a full day", () => {
    const result = calculateDailyNutrition({
      breakfast: [
        { recipe: chickenKarahi, portions: 0.5 },
      ],
      lunch: [
        { recipe: masoorDaal, portions: 1 },
      ],
      dinner: [
        { recipe: chickenKarahi, portions: 1 },
      ],
      snacks: [
        { recipe: masoorDaal, portions: 0.5 },
      ],
    });

    expect(result).toEqual({
      calories: 945,
      protein: 70.5,
      carbs: 67.5,
      fat: 43.5,
    });
  });

  it("allows an empty snack list", () => {
    const result = calculateDailyNutrition({
      breakfast: [
        { recipe: chickenKarahi, portions: 1 },
      ],
      lunch: [
        { recipe: masoorDaal, portions: 1 },
      ],
      dinner: [
        { recipe: chickenKarahi, portions: 1 },
      ],
      snacks: [],
    });

    expect(result.calories).toBe(980);
  });

  it("rejects invalid portions in any meal", () => {
    expect(() =>
      calculateDailyNutrition({
        breakfast: [
          { recipe: chickenKarahi, portions: 0 },
        ],
        lunch: [],
        dinner: [],
        snacks: [],
      })
    ).toThrow();
  });
});


describe("getAllowedPortions", () => {
  it("returns the default allowed portions", () => {
    expect(getAllowedPortions()).toEqual([
      0.5,
      0.75,
      1,
      1.25,
      1.5,
    ]);
  });

  it("supports custom portion limits", () => {
    expect(
      getAllowedPortions({
        min: 0.5,
        max: 2,
        step: 0.5,
      })
    ).toEqual([0.5, 1, 1.5, 2]);
  });

  it("rejects invalid limits", () => {
    expect(() =>
      getAllowedPortions({
        min: 0,
        max: 1.5,
        step: 0.25,
      })
    ).toThrow();

    expect(() =>
      getAllowedPortions({
        min: 1.5,
        max: 0.5,
        step: 0.25,
      })
    ).toThrow();

    expect(() =>
      getAllowedPortions({
        min: 0.5,
        max: 1.5,
        step: 0,
      })
    ).toThrow();
  });
});


describe("findBestPortion", () => {
  it("selects the portion closest to the calorie target", () => {
    const result = findBestPortion(
      chickenKarahi,
      630
    );

    expect(result.portions).toBe(1.5);
    expect(result.nutrition.calories).toBe(525);
    expect(result.calorieDifference).toBe(-105);
  });

  it("selects a smaller portion for a lower target", () => {
    const result = findBestPortion(
      chickenKarahi,
      200
    );

    expect(result.portions).toBe(0.5);
    expect(result.nutrition.calories).toBe(175);
  });

  it("respects custom portion limits", () => {
    const result = findBestPortion(
      chickenKarahi,
      630,
      {
        min: 0.5,
        max: 1,
        step: 0.25,
      }
    );

    expect(result.portions).toBe(1);
    expect(result.nutrition.calories).toBe(350);
  });

  it("rejects invalid calorie targets", () => {
    expect(() =>
      findBestPortion(chickenKarahi, 0)
    ).toThrow();

    expect(() =>
      findBestPortion(chickenKarahi, NaN)
    ).toThrow();
  });
});



describe("selectRecipeForMeal", () => {
  const approvedKarahi = {
    ...chickenKarahi,
    status: "approved" as const,
  };

  const approvedDaal = {
    ...masoorDaal,
    status: "approved" as const,
  };

  it("selects the approved recipe closest to the target", () => {
    const result = selectRecipeForMeal(
      [approvedKarahi, approvedDaal],
      "lunch",
      630
    );

    expect(result?.recipe.id).toBe("chicken-karahi");
    expect(result?.portions).toBe(1.5);
    expect(result?.nutrition.calories).toBe(525);
  });

  it("excludes draft recipes", () => {
    const result = selectRecipeForMeal(
      [chickenKarahi, approvedDaal],
      "lunch",
      630
    );

    expect(result?.recipe.id).toBe("masoor-daal");
  });

  it("returns null when no approved recipes match", () => {
    const result = selectRecipeForMeal(
      [chickenKarahi, masoorDaal],
      "lunch",
      630
    );

    expect(result).toBeNull();
  });

  it("returns null when the meal type does not match", () => {
    const result = selectRecipeForMeal(
      [approvedKarahi, approvedDaal],
      "breakfast",
      450
    );

    expect(result).toBeNull();
  });

  it("rejects invalid calorie targets", () => {
    expect(() =>
      selectRecipeForMeal(
        [approvedKarahi],
        "lunch",
        0
      )
    ).toThrow();
  });
});


describe("selectMealCombination", () => {
  const approvedKarahi = {
    ...chickenKarahi,
    status: "approved" as const,
    category: "main" as const,
  };

  const approvedRoti = {
    ...wholeWheatRoti,
    status: "approved" as const,
    category: "side" as const,
  };

  it("selects an approved main and side", () => {
    const result = selectMealCombination(
      [approvedKarahi, approvedRoti],
      "lunch",
      630
    );

    expect(result).not.toBeNull();
    expect(result?.items).toHaveLength(2);
    expect(result?.items[0].recipe.id).toBe("chicken-karahi");
    expect(result?.items[1].recipe.id).toBe("whole-wheat-roti");
    expect(result?.nutrition.calories).toBeCloseTo(633.75);
    expect(result?.calorieDifference).toBeCloseTo(3.75);
  });

  it("excludes draft recipes", () => {
    const result = selectMealCombination(
      [chickenKarahi, approvedRoti],
      "lunch",
      630
    );

    expect(result).toBeNull();
  });

  it("returns null when no side is available", () => {
    const result = selectMealCombination(
      [approvedKarahi],
      "lunch",
      630
    );

    expect(result).toBeNull();
  });

  it("returns null when the meal type does not match", () => {
    const result = selectMealCombination(
      [approvedKarahi, approvedRoti],
      "snack",
      180
    );

    expect(result).toBeNull();
  });

  it("rejects invalid calorie targets", () => {
    expect(() =>
      selectMealCombination(
        [approvedKarahi, approvedRoti],
        "lunch",
        0
      )
    ).toThrow();
  });
});


describe("generateDailyMealPlan", () => {
  const approvedRecipes = [
    {
      ...andaParatha,
      status: "approved" as const,
    },
    {
      ...chickenKarahi,
      status: "approved" as const,
      category: "main" as const,
    },
    {
      ...wholeWheatRoti,
      status: "approved" as const,
      category: "side" as const,
    },
    {
      ...fruitChaat,
      status: "approved" as const,
    },
  ];

  it("generates all four meal slots", () => {
    const result = generateDailyMealPlan(
      approvedRecipes,
      1800
    );

    expect(result).not.toBeNull();
    expect(result?.plan.breakfast.length).toBeGreaterThan(0);
    expect(result?.plan.lunch.length).toBeGreaterThan(0);
    expect(result?.plan.dinner.length).toBeGreaterThan(0);
    expect(result?.plan.snacks.length).toBeGreaterThan(0);
  });

  it("calculates the daily nutrition total", () => {
    const result = generateDailyMealPlan(
      approvedRecipes,
      1800
    );

    expect(result).not.toBeNull();

    if (!result) return;

    expect(result.nutrition).toEqual(
      calculateDailyNutrition(result.plan)
    );

    expect(result.calorieDifference).toBeCloseTo(
      result.nutrition.calories - 1800
    );
  });

  it("only selects approved recipes", () => {
    const result = generateDailyMealPlan(
      [...approvedRecipes, masoorDaal],
      1800
    );

    expect(result).not.toBeNull();

    if (!result) return;

    const selectedItems = [
      ...result.plan.breakfast,
      ...result.plan.lunch,
      ...result.plan.dinner,
      ...result.plan.snacks,
    ];

    expect(
      selectedItems.every(
        (item) => item.recipe.status === "approved"
      )
    ).toBe(true);
  });

  it("returns null when required meals cannot be filled", () => {
    const result = generateDailyMealPlan(
      [chickenKarahi, masoorDaal],
      1800
    );

    expect(result).toBeNull();
  });

  it("rejects invalid calorie targets", () => {
    expect(() =>
      generateDailyMealPlan(approvedRecipes, 0)
    ).toThrow();
  });
});
