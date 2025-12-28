
const { spawn } = require('child_process');
const path = require('path');

const services = [
  { name: 'backend', path: 'backend', command: 'npm', args: ['run', 'dev'], install: true },
  { name: 'frontend', path: 'frontend', command: 'npm', args: ['start'], install: true },
  { name: 'landing', path: 'streamys_landing', command: 'npm', args: ['run', 'dev'], install: true }
];

async function installDependencies(service) {
  return new Promise((resolve, reject) => {
    console.log(`[${service.name}] Installing dependencies...`);
    
    // On Windows npm is npm.cmd
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    
    const install = spawn(npmCmd, ['install'], {
      cwd: path.join(__dirname, service.path),
      stdio: 'inherit',
      shell: true
    });

    install.on('close', (code) => {
      if (code === 0) {
        console.log(`[${service.name}] Dependencies installed.`);
        resolve();
      } else {
        reject(new Error(`[${service.name}] Install failed with code ${code}`));
      }
    });
  });
}

function startService(service) {
  console.log(`[${service.name}] Starting service...`);
  
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  
  const child = spawn(npmCmd, service.args, {
    cwd: path.join(__dirname, service.path),
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (err) => {
    console.error(`[${service.name}] Error:`, err);
  });
}

async function main() {
  console.log('--- Streamys Startup Script ---');
  
  // 1. Install Dependencies sequentially
  for (const service of services) {
    if (service.install) {
        try {
            await installDependencies(service);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
  }

  console.log('\n--- Starting All Services ---\n');

  // 2. Start all services in parallel
  services.forEach(startService);
}

main();
