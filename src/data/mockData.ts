import { RecipeProps } from "@/components/RecipeCard";

export const mockRecipes: RecipeProps[] = [
  {
    id: "0",
    title: "Sushi Bake",
    description: "A delicious deconstructed sushi roll baked in a casserole dish with seasoned salmon, imitation crab, and creamy sriracha mayo sauce.",
    image: "/images/sushi-bake.jpg",
    prepTime: 40,
    servings: 4,
    category: "Japanese",
    dateAdded: "2023-05-15"
  },
  {
    id: "13",
    title: "Roasted Leg of Lamb",
    description: "A flavorful roasted lamb leg with Asian-inspired marinade, finished with a crispy exterior and tender, juicy meat inside.",
    image: "/roasted-lamb-leg.jpg",
    prepTime: 180,
    servings: 6,
    category: "American",
    dateAdded: "2023-06-15"
  },
  {
    id: "14",
    title: "Korean Braised Beef Short Ribs",
    description: "Tender bone-in beef short ribs slowly braised in a sweet and savory sauce with vegetables until melt-in-your-mouth tender.",
    image: "https://www.beyondkimchee.com/wp-content/uploads/2023/11/galbijjim-braised-short-ribs-20.jpg",
    prepTime: 120,
    servings: 6,
    category: "Korean",
    dateAdded: "2023-06-25",
    ingredients: [
      "5 lbs bone-in short ribs",
      "2 potatoes, peeled and cubed",
      "3 carrots, peeled and cut into chunks",
      "1 apple, peeled and diced",
      "1 pear, peeled and diced",
      "2 small onions, diced",
      "1 whole garlic bulb, cloves separated and peeled",
      "1/4 cup water (for blending sauce)",
      "1/3 cup light soy sauce",
      "1/4 cup dark soy sauce",
      "2 tbsp oyster sauce",
      "3 tbsp sugar",
      "1 tbsp mirin",
      "2 tbsp Korean spicy sauce (gochujang)",
      "2 tbsp toasted sesame seeds",
      "10 rice cakes (optional)"
    ],
    instructions: [
      "Boil the short ribs in water briefly to remove impurities, then drain and rinse.",
      "In a blender, combine apple, pear, onions, garlic and water to make a smooth sauce.",
      "Place the short ribs and blended sauce in a large pot.",
      "Add light soy sauce, dark soy sauce, oyster sauce, sugar, mirin, and Korean spicy sauce.",
      "Bring to a boil, then reduce heat to low and simmer for about 1 hour until the sauce thickens.",
      "Lightly pan-fry the carrots and potatoes until they turn golden brown.",
      "Add the pan-fried carrots and potatoes to the pot, and continue cooking for another 30 minutes until vegetables are tender.",
      "Serve hot, garnished with toasted sesame seeds."
    ]
  },
  {
    id: "1",
    title: "Pad Thai",
    description: "A classic Thai stir-fried noodle dish with eggs, tofu, bean sprouts, peanuts, and tangy sauce.",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1770&auto=format&fit=crop",
    prepTime: 30,
    servings: 4,
    category: "Thai",
    dateAdded: "2023-05-20",
    ingredients: [
      "8 oz pad Thai rice noodles (stir-fry rice noodles)",
      "2 tablespoons vegetable or peanut oil",
      "1-2 shallots, sliced (or sub ¼ cup red onion)",
      "4 garlic cloves, chopped",
      "2 eggs, whisked with a fork",
      "1-2 cups bean sprouts",
      "½ cup chopped scallions",
      "½ cup chopped peanuts (optional)",
      "2-3 lime wedges (essential!)",
      "8 oz tofu or chicken breast, or shrimp (optional)",
      "For the sauce:",
      "3 tablespoons fish sauce",
      "3 tablespoons brown sugar or palm sugar",
      "3 tablespoons rice vinegar (or tamarind paste, or white vinegar with a splash of lime)",
      "1 tablespoon soy sauce",
      "1-3 teaspoons sriracha or chili garlic sauce (optional)"
    ],
    instructions: [
      "Cook the rice noodles according to the package directions, making sure to slightly undercook as they will continue to cook in the wok. Rinse in cool water, drain well, and set aside.",
      "Mix the Pad Thai sauce ingredients together in a small bowl - fish sauce, brown sugar, rice vinegar, soy sauce, and sriracha.",
      "Heat oil in a wok or large skillet over medium-high heat. If adding protein (like chicken, tofu, or shrimp), cook it first until nearly done, then set aside.",
      "Add shallots and garlic to the wok, stir fry for 1 minute until fragrant.",
      "Push the vegetables to the side, creating a well in the center. Add a little more oil if needed, then pour in the whisked eggs, letting them cook slightly before breaking them apart.",
      "Add the cooked rice noodles and the prepared sauce to the wok. Toss and stir fry for 2-3 minutes until the noodles have absorbed the sauce.",
      "If using a pre-cooked protein, add it back to the wok now and toss to combine.",
      "Add the bean sprouts and most of the scallions (save some for garnish), tossing for just 30-60 seconds until slightly wilted but still crunchy.",
      "Taste and adjust by adding more fish sauce for saltiness, more sriracha for heat, or more lime for tanginess.",
      "Serve immediately in bowls, garnished with remaining scallions, chopped peanuts, extra bean sprouts, and lime wedges."
    ]
  },
  {
    id: "4",
    title: "Korean Bibimbap",
    description: "A colorful mixed rice bowl topped with assorted vegetables, gochujang, and a fried egg.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1975&auto=format&fit=crop",
    prepTime: 35,
    servings: 2,
    category: "Korean",
    dateAdded: "2023-05-30"
  },
  {
    id: "5",
    title: "Mango Sticky Rice",
    description: "Sweet Thai dessert made with glutinous rice, fresh mangoes, and coconut milk.",
    image: "https://data.thefeedfeed.com/static/2020/07/08/15942348605f0617ec7410a.png",
    prepTime: 30,
    servings: 4,
    category: "Dessert",
    dateAdded: "2023-06-01"
  },
  {
    id: "6",
    title: "Vegetable Spring Rolls",
    description: "Crispy fried rolls filled with vegetables, glass noodles, and mushrooms, served with dipping sauce.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1769&auto=format&fit=crop",
    prepTime: 35,
    servings: 6,
    category: "Appetizer",
    dateAdded: "2023-06-05"
  },
  {
    id: "9",
    title: "Shrimp Fried Rice",
    description: "Quick and flavorful wok-fried rice with shrimp, eggs, peas, and green onions.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop",
    prepTime: 20,
    servings: 4,
    category: "Chinese",
    dateAdded: "2023-06-10"
  },
  {
    id: "10",
    title: "Matcha Latte",
    description: "Creamy beverage made with Japanese green tea powder and frothed milk, served hot or iced.",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=1770&auto=format&fit=crop",
    prepTime: 5,
    servings: 2,
    category: "Beverage",
    dateAdded: "2023-06-15"
  },
  {
    id: "11",
    title: "Sushi Rolls",
    description: "Fresh rolls with seasoned rice, fish, and vegetables wrapped in seaweed and served with soy sauce.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1770&auto=format&fit=crop",
    prepTime: 45,
    servings: 4,
    category: "Japanese",
    dateAdded: "2023-06-20"
  },
  {
    id: "12",
    title: "Green Papaya Salad",
    description: "Spicy Thai salad with shredded unripe papaya, tomatoes, beans, and a tangy lime dressing.",
    image: "https://coleycooks.com/wp-content/uploads/2024/05/Thai-green-papaya-salad-2.jpg",
    prepTime: 15,
    servings: 4,
    category: "Thai",
    dateAdded: "2023-07-01"
  },
  {
    id: "15",
    title: "Chinese Tomato Egg Stir-fry",
    description: "A classic Chinese home-style dish featuring fluffy scrambled eggs and juicy tomatoes in a sweet and tangy sauce.",
    image: "https://hot-thai-kitchen.com/wp-content/uploads/2022/07/tomato-egg-sq.jpg",
    prepTime: 15,
    servings: 2,
    category: "Chinese",
    dateAdded: "2023-07-10",
    ingredients: [
      "4 medium tomatoes (about 1 pound)",
      "4 large eggs",
      "1 scallion, finely chopped",
      "3/4 teaspoon salt, divided",
      "1/4 teaspoon white pepper",
      "1 teaspoon oyster sauce",
      "3 tablespoons vegetable oil, divided",
      "2 teaspoons sugar",
      "1/4-1/2 cup water"
    ],
    instructions: [
      "Cut tomatoes into small wedges and finely chop the scallion.",
      "Crack eggs into a bowl and season with 1/4 teaspoon salt and white pepper. Beat eggs for a minute.",
      "Preheat a wok or large skillet over medium heat until it just starts to smoke. Add 2 tablespoons of oil and immediately add the eggs.",
      "Scramble the eggs until just cooked but still soft, then remove from the wok and set aside.",
      "Add the remaining 1 tablespoon oil to the wok, turn up the heat to high, and add the tomatoes and most of the scallions (reserve some for garnish).",
      "Stir-fry for 1 minute, then add sugar, remaining 1/2 teaspoon salt, 1 teaspoon oyster sauce, and 1/4 cup water.",
      "Add the cooked eggs back to the wok and mix everything together.",
      "Cover the wok and cook for 1-2 minutes, until the tomatoes are completely softened.",
      "Uncover and continue to stir-fry over high heat until the sauce thickens to your liking.",
      "Garnish with the reserved scallions and serve immediately with steamed rice."
    ]
  },
  {
    id: "17",
    title: "Basque Cheesecake (6-inch)",
    description: "A rustic Spanish-style cheesecake with a caramelized top and creamy, custard-like interior.",
    image: "https://cravinghomecooked.com/wp-content/uploads/2023/02/basque-cheesecake-1-15.jpg",
    prepTime: 45,
    servings: 8,
    category: "Dessert",
    dateAdded: "2024-07-15",
    ingredients: [
      "225g cream cheese (softened at room temperature)",
      "160g heavy cream",
      "80g sugar",
      "3 whole eggs",
      "10g cornstarch"
    ],
    instructions: [
      "Prepare the batter: Let the cream cheese soften at room temperature. Beat the cream cheese and sugar together until smooth and creamy. Add eggs one at a time, mixing well after each addition. Gradually pour in the heavy cream while continuing to mix.",
      "Incorporate cornstarch: Sift in the cornstarch and mix until fully incorporated. The batter should be smooth and free of lumps.",
      "Bake the cheesecake: Preheat the oven to 400°F (200°C). Line a 6-inch round cake pan with parchment paper. Pour the batter into the pan and tap it gently on the counter to release any air bubbles. Bake for about 30 minutes, or until the top is deep golden brown and slightly jiggly in the center.",
      "Chill and serve: Let the cheesecake cool to room temperature. Refrigerate overnight for the best texture. Slice and enjoy a silky, custard-like cheesecake!"
    ]
  },
  {
    id: "18",
    title: "Chicken Teriyaki",
    description: "Juicy chicken pieces cooked in a sweet and savory homemade teriyaki sauce, garnished with green onions and sesame seeds.",
    image: "https://www.cookingclassy.com/wp-content/uploads/2018/04/teriyaki-chicken-12.jpg",
    prepTime: 25,
    servings: 4,
    category: "Japanese",
    dateAdded: "2023-07-05"
  }
];
