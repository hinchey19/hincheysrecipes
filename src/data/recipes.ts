export type Recipe = {
  id: string;
  title: string;
  cuisine: string;
  path: string;
  description: string;
  time: number;
  servings: number;
  image: string;
};

export const recipes: Recipe[] = [
  // Your existing recipes will be here
  {
    id: "shrimp-fried-rice",
    title: "Shrimp Fried Rice",
    cuisine: "Chinese",
    path: "recipes/shrimp-fried-rice.md",
    description: "Quick and flavorful wok-fried rice with shrimp, eggs, and vegetables.",
    time: 20,
    servings: 4,
    image: "/images/shrimp-fried-rice.jpg"
  },
  // Add the new recipe
  {
    id: "chinese-tomato-egg-stir-fry",
    title: "Chinese Tomato Egg Stir-Fry",
    cuisine: "Chinese",
    path: "recipes/chinese-tomato-egg-stir-fry.md",
    description: "Classic Chinese comfort food with fluffy eggs and tangy tomatoes.",
    time: 20,
    servings: 3,
    image: "/images/shrimp-fried-rice.jpg" // Temporarily using an existing image
  }
];