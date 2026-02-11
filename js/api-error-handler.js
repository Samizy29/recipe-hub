// Fallback recipe data for when API fails
export const FALLBACK_RECIPES = {
    results: [
        {
            id: 716429,
            title: "Pasta with Garlic, Scallions, Tomato & Basil",
            image: "https://spoonacular.com/recipe-images/716429.jpg",
            readyInMinutes: 45,
            servings: 2,
            extendedIngredients: [
                { original: "200g pasta" },
                { original: "2 cloves garlic" },
                { original: "2 tomatoes" },
                { original: "Fresh basil" }
            ],
            analyzedInstructions: [{
                steps: [
                    { number: 1, step: "Cook pasta according to package instructions" },
                    { number: 2, step: "Sauté garlic in olive oil" },
                    { number: 3, step: "Add chopped tomatoes and cook for 5 minutes" },
                    { number: 4, step: "Toss with pasta and fresh basil" }
                ]
            }]
        },
        {
            id: 715538,
            title: "Easy Tomato Soup",
            image: "https://spoonacular.com/recipe-images/715538.jpg",
            readyInMinutes: 30,
            servings: 4,
            extendedIngredients: [
                { original: "1 tbsp olive oil" },
                { original: "1 onion" },
                { original: "2 cloves garlic" },
                { original: "800g canned tomatoes" }
            ],
            analyzedInstructions: [{
                steps: [
                    { number: 1, step: "Sauté onion and garlic in olive oil" },
                    { number: 2, step: "Add tomatoes and simmer 15 minutes" },
                    { number: 3, step: "Blend until smooth" },
                    { number: 4, step: "Season with salt and pepper" }
                ]
            }]
        }
    ]
};

export const FALLBACK_RECIPE_DETAIL = {
    id: 716429,
    title: "Pasta with Garlic, Scallions, Tomato & Basil",
    image: "https://spoonacular.com/recipe-images/716429.jpg",
    readyInMinutes: 45,
    servings: 2,
    extendedIngredients: [
        { original: "200g pasta" },
        { original: "2 cloves garlic, minced" },
        { original: "2 tomatoes, diced" },
        { original: "1/4 cup fresh basil, chopped" },
        { original: "2 tbsp olive oil" },
        { original: "Salt to taste" },
        { original: "Black pepper to taste" }
    ],
    analyzedInstructions: [{
        steps: [
            { number: 1, step: "Bring a large pot of salted water to a boil. Add pasta and cook according to package instructions until al dente." },
            { number: 2, step: "While pasta cooks, heat olive oil in a large skillet over medium heat. Add minced garlic and sauté for 1 minute until fragrant." },
            { number: 3, step: "Add diced tomatoes to the skillet and cook for 3-4 minutes until they start to soften." },
            { number: 4, step: "Drain pasta, reserving 1/4 cup of pasta water." },
            { number: 5, step: "Add drained pasta to the skillet with tomatoes. Toss to combine, adding reserved pasta water if needed." },
            { number: 6, step: "Remove from heat, stir in fresh basil, and season with salt and pepper to taste." }
        ]
    }]
};

// API Error Handler class
export class APIErrorHandler {
    static async handleRequest(apiCall, fallbackData = null) {
        try {
            const response = await apiCall();
            
            if (!response.ok) {
                // Handle specific HTTP status codes
                switch (response.status) {
                    case 401:
                    case 403:
                        throw new Error('API authentication failed. Please check your API key.');
                    case 404:
                        throw new Error('The requested resource was not found.');
                    case 429:
                        throw new Error('Too many requests. Please try again later.');
                    case 500:
                    case 502:
                    case 503:
                    case 504:
                        throw new Error('API service is temporarily unavailable.');
                    default:
                        throw new Error(`HTTP error ${response.status}`);
                }
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.warn('API request failed:', error.message);
            
            // Return fallback data if available
            if (fallbackData) {
                console.log('Using fallback data');
                return fallbackData;
            }
            
            // Re-throw if no fallback
            throw error;
        }
    }
}