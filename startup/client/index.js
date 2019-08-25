/* eslint-disable no-underscore-dangle, no-unused-expressions */
import Uniforms from 'uniforms';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import React from 'react';
// import i18n from 'meteor/universe:i18n';
import { hydrate } from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
// import { ApolloProvider } from 'react-apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import LocaleProvider from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale-provider/en_US';

// import 'antd/dist/antd.min.css'; // pulling it from the cdn instead

import '../../i18n';
import App from '../../ui/layouts/App';
import apolloClient from './apollo';
import GlobalStyle from './GlobalStyle';

// Bert.defaults.style = 'growl-bottom-right';

// workaround since the meteor loader skips them
// i18n.addTranslations('en-us', usersEnI18n);

// i18n.setLocale('en-US');

Accounts.onLogout(() => apolloClient.resetStore());

Meteor.startup(() =>
  hydrate(
    <LocaleProvider locale={enUS}>
      <ThemeProvider theme={{}}>
        <ApolloProvider client={apolloClient}>
          <GlobalStyle />
          <BrowserRouter>
            <Switch>
              <App />
            </Switch>
          </BrowserRouter>
        </ApolloProvider>
      </ThemeProvider>
    </LocaleProvider>,
    document.getElementById('react-root'),
  ),
);
