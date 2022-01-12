import React from 'react'
import '../home.css'
import '../chatfeed.css';
import FriendBox from './FriendBox'
import Sidebar from './Sidebar';
import Forum from './Forum'
import { useState, useRef, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
//

import { useCollectionData } from 'react-firebase-hooks/firestore';


const Home = (props) => {

    const auth = firebase.auth();
    const firestore = firebase.firestore();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (!loggedIn) {
            logIn();
        }
    });

    console.log("***** IS ANON BELOW *****")
    console.log(auth.currentUser.isAnonymous)

    async function logIn() {
        var data = {};
        if (auth.currentUser.isAnonymous) {
            data['isAnonymus'] = auth.currentUser.isAnonymous;
            data['uID'] = auth.currentUser.uid;
            await fetch("http://192.168.1.32:8000/api/login", {
                method: "POST",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result)
                    });

        }
        else {
            data['isAnonymus'] = auth.currentUser.isAnonymous;
            data['uID'] = auth.currentUser.uid;
            data['displayName'] = auth.currentUser.displayName;
            data['email'] = auth.currentUser.email;
            await fetch("http://192.168.1.32:8000/api/login", {
                method: "POST",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        setLoggedIn = true;
                    });

        }
    }

    function ChatRoom() {
        const webhook = useRef();
        const messagesRef = firestore.collection('messages');
        const query = messagesRef.orderBy('createdAt');
        const [messages] = useCollectionData(query, { idField: 'id' });
        const [formValue, setFormValue] = useState('');
        useEffect(() => {
            if (webhook.current) {
                scrollToBottom();
            }
        })

        const sendMessage = async (e) => {
            e.preventDefault();

            const { uid, photoURL } = auth.currentUser;

            await messagesRef.add({
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL
            })

            setFormValue('');
            webhook.current.scrollIntoView({ behavior: 'smooth' });
        }

        const scrollToBottom = () => {
            webhook.current.scrollIntoView({ behavior: 'smooth' });
        }

        return (
            <>
                <main>
                    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                    <span ref={webhook}></span>
                </main>
                <form onSubmit={sendMessage}>
                    <input value={formValue} placeholder='Send a message...' onChange={(e) => setFormValue(e.target.value)} />
                    <button type="submit" disabled={!formValue}>Send</button>
                </form>
            </>
        )
    }

    function ChatMessage(props) {
        const { text, uid, photoURL, createdAt } = props.message;
        console.log(createdAt)
        var myDate = new Date(createdAt.seconds * 1000);
        var date = String(myDate).slice(0, 21);
        const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
        const textClass = uid === auth.currentUser.uid ? 'sent2' : 'received2';

        return (<>
            <div className={`message ${messageClass}`}>
                <div className='chatcontent'>
                    <div className={`message ${textClass}`}>
                        <img src={photoURL} />
                        <p>{text}</p>
                    </div>
                    <h5 className='receivedAt'>{date}</h5>
                </div>

            </div>

        </>)

    }

    const [currentScreen, setCurrentScreen] = useState(2);

    const GetScreen = () => {
        if (currentScreen == 1) {
            return <Forum />
        }
        else if (currentScreen == 2) {
            return <div className='chatdiv'>
                <Sidebar />
                <ChatRoom />
            </div>

        }
        else {
            return <FriendBox />
        }
    }

    const setScreen = (screenState) => {
        if (screenState == 1) {
            setCurrentScreen(1)
        }
        else if (screenState == 2) {
            setCurrentScreen(2)
        }
        else {
            setCurrentScreen(3)
        }
    }

    const OrderNavs = () => {
        if (currentScreen) {
            return (<div className="newNav">
                <button onClick={function () {
                    setScreen(2);
                }} className={currentScreen == 2 ? "chat1" : "chat2"} id="chat">Chat</button>
                <button onClick={function () {
                    setScreen(1);
                }} className={currentScreen == 1 ? "forum1" : "forum2"} id="forum">Forum</button>
                <button onClick={function () {
                    setScreen(3);
                }} className={currentScreen == 3 ? "friends1" : "friends2"} id="friends">Friends</button>
            </div>);
        }
    }

    return (
        <div className="chat-title-container">
            <OrderNavs />
            <div className="container">
                <div className='space'></div>
                <GetScreen />
            </div>
        </div>
    )
}

export default Home;
