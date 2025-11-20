import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const COUNTRIES = [
  { name: 'Algeria', code: '+213' },
  { name: 'Angola', code: '+244' },
  { name: 'Argentina', code: '+54' },
  { name: 'Australia', code: '+61' },
  { name: 'Benin', code: '+229' },
  { name: 'Botswana', code: '+267' },
  { name: 'Brazil', code: '+55' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cabo Verde', code: '+238' },
  { name: 'Cameroon', code: '+237' },
  { name: 'Canada', code: '+1' },
  { name: 'Central African Republic', code: '+236' },
  { name: 'Chad', code: '+235' },
  { name: 'China', code: '+86' },
  { name: 'Comoros', code: '+269' },
  { name: 'Congo', code: '+242' },
  { name: 'DR Congo', code: '+243' },
  { name: "Cote d'Ivoire", code: '+225' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Egypt', code: '+20' },
  { name: 'Equatorial Guinea', code: '+240' },
  { name: 'Eritrea', code: '+291' },
  { name: 'Eswatini', code: '+268' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'France', code: '+33' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' },
  { name: 'Germany', code: '+49' },
  { name: 'Ghana', code: '+233' },
  { name: 'Guinea', code: '+224' },
  { name: 'Guinea-Bissau', code: '+245' },
  { name: 'India', code: '+91' },
  { name: 'Indonesia', code: '+62' },
  { name: 'Japan', code: '+81' },
  { name: 'Kenya', code: '+254' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Liberia', code: '+231' },
  { name: 'Libya', code: '+218' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Mali', code: '+223' },
  { name: 'Mauritania', code: '+222' },
  { name: 'Mauritius', code: '+230' },
  { name: 'Mexico', code: '+52' },
  { name: 'Morocco', code: '+212' },
  { name: 'Mozambique', code: '+258' },
  { name: 'Namibia', code: '+264' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Russia', code: '+7' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Sao Tome and Principe', code: '+239' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Senegal', code: '+221' },
  { name: 'Seychelles', code: '+248' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Somalia', code: '+252' },
  { name: 'South Africa', code: '+27' },
  { name: 'South Sudan', code: '+211' },
  { name: 'Spain', code: '+34' },
  { name: 'Sudan', code: '+249' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Togo', code: '+228' },
  { name: 'Tunisia', code: '+216' },
  { name: 'Turkey', code: '+90' },
  { name: 'Uganda', code: '+256' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
  { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' },
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.name === 'United States') || COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    if (phoneNumber.trim().length > 3) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center pt-10 font-sans">
      <div className="flex items-center justify-between w-full max-w-md px-4 mb-8">
         <div className="w-6"></div>
         <h1 className="text-teal-600 dark:text-teal-500 font-medium text-xl">Enter your phone number</h1>
         <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2">
           <span className="material-icons">more_vert</span>
         </button>
      </div>

      <div className="text-center px-8 mb-8">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          WhatsChat will need to verify your account. <br />
          <span className="text-teal-500 cursor-pointer">What's my number?</span>
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-6">
        <div className="border-b-2 border-teal-500 relative">
           <select 
             className="w-full py-2 bg-transparent text-gray-900 dark:text-gray-100 outline-none appearance-none text-center cursor-pointer pl-4"
             value={selectedCountry.name}
             onChange={(e) => {
               const country = COUNTRIES.find(c => c.name === e.target.value);
               if (country) setSelectedCountry(country);
             }}
           >
             {COUNTRIES.map(c => (
               <option key={c.name} value={c.name} className="text-gray-900 bg-white">
                 {c.name}
               </option>
             ))}
           </select>
           <span className="material-icons absolute right-0 top-2 text-gray-400 pointer-events-none">arrow_drop_down</span>
        </div>

        <div className="flex gap-4">
          <div className="w-20 border-b-2 border-teal-500 flex items-center">
             <span className="text-gray-400 text-sm mr-1">+</span>
             <input 
               type="text" 
               value={selectedCountry.code.replace('+', '')} 
               readOnly
               className="w-full py-2 bg-transparent text-gray-900 dark:text-gray-100 outline-none"
             />
          </div>
          <div className="flex-1 border-b-2 border-teal-500">
             <input 
               type="tel" 
               placeholder="phone number"
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
               className="w-full py-2 bg-transparent text-gray-900 dark:text-gray-100 outline-none placeholder-gray-400"
             />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 px-4">
          Carrier charges may apply.
        </p>
      </div>

      <div className="mt-12">
        <button 
          onClick={handleLogin}
          className="bg-teal-500 hover:bg-teal-600 text-white py-2.5 px-8 rounded-sm font-medium uppercase text-sm shadow-sm transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};