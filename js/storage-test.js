// localStorage persistence test utility
export class StorageTest {
    static testPersistence() {
        const testKey = 'recipe_hub_test';
        const testData = {
            timestamp: Date.now(),
            random: Math.random(),
            test: 'persistence test'
        };

        try {
            // Write test
            localStorage.setItem(testKey, JSON.stringify(testData));
            
            // Read test
            const retrieved = localStorage.getItem(testKey);
            if (!retrieved) {
                console.error('❌ localStorage write failed');
                return false;
            }

            const parsed = JSON.parse(retrieved);
            
            // Verify data integrity
            if (parsed.timestamp !== testData.timestamp || 
                parsed.random !== testData.random) {
                console.error('❌ localStorage data corruption');
                return false;
            }

            // Clean up
            localStorage.removeItem(testKey);
            
            console.log('✅ localStorage persistence test passed');
            return true;
            
        } catch (error) {
            console.error('❌ localStorage test failed:', error);
            return false;
        }
    }

    static checkStorageQuota() {
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalSize += (key.length + value.length) * 2; // Approximate size in bytes
        }
        
        console.log(`📊 localStorage usage: ${(totalSize / 1024).toFixed(2)} KB`);
        return totalSize;
    }

    static validateStoredData() {
        const validations = {
            favorites: this.validateFavorites(),
            shoppingList: this.validateShoppingList(),
            mealPlan: this.validateMealPlan()
        };

        console.table(validations);
        return validations;
    }

    static validateFavorites() {
        try {
            const favorites = localStorage.getItem('recipe_favorites');
            if (!favorites) return { exists: false, valid: true };
            
            const parsed = JSON.parse(favorites);
            if (!Array.isArray(parsed)) return { exists: true, valid: false };
            
            // Check each favorite has required fields
            const valid = parsed.every(fav => 
                fav.id && 
                fav.title && 
                typeof fav.id === 'number'
            );
            
            return { exists: true, valid, count: parsed.length };
        } catch {
            return { exists: true, valid: false };
        }
    }

    static validateShoppingList() {
        try {
            const list = localStorage.getItem('shopping_list');
            if (!list) return { exists: false, valid: true };
            
            const parsed = JSON.parse(list);
            if (!Array.isArray(parsed)) return { exists: true, valid: false };
            
            const valid = parsed.every(item => 
                item.id && 
                item.name && 
                'checked' in item
            );
            
            return { exists: true, valid, count: parsed.length };
        } catch {
            return { exists: true, valid: false };
        }
    }

    static validateMealPlan() {
        try {
            const plan = localStorage.getItem('weekly_meal_plan');
            if (!plan) return { exists: false, valid: true };
            
            const parsed = JSON.parse(plan);
            const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            
            const hasAllDays = validDays.every(day => day in parsed);
            return { exists: true, valid: hasAllDays };
        } catch {
            return { exists: true, valid: false };
        }
    }
}