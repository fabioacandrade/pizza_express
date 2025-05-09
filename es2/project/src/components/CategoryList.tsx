import React from 'react';
import { categories } from '../mockData';
import { useAppContext } from '../hooks/useAppContext';

const CategoryList: React.FC = () => {
  const { activeCategory, setActiveCategory } = useAppContext();

  return (
    <div className="overflow-x-auto scrollbar-hide pb-2">
      <div className="flex space-x-4 min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category.id 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;