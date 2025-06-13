import React from 'react';

const GameCategory = ({ title, icon }) => {
  return (
    <div className="flex flex-col items-center bg-yellow-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="w-16 h-16 mb-2 flex items-center justify-center bg-white rounded-full">
        {icon}
      </div>
      <span className="text-gray-800 font-medium">{title}</span>
    </div>
  );
};

const GamingPlatformMenu = () => {
  const categories = [
    { 
      id: 1, 
      title: 'Lottery', 
      icon: <span className="text-3xl">🎟️</span> 
    },
    { 
      id: 2, 
      title: 'Original', 
      icon: <span className="text-3xl">🎮</span> 
    },
    { 
      id: 3, 
      title: 'Slots', 
      icon: <span className="text-3xl">🎰</span> 
    },
    { 
      id: 4, 
      title: 'Sports', 
      icon: <span className="text-3xl">🏆</span> 
    },
    { 
      id: 5, 
      title: 'Popular', 
      icon: <span className="text-3xl">🌟</span> 
    },
    { 
      id: 6, 
      title: 'Casino', 
      icon: <span className="text-3xl">🃏</span> 
    },
    { 
      id: 7, 
      title: 'Rummy', 
      icon: <span className="text-3xl">🎴</span> 
    },
    { 
      id: 8, 
      title: 'Fishing', 
      icon: <span className="text-3xl">🎣</span> 
    }
  ];
  
  return (
    <div className="p-4 bg-gray-900">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {categories.slice(0, 3).map(category => (
          <GameCategory key={category.id} title={category.title} icon={category.icon} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {categories.slice(3, 6).map(category => (
          <GameCategory key={category.id} title={category.title} icon={category.icon} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {categories.slice(6, 8).map(category => (
          <GameCategory key={category.id} title={category.title} icon={category.icon} />
        ))}
      </div>
    </div>
  );
};

export default GamingPlatformMenu;