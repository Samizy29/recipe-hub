const API_KEY = '308b006aec1d4f58abaea69d51936305';
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function fetchRecipes(ingredients) {
  const response = await fetch(
    `${BASE_URL}/findByIngredients?ingredients=${ingredients}&apiKey=${API_KEY}`
  );
  return response.json();
}
