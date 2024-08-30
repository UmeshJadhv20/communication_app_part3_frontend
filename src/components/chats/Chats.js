import React, { useState, useEffect } from 'react';
import Nav from '../Nav';
import '../../css/style.css';
import Cookies from 'js-cookie';
import { getLoggedInUser, getChatList, sendChat } from '../api/apiService';

const Chats = () => {
    const [chatData, setChatData] = useState([]);
    const [message, setMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({});
    const [error, setError] = useState('');
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getLoggedInUser();
            setLoggedInUser(user);
            fetchChatData();
        };

        fetchUser();
    }, []);

    const fetchChatData = async () => {
        try {
            const responseChat = await getChatList(token);
            if (!responseChat.ok) {
                throw new Error('Failed to fetch chat data');
            }
            const data = await responseChat.json();
            setChatData(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSend = async () => {
        if (message.trim() === '') {
            setError('Please enter a message');
            return;
        }

        const newMessage = {
            user_id: loggedInUser.id,
            message: message,
        };

        try {
            const responseSend = await sendChat(newMessage,token);

            if (!responseSend.ok) {               
                setError('Failed to send message');
            }

            fetchChatData();
            setMessage('');
            setError('');
        } catch (error) {
            setError(error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-GB'); 
        const formattedTime = date.toLocaleTimeString('en-GB', { hour12: false }); 
        return `${formattedDate} ${formattedTime}`;
    };

    const handleRefresh = () => {
        fetchChatData();
    };

    return (
        <>
            <Nav />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Group Chat</h1>
                <ul className="list-group mb-3 chat-list">
                    {chatData.map((data, index) => (
                        <li
                            key={index}
                            className={`list-group-item ${data.user_id == loggedInUser.id ? 'text-left bg-chat-light' : 'text-right bg-chat-dark'}`}
                        >

                            <span>[{formatDate(data.date_time)}] <b>{data.user}</b>:</span> <span>{data.message}</span>
                        </li>
                    ))}
                </ul>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <b><span>{loggedInUser.name}</span></b>
                        </span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="btn btn-primary" id="send-btn" onClick={handleSend}>Send</button>
                    <button className="btn btn-secondary" id="refresh-btn" onClick={handleRefresh}>Refresh</button>
                </div>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
};

export default Chats;
