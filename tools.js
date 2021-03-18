const childProcess = require('child_process');
const fse = require('fs-extra');
const fs = require('fs');
const util = require('util');
const path = require('path');

/**
 * @typedef {{
 *  title: string;
 *  task: () => Promise<void>;
 * }} Task
 */

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
/**
 * @param {string[]} rawArgs
 */
function parseArgs(rawArgs) {
  const args = {};
  let i = 2;
  while (i < rawArgs.length) {
    const arg = rawArgs[i];
    let value = '';
    if (rawArgs[i + 1]) {
      value = rawArgs[i + 1].startsWith('--') ? '' : rawArgs[i + 1];
    }
    args[arg] = value;
    if (value === '') {
      i = i + 1;
    } else {
      i = i + 2;
    }
  }
  return {
    bundle: args['--bundle'] === '' || args['--bundle'] === 'true' || false,
    link: args['--link'] === '' || args['--link'] === 'true' || false,
    unlink: args['--unlink'] === '' || args['--unlink'] === 'true' || false,
    publish: args['--publish'] === '' || args['--publish'] === 'true' || false,
    build: args['--build'] === '' || args['--build'] === 'true' || false,
    sudo: args['--sudo'] === '' || args['--sudo'] === 'true' || false,
  };
}
/**
 * @param {Task[]} tasks
 */
function Tasks(tasks) {
  return {
    run: async () => {
      for (let i = 0; i < tasks.length; i = i + 1) {
        const t = tasks[i];
        console.log(`${i + 1}. ${t.title}`);
        try {
          await t.task();
          console.log(`✓`);
        } catch (error) {
          console.log(`⨉`);
          throw error;
        }
      }
    },
  };
}

async function bundle() {
  const tasks = new Tasks([
    {
      title: 'Remove dist directory.',
      task: async () => {
        await fse.remove(path.join(__dirname, 'dist'));
      },
    },
    {
      title: 'Compile Backend',
      task: async () => {
        if (
          await util.promisify(fs.exists)(
            path.join(__dirname, 'src', 'backend')
          )
        ) {
          await spawn('npm', ['run', 'build:backend']);
        }
      },
    },
    {
      title: 'Compile UI',
      task: async () => {
        if (
          await util.promisify(fs.exists)(path.join(__dirname, 'src', 'ui'))
        ) {
          await spawn('npm', ['run', 'build:ui']);
        }
      },
    },
    {
      title: 'Copy package.json.',
      task: async () => {
        const data = JSON.parse(
          (
            await util.promisify(fs.readFile)(
              path.join(__dirname, 'package.json')
            )
          ).toString()
        );
        data.devDependencies = undefined;
        data.nodemonConfig = undefined;
        data.scripts = undefined;
        await util.promisify(fs.writeFile)(
          path.join(__dirname, 'dist', 'package.json'),
          JSON.stringify(data, null, '  ')
        );
      },
    },
    {
      title: 'Copy README',
      task: async () => {
        await fse.copy(
          path.join(__dirname, 'README.md'),
          path.join(__dirname, 'dist', 'README.md')
        );
      },
    },
    {
      title: 'Copy UI to dist',
      task: async () => {
        if (
          (await util.promisify(fs.exists)(path.join(__dirname, 'public'))) &&
          (await util.promisify(fs.exists)(
            path.join(__dirname, 'public', 'plugin')
          ))
        ) {
          const files = await util.promisify(fs.readdir)(
            path.join(__dirname, 'public', 'plugin')
          );
          if (
            await util.promisify(fs.exists)(
              path.join(__dirname, 'public', 'plugin', files[0])
            )
          ) {
            await fse.copy(
              path.join(__dirname, 'public', 'plugin', files[0]),
              path.join(__dirname, 'dist', 'ui')
            );
          }
        }
      },
    },
  ]);
  await tasks.run();
}
/**
 * @param {boolean} sudo
 */
async function link(sudo) {
  await exec(`cd dist && npm i && ${sudo ? 'sudo ' : ''}npm link`);
}
/**
 * @param {boolean} sudo
 */
async function unlink(sudo) {
  await exec(`cd dist && ${sudo ? 'sudo ' : ''}npm unlink`);
}
async function publish() {
  if (
    await util.promisify(fs.exists)(
      path.join(__dirname, 'dist', 'node_modules')
    )
  ) {
    throw new Error(
      `Please remove "${path.join(__dirname, 'dist', 'node_modules')}"`
    );
  }
  await exec('cd dist && npm publish --access=public');
}
async function build() {
  await spawn('npm', ['run', 'build:ts'], { stdio: 'inherit' });
  await fse.copy(
    path.join(process.cwd(), 'src', 'response-code', 'codes'),
    path.join(process.cwd(), 'dist', 'response-code', 'codes')
  );
  await fse.copy(
    path.join(process.cwd(), 'src', 'swagger', 'doc.yaml'),
    path.join(process.cwd(), 'dist', 'swagger', 'doc.yaml')
  );
}

async function main() {
  const options = parseArgs(process.argv);
  if (options.bundle === true) {
    await bundle();
  } else if (options.link === true) {
    await link(options.sudo);
  } else if (options.unlink === true) {
    await unlink(options.sudo);
  } else if (options.publish === true) {
    await publish();
  } else if (options.build === true) {
    await build();
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
