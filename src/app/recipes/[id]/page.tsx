
import Link from "next/link";
import { notFound } from "next/navigation";
import { recipes } from "../../lib/recipes";

type RecipePageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecipePage({
  params,
}: RecipePageProps) {
  const { id } = await params;

  const recipe = recipes.find((item) => item.id === id);

  if (
    !recipe ||
    (process.env.NODE_ENV === "production" &&
      recipe.status !== "approved")
  ) {
    notFound();
  }

  const nutrients = [
    { label: "Calories", value: `${recipe.calories} kcal` },
    { label: "Protein", value: `${recipe.protein} g` },
    { label: "Carbs", value: `${recipe.carbs} g` },
    { label: "Fat", value: `${recipe.fat} g` },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/meal-plan"
          className="text-sm font-medium text-green-700"
        >
          ← Back to meal plan
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          {recipe.name}
        </h1>

        <p className="mt-2 text-gray-600">
          {recipe.description}
        </p>

        {recipe.status !== "approved" && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Development preview — recipe and nutrition
            values have not been verified.
          </div>
        )}

        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Nutrition per serving
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {nutrients.map((nutrient) => (
              <div
                key={nutrient.label}
                className="rounded-lg bg-gray-50 p-3"
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

        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Ingredients
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Makes {recipe.servings} servings
          </p>

          <ul className="mt-4 divide-y divide-gray-100">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex justify-between gap-4 py-3 text-gray-700"
              >
                <span>{ingredient.name}</span>
                <span>
                  {ingredient.quantity} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Cooking Instructions
          </h2>

          <ol className="mt-4 space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-800">
                  {index + 1}
                </span>

                <p className="text-gray-700">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
