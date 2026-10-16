
import { describe, expect, it } from "vitest";
import { estimateCalories } from "./calorie";

describe("estimateCalories", () => {
  const example = {
    age: 30,
    heightCm: 165,
    weightKg: 65,
    sexForEquation: "female" as const,
    activity: "sedentary" as const,
    goal: "maintain" as const,
  };

  it("calculates resting and maintenance calories", () => {
    const result = estimateCalories(example);

    expect(result.restingCalories).toBe(1370);
    expect(result.maintenanceCalories).toBe(1644);
    expect(result.targetCalories).toBe(1644);
  });

  it("applies the prototype weight-loss adjustment", () => {
    const result = estimateCalories({
      ...example,
      goal: "lose",
    });

    expect(result.targetCalories).toBe(1480);
  });

  it("applies the prototype weight-gain adjustment", () => {
    const result = estimateCalories({
      ...example,
      goal: "gain",
    });

    expect(result.targetCalories).toBe(1809);
  });

  it("rejects an age outside the supported range", () => {
    expect(() =>
      estimateCalories({ ...example, age: 15 })
    ).toThrow("Age must be between 18 and 100.");
  });

  it("rejects an invalid weight", () => {
    expect(() =>
      estimateCalories({ ...example, weightKg: 0 })
    ).toThrow("Weight must be between 30 and 350 kg.");
  });
});
