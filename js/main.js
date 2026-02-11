import { fetchRecipes } from "./api.js";
import { RecipeSearch, renderRecipes } from './recipes.js';
import { CookingTimer } from './cooking-timer.js';

class App {
    constructor() {
        this.app = document.getElementById('app');
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

        switch(hash) {
            case '/':
            case '/search':
                this.renderSearch();
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

        // Filters widget - simple version
        const filtersWidget = document.getElementById('filters-widget');
        if (filtersWidget) {
            filtersWidget.innerHTML = `
                <div class="dietary-filters">
                    <h3>Dietary Preferences</h3>
                    <div class="filters-grid">
                        <label><input type="checkbox"> 🌱 Vegetarian</label>
                        <label><input type="checkbox"> 🌾 Gluten Free</label>
                        <label><input type="checkbox"> 🥛 Dairy Free</label>
                    </div>
                </div>
            `;
        }
    }

    renderSearch() {
        this.app.innerHTML = '';
        const search = new RecipeSearch(this.app);
        search.render();
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
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready');
    new App();
});