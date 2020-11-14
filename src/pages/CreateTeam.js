import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

const CreateTeam = ({ mutate, history }) => {

  const [teamName, setTeamName] = useState();

  const handleChange = (e) => {
    setTeamName(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await mutate({
      variables: {
        name: teamName
      }
    });

    const { ok, team, errors } = response.data.createTeam;
    if(ok){
      history.push(`/home/${team.id}`, { from: '/create-team' });
      return null;
    }else{
      const err = [];
      errors.forEach(({ path, message}) => {
        err[`${path}Error`] = message;
      });
      console.log(err);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create a New Team in Estack</h2>
        <input type="text" onChange={handleChange} placeholder="Enter new team name and hit add button" />
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

const CREATE_TEAM_MUTATION = gql`
  mutation($name: String!){
    createTeam(name: $name){
      ok
      team{
        id
        teamName
        ownerId
      }
      errors{
        path
        message
      }
    }
  }
`;

export default graphql(CREATE_TEAM_MUTATION)(CreateTeam);