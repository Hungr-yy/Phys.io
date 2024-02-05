import logo from './logo.svg';
import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCDV-wULdUgtwip6Z5O9GeJem8udKD13vk",

  authDomain: "project-physio-733fb.firebaseapp.com",

  projectId: "project-physio-733fb",

  storageBucket: "project-physio-733fb.appspot.com",

  messagingSenderId: "467293321299",

  appId: "1:467293321299:web:025a3bd40b7bb687b96ea6",

  measurementId: "G-9FTYZBG7BQ"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return(
    <div className="App">
    <header>
    <h1>⚛️🔥💬</h1>
        <SignOut />
    </header>

    <section>
      {user ? <ChatRoom /> : <SignIn />}
    </section>
  </div>
    );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth'});
  }
  return (<>
    <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}  />)}

        <span ref={dummy}></span>
    </main>
    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="How are you feeling?" />

      <button type="submit" disabled={!formValue}>🕊️</button>
    </form>  
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={'message ${messageClass}'}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
