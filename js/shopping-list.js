const SHOPPING_LIST_KEY = 'shopping_list';

export class ShoppingList {
    constructor(container) {
        this.container = container;
        this.items = this.loadItems();
    }

    loadItems() {
        try {
            const saved = localStorage.getItem(SHOPPING_LIST_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading shopping list:', error);
            return [];
        }
    }

    saveItems() {
        localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(this.items));
    }

    addIngredients(ingredients) {
        ingredients.forEach(ing => {
            const existingItem = this.items.find(item => 
                item.name.toLowerCase() === ing.name.toLowerCase()
            );
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    id: Date.now() + Math.random(),
                    name: ing.name,
                    quantity: 1,
                    unit: ing.unit || '',
                    checked: false
                });
            }
        });
        this.saveItems();
        
        if (this.container) {
            this.render();
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveItems();
        this.render();
    }

    toggleChecked(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.checked = !item.checked;
            this.saveItems();
            this.render();
        }
    }

    clearChecked() {
        this.items = this.items.filter(item => !item.checked);
        this.saveItems();
        this.render();
    }

    clearAll() {
        if (confirm('Clear all items from shopping list?')) {
            this.items = [];
            this.saveItems();
            this.render();
        }
    }

    render() {
        if (!this.container) return;

        if (this.items.length === 0) {
            this.renderEmptyState();
            return;
        }

        const uncheckedItems = this.items.filter(item => !item.checked);
        const checkedItems = this.items.filter(item => item.checked);

        this.container.innerHTML = `
            <div class="shopping-list-view">
                <div class="view-header">
                    <h1>🛒 Shopping List</h1>
                    <div class="list-stats">
                        <span>${uncheckedItems.length} items to buy</span>
                        ${checkedItems.length > 0 ? `<span>${checkedItems.length} purchased</span>` : ''}
                    </div>
                </div>

                ${uncheckedItems.length > 0 ? `
                    <div class="list-section">
                        <h2>To Buy</h2>
                        <ul class="shopping-items">
                            ${uncheckedItems.map(item => this.renderItem(item)).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${checkedItems.length > 0 ? `
                    <div class="list-section purchased">
                        <h2>Purchased</h2>
                        <ul class="shopping-items">
                            ${checkedItems.map(item => this.renderItem(item)).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="list-actions">
                    <button id="clear-checked-btn" class="btn-secondary" ${checkedItems.length === 0 ? 'disabled' : ''}>
                        Clear Purchased
                    </button>
                    <button id="clear-all-btn" class="btn-danger" ${this.items.length === 0 ? 'disabled' : ''}>
                        Clear All
                    </button>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    renderItem(item) {
        return `
            <li class="shopping-item ${item.checked ? 'checked' : ''}" data-id="${item.id}">
                <input 
                    type="checkbox" 
                    class="item-checkbox"
                    ${item.checked ? 'checked' : ''}
                    aria-label="Mark ${item.name} as purchased"
                >
                <span class="item-name">${item.name}</span>
                ${item.quantity > 1 ? `<span class="item-quantity">×${item.quantity}</span>` : ''}
                ${item.unit ? `<span class="item-unit">${item.unit}</span>` : ''}
                <button class="remove-item" aria-label="Remove ${item.name}">
                    🗑️
                </button>
            </li>
        `;
    }

    renderEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h2>Your shopping list is empty</h2>
                <p>Add ingredients from recipes to build your shopping list</p>
                <button onclick="window.location.hash='#/'" class="btn-primary">
                    Browse Recipes
                </button>
            </div>
        `;
    }

    attachEvents() {
        // Checkbox toggles
        this.container.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const itemId = parseFloat(e.target.closest('.shopping-item').dataset.id);
                this.toggleChecked(itemId);
            });
        });

        // Remove individual items
        this.container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseFloat(e.target.closest('.shopping-item').dataset.id);
                if (confirm('Remove this item from the list?')) {
                    this.removeItem(itemId);
                }
            });
        });

        // Clear checked items
        const clearCheckedBtn = this.container.querySelector('#clear-checked-btn');
        clearCheckedBtn?.addEventListener('click', () => this.clearChecked());

        // Clear all items
        const clearAllBtn = this.container.querySelector('#clear-all-btn');
        clearAllBtn?.addEventListener('click', () => this.clearAll());
    }
}