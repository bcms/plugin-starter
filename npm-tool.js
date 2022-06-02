const { createConfig, createTasks } = require('@banez/npm-tool');
const { createFS } = require('@banez/fs');

const fs = createFS({
  base: process.cwd(),
});

module.exports = createConfig({
  custom: {
    '--setup': async () => {
      await createTasks([
        {
          title: 'Setup directories',
          task: async () => {
            const dirList = ['db', 'logs', 'backend-logs', 'uploads'];
            for (let i = 0; i < dirList.length; i++) {
              const dir = dirList[i];
              if (!(await fs.exist(dir))) {
                await fs.mkdir(dir);
              }
            }
          },
        },
      ]).run();
    },
  },
});
