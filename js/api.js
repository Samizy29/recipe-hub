import { APIErrorHandler, FALLBACK_RECIPES, FALLBACK_RECIPE_DETAIL } from './api-error-handler.js';

// Your actual API key
const API_KEY = '308b006aec1d4f58abaea69d51936305';
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Search recipes by ingredients (findByIngredients endpoint)
 * @param {string} ingredients - Comma-separated list of ingredients
 * @returns {Promise} - Array of recipes
 */
export async function fetchRecipesByIngredients(ingredients) {
    const url = `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredients}&number=12&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recipes by ingredients:', error);
        
        // Return fallback data with proper formatting
        return FALLBACK_RECIPES.results.map(recipe => ({
            ...recipe,
            usedIngredientCount: 2,
            missedIngredientCount: 3,
            usedIngredients: [],
            missedIngredients: []
        }));
    }
}

/**
 * Search recipes by query (complexSearch endpoint with full details)
 * @param {string} query - Search term
 * @returns {Promise} - Array of recipes with full information
 */
export async function fetchRecipes(query) {
    const url = `${BASE_URL}/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle empty results
        if (!data.results || data.results.length === 0) {
            console.warn('No recipes found for query:', query);
            return [];
        }
        
        return data.results;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return FALLBACK_RECIPES.results || [];
    }
}

/**
 * Get detailed recipe information by ID
 * @param {number} id - Recipe ID
 * @returns {Promise} - Detailed recipe information
 */
export async function getRecipeById(id) {
    const url = `${BASE_URL}/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Recipe not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching recipe ${id}:`, error);
        
        // Return fallback recipe with the requested ID
        return {
            ...FALLBACK_RECIPE_DETAIL,
            id: parseInt(id),
            title: `${FALLBACK_RECIPE_DETAIL.title} (ID: ${id})`
        };
    }
}

// Export a default object with all functions
export default {
    fetchRecipes,
    fetchRecipesByIngredients,
    getRecipeById
};