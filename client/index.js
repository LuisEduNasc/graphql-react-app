import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createNetworkInterface } from '@apollo/client';
import { HttpLink } from 'apollo-link-http';
import { Routes, Route } from 'react-router-dom';

import App from './components/App';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import requireAuth from './components/requireAuth';

const link = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  dataIdFromObject: o => o.id,
  cache: new InMemoryCache(),
  link
});

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <Routes>
        <Route path='/' component={App}>
          <Route path='Login' component={LoginForm} />
          <Route path='signup' component={SignupForm} />
          <Route path='dashboard' component={requireAuth(Dashboard)} />
        </Route>
      </Routes>
    </ApolloProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
