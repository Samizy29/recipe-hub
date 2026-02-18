// Your actual API key
const API_KEY = '308b006aec1d4f58abaea69d51936305';
const BASE_URL = 'https://api.spoonacular.com/recipes';

/**
 * Search recipes by query with optional dietary filters
 * @param {string} query - Search term (e.g., 'pasta')
 * @param {object} filters - Optional filters { vegetarian, glutenFree, dairyFree }
 * @returns {Promise<Array>} - Array of recipe objects
 */
export async function fetchRecipes(query, filters = {}) {
    // Start with base URL
    let url = `${BASE_URL}/complexSearch?query=${encodeURIComponent(query)}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;

    // Add filter parameters if they are true
    if (filters.vegetarian) url += '&vegetarian=true';
    if (filters.glutenFree) url += '&glutenFree=true';
    if (filters.dairyFree) url += '&dairyFree=true';
    // You can add more filters later (vegan, nutFree, etc.)

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

/**
 * Get detailed information for a specific recipe by ID
 * @param {number|string} id - Recipe ID
 * @returns {Promise<object>} - Recipe details
 */
export async function getRecipeById(id) {
    const url = `${BASE_URL}/${id}/information?includeNutrition=false&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipe:', error);
        // Return a fallback recipe object
        return {
            id: id,
            title: 'Recipe Not Found',
            image: 'https://via.placeholder.com/600x400?text=Recipe',
            extendedIngredients: [],
            analyzedInstructions: []
        };
    }
}