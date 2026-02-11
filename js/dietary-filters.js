export class DietaryFilters {
    constructor(container, onFilterChange) {
        this.container = container;
        this.onFilterChange = onFilterChange;
        this.filters = {
            vegetarian: false,
            vegan: false,
            glutenFree: false,
            dairyFree: false,
            nutFree: false,
            lowCarb: false,
            highProtein: false
        };
    }

    render() {
        this.container.innerHTML = `
            <div class="dietary-filters">
                <h3>Dietary Preferences</h3>
                <div class="filters-grid">
                    <label class="filter-checkbox">
                        <input type="checkbox" data-filter="vegetarian">
                        🌱 Vegetarian
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" data-filter="vegan">
                        🌿 Vegan
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" data-filter="glutenFree">
                        🌾 Gluten Free
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" data-filter="dairyFree">
                        🥛 Dairy Free
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" data-filter="nutFree">
                        🥜 Nut Free
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" data-filter="lowCarb">
                        🥩 Low Carb
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" data-filter="highProtein">
                        💪 High Protein
                    </label>
                </div>
                <button class="clear-filters-btn">Clear All Filters</button>
            </div>
        `;

        this.attachEvents();
    }

    attachEvents() {
        this.container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filter = e.target.dataset.filter;
                this.filters[filter] = e.target.checked;
                this.onFilterChange(this.getActiveFilters());
            });
        });

        const clearBtn = this.container.querySelector('.clear-filters-btn');
        clearBtn?.addEventListener('click', () => {
            this.container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            this.filters = Object.keys(this.filters).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            this.onFilterChange([]);
        });
    }

    getActiveFilters() {
        return Object.entries(this.filters)
            .filter(([, active]) => active)
            .map(([key]) => key);
    }
}