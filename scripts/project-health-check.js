#!/usr/bin/env node
/**
 * AIB-AXYS Platform Health Check Script
 * Run this before starting development to verify your environment
 * 
 * Usage: node scripts/project-health-check.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

let errorCount = 0;
let warningCount = 0;

// Helper functions
function log(message, color = colors.reset, icon = '') {
  console.log(`${icon} ${color}${message}${colors.reset}`);
}

function success(message) {
  log(message, colors.green, icons.success);
}

function error(message) {
  log(message, colors.red, icons.error);
  errorCount++;
}

function warning(message) {
  log(message, colors.yellow, icons.warning);
  warningCount++;
}

function info(message) {
  log(message, colors.cyan, icons.info);
}

function separator() {
  console.log('\n' + '═'.repeat(70) + '\n');
}

// Check functions
async function checkNodeVersion() {
  log('Checking Node.js Version...', colors.blue);
  
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      success(`Node.js ${version} (Required: v18+)`);
    } else {
      error(`Node.js ${version} detected. REQUIRED: v18 or higher`);
      warning('Install Node.js v18+ from: https://nodejs.org/');
    }
  } catch (err) {
    error('Failed to check Node version');
  }
}

function checkDependencies() {
  log('Checking Dependencies...', colors.blue);
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    success('node_modules directory found');
    
    // Check for critical packages
    const criticalPackages = [
      'next',
      'react',
      'react-dom',
      'mongoose',
      'bcryptjs',
      'jsonwebtoken',
    ];
    
    const missingPackages = [];
    criticalPackages.forEach(pkg => {
      const pkgPath = path.join(nodeModulesPath, pkg);
      if (!fs.existsSync(pkgPath)) {
        missingPackages.push(pkg);
      }
    });
    
    if (missingPackages.length > 0) {
      error(`Missing critical packages: ${missingPackages.join(', ')}`);
      info('Run: npm install');
    } else {
      success('All critical packages installed');
    }
  } else {
    error('node_modules NOT FOUND');
    info('ACTION REQUIRED: Run "npm install" or "yarn install"');
  }
}

function checkEnvironmentFile() {
  log('Checking Environment Configuration...', colors.blue);
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    error('.env file NOT FOUND');
    warning('Create .env file with required variables');
    info('Copy .env.example to .env if it exists');
    return;
  }
  
  success('.env file exists');
  
  // Read and parse .env
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  // Critical environment variables
  const criticalVars = [
    { key: 'MONGO_URL', description: 'MongoDB Connection String' },
    { key: 'NEXTAUTH_SECRET', description: 'NextAuth Secret Key' },
    { key: 'NEXTAUTH_URL', description: 'NextAuth Base URL' },
    { key: 'NEXT_PUBLIC_BASE_URL', description: 'Public Base URL' },
  ];
  
  console.log('\n  Checking Critical Environment Variables:');
  
  criticalVars.forEach(({ key, description }) => {
    if (envVars[key] && envVars[key].length > 0) {
      success(`  ${key}: ${description}`);
      
      // Additional validation
      if (key === 'MONGO_URL' && !envVars[key].startsWith('mongodb')) {
        warning(`  ${key} does not appear to be a valid MongoDB URI`);
      }
    } else {
      error(`  CRITICAL: Missing ${key} (${description})`);
      info(`    Add to .env: ${key}=your_value_here`);
    }
  });
  
  // Optional but recommended variables
  const optionalVars = [
    'JWT_SECRET',
    'CONTACT_EMAIL_DEFAULT',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD',
  ];
  
  console.log('\n  Checking Optional Environment Variables:');
  
  optionalVars.forEach(key => {
    if (envVars[key] && envVars[key].length > 0) {
      success(`  ${key}: Configured`);
    } else {
      warning(`  ${key}: Not configured (optional but recommended)`);
    }
  });
}

function checkProjectStructure() {
  log('Checking Project Structure...', colors.blue);
  
  const criticalPaths = [
    { path: 'app', type: 'dir', description: 'Next.js App Directory' },
    { path: 'components', type: 'dir', description: 'React Components' },
    { path: 'components/AdminSidebar.js', type: 'file', description: 'Admin Sidebar Component' },
    { path: 'components/LoadingPage.js', type: 'file', description: 'Loading Screen Component' },
    { path: 'components/RouteLoadingWrapper.js', type: 'file', description: 'Loading Manager' },
    { path: 'components/SwipeNavigation.js', type: 'file', description: 'Mobile Swipe Navigation' },
    { path: 'components/Navbar.js', type: 'file', description: 'Public Navbar Component' },
    { path: 'app/globals.css', type: 'file', description: 'Global Styles' },
    { path: 'lib', type: 'dir', description: 'Utility Libraries' },
    { path: 'lib/mongodb.js', type: 'file', description: 'MongoDB Connection' },
    { path: 'lib/auth.js', type: 'file', description: 'Authentication Library' },
    { path: 'lib/permissions.js', type: 'file', description: 'RBAC Permissions (NEW)' },
    { path: 'models', type: 'dir', description: 'Mongoose Models' },
    { path: 'models/Admin.js', type: 'file', description: 'Admin User Model (RBAC Updated)' },
    { path: 'models/Role.js', type: 'file', description: 'Role Model (NEW)' },
    { path: 'public', type: 'dir', description: 'Static Assets' },
    { path: 'public/emblem-logo-light.svg', type: 'file', description: 'Loading Emblem (Light)' },
    { path: 'public/emblem-logo-dark.svg', type: 'file', description: 'Loading Emblem (Dark)' },
    { path: 'package.json', type: 'file', description: 'Package Configuration' },
    { path: 'next.config.js', type: 'file', description: 'Next.js Configuration' },
    { path: 'tailwind.config.js', type: 'file', description: 'Tailwind Configuration' },
  ];
  
  let structureOk = true;
  
  criticalPaths.forEach(({ path: itemPath, type, description }) => {
    const fullPath = path.join(process.cwd(), itemPath);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      // Verify type
      const stats = fs.statSync(fullPath);
      const isCorrectType = (type === 'dir' && stats.isDirectory()) || 
                            (type === 'file' && stats.isFile());
      
      if (isCorrectType) {
        success(`  ${itemPath} - ${description}`);
      } else {
        error(`  ${itemPath} exists but is wrong type (expected ${type})`);
        structureOk = false;
      }
    } else {
      error(`  MISSING: ${itemPath} - ${description}`);
      structureOk = false;
    }
  });
  
  if (structureOk) {
    success('Project structure is intact');
  } else {
    error('Project structure has missing or incorrect files');
    warning('You may need to re-download the project from the repository');
  }
}

async function testDatabaseConnection() {
  log('Testing Database Connection...', colors.blue);
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    warning('Skipping database test (no .env file)');
    return;
  }
  
  // Load environment variables
  require('dotenv').config();
  
  if (!process.env.MONGO_URL) {
    warning('Skipping database test (MONGO_URL not configured)');
    return;
  }
  
  try {
    // Check if mongoose is installed
    const nodeModulesPath = path.join(process.cwd(), 'node_modules', 'mongoose');
    if (!fs.existsSync(nodeModulesPath)) {
      warning('Mongoose not installed - skipping database test');
      info('Run: npm install');
      return;
    }
    
    const mongoose = require('mongoose');
    
    // Set timeout for connection
    const connectionTimeout = setTimeout(() => {
      error('Database connection timeout (10 seconds)');
      error('Check if MongoDB is running and MONGO_URL is correct');
      mongoose.disconnect();
    }, 10000);
    
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    
    clearTimeout(connectionTimeout);
    success('Database Connection: OK');
    
    // Check database name
    const dbName = mongoose.connection.db.databaseName;
    info(`  Connected to database: ${dbName}`);
    
    await mongoose.disconnect();
  } catch (err) {
    error('Database Connection: FAILED');
    error(`  Error: ${err.message}`);
    
    if (err.message.includes('ECONNREFUSED')) {
      info('  MongoDB server is not running or not accessible');
      info('  Start MongoDB: sudo systemctl start mongod (Linux)');
      info('               : brew services start mongodb-community (Mac)');
    } else if (err.message.includes('authentication failed')) {
      info('  Check your MongoDB credentials in .env');
    } else if (err.message.includes('ENOTFOUND')) {
      info('  Check your MongoDB host/URL in .env');
    }
  }
}

function checkPackageJson() {
  log('Checking package.json...', colors.blue);
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    error('package.json NOT FOUND');
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    // Check for required scripts
    const requiredScripts = ['dev', 'build', 'start'];
    const missingScripts = [];
    
    requiredScripts.forEach(script => {
      if (!packageJson.scripts || !packageJson.scripts[script]) {
        missingScripts.push(script);
      }
    });
    
    if (missingScripts.length > 0) {
      error(`Missing npm scripts: ${missingScripts.join(', ')}`);
    } else {
      success('All required npm scripts present');
    }
    
    // Check Next.js version
    if (packageJson.dependencies && packageJson.dependencies.next) {
      const nextVersion = packageJson.dependencies.next;
      info(`  Next.js version: ${nextVersion}`);
      
      if (nextVersion.includes('16') || nextVersion.includes('^16')) {
        success('  Next.js 16 detected (Latest)');
      }
    }
    
  } catch (err) {
    error('Failed to parse package.json');
    error(`  ${err.message}`);
  }
}

function generateReport() {
  separator();
  log('HEALTH CHECK SUMMARY', colors.magenta);
  separator();
  
  if (errorCount === 0 && warningCount === 0) {
    success('🎉 ALL CHECKS PASSED! Your environment is ready.');
    info('\nNext Steps:');
    info('  1. Run: npm run dev');
    info('  2. Open: http://localhost:3000');
    info('  3. Admin Login: http://localhost:3000/admin/login');
  } else {
    if (errorCount > 0) {
      error(`\n❌ ${errorCount} ERROR(S) FOUND`);
      error('You MUST fix these errors before starting development.');
    }
    
    if (warningCount > 0) {
      warning(`\n⚠️  ${warningCount} WARNING(S) FOUND`);
      warning('These are non-critical but should be addressed.');
    }
    
    info('\nRecommended Actions:');
    if (errorCount > 0) {
      info('  1. Review error messages above');
      info('  2. Fix configuration issues');
      info('  3. Run this script again: node scripts/project-health-check.js');
    }
  }
  
  separator();
}

// Main execution
async function main() {
  console.clear();
  
  separator();
  log('🏥 AIB-AXYS PLATFORM HEALTH CHECK', colors.cyan);
  log('Verifying your development environment...', colors.cyan);
  separator();
  
  try {
    checkNodeVersion();
    separator();
    
    checkDependencies();
    separator();
    
    checkEnvironmentFile();
    separator();
    
    checkPackageJson();
    separator();
    
    checkProjectStructure();
    separator();
    
    await testDatabaseConnection();
    
    generateReport();
    
  } catch (err) {
    error('Health check failed with unexpected error:');
    console.error(err);
    process.exit(1);
  }
  
  process.exit(errorCount > 0 ? 1 : 0);
}

// Run the health check
main();
