import React, { useEffect, useRef, useState } from 'react';
import { StarBorderOutlined, InfoOutlined } from '@material-ui/icons';
import Message from './Message';
import Details from './Details';
import SendMessage from './SendMessage';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import PrivateChannelDetails from './PrivateChannelDetails';

const NEW_CHANNEL_MESSAGE_SUBSCRIPTION = gql`
  subscription($channelId: ID!){
    newChannelMessage(channelId: $channelId){
      id
      text
      createdAt
      sender{
        id
        username
      }
    }
  }
`;

const Chat = ({ channel, teamId, ownerId, data: { loading, getChannelMessages, subscribeToMore } }) => {

  const messagesEndRef = useRef(null);
  const [action, setAction] = useState(true);

  const handleAction = () => {
    setAction(!action);
  }
  const scrollToBottom = () => {
    if(messagesEndRef !== null){
      messagesEndRef.current.scrollIntoView()
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: NEW_CHANNEL_MESSAGE_SUBSCRIPTION,
      variables: {
        channelId: channel.id
      },
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData){
          return prev;
        }
        console.log(subscriptionData.data)
        return {
          ...prev,
          getChannelMessages: [...prev.getChannelMessages, subscriptionData.data.newChannelMessage]
        };
      }
    });
    return () => {
      console.log(`left ${channel.channelName}`)
      unsubscribe();
    }
  }, [channel, subscribeToMore]);

  useEffect(() => {
	  if(action){
		  scrollToBottom()
	  }
  }, [action, getChannelMessages]);


  
  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerLeft">
          <h4 className="chat__channelName">
            <strong># {channel.channelName}</strong>
            <StarBorderOutlined />
          </h4>
        </div>
        <div className="chat__headerRight">
          <p>
            <InfoOutlined onClick={handleAction} /> Details
          </p>
        </div>
      </div>
      {action ? (
        <div className="chat__messages">
          <div ref={messagesEndRef} />
          {!loading && getChannelMessages.slice().reverse().map(message => {
            return (
             <Message key={message.id} sender={message.sender} timestamp={message.createdAt} message={message.text} />
            )
          })}
        </div>
        ): channel.public ? (
           <Details ownerId={ownerId} teamId={teamId} />
        ) : (
          <PrivateChannelDetails />
        )
      }
      <SendMessage channel={channel} />
    </div>
  )
}

const GET_CHANNEL_MESSAGES = gql`
  query($channelId: ID!){
    getChannelMessages(channelId: $channelId){
      id
      text
      createdAt
      sender{
        id
        username
      }
    }
  }
`;

export default graphql(GET_CHANNEL_MESSAGES, {
  options: ({ channel }) => ({
    fetchPolicy: 'cache-first',
    variables: {
      channelId: channel.id
    }
  })
})(Chat);