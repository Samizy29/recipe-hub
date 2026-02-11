import { fetchRecipes, fetchRecipesByIngredients } from './api.js';
import { getFavorites } from './favorites.js';

export class RecipeSearch {
    constructor(container) {
        this.container = container;
        this.currentQuery = 'pasta'; // default search
    }

    render() {
        this.container.innerHTML = `
            <div class="search-section">
                <div class="search-header">
                    <h2>Find Recipes</h2>
                    <div class="search-box">
                        <input 
                            type="text" 
                            id="search-input" 
                            placeholder="Search for recipes (e.g., pasta, tomato)"
                            value="${this.currentQuery}"
                        />
                        <button id="search-btn">🔍 Search</button>
                    </div>
                    <p class="search-hint">Try: pasta, tomato, chicken, rice</p>
                </div>
                <div id="recipes-container" class="loading">Loading recipes...</div>
            </div>
        `;

        this.attachEvents();
        this.loadRecipes();
    }

    attachEvents() {
        const searchBtn = this.container.querySelector('#search-btn');
        const searchInput = this.container.querySelector('#search-input');

        searchBtn?.addEventListener('click', () => {
            this.currentQuery = searchInput.value.trim() || 'pasta';
            this.loadRecipes();
        });

        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.currentQuery = searchInput.value.trim() || 'pasta';
                this.loadRecipes();
            }
        });
    }

    async loadRecipes() {
        const container = this.container.querySelector('#recipes-container');
        container.innerHTML = '<div class="loading">Loading recipes...</div>';
        
        try {
            // Try complexSearch first
            let recipes = await fetchRecipes(this.currentQuery);
            
            // If no results, try ingredients search
            if (!recipes || recipes.length === 0) {
                recipes = await fetchRecipesByIngredients(this.currentQuery);
            }
            
            renderRecipes(recipes, container);
        } catch (error) {
            console.error('Failed to load recipes:', error);
            container.innerHTML = `
                <div class="error-state">
                    <span class="error-icon">❌</span>
                    <h3>Failed to load recipes</h3>
                    <p>${error.message || 'Please try again later'}</p>
                    <button onclick="window.location.reload()" class="btn-primary">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

export function renderRecipes(recipes, container) {
    if (!recipes || recipes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">🔍</span>
                <h3>No recipes found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
        return;
    }

    const favorites = getFavorites();
    const favoritesIds = favorites.map(f => f.id);

    container.innerHTML = `
        <div class="recipes-grid">
            ${recipes.map(recipe => `
                <div class="recipe-card" data-id="${recipe.id}">
                    <img 
                        src="${recipe.image || 'https://spoonacular.com/recipe-images/placeholder.jpg'}" 
                        alt="${recipe.title}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/312x231?text=Recipe+Image'"
                    >
                    <div class="recipe-info">
                        <h3 title="${recipe.title}">${recipe.title}</h3>
                        <span class="time">⏱️ ${recipe.readyInMinutes || recipe.readyInMinutes || '30'} mins</span>
                        <div class="recipe-actions">
                            <button 
                                class="view-recipe-btn" 
                                onclick="window.location.hash='#/recipe/${recipe.id}'"
                            >
                                View Recipe
                            </button>
                            <span class="favorite-indicator ${favoritesIds.includes(recipe.id) ? 'active' : ''}">
                                ${favoritesIds.includes(recipe.id) ? '★' : '☆'}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}