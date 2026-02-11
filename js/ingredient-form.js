export class IngredientForm {
    constructor(container, onSearch) {
        this.container = container;
        this.onSearch = onSearch;
        this.ingredients = [];
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="ingredient-form">
                <h3>🍅 Find by Ingredients</h3>
                <p class="form-hint">Add ingredients you have at home</p>
                <div class="ingredient-input-group">
                    <input 
                        type="text" 
                        id="ingredient-input" 
                        placeholder="e.g., chicken, rice, tomato"
                        autocomplete="off"
                    />
                    <button id="add-ingredient-btn" class="btn-secondary">Add</button>
                </div>
                <div class="ingredients-list" id="ingredients-list">
                    ${this.renderIngredients()}
                </div>
                <button id="search-by-ingredients-btn" class="btn-primary" ${this.ingredients.length === 0 ? 'disabled' : ''}>
                    🔍 Find Recipes (${this.ingredients.length} ingredients)
                </button>
                ${this.ingredients.length > 0 ? `
                    <button id="clear-ingredients-btn" class="btn-text">Clear all</button>
                ` : ''}
            </div>
        `;
        
        this.attachEvents();
    }

    renderIngredients() {
        if (this.ingredients.length === 0) {
            return '<p class="no-ingredients">No ingredients added yet</p>';
        }

        return this.ingredients.map(ing => `
            <span class="ingredient-tag">
                ${ing}
                <button class="remove-ingredient" data-ingredient="${ing}" aria-label="Remove ${ing}">×</button>
            </span>
        `).join('');
    }

    attachEvents() {
        const addBtn = this.container.querySelector('#add-ingredient-btn');
        const input = this.container.querySelector('#ingredient-input');
        const searchBtn = this.container.querySelector('#search-by-ingredients-btn');
        const clearBtn = this.container.querySelector('#clear-ingredients-btn');

        addBtn?.addEventListener('click', () => {
            const ingredient = input.value.trim().toLowerCase();
            if (ingredient && !this.ingredients.includes(ingredient)) {
                this.ingredients.push(ingredient);
                this.render();
            }
            input.value = '';
            input.focus();
        });

        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addBtn.click();
            }
        });

        // Remove individual ingredients
        this.container.querySelectorAll('.remove-ingredient').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ingredient = e.target.dataset.ingredient;
                this.ingredients = this.ingredients.filter(i => i !== ingredient);
                this.render();
            });
        });

        // Search button
        searchBtn?.addEventListener('click', () => {
            if (this.ingredients.length > 0) {
                this.onSearch(this.ingredients.join(','));
            }
        });

        // Clear all button
        clearBtn?.addEventListener('click', () => {
            this.ingredients = [];
            this.render();
        });
    }
}