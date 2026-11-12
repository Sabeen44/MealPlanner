
export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export type Ingredient = {
  name: string;
  quantity: number;
  unit: "g" | "ml" | "piece";
};

export type Recipe = {
  status: "draft" | "reviewed" | "approved";
  id: string;
  name: string;
  description: string;

  mealTypes: MealType[];

  // Total servings prepared by the recipe
  servings: number;

  // Ingredients for the entire recipe
  ingredients: Ingredient[];

  // Nutrition for ONE serving
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  // Instructions for preparing the dish
  instructions: string[];
};

export const chickenKarahi: Recipe = {
   status: "draft",
  id: "chicken-karahi",
  name: "Chicken Karahi",
  description: "A traditional Pakistani chicken curry.",

  mealTypes: ["lunch", "dinner"],
  servings: 4,

  ingredients: [
    { name: "Chicken", quantity: 600, unit: "g" },
    { name: "Tomatoes", quantity: 400, unit: "g" },
    { name: "Cooking oil", quantity: 40, unit: "ml" },
    { name: "Ginger", quantity: 20, unit: "g" },
    { name: "Garlic", quantity: 20, unit: "g" },
    { name: "Green chilies", quantity: 3, unit: "piece" },
  ],

  // Placeholder nutrition per serving
  calories: 350,
  protein: 32,
  carbs: 10,
  fat: 20,

  instructions: [
    "Heat oil in a pan.",
    "Add chicken and cook until lightly browned.",
    "Add ginger, garlic, tomatoes, and green chilies.",
    "Cook until the chicken is fully cooked and the sauce thickens.",
    "Serve hot.",
  ],
};


export const masoorDaal: Recipe = {
   status: "draft",
  id: "masoor-daal",
  name: "Masoor Daal",
  description: "Pakistani red lentil curry.",

  mealTypes: ["lunch", "dinner"],
  servings: 4,

  ingredients: [
    { name: "Dry red lentils", quantity: 250, unit: "g" },
    { name: "Onion", quantity: 100, unit: "g" },
    { name: "Tomatoes", quantity: 200, unit: "g" },
    { name: "Cooking oil", quantity: 30, unit: "ml" },
    { name: "Garlic", quantity: 15, unit: "g" },
    { name: "Turmeric", quantity: 3, unit: "g" },
    { name: "Cumin", quantity: 5, unit: "g" },
    { name: "Water", quantity: 750, unit: "ml" },
  ],

  // Placeholder nutrition per serving
  calories: 280,
  protein: 15,
  carbs: 35,
  fat: 9,

  instructions: [
    "Rinse the lentils thoroughly.",
    "Add lentils, water, tomatoes, and turmeric to a pot.",
    "Simmer until the lentils are tender.",
    "Heat oil separately and sauté onion, garlic, and cumin.",
    "Add the tempering to the cooked lentils and mix.",
    "Serve hot.",
  ],
};


export const andaParatha: Recipe = {
  id: "anda-paratha",
  name: "Anda Paratha",
  description:
    "A traditional Pakistani breakfast of egg and whole-wheat paratha.",

  status: "draft",

  mealTypes: ["breakfast"],
  servings: 2,

  ingredients: [
    { name: "Whole-wheat flour", quantity: 120, unit: "g" },
    { name: "Eggs", quantity: 2, unit: "piece" },
    { name: "Cooking oil", quantity: 20, unit: "ml" },
    { name: "Water", quantity: 70, unit: "ml" },
    { name: "Salt", quantity: 2, unit: "g" },
  ],

  // Placeholder nutrition per serving
  calories: 400,
  protein: 15,
  carbs: 48,
  fat: 17,

  instructions: [
    "Mix whole-wheat flour, salt, and water to form a soft dough.",
    "Divide the dough into two equal portions.",
    "Roll each portion into a paratha.",
    "Cook the parathas on a hot tawa using the measured oil.",
    "Cook the eggs separately using the remaining oil.",
    "Serve one paratha with one egg per person.",
  ],
};


