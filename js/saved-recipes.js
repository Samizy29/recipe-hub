import { getFavorites, removeFavorite } from './favorites.js';

export class SavedRecipesView {
    constructor(container) {
        this.container = container;
    }

    render() {
        const favorites = getFavorites();
        
        if (!favorites || favorites.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.container.innerHTML = `
            <div class="saved-recipes-view">
                <div class="view-header">
                    <h1>❤️ My Favorite Recipes</h1>
                    <p class="recipe-count">${favorites.length} ${favorites.length === 1 ? 'recipe' : 'recipes'} saved</p>
                </div>
                
                <div class="recipes-grid">
                    ${favorites.map(recipe => `
                        <div class="recipe-card" data-id="${recipe.id}">
                            <div class="card-badge">Favorite</div>
                            <img 
                                src="${recipe.image || 'https://via.placeholder.com/312x231?text=Recipe'}" 
                                alt="${recipe.title}"
                                loading="lazy"
                                onerror="this.src='https://via.placeholder.com/312x231?text=Recipe'"
                            >
                            <div class="recipe-info">
                                <h3 title="${recipe.title}">${recipe.title}</h3>
                                <span class="time">⏱️ ${recipe.readyInMinutes || '30'} mins</span>
                                <div class="card-actions">
                                    <button 
                                        class="view-recipe-btn" 
                                        onclick="window.location.hash='#/recipe/${recipe.id}'"
                                    >
                                        View Recipe
                                    </button>
                                    <button 
                                        class="remove-fav-btn" 
                                        data-id="${recipe.id}"
                                        aria-label="Remove from favorites"
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.attachEvents();
    }

    renderEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <h2>No favorite recipes yet</h2>
                <p>Start exploring recipes and save your favorites!</p>
                <button onclick="window.location.hash='#/'" class="btn-primary">
                    Browse Recipes
                </button>
            </div>
        `;
    }

    attachEvents() {
        this.container.querySelectorAll('.remove-fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(e.currentTarget.dataset.id);
                removeFavorite(recipeId);
                
                // Show feedback
                const card = e.currentTarget.closest('.recipe-card');
                card.style.opacity = '0';
                setTimeout(() => {
                    this.render(); // Re-render the view
                }, 300);
            });
        });
    }
}