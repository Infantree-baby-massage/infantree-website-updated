import React, { useState } from 'react';
import iramAvatar from '../assets/images/iram-avatar.png.png';

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

const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId');

  if (!visitorId) {
    visitorId =
      'VIS_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    localStorage.setItem('visitorId', visitorId);
  }

  return visitorId;
};        

return (
<>
{isOpen && ( 
        <div className="fixed bottom-28 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"> <div className="bg-[#006B4F] text-white px-4 py-3 flex justify-between items-center"> <div> <h3 className="font-semibold">Iram</h3> <p className="text-xs opacity-90">Infantree Assistant</p> </div>

        <button
          onClick={() => setIsOpen(false)}
          className="text-xl"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        <div className="bg-gray-100 rounded-2xl p-3 text-sm text-gray-800">
          <p>Hello 👋 I am Iram, your Infantree Assistant.</p>

          <p className="mt-2">
            Main aapki kaise madad kar sakti hoon?

          </p>

          <p className="mt-2 font-medium">
          👶 Baby Massage ya
          🤱 Mother Massage ?
          </p>
                
        </div>
        <div className="space-y-2 mb-4">
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
</div>      

        <div className="mt-4">
          <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type your message..."
  className="w-full border rounded-xl px-3 py-2 text-sm"
/>
        </div>

        <button
  className="w-full mt-3 bg-[#006B4F] text-white py-2 rounded-xl"
  onClick={async () => {
    if (!message.trim()) return;
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
