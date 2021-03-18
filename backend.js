const childProcess = require('child_process');

/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {import('child_process').SpawnOptions} options
 */
 async function spawn(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const proc = childProcess.spawn(
      cmd,
      args,
      options
        ? options
        : {
            stdio: 'inherit',
          }
    );
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  process.env.BCMS_LOCAL = 'true'
  await spawn('npm', ['run', 'build:backend']);
  await spawn('npm', ['run', 'start:backend']);
}
main().catch(error => {
  console.error(error);
  process.exit(1);
})