export const vegetableOmelette: Recipe = {
  id: "vegetable-omelette",
  name: "Vegetable Omelette",
  description:
    "A Pakistani-style omelette with onions, tomatoes, green chilies, and fresh coriander.",

  status: "draft",

  mealTypes: ["breakfast"],
  servings: 2,

  ingredients: [
    { name: "Eggs", quantity: 4, unit: "piece" },
    { name: "Onion", quantity: 60, unit: "g" },
    { name: "Tomatoes", quantity: 80, unit: "g" },
    { name: "Green chilies", quantity: 1, unit: "piece" },
    { name: "Fresh coriander", quantity: 10, unit: "g" },
    { name: "Cooking oil", quantity: 10, unit: "ml" },
    { name: "Salt", quantity: 2, unit: "g" },
    { name: "Black pepper", quantity: 1, unit: "g" },
  ],

  // Placeholder nutrition per serving
  calories: 220,
  protein: 14,
  carbs: 6,
  fat: 16,

  instructions: [
    "Finely chop the onion, tomatoes, green chili, and coriander.",
    "Crack the eggs into a bowl and whisk until combined.",
    "Add the chopped vegetables, salt, and black pepper.",
    "Heat the measured oil in a nonstick pan.",
    "Pour half the egg mixture into the pan.",
    "Cook until the eggs are fully set, flipping if needed.",
    "Repeat with the remaining mixture.",
    "Serve one omelette per person.",
  ],
};


export const alooKeema: Recipe = {
  id: "aloo-keema",
  name: "Aloo Keema",
  description:
    "A traditional Pakistani curry made with minced meat, potatoes, tomatoes, and aromatic spices.",

  status: "draft",

  mealTypes: ["lunch", "dinner"],
  servings: 4,

  ingredients: [
    { name: "Lean minced beef", quantity: 500, unit: "g" },
    { name: "Potatoes", quantity: 300, unit: "g" },
    { name: "Onion", quantity: 150, unit: "g" },
    { name: "Tomatoes", quantity: 250, unit: "g" },
    { name: "Cooking oil", quantity: 30, unit: "ml" },
    { name: "Ginger", quantity: 15, unit: "g" },
    { name: "Garlic", quantity: 15, unit: "g" },
    { name: "Green chilies", quantity: 2, unit: "piece" },
    { name: "Cumin", quantity: 5, unit: "g" },
    { name: "Coriander powder", quantity: 5, unit: "g" },
    { name: "Turmeric", quantity: 3, unit: "g" },
    { name: "Red chili powder", quantity: 3, unit: "g" },
    { name: "Salt", quantity: 5, unit: "g" },
    { name: "Water", quantity: 200, unit: "ml" },
  ],

  // Placeholder nutrition per serving
  calories: 390,
  protein: 30,
  carbs: 25,
  fat: 19,

  instructions: [
    "Peel and cut the potatoes into small cubes.",
    "Finely chop the onion, tomatoes, ginger, garlic, and green chilies.",
    "Heat the measured oil in a pan and sauté the onion until golden.",
    "Add ginger, garlic, and minced beef. Cook until the meat is browned.",
    "Add tomatoes, green chilies, and spices. Cook until the tomatoes soften.",
    "Add potatoes and water, then cover and simmer until the potatoes are tender and the meat is fully cooked.",
    "Cook uncovered briefly if needed to reduce excess liquid.",
    "Divide into four equal servings and serve hot.",
  ],
};


