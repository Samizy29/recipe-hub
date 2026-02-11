import { getFavorites, removeFavorite } from './favorites.js';

export class SavedRecipesView {
    constructor(container) {
        this.container = container;
    }

    render() {
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📖</span>
                    <h3>No favorite recipes yet</h3>
                    <p>Start adding recipes to your favorites and they'll appear here!</p>
                    <button onclick="window.location.href='index.html'" class="btn-primary">
                        Browse Recipes
                    </button>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="saved-recipes">
                <h1>My Favorite Recipes</h1>
                <div class="recipes-grid">
                    ${favorites.map(recipe => `
                        <div class="recipe-card" data-id="${recipe.id}">
                            <img src="${recipe.image}" alt="${recipe.title}">
                            <div class="recipe-info">
                                <h3>${recipe.title}</h3>
                                <span class="time">⏱️ ${recipe.readyInMinutes} mins</span>
                                <div class="card-actions">
                                    <button class="view-btn" onclick="viewRecipe(${recipe.id})">
                                        View Recipe
                                    </button>
                                    <button class="remove-fav-btn" data-id="${recipe.id}">
                                        ❌ Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.attachRemoveEvents();
    }

    attachRemoveEvents() {
        this.container.querySelectorAll('.remove-fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recipeId = e.target.dataset.id;
                removeFavorite(recipeId);
                this.render(); // Re-render the view
            });
        });
    }
}