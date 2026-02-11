const MEAL_PLAN_KEY = 'weekly_meal_plan';

export class MealPlanner {
    constructor(container) {
        this.container = container;
        this.plan = this.loadPlan();
        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }

    loadPlan() {
        const saved = localStorage.getItem(MEAL_PLAN_KEY);
        return saved ? JSON.parse(saved) : this.initializePlan();
    }

    initializePlan() {
        const plan = {};
        this.days.forEach(day => {
            plan[day] = { breakfast: null, lunch: null, dinner: null };
        });
        return plan;
    }

    savePlan() {
        localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(this.plan));
    }

    addMeal(day, mealType, recipe) {
        this.plan[day][mealType] = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image
        };
        this.savePlan();
        this.render();
    }

    removeMeal(day, mealType) {
        this.plan[day][mealType] = null;
        this.savePlan();
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="meal-planner">
                <h1>Weekly Meal Plan</h1>
                <div class="meal-grid">
                    <div class="meal-header">
                        <div class="day-header">Day</div>
                        <div class="meal-header">Breakfast</div>
                        <div class="meal-header">Lunch</div>
                        <div class="meal-header">Dinner</div>
                    </div>
                    ${this.days.map(day => `
                        <div class="meal-row" data-day="${day}">
                            <div class="day-name">${day}</div>
                            ${['breakfast', 'lunch', 'dinner'].map(mealType => `
                                <div class="meal-slot ${this.plan[day][mealType] ? 'filled' : ''}">
                                    ${this.renderMealSlot(day, mealType)}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.attachEvents();
    }

    renderMealSlot(day, mealType) {
        const meal = this.plan[day][mealType];
        if (meal) {
            return `
                <div class="meal-content">
                    <span class="meal-title">${meal.title}</span>
                    <button class="remove-meal" data-day="${day}" data-meal="${mealType}">✕</button>
                </div>
            `;
        }
        return `<button class="add-meal" data-day="${day}" data-meal="${mealType}">+ Add</button>`;
    }

    attachEvents() {
        this.container.querySelectorAll('.add-meal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const { day, meal } = e.target.dataset;
                this.openRecipeSelector(day, meal);
            });
        });

        this.container.querySelectorAll('.remove-meal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const { day, meal } = e.target.dataset;
                this.removeMeal(day, meal);
            });
        });
    }

    openRecipeSelector(day, mealType) {
        // This would open a modal or navigate to recipe search
        // For simplicity, you can create a recipe browser modal here
        console.log(`Add recipe for ${day} - ${mealType}`);
    }
}