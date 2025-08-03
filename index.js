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
        await runCommand('git stash');
        await runCommand('git pull');
        await runCommand('git stash pop');
        console.log('✅');
    } catch (error) {
        console.error('❌ Sync error:', error.message);
    }
};


// Main startup function
async function startBot() {
  try {
    await gitSync();

    console.log('🤖 Start bot...');
    const botProcess = spawn('node', ['src/index.js'], {
      stdio: 'inherit',
      env: process.env
    });
    
    botProcess.on('close', (code) => {
      console.log(`\n❌ Bot terminated with code: ${code}`);
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
      botProcess.kill('SIGTERM');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Received termination signal...');
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
