/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import { useHistory } from 'react-router-dom';
import { HiddenField, ListField, TextField } from 'uniforms-antd';
import AutoForm from '/imports/ui/components/AutoForm';
import CrossReferenceSearchField from '/imports/ui/components/CrossReferenceSearchField';
import ListInlineItemField from '/imports/ui/components/ListInlineItemField';
import SelectField from '/imports/ui/components/SelectField';
import { ErrorReport } from '/imports/common/ErrorReports/interfaces';
import { RoleSlug } from '/imports/common/Users/interfaces';

/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

import { errorReports as errorReportsQuery } from '../graphql/queries.gql';
import { saveErrorReport as saveErrorReportMutation } from '../graphql/mutations.gql';

import ErrorReportSchema from '/imports/common/ErrorReports/schemas/error-report';

import StyledErrorReportEditor from './StyledErrorReportEditor';

interface ErrorReportEditorProps {
  doc?: ErrorReport
  roles?: RoleSlug[]
}

function ErrorReportEditor({ doc }: ErrorReportEditorProps) {
  const history = useHistory();

  const [saveErrorReport] = useMutation(saveErrorReportMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('ErrorReports.error_report_saved'));
      history.push('/admin/error-reports');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: errorReportsQuery }],
  });

  function handleSubmit(form: any) {
    const cleanForm = ErrorReportSchema.clean(form);
    saveErrorReport({
      variables: { errorReport: cleanForm },
    });
  }

  //const Form = AutoForm<ErrorReport>();

  return (
    <StyledErrorReportEditor>
      <AutoForm name="errorReport" schema={ErrorReportSchema} onSubmit={handleSubmit} model={doc}>
        <HiddenField name="_id" />
        <CrossReferenceSearchField name="userId" />
        <SelectField name="level" />
        <TextField name="message" />
        <TextField name="path" />
        <TextField name="userAgent" />
        <ListField name="stack" initialCount={1}>
          <ListInlineItemField name="$">
            <TextField name="" />
          </ListInlineItemField>
        </ListField>
        <ListField name="reactStack" initialCount={1}>
          <ListInlineItemField name="$">
            <TextField name="" />
          </ListInlineItemField>
        </ListField>
        <Button htmlType="submit" type="primary" block>
          {i18n.__('ErrorReports.save')}
        </Button>
      </AutoForm>
    </StyledErrorReportEditor>
  );
}

ErrorReportEditor.defaultProps = {
  doc: {},
};

ErrorReportEditor.propTypes = {
  doc: PropTypes.object,
};

export default ErrorReportEditor;