export const chickenPulao: Recipe = {
  id: "chicken-pulao",
  name: "Chicken Pulao",
  description:
    "A traditional Pakistani rice dish cooked with chicken, aromatic spices, and flavorful broth.",

  status: "draft",

  mealTypes: ["lunch", "dinner"],
  servings: 4,

  ingredients: [
    { name: "Basmati rice (dry)", quantity: 300, unit: "g" },
    { name: "Chicken", quantity: 500, unit: "g" },
    { name: "Onion", quantity: 150, unit: "g" },
    { name: "Cooking oil", quantity: 30, unit: "ml" },
    { name: "Ginger", quantity: 15, unit: "g" },
    { name: "Garlic", quantity: 15, unit: "g" },
    { name: "Green chilies", quantity: 2, unit: "piece" },
    { name: "Cumin seeds", quantity: 5, unit: "g" },
    { name: "Whole black pepper", quantity: 3, unit: "g" },
    { name: "Cloves", quantity: 4, unit: "piece" },
    { name: "Cinnamon stick", quantity: 1, unit: "piece" },
    { name: "Salt", quantity: 6, unit: "g" },
    { name: "Water", quantity: 650, unit: "ml" },
  ],

  // Placeholder nutrition per serving
  calories: 520,
  protein: 30,
  carbs: 65,
  fat: 15,

  instructions: [
    "Rinse the rice and soak it for 20 minutes.",
    "Heat oil in a pot and sauté sliced onions until golden.",
    "Add ginger, garlic, whole spices, and chicken.",
    "Cook until the chicken is lightly browned.",
    "Add water and salt, then simmer until the chicken is cooked.",
    "Add drained rice and green chilies.",
    "Cook until the rice absorbs most of the liquid.",
    "Cover and steam on low heat until the rice is tender.",
    "Divide into four equal servings.",
  ],
};


export const bhindiMasala: Recipe = {
  id: "bhindi-masala",
  name: "Bhindi Masala",
  description:
    "A Pakistani-style okra dish cooked with onions, tomatoes, and spices.",

  status: "draft",

  mealTypes: ["lunch", "dinner"],
  servings: 4,

  ingredients: [
    { name: "Fresh okra (bhindi)", quantity: 600, unit: "g" },
    { name: "Onion", quantity: 150, unit: "g" },
    { name: "Tomatoes", quantity: 250, unit: "g" },
    { name: "Cooking oil", quantity: 35, unit: "ml" },
    { name: "Green chilies", quantity: 2, unit: "piece" },
    { name: "Cumin seeds", quantity: 5, unit: "g" },
    { name: "Turmeric", quantity: 3, unit: "g" },
    { name: "Red chili powder", quantity: 3, unit: "g" },
    { name: "Coriander powder", quantity: 5, unit: "g" },
    { name: "Salt", quantity: 5, unit: "g" },
  ],

  // Placeholder nutrition per serving
  calories: 180,
  protein: 4,
  carbs: 17,
  fat: 11,

  instructions: [
    "Wash and thoroughly dry the okra.",
    "Trim the ends and slice the okra into small pieces.",
    "Heat the measured oil in a pan.",
    "Add cumin seeds and sliced onions, then sauté until softened.",
    "Add tomatoes, green chilies, and spices.",
    "Cook until the tomatoes soften.",
    "Add the okra and gently mix.",
    "Cook uncovered until the okra is tender and excess moisture evaporates.",
    "Divide into four equal servings.",
  ],
};


export const fruitChaat: Recipe = {
  id: "fruit-chaat",
  name: "Fruit Chaat",
  description:
    "A refreshing Pakistani fruit salad with seasonal fruits, lemon juice, and chaat masala.",

  status: "draft",

  mealTypes: ["snack"],
  servings: 4,

  ingredients: [
    { name: "Apple", quantity: 200, unit: "g" },
    { name: "Banana", quantity: 200, unit: "g" },
    { name: "Orange", quantity: 200, unit: "g" },
    { name: "Guava", quantity: 150, unit: "g" },
    { name: "Pomegranate seeds", quantity: 100, unit: "g" },
    { name: "Lemon juice", quantity: 20, unit: "ml" },
    { name: "Chaat masala", quantity: 5, unit: "g" },
  ],

  // Placeholder nutrition per serving
  calories: 160,
  protein: 2,
  carbs: 38,
  fat: 1,

  instructions: [
    "Wash all fruits thoroughly.",
    "Peel the banana and orange.",
    "Cut the fruits into bite-sized pieces.",
    "Combine all fruits in a large bowl.",
    "Add lemon juice and chaat masala.",
    "Toss gently to combine.",
    "Divide into four equal servings and serve fresh.",
  ],
};




export const recipes: Recipe[] = [
  chickenKarahi,
   masoorDaal,
   andaParatha,
    vegetableOmelette,
      alooKeema,
       chickenPulao,
  bhindiMasala,
  fruitChaat,
];
