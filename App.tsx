import React, { useState, useEffect, useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import { INITIAL_CHATS, CURRENT_USER, CONTACTS, GEMINI_USER } from './constants';
import { Chat, Message, MessageStatus, MessageType, Tab, User } from './types';
import { getGeminiResponse } from './services/geminiService';
import { Login } from './components/Login';
import { StatusList } from './components/StatusList';
import { CallsList } from './components/CallsList';

// --- Helper Components to keep file count low per instruction ---

// 1. Chat List Item
const ChatListItem: React.FC<{ 
  chat: Chat; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ chat, isActive, onClick }) => {
  const timeString = chat.lastMessage 
    ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    : '';

  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-chat-panelDark'}`}
    >
      <img 
        src={chat.participant.avatar} 
        alt={chat.participant.name} 
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <h3 className="text-gray-900 dark:text-gray-100 font-medium truncate">{chat.participant.name}</h3>
          <span className={`text-xs ${chat.unreadCount > 0 ? 'text-teal-secondary font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
            {timeString}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1 flex items-center">
            {chat.typing ? (
              <span className="text-teal-secondary italic">typing...</span>
            ) : (
              <>
                {chat.lastMessage?.isMe && (
                  <span className={`material-icons text-[16px] mr-1 ${chat.lastMessage.status === MessageStatus.READ ? 'text-blue-400' : 'text-gray-400'}`}>
                    done_all
                  </span>
                )}
                {chat.lastMessage?.content || 'Start chatting'}
              </>
            )}
          </p>
          {chat.unreadCount > 0 && (
            <div className="w-5 h-5 bg-teal-secondary rounded-full flex items-center justify-center ml-2">
              <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Message Bubble
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const time = new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  return (
    <div className={`flex mb-2 ${message.isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] rounded-lg p-2 px-3 relative shadow-sm text-sm ${message.isMe ? 'bg-chat-outgoing dark:bg-chat-outgoingDark rounded-tr-none' : 'bg-chat-incoming dark:bg-chat-incomingDark rounded-tl-none'}`}>
        {/* Tail SVG could go here for extra polish */}
        <p className="text-gray-800 dark:text-gray-200 pb-2 leading-relaxed break-words">{message.content}</p>
        <div className="absolute bottom-1 right-2 flex items-center gap-1">
          <span className="text-[10px] text-gray-500 dark:text-gray-400">{time}</span>
          {message.isMe && (
            <span className={`material-icons text-[14px] ${message.status === MessageStatus.READ ? 'text-blue-400' : 'text-gray-400'}`}>
              done_all
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('CHATS');
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'c1': [INITIAL_CHATS[0].lastMessage!],
    'c2': [INITIAL_CHATS[1].lastMessage!],
    'c3': [INITIAL_CHATS[2].lastMessage!]
  });
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeMessages = activeChatId ? (messages[activeChatId] || []) : [];

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: activeChatId,
      senderId: CURRENT_USER.id,
      content: inputText,
      timestamp: Date.now(),
      status: MessageStatus.SENT,
      type: MessageType.TEXT,
      isMe: true
    };

    // Update Messages
    setMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));

    // Update Chat List (Last message)
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMessage: newMessage } : c));
    
    setInputText('');

    // Simulate Server Delay for Ticks
    setTimeout(() => {
        updateMessageStatus(activeChatId, newMessage.id, MessageStatus.DELIVERED);
    }, 1000);

    // Gemini Integration
    if (activeChat?.participant.id === 'gemini') {
       // Show typing
       setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, typing: true } : c));
       
       // Get Response
       const replyText = await getGeminiResponse(newMessage.content);
       
       setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, typing: false } : c));

       const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId: activeChatId,
          senderId: 'gemini',
          content: replyText,
          timestamp: Date.now(),
          status: MessageStatus.READ,
          type: MessageType.TEXT,
          isMe: false
       };

       setMessages(prev => ({
         ...prev,
         [activeChatId]: [...(prev[activeChatId] || []), replyMessage]
       }));

       setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMessage: replyMessage } : c));
       
       // Mark original as read
       updateMessageStatus(activeChatId, newMessage.id, MessageStatus.READ);
    }
  };

  const updateMessageStatus = (chatId: string, msgId: string, status: MessageStatus) => {
     setMessages(prev => ({
        ...prev,
        [chatId]: prev[chatId].map(m => m.id === msgId ? { ...m, status } : m)
     }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <HashRouter>
      {/* Main Layout Container */}
      <div className="flex h-screen bg-gray-200 dark:bg-gray-900 overflow-hidden">
        
        {/* Green Header Background Strip (Desktop) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-teal-primary z-0 hidden md:block"></div>

        {/* App Card */}
        <div className="relative z-10 w-full h-full md:h-[95vh] md:w-[95vw] md:max-w-[1600px] md:m-auto bg-white dark:bg-chat-panelDark flex shadow-xl overflow-hidden md:rounded-lg">
          
          {/* Sidebar */}
          <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} w-full md:w-[30%] lg:w-[400px] flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-chat-panelDark transition-all`}>
            
            {/* Sidebar Header */}
            <div className="h-16 bg-chat-header dark:bg-chat-headerDark flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <img src={CURRENT_USER.avatar} alt="Me" className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80" />
              <div className="flex gap-6 text-gray-500 dark:text-gray-300">
                 <button title="Community" className="material-icons text-xl">groups</button>
                 <button title="Status" className="material-icons text-xl" onClick={() => setActiveTab('STATUS')}>data_usage</button>
                 <button title="New Chat" className="material-icons text-xl" onClick={() => setActiveTab('CHATS')}>chat</button>
                 <button title="Menu" className="material-icons text-xl">more_vert</button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-2 bg-white dark:bg-chat-panelDark border-b border-gray-100 dark:border-gray-800">
               <div className="bg-gray-100 dark:bg-chat-headerDark rounded-lg flex items-center px-3 py-1.5">
                  <span className="material-icons text-gray-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Search or start new chat" 
                    className="bg-transparent ml-3 outline-none text-sm w-full dark:text-white placeholder-gray-500"
                  />
               </div>
            </div>

            {/* Tab Filters (Mobile/Visual) */}
            <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
               {['All', 'Unread', 'Groups'].map(f => (
                 <button key={f} className="px-3 py-1 bg-gray-100 dark:bg-chat-headerDark rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors">
                    {f}
                 </button>
               ))}
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-chat-panelDark">
               {activeTab === 'CHATS' && chats.map(chat => (
                 <ChatListItem 
                    key={chat.id} 
                    chat={chat} 
                    isActive={activeChatId === chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      // Reset unread
                      setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
                    }}
                 />
               ))}
               {activeTab === 'STATUS' && <StatusList />}
               {activeTab === 'CALLS' && <CallsList />}
            </div>
          </div>

          {/* Chat Room */}
          {activeChatId && activeChat ? (
            <div className={`${!activeChatId ? 'hidden md:block' : 'block'} flex-1 flex flex-col bg-wa-bg relative h-full`}>
              
              {/* Chat Header */}
              <div className="h-16 bg-chat-header dark:bg-chat-headerDark flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 shadow-sm z-20">
                <div className="flex items-center">
                   <button onClick={() => setActiveChatId(null)} className="md:hidden mr-2 text-gray-500">
                      <span className="material-icons">arrow_back</span>
                   </button>
                   <img src={activeChat.participant.avatar} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
                   <div className="ml-3 flex flex-col justify-center">
                      <h2 className="text-gray-900 dark:text-gray-100 font-medium leading-tight">{activeChat.participant.name}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                         {activeChat.typing ? 'typing...' : 'click here for contact info'}
                      </p>
                   </div>
                </div>
                <div className="flex gap-5 text-gray-500 dark:text-gray-300">
                   <button className="material-icons text-xl">videocam</button>
                   <button className="material-icons text-xl">call</button>
                   <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600"></div>
                   <button className="material-icons text-xl">search</button>
                   <button className="material-icons text-xl">more_vert</button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:px-[5%] bg-cover bg-center">
                 {activeMessages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                 ))}
                 <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="min-h-[60px] bg-chat-header dark:bg-chat-headerDark px-4 py-2 flex items-end gap-2 z-20">
                 <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                    <span className="material-icons">mood</span>
                 </button>
                 <button 
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                 >
                    <span className="material-icons transform rotate-45">attach_file</span>
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" />
                 
                 <div className="flex-1 bg-white dark:bg-chat-panelDark rounded-lg mb-1 flex items-center px-4 py-2 border border-transparent focus-within:border-teal-primary transition-colors">
                    <textarea 
                      rows={1}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message"
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 resize-none max-h-32 text-sm"
                      style={{minHeight: '24px'}}
                    />
                 </div>

                 {inputText.length > 0 ? (
                    <button 
                      onClick={handleSendMessage} 
                      className="p-3 bg-teal-primary text-white rounded-full shadow-md hover:bg-teal-secondary transition-transform transform hover:scale-110"
                    >
                      <span className="material-icons text-sm">send</span>
                    </button>
                 ) : (
                    <button className="p-3 text-gray-500 dark:text-gray-400 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                       <span className="material-icons">mic</span>
                    </button>
                 )}
              </div>

            </div>
          ) : (
            /* Default Empty State (Desktop) */
            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-chat-panel dark:bg-chat-panelDark border-b-[6px] border-teal-primary">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-20 h-20 opacity-30 mb-8 filter grayscale" />
                <h1 className="text-3xl font-light text-gray-700 dark:text-gray-200 mb-4">WhatsChat Web</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md text-center leading-6">
                  Send and receive messages without keeping your phone online.<br/>
                  Use WhatsChat on up to 4 linked devices and 1 phone.
                </p>
                <div className="mt-10 text-xs text-gray-400 flex items-center gap-1">
                  <span className="material-icons text-xs">lock</span> End-to-end encrypted
                </div>
            </div>
          )}
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
