#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

async function setupConfig() {
    console.log('🚀 MediaWiki MCP Server Authentication - Configuration Setup');
    console.log('=' .repeat(60));
    console.log();
    
    // Check if config already exists
    if (existsSync('config.json')) {
        const overwrite = await question('⚠️  config.json already exists. Overwrite? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('Setup cancelled.');
            rl.close();
            return;
        }
    }
    
    console.log('Please provide your MediaWiki configuration:');
    console.log();
    
    // Collect basic information
    const wikiName = await question('📝 Wiki name/identifier (e.g., my-wiki): ');
    const siteName = await question('🏷️  Site name (e.g., My Company Wiki): ');
    const serverUrl = await question('🌐 Server URL (e.g., https://wiki.example.com): ');
    
    // Determine paths based on server URL
    let articlePath = '/wiki';
    let scriptPath = '/w';
    
    const pathType = await question('📂 Wiki path type? (1) Standard (/wiki, /w) (2) Root (/index.php, empty) (3) Custom: ');
    
    if (pathType === '2') {
        articlePath = '/index.php';
        scriptPath = '';
    } else if (pathType === '3') {
        articlePath = await question('   Article path (e.g., /wiki): ');
        scriptPath = await question('   Script path (e.g., /w): ');
    }
    
    // Authentication details
    console.log();
    console.log('🔐 Authentication Configuration:');
    const username = await question('👤 Bot username: ');
    const password = await question('🔑 Bot password: ');
    
    // Build configuration
    const config = {
        defaultWiki: wikiName,
        wikis: {
            [wikiName]: {
                sitename: siteName,
                server: serverUrl,
                articlepath: articlePath,
                scriptpath: scriptPath,
                username: username,
                password: password
            }
        }
    };
    
    // Save configuration
    try {
        writeFileSync('config.json', JSON.stringify(config, null, 2));
        console.log();
        console.log('✅ Configuration saved to config.json');
        console.log();
        
        // Security reminder
        console.log('🔒 Security Reminder:');
        console.log('   • Keep config.json secure and private');
        console.log('   • Add config.json to .gitignore');
        console.log('   • Consider using environment variables in production');
        console.log();
        
        // Test configuration
        const testConfig = await question('🧪 Test configuration now? (Y/n): ');
        if (testConfig.toLowerCase() !== 'n') {
            console.log();
            console.log('Running authentication test...');
            
            // Import and run test
            try {
                process.env.CONFIG = './config.json';
                const { testAuthentication } = await import('../test/test-auth.js');
                const success = await testAuthentication();
                
                if (success) {
                    console.log();
                    console.log('🎉 Setup completed successfully!');
                    console.log();
                    console.log('Next steps:');
                    console.log('1. Add MCP server to Claude Code configuration');
                    console.log('2. Test with Claude Code MCP tools');
                    console.log('3. Review security settings');
                } else {
                    console.log();
                    console.log('⚠️  Configuration saved but authentication test failed.');
                    console.log('Please check your settings and try again.');
                }
            } catch (error) {
                console.error('❌ Test failed:', error.message);
                console.log('Configuration saved, but please verify settings manually.');
            }
        }
        
    } catch (error) {
        console.error('❌ Failed to save configuration:', error.message);
    }
    
    rl.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    setupConfig().catch(error => {
        console.error('Setup failed:', error.message);
        process.exit(1);
    });
}