import React from 'react';
import { CURRENT_USER, CONTACTS } from '../constants';

export const StatusList: React.FC = () => {
  return (
    <div className="flex-1 bg-white dark:bg-chat-panelDark overflow-y-auto">
      {/* My Status */}
      <div className="flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="relative">
           <img src={CURRENT_USER.avatar} alt="My Status" className="w-12 h-12 rounded-full object-cover" />
           <div className="absolute bottom-0 right-0 bg-teal-primary w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-chat-panelDark">
             <span className="material-icons text-white text-xs">add</span>
           </div>
        </div>
        <div className="ml-4">
          <h3 className="text-gray-900 dark:text-gray-100 font-medium">My Status</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Click to add status update</p>
        </div>
      </div>

      <div className="px-4 py-2">
        <p className="text-teal-secondary text-sm font-medium uppercase">Recent updates</p>
      </div>

      {CONTACTS.slice(1, 3).map(contact => (
        <div key={contact.id} className="flex items-center p-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
           <div className="p-[2px] rounded-full border-2 border-teal-primary">
             <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
           </div>
           <div className="ml-4">
             <h3 className="text-gray-900 dark:text-gray-100 font-medium">{contact.name}</h3>
             <p className="text-gray-500 dark:text-gray-400 text-xs">Today, 10:23 AM</p>
           </div>
        </div>
      ))}

      <div className="px-4 py-2 mt-2">
        <p className="text-gray-500 text-sm font-medium uppercase">Viewed updates</p>
      </div>
       
       {/* Mock Viewed */}
       <div className="flex items-center p-3 px-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 opacity-70">
           <div className="p-[2px] rounded-full border-2 border-gray-300 dark:border-gray-600">
             <img src="https://picsum.photos/200/200?random=88" alt="Friend" className="w-10 h-10 rounded-full object-cover" />
           </div>
           <div className="ml-4">
             <h3 className="text-gray-900 dark:text-gray-100 font-medium">John Doe</h3>
             <p className="text-gray-500 dark:text-gray-400 text-xs">Yesterday, 11:00 PM</p>
           </div>
        </div>
    </div>
  );
};
