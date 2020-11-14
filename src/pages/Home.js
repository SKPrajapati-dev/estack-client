import React from 'react';
import Header from '../components/Header';
import TeamSidebar from '../components/TeamSidebar';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

const Home = ({ history, data: { loading, me, refetch }, match: { params: { teamId, channelId }}}) => {
  if(loading || !me){
    return null;
  }
  
  if(teamId === undefined){

    if(me.user.teams.length === 0){
      history.push('/create-team')
    }else{
      teamId = me.user.teams[0].id;
      me.user.teams[0].channels.forEach(channel => {
        if(channel.channelName === 'general'){
          channelId = channel.id;
        }
      })
    }
  }
  
  let team;
  let channel;

  me.user.teams.forEach((teamItem) => {
    if(teamItem.id === teamId){
      team = teamItem;
      if(channelId === undefined){
        team.channels.forEach(channelItem => {
          if(channelItem.channelName === 'general'){
            channel = channelItem;
          }
        })
      }else{
        team.channels.forEach(channelItem => {
          if(channelItem.id === channelId){
            channel = channelItem;
          }
        })
      }
    }
  });
  if(me.user.teams.length === 0){
    history.push('/create-team');
    return null;
  }else{
    return (
      <>
        <Header user={me.user} />
        <div className="app__body">
          <TeamSidebar key="team-sidebar" teams={me.user.teams} />
          <Sidebar key="channel-sidebar" userId={me.user.id} team={team} />
          <Chat channel={channel} teamId={team.id} ownerId={team.ownerId} />
        </div>
      </>
    )
  }

}
const ME_QUERY = gql`
  query{
    me{
      ok
      user{
        id
        username
        email
        teams{
          id
          teamName
          ownerId
          channels{
            id
            channelName
            public
          }
        }
      }
      errors{
        path
        message
      }
    }
  }
`;

export default graphql(ME_QUERY)(Home);