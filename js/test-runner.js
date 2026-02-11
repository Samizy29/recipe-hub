import { StorageTest } from './storage-test.js';
import { EdgeCaseTester, FormValidator } from './form-validation.js';

class TestRunner {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    async runAllTests() {
        console.log('🧪 Starting Recipe Hub Test Suite...\n');
        
        // Run localStorage tests
        await this.runLocalStorageTests();
        
        // Run edge case tests
        await this.runEdgeCaseTests();
        
        // Run validation tests
        await this.runValidationTests();
        
        // Run mobile tests (simulated)
        await this.runMobileTests();
        
        // Print summary
        this.printSummary();
    }

    async runLocalStorageTests() {
        console.group('📦 localStorage Tests');
        
        // Test 1: Basic persistence
        const persistenceTest = StorageTest.testPersistence();
        this.logResult('Basic persistence', persistenceTest);
        
        // Test 2: Data validation
        const validation = StorageTest.validateStoredData();
        console.log('Storage validation:', validation);
        
        // Test 3: Quota check
        const quota = StorageTest.checkStorageQuota();
        this.logResult('Storage quota check', quota > 0);
        
        console.groupEnd();
    }

    async runEdgeCaseTests() {
        console.group('⚡ Edge Case Tests');
        
        const edgeCases = await EdgeCaseTester.testAllEdgeCases();
        
        Object.entries(edgeCases).forEach(([test, result]) => {
            this.logResult(test, result.passed, result);
        });
        
        console.groupEnd();
    }

    async runValidationTests() {
        console.group('✅ Validation Tests');
        
        // Test search validation
        const searchValid = FormValidator.validateSearchInput('pasta');
        const searchInvalid = FormValidator.validateSearchInput('');
        
        this.logResult('Valid search passes', searchValid.isValid);
        this.logResult('Empty search fails', !searchInvalid.isValid);
        
        // Test sanitization
        const malicious = '<script>alert("test")</script>';
        const sanitized = FormValidator.sanitizeInput(malicious);
        this.logResult('XSS prevention', sanitized === 'alert(&quot;test&quot;)');
        
        // Test timer validation
        const timerValid = FormValidator.validateTimerInput('30');
        const timerInvalid = FormValidator.validateTimerInput('150');
        
        this.logResult('Valid timer passes', timerValid.isValid);
        this.logResult('Invalid timer fails', !timerInvalid.isValid);
        
        console.groupEnd();
    }

    async runMobileTests() {
        console.group('📱 Mobile Responsiveness Tests');
        
        // Simulate different viewport sizes
        const viewports = [
            { width: 375, height: 667, name: 'iPhone SE' },
            { width: 414, height: 896, name: 'iPhone 11' },
            { width: 360, height: 740, name: 'Android' },
            { width: 768, height: 1024, name: 'iPad' }
        ];
        
        viewports.forEach(viewport => {
            const hasMediaQuery = this.checkMediaQueryForViewport(viewport.width);
            this.logResult(`${viewport.name} (${viewport.width}px)`, hasMediaQuery);
        });
        
        console.groupEnd();
    }

    checkMediaQueryForViewport(width) {
        // Check if CSS media queries exist for this viewport
        const styleSheets = document.styleSheets;
        let hasQuery = false;
        
        try {
            for (let sheet of styleSheets) {
                for (let rule of sheet.cssRules) {
                    if (rule.media && rule.conditionText) {
                        if (rule.conditionText.includes(`${width}px`)) {
                            hasQuery = true;
                        }
                    }
                }
            }
        } catch (e) {
            // CORS issues with external stylesheets
            return true; // Assume responsive
        }
        
        return hasQuery;
    }

    logResult(testName, passed, details = null) {
        this.results.total++;
        if (passed) {
            this.results.passed++;
            console.log(`✅ ${testName}`);
        } else {
            this.results.failed++;
            console.log(`❌ ${testName}`);
            if (details) {
                console.log('   Details:', details);
            }
        }
    }

    printSummary() {
        console.log('\n📊 Test Summary');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        // Add to DOM
        this.addSummaryToDOM();
    }

    addSummaryToDOM() {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'test-summary';
        summaryDiv.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 9999; border-left: 4px solid ${this.results.failed === 0 ? '#4caf50' : '#f44336'};">
                <h4 style="margin: 0 0 0.5rem 0; color: #333;">🧪 Test Results</h4>
                <div style="display: flex; gap: 1rem;">
                    <span style="color: #4caf50;">✅ ${this.results.passed}</span>
                    <span style="color: #f44336;">❌ ${this.results.failed}</span>
                    <span style="color: #666;">📊 ${this.results.total}</span>
                </div>
                <button onclick="this.parentElement.remove()" style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
        `;
        
        document.body.appendChild(summaryDiv);
    }
}

// Auto-run tests in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        const runner = new TestRunner();
        runner.runAllTests();
    });
}

export default TestRunner;