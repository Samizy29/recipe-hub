import { fetchRecipes } from "./api.js";

export class RecipeSearch {
    constructor(container) {
        this.container = container;
        this.currentQuery = 'pasta';
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

        this.loadRecipes();
    }

    async loadRecipes() {
        const container = this.container.querySelector('#recipes-container');
        container.innerHTML = '<div class="loading">Loading recipes...</div>';
        
        try {
            const recipes = await fetchRecipes(this.currentQuery);
            
            if (!recipes || recipes.length === 0) {
                container.innerHTML = '<div class="empty-state">No recipes found</div>';
                return;
            }

            container.innerHTML = `
                <div class="recipes-grid">
                    ${recipes.map(recipe => `
                        <div class="recipe-card">
                            <img src="${recipe.image}" alt="${recipe.title}">
                            <div class="recipe-info">
                                <h3>${recipe.title}</h3>
                                <span class="time">⏱️ ${recipe.readyInMinutes || '30'} mins</span>
                                <button 
                                    class="view-recipe-btn" 
                                    onclick="window.location.hash='#/recipe/${recipe.id}'"
                                >
                                    View Recipe
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<div class="error-state">Failed to load recipes</div>';
        }
    }
}

// For backward compatibility
export function renderRecipes(recipes, container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="recipes-grid">
            ${recipes.map(recipe => `
                <div class="recipe-card">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="recipe-info">
                        <h3>${recipe.title}</h3>
                        <span class="time">⏱️ ${recipe.readyInMinutes || '30'} mins</span>
                        <button 
                            class="view-recipe-btn" 
                            onclick="window.location.hash='#/recipe/${recipe.id}'"
                        >
                            View Recipe
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}