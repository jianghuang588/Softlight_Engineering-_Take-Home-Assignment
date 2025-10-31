const { chromium } = require('playwright');
const fs = require('fs-extra');

// Parse natural language into actions
function parseTask(question) {
    const q = question.toLowerCase();
    
    // Detect action
    let action = 'unknown';
    if (q.includes('create') || q.includes('add')) action = 'create';
    else if (q.includes('filter')) action = 'filter';
    else if (q.includes('delete')) action = 'delete';
    else if (q.includes('edit') || q.includes('change')) action = 'edit';
    
    // Detect app
    let app = 'unknown';
    if (q.includes('notion')) app = 'notion';
    else if (q.includes('linear')) app = 'linear';
    else if (q.includes('asana')) app = 'asana';
    
    // Detect target (what to create/filter/etc)
    let target = 'unknown';
    if (q.includes('page')) target = 'page';
    else if (q.includes('project')) target = 'project';
    else if (q.includes('task')) target = 'task';
    else if (q.includes('issue')) target = 'issue';
    else if (q.includes('database')) target = 'database';
    
    return { action, app, target, original: question };
}

// Main capture system
async function captureWorkflow(question) {
    const task = parseTask(question);
    console.log('Parsed task:', task);
    
    // Create folder for this task
    const folderName = `${task.app}-${task.action}-${task.target}`.replace(/ /g, '-');
    const screenshotDir = `screenshots/${folderName}`;
    await fs.ensureDir(screenshotDir);
    
    // Launch browser
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000  // Slow down so you can see what's happening
    });
    
    const page = await browser.newPage();
    let stepCount = 1;
    
    try {
        // Navigate to app
        const urls = {
            'notion': 'https://notion.so',
            'linear': 'https://linear.app',
            'asana': 'https://asana.com'
        };
        
        await page.goto(urls[task.app] || 'https://notion.so');
        await page.waitForTimeout(2000);
        
        // Capture initial state
        await page.screenshot({ 
            path: `${screenshotDir}/step-${stepCount++}-initial.png` 
        });
        console.log('✓ Captured initial state');
        
        // Find and click create/action button
        const buttonPatterns = [
            `text=/.*${task.action}.*${task.target}/i`,
            `text=/.*new.*${task.target}/i`,
            `text=/.*add.*${task.target}/i`,
            `button:has-text("${task.action}")`,
            `button:has-text("New")`,
            `button:has-text("Add")`,
            `button:has-text("Create")`,
            '[aria-label*="create"]',
            '[aria-label*="new"]',
            'button:has(svg)',  // Icon buttons
            '.plus-button',
            '[class*="create"]',
            '[class*="add-new"]'
        ];
        
        let buttonFound = false;
        for (const pattern of buttonPatterns) {
            try {
                const button = page.locator(pattern).first();
                if (await button.isVisible({ timeout: 1000 })) {
                    await button.click();
                    buttonFound = true;
                    console.log(`✓ Clicked button with pattern: ${pattern}`);
                    await page.waitForTimeout(2000);
                    
                    // Capture after click
                    await page.screenshot({ 
                        path: `${screenshotDir}/step-${stepCount++}-after-action-click.png` 
                    });
                    break;
                }
            } catch (e) {
                // Try next pattern
            }
        }
        
        if (!buttonFound) {
            console.log('⚠ No action button found, trying to capture visible UI...');
        }
        
        // Check if modal or form appeared
        const hasModal = await page.locator('[role="dialog"], .modal, [class*="modal"]').isVisible();
        const hasForm = await page.locator('form').isVisible();
        
        if (hasModal || hasForm) {
            console.log('✓ Found modal/form');
            await page.screenshot({ 
                path: `${screenshotDir}/step-${stepCount++}-form-modal.png` 
            });
            
            // Try to fill some fields - only text inputs
        const inputs = await page.locator('input[type="text"], input[type="email"], input:not([type])').all();
        const textInputs = [];

        // Filter for only fillable inputs
        for (const input of inputs) {
        const type = await input.getAttribute('type');
        if (!type || type === 'text' || type === 'email') {
            textInputs.push(input);
            }
        }

if (textInputs.length > 0) {
    console.log(`✓ Found ${textInputs.length} text input fields`);
    
    // Fill first text input
    await textInputs[0].fill(`Test ${task.target}`);



                await page.waitForTimeout(1000);
                
                await page.screenshot({ 
                    path: `${screenshotDir}/step-${stepCount++}-form-filled.png` 
                });
            }
            
            // Try to submit
            const submitPatterns = [
                'button[type="submit"]',
                'button:has-text("Create")',
                'button:has-text("Save")',
                'button:has-text("Add")',
                'button:has-text("Done")',
                'button:has-text("Submit")'
            ];
            
            for (const pattern of submitPatterns) {
                const submit = page.locator(pattern).first();
                if (await submit.isVisible({ timeout: 1000 })) {
                    await submit.click();
                    console.log('✓ Clicked submit button');
                    await page.waitForTimeout(2000);
                    
                    await page.screenshot({ 
                        path: `${screenshotDir}/step-${stepCount++}-after-submit.png` 
                    });
                    break;
                }
            }
        }
        
        // Final state
        await page.screenshot({ 
            path: `${screenshotDir}/step-${stepCount++}-final.png` 
        });
        
        // Save metadata
        const metadata = {
            question: question,
            task: task,
            screenshots: stepCount - 1,
            timestamp: new Date().toISOString(),
            folder: screenshotDir
        };
        
        await fs.writeJson(`${screenshotDir}/metadata.json`, metadata, { spaces: 2 });
        console.log('✓ Saved metadata');
        
    } catch (error) {
        console.error('Error during capture:', error);
    } finally {
        await browser.close();
    }
    
    console.log(`\n✅ Complete! Check ${screenshotDir}/ for screenshots\n`);
}

// Test runner
async function runTests() {
    const testQuestions = [
        "How do I create a new page in Notion?",
        "How do I add a project in Linear?",
        "How do I filter tasks in Asana?",
        "How do I create a database in Notion?",
        "How do I create an issue in Linear?"
    ];
    
    console.log('Starting tests...\n');
    
    for (const question of testQuestions) {
        console.log(`\n📷 Testing: "${question}"`);
        console.log('='.repeat(50));
        
        try {
            await captureWorkflow(question);
        } catch (error) {
            console.error(`Failed: ${error.message}`);
        }
        
        console.log('\nWaiting 3 seconds before next test...');
        await new Promise(r => setTimeout(r, 3000));
    }
    
    console.log('\n🎉 All tests complete!');
    console.log('Check the screenshots/ folder for results');
}

// Helper function to test a single question
async function testSingle(question) {
    await captureWorkflow(question);
}

// Run based on command line argument
if (process.argv[2] === 'all') {
    runTests();
} else if (process.argv[2]) {
    // Test specific question from command line
    testSingle(process.argv.slice(2).join(' '));
} else {
    // Default test
    testSingle("How do I create a new page in Notion?");
}