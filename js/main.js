import { fetchRecipes } from "./api.js";
import { RecipeSearch, renderRecipes } from './recipes.js';
import { CookingTimer } from './cooking-timer.js';

class App {
    constructor() {
        this.app = document.getElementById('app');
        this.activeFilters = {}; // Store current filter states
        this.recipeSearch = null; // Will hold the current RecipeSearch instance
        this.init();
    }

    init() {
        console.log('App starting...');
        this.setupComponents();
        this.setupRouting();

        if (!window.location.hash) {
            window.location.hash = '#/';
        }
    }

    setupRouting() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        console.log('Route:', hash);

        if (hash.startsWith('/recipe/')) {
            const id = hash.split('/')[2];
            this.renderRecipeDetail(id);
            return;
        }

        switch (hash) {
            case '/':
            case '/search':
                this.renderSearch();
                break;
            case '/favorites':
                this.renderFavorites();
                break;
            case '/shopping-list':
                this.renderShoppingList();
                break;
            case '/meal-planner':
                this.renderMealPlanner();
                break;
            default:
                this.renderSearch();
        }
    }

    setupComponents() {
        // Timer widget
        const timerWidget = document.getElementById('timer-widget');
        if (timerWidget) {
            try {
                this.timer = new CookingTimer(timerWidget);
                this.timer.render();
            } catch (e) {
                console.error('Timer error:', e);
            }
        }

        // Filters widget - with event listeners
        const filtersWidget = document.getElementById('filters-widget');
        if (filtersWidget) {
            filtersWidget.innerHTML = `
                <div class="dietary-filters">
                    <h3>Dietary Preferences</h3>
                    <div class="filters-grid">
                        <label><input type="checkbox" id="filter-vegetarian"> 🌱 Vegetarian</label>
                        <label><input type="checkbox" id="filter-glutenfree"> 🌾 Gluten Free</label>
                        <label><input type="checkbox" id="filter-dairyfree"> 🥛 Dairy Free</label>
                    </div>
                </div>
            `;

            const veggie = document.getElementById('filter-vegetarian');
            const gluten = document.getElementById('filter-glutenfree');
            const dairy = document.getElementById('filter-dairyfree');

            const updateFilters = () => {
                this.activeFilters = {
                    vegetarian: veggie?.checked || false,
                    glutenFree: gluten?.checked || false,
                    dairyFree: dairy?.checked || false
                };
                if (this.recipeSearch) {
                    this.recipeSearch.filters = this.activeFilters;
                    this.recipeSearch.loadRecipes();
                }
            };

            veggie?.addEventListener('change', updateFilters);
            gluten?.addEventListener('change', updateFilters);
            dairy?.addEventListener('change', updateFilters);
        }

        // Ingredient form
        const ingredientContainer = document.getElementById('ingredient-form-container');
        if (ingredientContainer) {
            import('./ingredient-form.js').then(module => {
                const form = new module.IngredientForm(ingredientContainer, (ingredients) => {
                    console.log('Searching with ingredients:', ingredients);
                    // Optional: implement ingredient search
                });
                form.render();
            }).catch(err => console.error('Failed to load ingredient form:', err));
        }
    }

    renderSearch() {
        this.app.innerHTML = '';
        this.recipeSearch = new RecipeSearch(this.app, 'pasta', this.activeFilters);
        this.recipeSearch.render();
    }

    async renderRecipeDetail(id) {
        this.app.innerHTML = '<div class="loading">Loading recipe...</div>';

        try {
            const { getRecipeById } = await import('./api.js');
            const recipe = await getRecipeById(id);

            this.app.innerHTML = `
                <div class="recipe-detail">
                    <button onclick="window.location.hash='#/'" class="back-btn">← Back</button>
                    <h1>${recipe.title}</h1>
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <h2>Ingredients</h2>
                    <ul>
                        ${recipe.extendedIngredients?.map(ing =>
                            `<li>${ing.original}</li>`
                        ).join('') || '<li>No ingredients</li>'}
                    </ul>
                    <h2>Instructions</h2>
                    <div>
                        ${recipe.analyzedInstructions?.[0]?.steps?.map(step =>
                            `<p>${step.number}. ${step.step}</p>`
                        ).join('') || '<p>No instructions</p>'}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Recipe detail error:', error);
            this.app.innerHTML = '<div class="error-state">Failed to load recipe</div>';
        }
    }

    renderFavorites() {
        this.app.innerHTML = '<div class="loading">Loading favorites...</div>';
        import('./saved-recipes.js').then(module => {
            const view = new module.SavedRecipesView(this.app);
            view.render();
        }).catch(err => {
            console.error('Failed to load favorites:', err);
            this.app.innerHTML = '<div class="error-state">Could not load favorites</div>';
        });
    }

    renderShoppingList() {
        this.app.innerHTML = '<div class="loading">Loading shopping list...</div>';
        import('./shopping-list.js').then(module => {
            const list = new module.ShoppingList(this.app);
            list.render();
        }).catch(err => {
            console.error('Failed to load shopping list:', err);
            this.app.innerHTML = '<div class="error-state">Could not load shopping list</div>';
        });
    }

    renderMealPlanner() {
        this.app.innerHTML = '<div class="loading">Loading meal planner...</div>';
        import('./meal-planner.js').then(module => {
            const planner = new module.MealPlanner(this.app);
            planner.render();
        }).catch(err => {
            console.error('Failed to load meal planner:', err);
            this.app.innerHTML = '<div class="error-state">Could not load meal planner</div>';
        });
    }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready');
    new App();
});