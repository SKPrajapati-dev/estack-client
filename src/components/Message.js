import React from 'react';

const Message = ({ message, timestamp, sender }) => {

  var intTime = parseInt(timestamp);
  intTime = new Date(intTime).toString();

  return (
    <div className="message">
      <img src="ghdeuigwe" alt={sender.username.charAt(0)} />
      <div className="message__info">
        <h4>
          {sender.username} <span className="message__timestamp">{intTime}</span>
        </h4>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Message;