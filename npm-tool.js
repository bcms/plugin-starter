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
            const dirList = [
              'db',
              'logs',
              'backend-logs',
              'uploads',
              'storage',
            ];
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
    '--fix:db': async () => {
      const files = await fs.fileTree(['db', 'bcms'], '');
      for (let i = 0; i < files.length; i++) {
        const fileInfo = files[i];
        if (fileInfo.path.abs.endsWith('.json')) {
          const items = JSON.parse(await fs.readString(fileInfo.path.abs));
          const json = {};
          for (let j = 0; j < items.length; j++) {
            const item = items[j];
            json[item._id] = item;
          }
          await fs.save(fileInfo.path.abs, JSON.stringify(json, null, '  '));
        }
      }
    },
  },
});
