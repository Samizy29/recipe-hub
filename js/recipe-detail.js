import { getRecipeById } from './api.js';
import { saveFavorite, removeFavorite, isFavorite } from './favorites.js';

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
            console.error('Error loading recipe:', error);
            this.container.innerHTML = `
                <div class="error-state">
                    <span class="error-icon">❌</span>
                    <h3>Failed to load recipe</h3>
                    <p>Please try again later</p>
                    <button onclick="window.location.hash='#/'" class="btn-primary">
                        Back to Search
                    </button>
                </div>
            `;
        }
    }

    displayRecipe() {
        const isFav = isFavorite(this.recipeId);
        
        this.container.innerHTML = `
            <div class="recipe-detail">
                <div class="recipe-header">
                    <h1>${this.recipe.title}</h1>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${this.recipe.id}">
                        ${isFav ? '★' : '☆'} ${isFav ? 'Saved' : 'Save Recipe'}
                    </button>
                </div>
                
                <div class="recipe-meta">
                    <span>⏱️ ${this.recipe.readyInMinutes || 'N/A'} mins</span>
                    <span>👥 Serves ${this.recipe.servings || 'N/A'}</span>
                </div>

                <img src="${this.recipe.image}" alt="${this.recipe.title}">
                
                <div class="recipe-section">
                    <h2>Ingredients</h2>
                    <ul class="ingredients-list">
                        ${this.recipe.extendedIngredients?.map(ing => `
                            <li>
                                <label>
                                    <input type="checkbox" class="ingredient-checkbox">
                                    ${ing.original}
                                </label>
                            </li>
                        `).join('') || '<p>No ingredients available</p>'}
                    </ul>
                    <button id="add-to-shopping-list" class="btn-secondary">
                        🛒 Add Selected to Shopping List
                    </button>
                </div>

                <div class="recipe-section">
                    <h2>Instructions</h2>
                    <div class="instructions">
                        ${this.recipe.analyzedInstructions?.[0]?.steps?.map(step => `
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

        const addToListBtn = this.container.querySelector('#add-to-shopping-list');
        addToListBtn?.addEventListener('click', () => this.addToShoppingList());
    }

    toggleFavorite() {
        const btn = this.container.querySelector('.favorite-btn');
        const isFav = isFavorite(this.recipeId);
        
        if (isFav) {
            removeFavorite(this.recipeId);
            btn.innerHTML = '☆ Save Recipe';
            btn.classList.remove('active');
        } else {
            saveFavorite({
                id: this.recipe.id,
                title: this.recipe.title,
                image: this.recipe.image,
                readyInMinutes: this.recipe.readyInMinutes
            });
            btn.innerHTML = '★ Saved';
            btn.classList.add('active');
        }
    }

    addToShoppingList() {
        const selectedIngredients = [];
        this.container.querySelectorAll('.ingredient-checkbox:checked').forEach(cb => {
            const label = cb.closest('label').textContent.trim();
            selectedIngredients.push({
                name: label,
                checked: false
            });
        });

        if (selectedIngredients.length > 0) {
            // Import ShoppingList dynamically to avoid circular dependency
            import('./shopping-list.js').then(module => {
                const shoppingList = new module.ShoppingList();
                shoppingList.addIngredients(selectedIngredients);
                alert(`${selectedIngredients.length} ingredients added to shopping list!`);
            });
        } else {
            alert('Please select ingredients to add to your shopping list');
        }
    }
}