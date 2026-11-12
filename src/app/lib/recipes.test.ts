
import { describe, expect, it } from "vitest";
import { recipes } from "./recipes";

describe("Recipe library", () => {
  it("contains recipes", () => {
    expect(recipes.length).toBeGreaterThan(0);
  });

  it("has unique recipe IDs", () => {
    const ids = recipes.map((recipe) => recipe.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const recipe of recipes) {
    describe(recipe.name, () => {
      
      it("has a valid approval status", () => {
  expect(["draft", "reviewed", "approved"]).toContain(
    recipe.status
  );
});
      it("has an ID and name", () => {
        expect(recipe.id.trim()).not.toBe("");
        expect(recipe.name.trim()).not.toBe("");
      });

      it("has valid servings and ingredients", () => {
        expect(recipe.servings).toBeGreaterThan(0);
        expect(recipe.ingredients.length).toBeGreaterThan(0);

        for (const ingredient of recipe.ingredients) {
          expect(ingredient.name.trim()).not.toBe("");
          expect(ingredient.quantity).toBeGreaterThan(0);
          expect(Number.isFinite(ingredient.quantity)).toBe(true);
        }
      });

      it("has valid nutrition values", () => {
        expect(Number.isFinite(recipe.calories)).toBe(true);
        expect(recipe.calories).toBeGreaterThan(0);

        for (const macro of [
          recipe.protein,
          recipe.carbs,
          recipe.fat,
        ]) {
          expect(Number.isFinite(macro)).toBe(true);
          expect(macro).toBeGreaterThanOrEqual(0);
        }
      });

      it("has cooking instructions", () => {
        expect(recipe.instructions.length).toBeGreaterThan(0);
      });
    });
  }
});
