/* eslint-disable  */
const fs = require('fs');
const processSchema = require('../../libs/processSchema');
const prettierTransform = require('../../libs/prettierTransform');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a new Basic API module from a predefined Schema',
  prompts: async (inquirer) => {
    const values = await inquirer.prompt({
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    });
    const name = await inquirer.prompt({
      default: values.schema.name || null,
      type: 'input',
      name: 'name',
      message: 'What is your module name?',
      validate: requireField('name'),
    });
    Object.assign(values, name);
    return values;
  },
  actions: (promptData) => {
    const data = processSchema(promptData);
    return [
      {
        type: 'addMany',
        destination: 'api/{{ apiFolderName }}/',
        base: 'tools/plop/generators/BasicApiModule/templates/api/',
        templateFiles:
          'tools/plop/generators/BasicApiModule/templates/api/**/+(*.js.hbs|*.jsx.hbs)',
        verbose: true,
        data,
        transform: prettierTransform,
      },
      {
        type: 'addMany',
        destination: 'api/{{ apiFolderName }}/',
        base: 'tools/plop/generators/BasicApiModule/templates/api/',
        templateFiles:
          'tools/plop/generators/BasicApiModule/templates/api/**/!(*.js.hbs|*.jsx.hbs)',
        verbose: true,
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        templateFile: 'tools/plop/generators/BasicApiModule/templates/graphql-api-imports.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_TYPES_START ####',
        template: '    ${ {{~ pascalCase singularName }}Types}',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_QUERY_TYPES_START ####',
        templateFile: 'tools/plop/generators/BasicApiModule/templates/graphql-api-queries.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_MUTATION_TYPES_START ####',
        templateFile: 'tools/plop/generators/BasicApiModule/templates/graphql-api-mutations.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_QUERY_RESOLVERS_START #### */',
        template: '      ...{{ pascalCase singularName }}Queries,',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_MUTATION_RESOLVERS_START #### */',
        template: '      ...{{ pascalCase singularName }}Mutations,',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_RESOLVERS_START #### */',
        templateFile: 'tools/plop/generators/BasicApiModule/templates/graphql-api-resolvers.js.hbs',
        data,
      },
      {
        type: 'modify',
        path: 'startup/server/graphql-api.js',
        transform: prettierTransform,
        data,
      },
      {
        type: 'append',
        path: 'startup/server/index.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        templateFile: 'tools/plop/generators/BasicApiModule/templates/server-index-imports.js.hbs',
        data,
      },
      {
        type: 'modify',
        path: 'startup/server/index.js',
        transform: prettierTransform,
        data,
      },
    ];
  },
};
