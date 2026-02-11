const FAVORITES_KEY = 'recipe_favorites';

export function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

export function saveFavorite(recipe) {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.id === recipe.id)) {
        favorites.push(recipe);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export function removeFavorite(recipeId) {
    const favorites = getFavorites();
    const updated = favorites.filter(fav => fav.id !== recipeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export function isFavorite(recipeId) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === recipeId);
}