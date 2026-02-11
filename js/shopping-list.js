const SHOPPING_LIST_KEY = 'shopping_list';

export class ShoppingList {
    constructor(container) {
        this.container = container;
        this.items = this.loadItems();
    }

    loadItems() {
        const saved = localStorage.getItem(SHOPPING_LIST_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    saveItems() {
        localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(this.items));
    }

    generateFromIngredients(selectedIngredients) {
        selectedIngredients.forEach(ing => {
            const exists = this.items.find(item => item.name === ing.name);
            if (exists) {
                exists.quantity += 1; // Simple increment, you might want better logic
            } else {
                this.items.push({
                    id: Date.now() + Math.random(),
                    name: ing.name,
                    quantity: 1,
                    unit: ing.unit,
                    checked: false
                });
            }
        });
        this.saveItems();
        this.render();
    }

    render() {
        if (this.items.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🛒</span>
                    <h3>Shopping list is empty</h3>
                    <p>Add ingredients from recipes to build your shopping list</p>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="shopping-list">
                <h2>Shopping List</h2>
                <ul class="shopping-items">
                    ${this.items.map((item, index) => `
                        <li class="shopping-item ${item.checked ? 'checked' : ''}">
                            <input type="checkbox" 
                                   data-index="${index}" 
                                   ${item.checked ? 'checked' : ''}>
                            <span>${item.name}</span>
                            <span class="quantity">${item.quantity} ${item.unit || ''}</span>
                            <button class="remove-item" data-index="${index}">🗑️</button>
                        </li>
                    `).join('')}
                </ul>
                <button class="clear-list-btn">Clear Purchased Items</button>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        this.container.querySelectorAll('.shopping-item input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                this.items[index].checked = e.target.checked;
                this.saveItems();
            });
        });

        this.container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                this.items.splice(index, 1);
                this.saveItems();
                this.render();
            });
        });

        const clearBtn = this.container.querySelector('.clear-list-btn');
        clearBtn?.addEventListener('click', () => {
            this.items = this.items.filter(item => !item.checked);
            this.saveItems();
            this.render();
        });
    }
}