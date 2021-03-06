const relativePath = require('../../libs/relativePath');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Add Cron',
  prompts: async (inquirer) => {
    const data = await inquirer.prompt([
      {
        type: 'list',
        name: 'plopType',
        message: 'Select a task',
        choices: [
          { name: 'Setup Cron', value: 'setup' },
          { name: 'Add Cron Script', value: 'add' },
        ],
      },
    ]);

    if (data.plopType === 'add') {
      // @todo support modules in sub directories
      Object.assign(
        data,
        await inquirer.prompt([
          {
            type: 'file',
            name: 'apiFolderName',
            message: 'Select an api module',
            selectionType: 'folder',
            path: './api',
          },
        ]),
      );
    }
    if (data.plopType === 'setup') {
      // Object.assign(
      //   data,
      //   await inquirer.prompt([
      //     {
      //       type: 'input',
      //       name: 'name',
      //       message: `What should the menu label say?`,
      //       validate: requireField('URL Slug'),
      //       default: changeCase.titleCase(data2.urlSlug),
      //     },
      //   ]),
      // );
    }

    return data;
  },
  actions: (data) => {
    if (data.plopType === 'setup') {
      return [
        {
          type: 'append',
          path: 'startup/server/index.js',
          pattern: `/* #### PLOP_IMPORTS_START #### */`,
          template: `
/* #### CRON_IMPORTS_START #### */
import './cron';
/* #### CRON_IMPORTS_END #### */`,
        },
        {
          type: 'add',
          path: 'startup/server/cron.js',
          templateFile: 'tools/plop/generators/AddCron/templates/startup-server-cron.js.hbs',
        },
        {
          type: 'comment',
          comment: `Be sure to add the sync cron module to meteor by running:
  meteor add littledata:synced-cron`,
        },
      ];
    }
    if (data.plopType === 'add') {
      data.apiFolderName = relativePath('./api', data.apiFolderName);
      return [
        {
          type: 'add',
          path: 'api/{{apiDirCase apiFolderName}}/server/cron.js',
          templateFile: 'tools/plop/generators/AddCron/templates/module-server-cron.js.hbs',
          data,
        },
        {
          type: 'append',
          path: 'startup/server/cron.js',
          pattern: `/* #### PLOP_IMPORTS_START #### */`,
          template: `import '../../api/{{apiDirCase apiFolderName}}/server/cron.js';`,
          data,
        },
      ];
    }

    return [];
  },
};
