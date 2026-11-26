
import type { Recipe } from "../../lib/recipes";
import {
  calculatePortionNutrition,
  getAllowedPortions,
} from "../../lib/mealPlanner";

type PersonalPortionProps = {
  recipe: Recipe;
  searchParams: Promise<{
    portions?: string | string[];
  }>;
};

export default async function PersonalPortion({
  recipe,
  searchParams,
}: PersonalPortionProps) {
  const { portions } = await searchParams;

  if (typeof portions !== "string") {
    return null;
  }

  const portion = Number(portions);

  if (
    !Number.isFinite(portion) ||
    !getAllowedPortions().includes(portion)
  ) {
    return null;
  }

  const nutrition = calculatePortionNutrition(
    recipe,
    portion
  );

  const nutrients = [
    {
      label: "Calories",
      value: `${nutrition.calories.toFixed(0)} kcal`,
    },
    {
      label: "Protein",
      value: `${nutrition.protein.toFixed(1)} g`,
    },
    {
      label: "Carbs",
      value: `${nutrition.carbs.toFixed(1)} g`,
    },
    {
      label: "Fat",
      value: `${nutrition.fat.toFixed(1)} g`,
    },
  ];

  return (
    <section className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
      <h2 className="text-xl font-semibold text-green-900">
        Your Recommended Portion
      </h2>

      <p className="mt-3 text-2xl font-bold text-green-900">
        {portion} {portion === 1 ? "serving" : "servings"}
      </p>

      <p className="mt-2 text-sm text-green-800">
        This is your personal portion from the meal plan,
        not the amount to cook for the family.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {nutrients.map((nutrient) => (
          <div
            key={nutrient.label}
            className="rounded-lg bg-white p-3"
          >
            <p className="text-sm text-gray-500">
              {nutrient.label}
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {nutrient.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
