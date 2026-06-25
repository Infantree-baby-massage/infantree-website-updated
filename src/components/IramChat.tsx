import React, { useState, useEffect, useRef } from 'react';
import iramAvatar from '../assets/images/iram-avatar.png.png';
import faqs from './faqs.json';

import { db } from '../lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

export default function IramChat() {
const [isOpen, setIsOpen] = useState(false);        
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);  

const messagesEndRef = useRef(null);
const chatContainerRef = useRef(null);
const [showScrollButton, setShowScrollButton] = useState(true); 
const [showMenu, setShowMenu] = useState(false);  

const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId');

  if (!visitorId) {
    visitorId =
    'VIS_' +
Math.random().toString(36).substring(2, 8).toUpperCase();

    localStorage.setItem('visitorId', visitorId);
  }

  return visitorId;
};     

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: 'smooth'
  });
}, [messages]);

useEffect(() => {
  const container = chatContainerRef.current;

  const handleScroll = () => {
    console.log('SCROLL WORKING');
    if (!container) return;
    
    const isNearBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight <
      200;

    setShowScrollButton(!isNearBottom);
  };

if (container) {
  handleScroll();

  container.addEventListener(
    'scroll',
    handleScroll
  );
}

  return () => {
    if (container) {
      container.removeEventListener('scroll', handleScroll);
    }
  };
}, []);

  useEffect(() => {
  const loadMessages = async () => {
    const visitorId = getVisitorId();

    const sessionRef = doc(db, 'chat_sessions', visitorId);
    const sessionSnap = await getDoc(sessionRef);

    const chatCleared =
  localStorage.getItem('chatCleared') === 'true';

if (chatCleared) {
  return;
}
    
    if (sessionSnap.exists()) {
      const data = sessionSnap.data();

      if (data.messages) {
        setMessages(
          data.messages.map((msg) => ({
            sender: msg.sender,
            text: msg.message
          }))
        );
      }
    }
  };

  loadMessages();
}, []);

return (
<>
{isOpen && ( 
        <div className="fixed bottom-28 left-6 z-50 w-80 max-w-[90vw] h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"> <div className="bg-[#006B4F] text-white px-4 py-3 flex justify-between items-center"> <div> <h3 className="font-semibold">Iram</h3> <p className="text-xs opacity-90">Infantree Assistant</p> </div>

        <div className="flex items-center gap-2">

  <div className="relative">

    <button
      onClick={() => setShowMenu(!showMenu)}
      className="text-xl text-white px-1"
    >
      ⋮
    </button>

    {showMenu && (
      <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg border z-50 min-w-[120px]">
        <button
          onClick={() => {
            setMessages([]);
            localStorage.setItem('chatCleared', 'true');
            setShowMenu(false);
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Clear Chat
        </button>
      </div>
    )}

  </div>

  <button
    onClick={() => setIsOpen(false)}
    className="text-xl text-white"
  >
    ×
  </button>

</div>
      </div>

<div
  ref={chatContainerRef}
  className="flex-1 space-y-2 mb-4 overflow-y-auto pr-2"
>
          
      <div className="p-4 relative">
        <div className="bg-gray-100 rounded-2xl p-3 text-sm text-gray-800">
          <p>Hello 👋 I am Iram, your Infantree Assistant.</p>

          <p className="mt-2">
            Main aapki kaise madad kar sakti hoon?

          </p>

          <p className="mt-2 font-medium">
          👶 Baby Massage or 
          🤱 Mother Massage ?
          </p>
                
        </div>
          
          
  {messages.map((msg, index) => (
    <div
      key={index}
      className={
        msg.sender === 'user'
          ? 'bg-emerald-100 p-2 rounded-lg text-sm text-right'
          : 'bg-gray-100 p-2 rounded-lg text-sm'
      }
    >
      {msg.text}
    </div>
  ))}

<div ref={messagesEndRef}></div>

</div>

        <div className="mt-4">
<textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !isMobile
    ) {
      e.preventDefault();
      document.getElementById('sendBtn')?.click();
    }
  }}
  placeholder="Type your message..."
  rows={3}
  className="w-full border rounded-xl px-3 py-2 text-sm resize-none"
/>
        </div>
  
  <p className="text-[10px] text-gray-500 text-center mt-2 mb-2">
  Iram responses are for guidance only.
</p>

  <button
  id="sendBtn"
  className="w-full mt-3 bg-[#006B4F] text-white py-2 rounded-xl"
  onClick={async () => {
    console.log('FAQs Loaded:', faqs);
    
    if (!message.trim()) return;
    localStorage.removeItem('chatCleared');
console.log('Saving user message...');    

 const visitorId = getVisitorId();

const sessionRef = doc(db, 'chat_sessions', visitorId);

const sessionSnap = await getDoc(sessionRef);

const userMessage = {
  sender: 'user',
  message: message,
  timestamp: new Date().toISOString()
};

const iramReply = {
  sender: 'iram',
  message: 'Thank you for your message. I am still learning and will assist you shortly.',
  timestamp: new Date().toISOString()
};

if (!sessionSnap.exists()) {
  await setDoc(sessionRef, {
  visitorId: visitorId,

  name: '',
  mobile: '',
  babyAge: '',
  location: '',

  leadStatus: 'New',

  totalMessages: 2,

  firstVisit: new Date().toISOString(),
  lastVisit: new Date().toISOString(),

  messages: [userMessage, iramReply]
});
} else {
  const existingData = sessionSnap.data();

  await updateDoc(sessionRef, {
    lastVisit: new Date().toISOString(),
    totalMessages: (existingData.totalMessages || 0) + 2,
    messages: [
      ...(existingData.messages || []),
      userMessage,
      iramReply
    ]
  });
}         
          
  setMessages([
  ...messages,
  { sender: 'user', text: message },
  {
    sender: 'iram',
    text: 'Thank you for your message. I am still learning and will assist you shortly.'
  }
]);
                     
    setMessage('');
  }}
>
  Send
</button>

{showScrollButton && (
  <button
    onClick={() =>
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth'
      })
    }
    className="absolute bottom-24 right-4 z-50 w-8 h-8 bg-white rounded-full shadow-md flex flex-col items-center justify-center text-gray-600"
  >
    <span className="leading-none text-xs">⌄</span>
    <span className="leading-none -mt-2 text-xs">⌄</span>
  </button>
)}
  
      </div>
    </div>
  )}

  <button
    aria-label="Iram"
    title="Iram"
    onClick={() => setIsOpen(!isOpen)}
    className="fixed bottom-8 left-6 z-50 bg-[#E18A00] p-2 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
  >
    <img
      src={iramAvatar}
      alt="Iram"
      className="w-14 h-14 rounded-full object-cover"
    />
  </button>
</>

);
}
