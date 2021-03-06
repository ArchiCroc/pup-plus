/* eslint-disable  */
const fs = require('fs');
const path = require('path');
const processSchema = require('../../libs/processSchema');
const listDirectories = require('../../libs/listDirectories');
const slugify = require('slugify');
const changeCase = require('change-case');
const normalizePath = require('../../libs/normalizePath');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Add a new Route',
  prompts: async (inquirer, values) => {
    if (!values) {
      values = await inquirer.prompt({
        type: 'list',
        name: 'uiFolderName',
        message: 'Select an ui module',
        choices: () => {
          return listDirectories('./ui', ['components']);
        },
      });
      values2 = await inquirer.prompt([
        {
          type: 'file',
          name: 'componentPath',
          message: 'choose a page component',
          extensions: ['.jsx'],
          // onlyShowMatchingExtensions: true,
          path: `./ui/${values.uiFolderName}`,
        },
      ]);

      const rel = path.relative(`./ui/${values.uiFolderName}`, values2.componentPath);
      const cleanPath = normalizePath(rel);
      values2.componentPath = cleanPath;
      let componentParts = cleanPath.split('.');
      componentParts.pop();
      componentParts = componentParts.join('').split('/');

      values2.componentName = componentParts.map((item) => changeCase.pascalCase(item)).join('');
      const defaultSlug = componentParts.map((item) => changeCase.paramCase(item)).join('/');

      values3 = await inquirer.prompt([
        {
          type: 'input',
          name: 'urlSlug',
          message: `What is url for your page? ${values.uiFolderName}/`,
          validate: requireField('URL Slug'),
          default: defaultSlug,
        },
        {
          type: 'input',
          name: 'uiRouteBasePath',
          message: `What is Route Base Path?`,
          validate: requireField('URL Slug'),
          default: `/${changeCase.paramCase(values.uiFolderName)}`,
        },
      ]);
      Object.assign(values, values2, values3);
    }

    const values4 = await inquirer.prompt([
      {
        type: 'list',
        name: 'routeType',
        message: 'Route Type',
        choices: ['everyone', 'user', 'admin'],
        default: 'user',
      },
    ]);
    Object.assign(values, values4);
    return values;
  },
  actions: (data) => {
    if (!data.componentName) {
      let componentParts = normalizePath(data.componentPath).split('.');
      componentParts.pop();
      componentParts = componentParts.join('').split('/');

      data.componentName = componentParts.map((item) => changeCase.pascalCase(item)).join('');
    }

    if (!data.uiRouteBasePath) {
      data.uiRouteBasePath = `/${data.uiFolderName}`;
    }

    if (data.urlSlug) {
      data.urlSlug = data.urlSlug
        .split('/')
        .map((item) => slugify(data.urlSlug, { lower: true }))
        .join('/');
    }

    const actions = [];

    if (data.addWrapper) {
      actions.push(
        {
          type: 'append',
          path: 'ui/layouts/App.jsx',
          pattern: '/* #### PLOP_IMPORTS_START #### */',
          templateFile: 'tools/plop/generators/AddRoute/templates/app-imports-wrapper.js.hbs',
          data,
        },
        {
          type: 'append',
          path: 'ui/layouts/App.jsx',
          pattern: '{/* #### PLOP_ROUTES_START #### */}',
          templateFile: 'tools/plop/generators/AddRoute/templates/app-routes-wrapper.js.hbs',
          data,
        },
      );
    }

    actions.push(
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `/* #### ${changeCase.constant(data.uiFolderName)}_IMPORTS_START #### */`,
        templateFile: 'tools/plop/generators/AddRoute/templates/app-import.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `{/* #### ${changeCase.constant(data.uiFolderName)}_ROUTES_START #### */}`,
        templateFile: 'tools/plop/generators/AddRoute/templates/app-route.js.hbs',
        data,
      },
      {
        type: 'modify',
        path: 'ui/layouts/App.jsx',
        transform: prettierTransform,
        data,
      },
    );
    return actions;
  },
};
