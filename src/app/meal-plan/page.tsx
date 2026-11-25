
import { recipes } from "../lib/recipes";
import { generateDailyMealPlan } from "../lib/mealPlanner";
import Link from "next/link";

export function generateStaticParams() {
  return recipes
    .filter(
      (recipe) =>
        process.env.NODE_ENV !== "production" ||
        recipe.status === "approved"
    )
    .map((recipe) => ({
      id: recipe.id,
    }));
}

export default function MealPlanPage() {
  // Development preview only:
  // Treat draft recipes as approved without changing the library.
  const previewRecipes = recipes.map((recipe) => ({
    ...recipe,
    status: "approved" as const,
  }));

  const result = generateDailyMealPlan(
    previewRecipes,
    1800,
    84
  );

  if (!result) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Unable to generate meal plan
        </h1>
        <p className="mt-2">
          Check that recipes are available for every meal type.
        </p>
      </main>
    );
  }

  const { plan, nutrition, evaluation, proteinEvaluation } =
    result;

  const meals = [
    { label: "Breakfast", items: plan.breakfast },
    { label: "Lunch", items: plan.lunch },
    { label: "Dinner", items: plan.dinner },
    { label: "Snacks", items: plan.snacks },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Daily Meal Plan
        </h1>

        <p className="mt-2 text-gray-600">
          Development preview using sample targets and
          unverified recipe nutrition values.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Daily Calories
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {nutrition.calories.toFixed(0)} kcal
            </p>
            <p className="text-sm text-gray-500">
              Target: 1800 kcal
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Daily Protein
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {nutrition.protein.toFixed(1)} g
            </p>
            <p className="text-sm text-gray-500">
              Target: 84 g
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {meals.map((meal) => (
            <section
              key={meal.label}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {meal.label}
              </h2>

              <div className="mt-3 space-y-3">
                {meal.items.map((item, index) => (
                  <div
                    key={`${item.recipe.id}-${index}`}
                    className="flex justify-between gap-4 border-t border-gray-100 pt-3"
                  >
                    <div>
                     <Link
  href={`/recipes/${item.recipe.id}`}
  className="font-medium text-green-700 hover:underline"
>
  {item.recipe.name}
</Link>
                      <p className="text-sm text-gray-500">
                        {item.portions} serving(s)
                      </p>
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      {(item.recipe.calories * item.portions).toFixed(0)}
                      {" "}kcal
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Nutrition Evaluation
          </h2>

          <p className="mt-3 text-gray-700">
            Daily calorie target:{" "}
            {evaluation.withinDailyTolerance
              ? "Within tolerance"
              : "Outside tolerance"}
          </p>

          <p className="mt-2 text-gray-700">
            Protein target:{" "}
            {proteinEvaluation?.meetsTarget
              ? "Met"
              : "Not met"}
          </p>
        </div>
      </div>
    </main>
  );
}
