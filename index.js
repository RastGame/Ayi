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
        
        await runCommand('git reset --hard HEAD');
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
const intervals = [1]; // Check for updates every 1 minute
let botProcess = null; // Variable to hold the bot process

// Function to spawn the bot process
function spawnBotProcess() {
  console.log('🤖 Start bot...');
  const newBotProcess = spawn('node', ['src/index.js'], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    env: process.env
  });

  newBotProcess.on('message', async (msg) => {
    if (msg.type === 'sync' && msg.userId === 1111) {
      console.log('🔄 Manual sync requested by admin...');
      console.log('DEBUG: Starting gitSync for manual request');
      const hasUpdates = await gitSync();
      console.log(`DEBUG: Manual sync result: ${hasUpdates}`);
      newBotProcess.send({ type: 'syncResult', hasUpdates, messageId: msg.messageId });
      if (hasUpdates) {
        console.log('🔄 Updates found! Restarting...');
        currentInterval = 0;
        clearTimeout(updateCheckTimeout);
        // Instead of exiting, we kill the current bot process and start a new one
        if (botProcess) {
            botProcess.kill();
        }
        botProcess = spawnBotProcess();
        scheduleUpdateCheck(); // Reschedule the update check
      }
    }
    if (msg.type === 'restart' && msg.userId === 1111) {
      console.log('🔄 Manual restart requested by admin...');
      console.log('DEBUG: Processing restart request');
      clearTimeout(updateCheckTimeout);
      // Instead of exiting, we kill the current bot process and start a new one
      console.log('DEBUG: Killing current bot process and starting a new one');
      if (botProcess) {
          botProcess.kill();
      }
      botProcess = spawnBotProcess();
      scheduleUpdateCheck(); // Reschedule the update check
    }
  });
  
  newBotProcess.on('close', (code) => {
    console.log(`\n❌ Bot terminated with code: ${code}`);
    clearTimeout(updateCheckTimeout);
    // Only restart if the process was not killed intentionally
    if (code !== 0 && code !== null) {
        console.log('🔄 Restarting in 5 seconds...');
        setTimeout(() => {
            botProcess = spawnBotProcess();
            scheduleUpdateCheck(); // Reschedule the update check
        }, 5000);
    }
  });

  // Error handling
  newBotProcess.on('error', (error) => {
    console.error('❌ Launch error:', error.message);
    // Only restart if the process was not killed intentionally
    if (botProcess && botProcess.exitCode !== 0 && botProcess.exitCode !== null) {
        console.log('🔄 Retrying in 5 seconds...');
        setTimeout(() => {
            botProcess = spawnBotProcess();
            scheduleUpdateCheck(); // Reschedule the update check
        }, 5000);
    }
  });

  return newBotProcess;
}

function scheduleUpdateCheck() {
  const minutes = intervals[currentInterval] || 30;
  console.log(`⏰ Next update check in ${minutes} minutes`);
  
  updateCheckTimeout = setTimeout(async () => {
    console.log('🔍 Checking for updates...');
    const hasUpdates = await gitSync();
    
    if (hasUpdates) {
      console.log('🔄 Updates found! Restarting...');
      currentInterval = 0;
      // Instead of exiting, we kill the current bot process and start a new one
      if (botProcess) {
          botProcess.kill();
      }
      botProcess = spawnBotProcess();
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
    try { await runCommand('npm install'); } catch {}
    botProcess = spawnBotProcess(); // Start the bot process
    scheduleUpdateCheck(); // Schedule the first update check

    // Handle termination signals
    const handleTerminationSignal = (signal) => {
      console.log(`\n🛑 Received termination signal ${signal}...`);
      clearTimeout(updateCheckTimeout);
      if (botProcess) {
        botProcess.kill('SIGTERM');
      }
      process.exit(0);
    };

    process.on('SIGINT', () => handleTerminationSignal('SIGINT'));
    process.on('SIGTERM', () => handleTerminationSignal('SIGTERM'));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(startBot, 5000);
  }
}


startBot();
