import { fetchRecipes } from './api.js';
import { RecipeSearch } from './recipes.js';
import { RecipeDetail } from './recipe-detail.js';
import { SavedRecipesView } from './saved-recipes.js';
import { ShoppingList } from './shopping-list.js';
import { MealPlanner } from './meal-planner.js';
import { CookingTimer } from './cooking-timer.js';
import { DietaryFilters } from './dietary-filters.js';

class App {
    constructor() {
        this.app = document.getElementById('app');
        this.init();
    }

    init() {
        this.setupRouting();
        this.setupComponents();
        
        // Load default view if no hash
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
        console.log('Navigating to:', hash);

        switch(true) {
            case hash === '/' || hash === '/search':
                this.renderSearchView();
                break;
            case hash === '/favorites':
                this.renderFavoritesView();
                break;
            case hash === '/shopping-list':
                this.renderShoppingListView();
                break;
            case hash === '/meal-planner':
                this.renderMealPlannerView();
                break;
            case hash.startsWith('/recipe/'):
                const id = hash.split('/')[2];
                this.renderRecipeDetailView(id);
                break;
            default:
                this.renderSearchView();
        }
    }

    setupComponents() {
        // Initialize timer widget
        const timerWidget = document.getElementById('timer-widget');
        if (timerWidget) {
            this.timer = new CookingTimer(timerWidget);
            this.timer.render();
        }

        // Initialize filters widget
        const filtersWidget = document.getElementById('filters-widget');
        if (filtersWidget) {
            this.filters = new DietaryFilters(
                filtersWidget,
                (activeFilters) => this.filterRecipes(activeFilters)
            );
            this.filters.render();
        }
    }

    renderSearchView() {
        this.app.innerHTML = '';
        const search = new RecipeSearch(this.app);
        search.render();
    }

    renderFavoritesView() {
        this.app.innerHTML = '';
        const favorites = new SavedRecipesView(this.app);
        favorites.render();
    }

    renderRecipeDetailView(id) {
        this.app.innerHTML = '';
        const detail = new RecipeDetail(this.app);
        detail.render(id);
    }

    renderShoppingListView() {
        this.app.innerHTML = '';
        const shoppingList = new ShoppingList(this.app);
        shoppingList.render();
    }

    renderMealPlannerView() {
        this.app.innerHTML = '';
        const planner = new MealPlanner(this.app);
        planner.render();
    }

    filterRecipes(filters) {
        const event = new CustomEvent('filtersChanged', { detail: filters });
        window.dispatchEvent(event);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});