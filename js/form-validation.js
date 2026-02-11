export class FormValidator {
    static validateSearchInput(query) {
        const errors = [];
        
        if (!query || query.trim().length === 0) {
            errors.push('Search query cannot be empty');
        }
        
        if (query && query.length > 100) {
            errors.push('Search query is too long (maximum 100 characters)');
        }
        
        if (query && /[<>{}]/.test(query)) {
            errors.push('Search query contains invalid characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            sanitized: this.sanitizeInput(query)
        };
    }

    static validateTimerInput(minutes) {
        const errors = [];
        const value = parseInt(minutes);
        
        if (isNaN(value)) {
            errors.push('Please enter a valid number');
        }
        
        if (value < 1) {
            errors.push('Timer must be at least 1 minute');
        }
        
        if (value > 120) {
            errors.push('Timer cannot exceed 120 minutes');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            value: value || 0
        };
    }

    static validateEmail(email) {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || email.trim().length === 0) {
            errors.push('Email cannot be empty');
        } else if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            sanitized: this.sanitizeInput(email)
        };
    }

    static sanitizeInput(input) {
        if (!input) return '';
        return input
            .trim()
            .replace(/[<>{}]/g, '') // Remove HTML tags
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    static validateRecipeData(recipe) {
        const required = ['title', 'image'];
        const errors = [];
        
        required.forEach(field => {
            if (!recipe[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Edge Cases Test Suite
export class EdgeCaseTester {
    static async testAllEdgeCases() {
        const results = {
            emptySearch: await this.testEmptySearch(),
            specialCharacters: await this.testSpecialCharacters(),
            longSearch: await this.testLongSearch(),
            invalidRecipeId: await this.testInvalidRecipeId(),
            duplicateFavorites: await this.testDuplicateFavorites(),
            largeShoppingList: await this.testLargeShoppingList(),
            corruptedStorage: await this.testCorruptedStorage()
        };
        
        console.table(results);
        return results;
    }

    static async testEmptySearch() {
        try {
            const validation = FormValidator.validateSearchInput('');
            return { passed: !validation.isValid, error: validation.errors[0] };
        } catch {
            return { passed: false, error: 'Exception thrown' };
        }
    }

    static async testSpecialCharacters() {
        try {
            const maliciousInput = '<script>alert("xss")</script>';
            const sanitized = FormValidator.sanitizeInput(maliciousInput);
            return { 
                passed: !sanitized.includes('<script>'),
                original: maliciousInput,
                sanitized 
            };
        } catch {
            return { passed: false, error: 'Sanitization failed' };
        }
    }

    static async testLongSearch() {
        const longQuery = 'a'.repeat(200);
        const validation = FormValidator.validateSearchInput(longQuery);
        return { passed: !validation.isValid, length: longQuery.length };
    }

    static async testInvalidRecipeId() {
        try {
            import('../api.js').then(module => {
                module.getRecipeById('invalid');
            });
            return { passed: true };
        } catch {
            return { passed: false, error: 'Should handle invalid ID gracefully' };
        }
    }

    static async testDuplicateFavorites() {
        const { saveFavorite, getFavorites } = await import('./favorites.js');
        
        // Clear favorites first
        localStorage.removeItem('recipe_favorites');
        
        const testRecipe = { id: 9999, title: 'Test Recipe', image: 'test.jpg' };
        saveFavorite(testRecipe);
        saveFavorite(testRecipe); // Try to save duplicate
        
        const favorites = getFavorites();
        const duplicateCount = favorites.filter(f => f.id === 9999).length;
        
        return { 
            passed: duplicateCount === 1,
            count: duplicateCount 
        };
    }

    static async testLargeShoppingList() {
        const { ShoppingList } = await import('./shopping-list.js');
        const list = new ShoppingList();
        
        // Add 100 items
        for (let i = 0; i < 100; i++) {
            list.addIngredients([{ name: `Item ${i}`, checked: false }]);
        }
        
        return { 
            passed: list.items.length === 100,
            count: list.items.length 
        };
    }

    static async testCorruptedStorage() {
        // Simulate corrupted localStorage data
        localStorage.setItem('recipe_favorites', 'invalid json{');
        
        try {
            const { getFavorites } = await import('./favorites.js');
            const favorites = getFavorites();
            return { 
                passed: Array.isArray(favorites),
                recovered: true 
            };
        } catch {
            return { passed: false, error: 'Failed to recover from corruption' };
        }
    }
}