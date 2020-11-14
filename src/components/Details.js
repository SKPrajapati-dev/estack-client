import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { FiberManualRecord } from '@material-ui/icons';

const Details = ({ ownerId, data: { loading, getTeamMembers} }) => {

  return (
    <div className="details">
      <div className="details__header">
        <h4>Channel Description</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis porro inventore eaque reprehenderit dicta illo odit praesentium ut fugit non, nam, expedita aliquid officia quod aut omnis reiciendis nisi amet?</p>
        <h6>Pinned Messages</h6>
      </div>
      <div className="details__content">
        <h5>Members {getTeamMembers && `(${getTeamMembers.length})`}</h5>
        {!loading && getTeamMembers.map(member => {
          return (<div key={member.id} className="details__member">
            {member.username}
            {member.id === ownerId && " (Owner) "}
            {member.isOnline && <h3><FiberManualRecord /></h3>}
          </div>)
        })}
      </div>
    </div>
  )
}

const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($teamId: ID!){
    getTeamMembers(teamId: $teamId){
      id
      username
      email
      isOnline
    }
  }
`;

export default graphql(GET_TEAM_MEMBERS, {
  options: ({ teamId }) => ({
    variables: {
      teamId
    }
  })
})(Details);