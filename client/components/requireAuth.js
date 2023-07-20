import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { useNavigate } from 'react-router-dom'

import query from '../queries/CurrentUser';

const navigate = useNavigate();

export default (WrappedComponent) => {
  class RequireAuth extends Component {
    shouldComponentUpdate(nextProps) {
      if (!nextProps.data.loading && !nextProps.data.user) {
        navigate('/login');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return graphql(query)(RequireAuth);
}