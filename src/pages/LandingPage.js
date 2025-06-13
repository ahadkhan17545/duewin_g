import React from 'react';

const BDGWin = () => {
  const urls = [
    { time: '6ms', url: 'bdgwincolor.com' },
    { time: '9ms', url: 'bdgwinf.com' },
    { time: '14ms', url: 'bdgwinvip6.com' },
    { time: '10ms', url: 'bdgwinvip7.com' },
    { time: '7ms', url: 'bdgwinvip8.com' },
  ];

  const paymentMethods = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Paytm_Logo_%28standalone%29.svg/1200px-Paytm_Logo_%28standalone%29.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Google_Pay_Logo.svg/1200px-Google_Pay_Logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/BHIM_Logo.png/1200px-BHIM_Logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/United_Payments_Interface_logo.svg/1200px-United_Payments_Interface_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tether_Logo.svg/1200px-Tether_Logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Tron_logo.svg/1200px-Tron_logo.svg.png',
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-[#2A2F3A] text-[#FFD700] font-sans">
      {/* Logo Section */}
      <div className="logo-bg w-64 h-32 flex items-center justify-center mb-4">
        <h1 className="text-4xl font-bold text-gray-300">BDG WIN</h1>
      </div>

      {/* Welcome Text */}
      <h2 className="text-xl mb-2">Welcome to BDG WIN</h2>
      <p className="text-sm text-center mb-4">
        *This is a complete collection of BDG websites, please take a screenshot and save it.
      </p>

      {/* Verify Input */}
      <div className="flex w-full max-w-md mb-4">
        <input
          type="text"
          placeholder="Verify BDGWIN URL...."
          className="flex-1 p-2 rounded-l-md bg-white text-black focus:outline-none"
        />
        <button className="bg-yellow-500 text-black font-bold p-2 rounded-r-md hover:bg-yellow-600">
          Verify
        </button>
      </div>

      {/* URL List */}
      <div className="w-full max-w-md space-y-2 mb-4">
        {urls.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white text-black p-2 rounded-md"
          >
            <span className="text-yellow-500 font-bold">{item.time}</span>
            <span>{item.url}</span>
            <button className="bg-yellow-500 text-black font-bold p-2 rounded-md hover:bg-yellow-600">
              VISIT
            </button>
          </div>
        ))}
      </div>

      {/* How to Invite Section */}
      <div className="invite-bg w-full max-w-md p-4 rounded-md text-white mb-4">
        <h3 className="text-lg font-bold mb-2">HOW TO INVITE? – BECOME AN AGENT</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
            <p>Visit the official website shift promotion</p>
          </div>
          <div className="flex items-start">
            <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
            <p>Copy invitation link and to friends to register an account</p>
          </div>
          <div className="flex items-start">
            <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
            <p>Earn income & commission become a BDG game agent</p>
          </div>
        </div>
      </div>

      {/* New Section: Why Choose BDG Win */}
      <div className="w-full max-w-md p-4 bg-[#FFC107] text-black rounded-md border-4 border-red-600">
        <h3 className="text-lg font-bold mb-2">
          WHY THERE HAVE MANY MEMBERS CHOOSE BDG WIN?
        </h3>
        <p className="text-sm mb-4">
          THE PLATFORM WAS LAUNCHED IN 2019 AND HAS BEEN RUNNING FOR MORE THAN 4 YEARS. MORE THAN MILLIONS OF PEOPLE HAVE CHOSEN BDG WIN. AT THE SAME TIME, THE LATEST SYSTEM IS ADOPTED TO ENSURE MEMBER INFORMATION SECURITY AND SERVICE QUALITY.
        </p>

        <h3 className="text-lg font-bold mb-2">
          WHY CHOOSE BDG WIN TO BECOME AN AGENT?
        </h3>
        <p className="text-sm mb-4">
          THE PLATFORM WAS LAUNCHED IN 2019 AND HAS BEEN RUNNING FOR MORE THAN 4 YEARS. MORE THAN MILLIONS OF PEOPLE HAVE CHOSEN BDG WIN. AT THE SAME TIME, THE LATEST SYSTEM IS ADOPTED TO ENSURE MEMBER INFORMATION SECURITY AND SERVICE QUALITY.
        </p>

        <h3 className="text-lg font-bold mb-2 text-red-600">
          HOW TO REGISTER AS AN AGENT?
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <span className="text-red-600 font-bold mr-2">1</span>
            <p>Select “Promotion”</p>
          </div>
          <div className="flex items-start">
            <span className="text-red-600 font-bold mr-2">2</span>
            <p>Select “Invitation Link</p>
          </div>
          <div className="flex items-start">
            <span className="text-red-600 font-bold mr-2">3</span>
            <p>Copy The “Invitation Link</p>
          </div>
          <div className="flex items-start">
            <span className="text-red-600 font-bold mr-2">4</span>
            <p>Use Invitation Links To Invite Friends To Join</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-2 text-red-600">
          PAYMENT METHODS
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {paymentMethods.map((method, index) => (
            <img
              key={index}
              src={method}
              alt={`Payment Method ${index + 1}`}
              className="w-full h-12 object-contain bg-white rounded-md p-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BDGWin;