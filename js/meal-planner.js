const MEAL_PLAN_KEY = 'weekly_meal_plan';

export class MealPlanner {
    constructor(container) {
        this.container = container;
        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.mealTypes = ['breakfast', 'lunch', 'dinner'];
        this.plan = this.loadPlan();
    }

    loadPlan() {
        try {
            const saved = localStorage.getItem(MEAL_PLAN_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading meal plan:', error);
        }
        
        // Initialize empty plan
        return this.initializeEmptyPlan();
    }

    initializeEmptyPlan() {
        const plan = {};
        this.days.forEach(day => {
            plan[day] = {
                breakfast: null,
                lunch: null,
                dinner: null
            };
        });
        return plan;
    }

    savePlan() {
        localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(this.plan));
    }

    addMeal(day, mealType, recipe) {
        if (!this.plan[day]) {
            this.plan[day] = { breakfast: null, lunch: null, dinner: null };
        }
        
        this.plan[day][mealType] = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image || 'https://via.placeholder.com/100x100?text=Recipe',
            readyInMinutes: recipe.readyInMinutes || 30
        };
        
        this.savePlan();
        this.render();
    }

    removeMeal(day, mealType) {
        if (this.plan[day] && this.plan[day][mealType]) {
            this.plan[day][mealType] = null;
            this.savePlan();
            this.render();
        }
    }

    getWeekSummary() {
        let totalMeals = 0;
        let plannedMeals = 0;
        
        this.days.forEach(day => {
            this.mealTypes.forEach(mealType => {
                totalMeals++;
                if (this.plan[day]?.[mealType]) {
                    plannedMeals++;
                }
            });
        });
        
        return {
            totalMeals,
            plannedMeals,
            percentage: Math.round((plannedMeals / totalMeals) * 100)
        };
    }

    render() {
        const summary = this.getWeekSummary();
        
        this.container.innerHTML = `
            <div class="meal-planner-view">
                <div class="view-header">
                    <h1>📅 Weekly Meal Planner</h1>
                    <div class="plan-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${summary.percentage}%"></div>
                        </div>
                        <p>${summary.plannedMeals}/${summary.totalMeals} meals planned</p>
                    </div>
                </div>

                <div class="meal-plan-grid">
                    <div class="grid-header">
                        <div class="day-column">Day</div>
                        <div class="meal-column">Breakfast</div>
                        <div class="meal-column">Lunch</div>
                        <div class="meal-column">Dinner</div>
                    </div>
                    
                    ${this.days.map(day => `
                        <div class="plan-row" data-day="${day}">
                            <div class="day-column">
                                <h3>${day}</h3>
                            </div>
                            ${this.mealTypes.map(mealType => `
                                <div class="meal-column ${this.plan[day]?.[mealType] ? 'filled' : ''}">
                                    ${this.renderMealSlot(day, mealType)}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>

                <div class="meal-suggestions">
                    <h2>Quick Add</h2>
                    <div class="suggestion-buttons">
                        <button class="suggestion-btn" data-meal="breakfast">🍳 Breakfast</button>
                        <button class="suggestion-btn" data-meal="lunch">🥗 Lunch</button>
                        <button class="suggestion-btn" data-meal="dinner">🍽️ Dinner</button>
                    </div>
                </div>
            </div>
        `;

        this.attachEvents();
    }

    renderMealSlot(day, mealType) {
        const meal = this.plan[day]?.[mealType];
        
        if (meal) {
            return `
                <div class="meal-card">
                    <div class="meal-content">
                        <h4 title="${meal.title}">${meal.title}</h4>
                        <span class="meal-time">⏱️ ${meal.readyInMinutes} min</span>
                    </div>
                    <button 
                        class="remove-meal-btn" 
                        data-day="${day}" 
                        data-meal="${mealType}"
                        aria-label="Remove ${mealType}"
                    >
                        ✕
                    </button>
                </div>
            `;
        }
        
        return `
            <button 
                class="add-meal-btn" 
                data-day="${day}" 
                data-meal="${mealType}"
            >
                + Add
            </button>
        `;
    }

    attachEvents() {
        // Add meal buttons
        this.container.querySelectorAll('.add-meal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const { day, meal } = e.currentTarget.dataset;
                this.openRecipeSelector(day, meal);
            });
        });

        // Remove meal buttons
        this.container.querySelectorAll('.remove-meal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const { day, meal } = e.currentTarget.dataset;
                if (confirm(`Remove this ${meal} from ${day}?`)) {
                    this.removeMeal(day, meal);
                }
            });
        });

        // Quick add suggestions
        this.container.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mealType = e.currentTarget.dataset.meal;
                this.openQuickAddModal(mealType);
            });
        });
    }

    openRecipeSelector(day, mealType) {
        // Create modal for recipe selection
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add ${mealType} for ${day}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="search-box">
                        <input 
                            type="text" 
                            id="modal-search" 
                            placeholder="Search for recipes..."
                            autofocus
                        />
                        <button id="modal-search-btn">🔍 Search</button>
                    </div>
                    <div id="modal-results" class="modal-results">
                        <p>Search for recipes to add to your meal plan</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        const searchInput = modal.querySelector('#modal-search');
        const searchBtn = modal.querySelector('#modal-search-btn');
        const resultsDiv = modal.querySelector('#modal-results');

        const performSearch = async () => {
            const query = searchInput.value.trim();
            if (!query) return;

            resultsDiv.innerHTML = '<div class="loading">Searching...</div>';
            
            try {
                const { fetchRecipes } = await import('./api.js');
                const recipes = await fetchRecipes(query);
                
                if (recipes.length === 0) {
                    resultsDiv.innerHTML = '<p>No recipes found</p>';
                    return;
                }

                resultsDiv.innerHTML = `
                    <div class="recipe-grid-mini">
                        ${recipes.slice(0, 6).map(recipe => `
                            <div class="recipe-mini-card" data-recipe='${JSON.stringify(recipe)}'>
                                <img src="${recipe.image}" alt="${recipe.title}">
                                <h4>${recipe.title}</h4>
                                <span>⏱️ ${recipe.readyInMinutes || 30} min</span>
                                <button class="select-recipe-btn">Select</button>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Add select handlers
                resultsDiv.querySelectorAll('.select-recipe-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const card = e.target.closest('.recipe-mini-card');
                        const recipeData = JSON.parse(card.dataset.recipe);
                        this.addMeal(day, mealType, recipeData);
                        modal.remove();
                    });
                });

            } catch (error) {
                resultsDiv.innerHTML = '<p>Error loading recipes. Please try again.</p>';
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    openQuickAddModal(mealType) {
        const days = this.days.filter(day => !this.plan[day]?.[mealType]);
        
        if (days.length === 0) {
            alert(`You already have ${mealType} planned for every day!`);
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content small">
                <div class="modal-header">
                    <h2>Add ${mealType} to...</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="day-selector">
                        ${days.map(day => `
                            <button class="day-btn" data-day="${day}">${day}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const day = btn.dataset.day;
                modal.remove();
                this.openRecipeSelector(day, mealType);
            });
        });
    }
}