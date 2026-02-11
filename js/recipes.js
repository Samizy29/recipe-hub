import { fetchRecipes } from './api.js';
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
                            placeholder="Search for recipes..."
                            value="${this.currentQuery}"
                        />
                        <button id="search-btn">🔍 Search</button>
                    </div>
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
            this.currentQuery = searchInput.value;
            this.loadRecipes();
        });

        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.currentQuery = searchInput.value;
                this.loadRecipes();
            }
        });

        // Listen for filter changes
        window.addEventListener('filtersChanged', (e) => {
            this.currentFilters = e.detail;
            this.loadRecipes();
        });
    }

    async loadRecipes() {
        const container = this.container.querySelector('#recipes-container');
        container.innerHTML = '<div class="loading">Loading recipes...</div>';
        
        try {
            const data = await fetchRecipes(this.currentQuery);
            renderRecipes(data, container);
        } catch (error) {
            container.innerHTML = '<div class="error">Failed to load recipes. Please try again.</div>';
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
                    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
                    <div class="recipe-info">
                        <h3>${recipe.title}</h3>
                        <span class="time">⏱️ ${recipe.readyInMinutes || '?'} mins</span>
                        <button class="view-recipe-btn" onclick="window.location.hash='#/recipe/${recipe.id}'">
                            View Recipe
                        </button>
                        <span class="favorite-indicator ${favoritesIds.includes(recipe.id) ? 'active' : ''}">
                            ${favoritesIds.includes(recipe.id) ? '★' : '☆'}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}