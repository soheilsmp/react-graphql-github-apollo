import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
// import { graphql } from 'react-apollo'

import Loading from '../Loading'
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository'
import ErrorMessage from '../Error'

const GET_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5
        after: $cursor
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`

const Profile = () => (
  <Query 
    query={GET_CURRENT_USER} 
    errorPolicy="all"
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) { return <ErrorMessage error={error} /> }

      const { viewer } = data
      
      if (loading && !viewer) { return <Loading /> }

      return ( 
        <RepositoryList
          loading={loading}
          repositories={viewer.repositories} 
          fetchMore={fetchMore}
          entry={'viewer'}
        />
      )
    }}
  </Query>
);

// const Profile = ({ data, loading, error }) => {
//   if (error) {
//     return <ErrorMessage error={error} />;
//   }

//   const { viewer } = data;

//   if (loading || !viewer) {
//     return <Loading />;
//   }

//   return <RepositoryList repositories={viewer.repositories} />;
// };

export default Profile;