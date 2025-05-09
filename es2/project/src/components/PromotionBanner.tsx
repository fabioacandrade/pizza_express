import React from 'react';
import { Promotion } from '../types';
import { ArrowRight } from 'lucide-react';

interface PromotionBannerProps {
  promotion: Promotion;
  fullWidth?: boolean;
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({ promotion, fullWidth = false }) => {
  return (
    <div 
      className={`${fullWidth ? 'w-full' : 'w-full'} mx-auto rounded-xl overflow-hidden shadow-md relative cursor-pointer group`}
    >
      <div className="aspect-[21/9] relative">
        <img 
          src={promotion.imageUrl} 
          alt={promotion.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 sm:px-10">
          <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {promotion.title}
          </h3>
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-md mb-4">
            {promotion.description}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-white bg-red-600 px-3 py-1 rounded-full text-sm inline-flex items-center">
              Ver detalhes
              <ArrowRight size={14} className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner