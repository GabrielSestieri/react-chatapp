import './App.css';
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Chatfeed from './components/ChatFeed';
import Home from './components/Home'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import firebaseAuth from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";


firebase.initializeApp({
  apiKey: "AIzaSyBr0FdE4CaMEvGIsxOj5Tj6Ak_UQtV0HSc",
  authDomain: "chat-app-8ad90.firebaseapp.com",
  projectId: "chat-app-8ad90",
  storageBucket: "chat-app-8ad90.appspot.com",
  messagingSenderId: "588248375846",
  appId: "1:588248375846:web:4af2e4a32b10a8aae0fce7",
  measurementId: "G-KWYTCBN5T7"
})

const auth = firebase.auth();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <div className="title-signout">
          <p></p>
          <p>WebApp</p>
          <SignOut />
        </div>
        <p className='chat-subtitle'>by Tuckerman House</p>
      </header>
      <section>
        {user ? <Home user="USER" /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  const signInAnon = () => {
    signInAnonymously(auth)
      .then(() => {

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInAnon}>Sign in anonymously</button>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="signout" onClick={() => auth.signOut()}>Sign Out</button>
  )
}



export default App;
