// Remove any duplicate imports - you should only have ONE of each
import { fetchRecipes } from './api.js';
import { RecipeSearch, renderRecipes } from './recipes.js';
import { CookingTimer } from './cooking-timer.js';
import { DietaryFilters } from './dietary-filters.js';

// Comment out these if they don't exist yet or are causing errors
// import { RecipeDetail } from './recipe-detail.js';
// import { SavedRecipesView } from './saved-recipes.js';
// import { ShoppingList } from './shopping-list.js';
// import { MealPlanner } from './meal-planner.js';

class App {
    constructor() {
        this.app = document.getElementById('app');
        this.init();
    }

    init() {
        console.log('App initializing...');
        this.setupComponents();
        this.loadSampleRecipes();
    }

    setupComponents() {
        // Initialize timer widget
        const timerWidget = document.getElementById('timer-widget');
        console.log('Timer widget element:', timerWidget);
        
        if (timerWidget) {
            try {
                this.timer = new CookingTimer(timerWidget);
                this.timer.render();
                console.log('Timer rendered successfully');
            } catch (error) {
                console.error('Error rendering timer:', error);
            }
        }

        // Initialize filters widget
        const filtersWidget = document.getElementById('filters-widget');
        console.log('Filters widget element:', filtersWidget);
        
        if (filtersWidget) {
            try {
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
                console.log('Filters rendered successfully');
            } catch (error) {
                console.error('Error rendering filters:', error);
            }
        }
    }

    async loadSampleRecipes() {
        console.log('Loading sample recipes...');
        this.app.innerHTML = '<div class="loading">Loading delicious recipes...</div>';
        
        try {
            const recipes = await fetchRecipes('pasta');
            console.log('Recipes loaded:', recipes);
            
            if (recipes && recipes.length > 0) {
                renderRecipes(recipes, this.app);
            } else {
                this.app.innerHTML = '<div class="empty-state">No recipes found. Try searching for something else!</div>';
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.app.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🍳</span>
                    <h3>Unable to load recipes</h3>
                    <p>Please check your connection and try again</p>
                </div>
            `;
        }
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, starting app...');
    new App();
});