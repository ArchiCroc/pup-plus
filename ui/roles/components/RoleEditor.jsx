/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import AutoForm from 'uniforms/AutoForm';
import HiddenField from 'uniforms-antd/HiddenField';
import TextField from 'uniforms-antd/TextField';

/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

import { roles as rolesQuery } from '../queries/Roles.gql';
import { saveRole as saveRoleMutation } from '../mutations/Roles.gql';

import RoleSchema from '../../../api/Roles/schemas/role';

import StyledRoleEditor from './StyledRoleEditor';

function RoleEditor({ doc }) {
  const history = useHistory();
  const [saveRole] = useMutation(saveRoleMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('Roles.role_saved'));
      history.push('/roles');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: rolesQuery }],
  });

  function handleSubmit(form) {
    const cleanForm = RoleSchema.clean(form);
    // console.log('cleanForm', cleanForm);
    saveRole({
      variables: { role: cleanForm },
    });
  }

  // fix issue with uniforms getting a null for visionNames
  if (doc && !doc.visionNames) {
    doc.visionNames = []; //eslint-disable-line
  }

  return (
    <StyledRoleEditor>
      <AutoForm
        name="role"
        schema={RoleSchema}
        onSubmit={handleSubmit}
        model={doc}
        showInlineError
        placeholder
      >
        <HiddenField name="_id" />
        <TextField name="name" />
        <Button htmlType="submit" type="primary" block>
          {i18n.__('Roles.save')}
        </Button>
      </AutoForm>
    </StyledRoleEditor>
  );
}

RoleEditor.defaultProps = {
  doc: {},
};

RoleEditor.propTypes = {
  doc: PropTypes.object,
};

export default RoleEditor;
