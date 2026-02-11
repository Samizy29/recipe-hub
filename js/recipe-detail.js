import { getRecipeById } from './api.js';
import { saveFavorite, isFavorite } from './favorites.js';

export class RecipeDetail {
    constructor(container) {
        this.container = container;
        this.recipeId = null;
        this.recipe = null;
    }

    async render(recipeId) {
        this.recipeId = recipeId;
        this.container.innerHTML = '<div class="loading">Loading recipe details...</div>';
        
        try {
            this.recipe = await getRecipeById(recipeId);
            this.displayRecipe();
        } catch (error) {
            this.container.innerHTML = '<div class="error">Failed to load recipe details</div>';
        }
    }

    displayRecipe() {
        const isFav = isFavorite(this.recipeId);
        
        this.container.innerHTML = `
            <div class="recipe-detail">
                <div class="recipe-header">
                    <h1>${this.recipe.title}</h1>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${this.recipe.id}">
                        ${isFav ? '★' : '☆'} Favorite
                    </button>
                </div>
                
                <div class="recipe-meta">
                    <span>⏱️ ${this.recipe.readyInMinutes} mins</span>
                    <span>👥 Serves ${this.recipe.servings}</span>
                </div>

                <img src="${this.recipe.image}" alt="${this.recipe.title}">
                
                <div class="recipe-section">
                    <h2>Ingredients</h2>
                    <ul class="ingredients-list">
                        ${this.recipe.extendedIngredients.map(ing => `
                            <li>
                                <label>
                                    <input type="checkbox" class="ingredient-checkbox">
                                    ${ing.original}
                                </label>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="recipe-section">
                    <h2>Instructions</h2>
                    <div class="instructions">
                        ${this.recipe.analyzedInstructions[0]?.steps.map(step => `
                            <div class="instruction-step">
                                <span class="step-number">${step.number}</span>
                                <p>${step.step}</p>
                            </div>
                        `).join('') || '<p>No instructions available</p>'}
                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        const favBtn = this.container.querySelector('.favorite-btn');
        favBtn?.addEventListener('click', () => this.toggleFavorite());
    }

    toggleFavorite() {
        const btn = this.container.querySelector('.favorite-btn');
        const isFav = isFavorite(this.recipeId);
        
        if (isFav) {
            removeFavorite(this.recipeId);
            btn.innerHTML = '☆ Favorite';
            btn.classList.remove('active');
        } else {
            saveFavorite({
                id: this.recipe.id,
                title: this.recipe.title,
                image: this.recipe.image,
                readyInMinutes: this.recipe.readyInMinutes
            });
            btn.innerHTML = '★ Favorite';
            btn.classList.add('active');
        }
    }
}