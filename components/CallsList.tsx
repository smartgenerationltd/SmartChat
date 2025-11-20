import React from 'react';
import { CONTACTS } from '../constants';

export const CallsList: React.FC = () => {
  return (
    <div className="flex-1 bg-white dark:bg-chat-panelDark overflow-y-auto">
       <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-full bg-teal-primary flex items-center justify-center shadow-md">
               <span className="material-icons text-white rotate-[-135deg]">link</span>
             </div>
             <div>
               <h3 className="font-medium text-gray-900 dark:text-gray-100">Create call link</h3>
               <p className="text-gray-500 text-sm">Share a link for your WhatsApp call</p>
             </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase mb-2">Recent</p>
          
          {CONTACTS.slice(1).map((contact, idx) => (
            <div key={contact.id} className="flex items-center py-3">
               <img src={contact.avatar} className="w-12 h-12 rounded-full mr-4 object-cover" alt="avatar"/>
               <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-gray-100 font-medium">{contact.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className={`material-icons text-sm mr-1 ${idx % 2 === 0 ? 'text-red-500' : 'text-teal-500'}`}>
                      {idx % 2 === 0 ? 'call_missed' : 'call_received'}
                    </span>
                    <span>{idx % 2 === 0 ? 'Yesterday, 8:41 PM' : 'Today, 10:00 AM'}</span>
                  </div>
               </div>
               <span className="material-icons text-teal-secondary">
                 {idx % 2 === 0 ? 'videocam' : 'call'}
               </span>
            </div>
          ))}
       </div>
    </div>
  );
};
