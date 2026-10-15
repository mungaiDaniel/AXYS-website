#!/usr/bin/env node

/**
 * AIB-AXYS Website Load Test Script
 * 
 * Simulates concurrent requests to test site stability
 * Run with: node load-test.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const CONCURRENT_USERS = 50;
const PAGES_TO_TEST = [
  '/',
  '/about',
  '/ipo',
  '/leverage',
  '/platforms',
  '/services',
  '/contact',
  '/faq'
];

let successCount = 0;
let errorCount = 0;
let totalResponseTime = 0;
const responseTimes = [];

function makeRequest(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        responseTimes.push(responseTime);
        totalResponseTime += responseTime;
        
        if (res.statusCode === 200) {
          successCount++;
          resolve({ success: true, time: responseTime });
        } else {
          errorCount++;
          resolve({ success: false, time: responseTime, status: res.statusCode });
        }
      });
    }).on('error', (err) => {
      const responseTime = Date.now() - startTime;
      errorCount++;
      resolve({ success: false, time: responseTime, error: err.message });
    });
  });
}

async function runLoadTest() {
  console.log('🔥 AIB-AXYS Website Load Test\n');
  console.log(`Testing with ${CONCURRENT_USERS} concurrent users`);
  console.log(`Testing ${PAGES_TO_TEST.length} pages\n`);
  console.log('🚀 Starting load test...\n');
  
  const startTime = Date.now();
  const requests = [];
  
  // Generate concurrent requests
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    const page = PAGES_TO_TEST[i % PAGES_TO_TEST.length];
    const url = `${BASE_URL}${page}`;
    requests.push(makeRequest(url));
  }
  
  // Wait for all requests to complete
  const results = await Promise.all(requests);
  
  const totalTime = Date.now() - startTime;
  const avgResponseTime = totalResponseTime / (successCount + errorCount);
  const sortedTimes = responseTimes.sort((a, b) => a - b);
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
  
  console.log('\n📊 LOAD TEST RESULTS\n');
  console.log('═'.repeat(50));
  console.log(`Total Requests:        ${CONCURRENT_USERS}`);
  console.log(`Successful:            ${successCount} ✅`);
  console.log(`Failed:                ${errorCount} ❌`);
  console.log(`Success Rate:          ${((successCount / CONCURRENT_USERS) * 100).toFixed(2)}%`);
  console.log('═'.repeat(50));
  console.log(`Total Test Time:       ${totalTime}ms`);
  console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`Fastest Response:      ${Math.min(...responseTimes)}ms`);
  console.log(`Slowest Response:      ${Math.max(...responseTimes)}ms`);
  console.log(`95th Percentile (P95): ${p95}ms`);
  console.log(`99th Percentile (P99): ${p99}ms`);
  console.log('═'.repeat(50));
  
  if (errorCount === 0) {
    console.log('\n✅ All tests passed! Site is stable under load.\n');
  } else {
    console.log('\n⚠️  Some requests failed. Review error logs.\n');
  }
  
  // Performance recommendations
  console.log('\n💡 PERFORMANCE ANALYSIS:\n');
  if (avgResponseTime < 200) {
    console.log('   ✨ EXCELLENT: Average response time < 200ms');
  } else if (avgResponseTime < 500) {
    console.log('   ✅ GOOD: Average response time < 500ms');
  } else if (avgResponseTime < 1000) {
    console.log('   ⚠️  FAIR: Average response time < 1s. Consider optimization.');
  } else {
    console.log('   ❌ SLOW: Average response time > 1s. Optimization needed!');
  }
  
  if (p95 < 500) {
    console.log('   ✅ 95% of users experience fast load times');
  } else {
    console.log('   ⚠️  Consider optimizing for 95th percentile users');
  }
  
  console.log('\n');
}

// Run the load test
runLoadTest().catch(console.error);
