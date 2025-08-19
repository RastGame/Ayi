#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Function to execute commands
function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}
async function gitSync() {
    try {
        console.log('Sync with github...');
        try { await runCommand('rm -f .git/index.lock'); } catch {}
        
        const beforeCommit = await runCommand('git rev-parse HEAD');
        console.log(`Before: ${beforeCommit.trim()}`);
        
        await runCommand('git pull');
        
        const afterCommit = await runCommand('git rev-parse HEAD');
        console.log(`After: ${afterCommit.trim()}`);
        
        const hasUpdates = beforeCommit.trim() !== afterCommit.trim();
        console.log(`Has updates: ${hasUpdates}`);
        console.log('✅');
        
        return hasUpdates;
    } catch (error) {
        console.error('❌ Sync error:', error.message);
        return false;
    }
};

let updateCheckTimeout;
let currentInterval = 0;
const intervals = [1, 5, 15, 30];

function scheduleUpdateCheck() {
  const minutes = intervals[currentInterval] || 30;
  console.log(`⏰ Next update check in ${minutes} minutes`);
  
  updateCheckTimeout = setTimeout(async () => {
    console.log('🔍 Checking for updates...');
    const hasUpdates = await gitSync();
    
    if (hasUpdates) {
      console.log('🔄 Updates found! Restarting...');
      currentInterval = 0;
      process.exit(1);
    } else {
      if (currentInterval < intervals.length - 1) currentInterval++;
      scheduleUpdateCheck();
    }
  }, minutes * 60 * 1000);
}


// Main startup function
async function startBot() {
  try {
    await gitSync();
    scheduleUpdateCheck();

    console.log('🤖 Start bot...');
    const botProcess = spawn('node', ['src/index.js'], {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      env: process.env
    });

    botProcess.on('message', async (msg) => {
      if (msg.type === 'sync' && msg.userId === 1111) {
        console.log('🔄 Manual sync requested by admin...');
        const hasUpdates = await gitSync();
        botProcess.send({ type: 'syncResult', hasUpdates, messageId: msg.messageId });
        if (hasUpdates) {
          console.log('🔄 Updates found! Restarting...');
          currentInterval = 0;
          clearTimeout(updateCheckTimeout);
          botProcess.kill('SIGTERM');
          setTimeout(() => process.exit(1), 1000);
        }
      }
      if (msg.type === 'restart' && msg.userId === 1111) {
        console.log('🔄 Manual restart requested by admin...');
        clearTimeout(updateCheckTimeout);
        botProcess.kill('SIGTERM');
        setTimeout(() => process.exit(1), 500);
      }
    });
    
    botProcess.on('close', (code) => {
      console.log(`\n❌ Bot terminated with code: ${code}`);
      clearTimeout(updateCheckTimeout);
      if (code !== 0) {
        console.log('🔄 Restarting in 5 seconds...');
        setTimeout(startBot, 5000);
      }
    });

    // Error handling
    botProcess.on('error', (error) => {
      console.error('❌ Launch error:', error.message);
      setTimeout(startBot, 5000);
    });

    // Handle termination signals
    process.on('SIGINT', () => {
      console.log('\n🛑 Received termination signal...');
      clearTimeout(updateCheckTimeout);
      botProcess.kill('SIGTERM');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Received termination signal...');
      clearTimeout(updateCheckTimeout);
      botProcess.kill('SIGTERM');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(startBot, 5000);
  }
}


startBot();
