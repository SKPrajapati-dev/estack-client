import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

const SendMessage = ({ channel, mutate }) => {

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    await mutate({
      variables: {
        channelId: channel.id,
        text: message
      }
    });
    setMessage('');
  }

  return (
    <div className="sendMessage">
      <form>
        <input type="text" value={message} placeholder={`Type here to write to #${channel.channelName}`} onChange={handleChange} />
        <button type="submit" onClick={sendMessage}>SEND</button>
      </form>
    </div>
  )
}

const SEND_MESSAGE = gql`
  mutation($channelId: ID!, $text: String!){
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default graphql(SEND_MESSAGE)(SendMessage);