// Your actual API key
const API_KEY = '308b006aec1d4f58abaea69d51936305';
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function fetchRecipes(query) {
    const url = `${BASE_URL}/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export async function getRecipeById(id) {
    const url = `${BASE_URL}/${id}/information?includeNutrition=false&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return {
            id: id,
            title: 'Recipe Not Found',
            image: 'https://via.placeholder.com/600x400?text=Recipe',
            extendedIngredients: [],
            analyzedInstructions: []
        };
    }
}