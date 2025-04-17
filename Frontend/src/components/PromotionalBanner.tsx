import React from 'react';
import { TagIcon, ArrowRightIcon, SparklesIcon, GiftIcon, TrendingUpIcon, ChevronRightIcon } from 'lucide-react';
interface PromotionalBannerProps {
  title: string;
  discount: string;
  bgColor: string;
  textColor: string;
}
const PromotionalBanner = ({
  title,
  discount,
  bgColor,
  textColor
}: PromotionalBannerProps) => {
  const getIcon = () => {
    if (title.includes('NEW')) return <SparklesIcon size={24} className="mr-2" />;
    if (title.includes('BESTSELLING')) return <TrendingUpIcon size={24} className="mr-2" />;
    if (title.includes('SPECIAL')) return <GiftIcon size={24} className="mr-2" />;
    return <TagIcon size={24} className="mr-2" />;
  };
  return <div className={`w-full ${bgColor} ${textColor} py-6 relative overflow-hidden group`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute transform rotate-45 -right-32 -top-8 w-64 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute transform -rotate-45 -right-32 -bottom-8 w-64 h-32 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black to-transparent opacity-10"></div>
      </div>
      <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center relative z-10 gap-4">
        <div className="flex items-center text-center sm:text-left">
          <div className="hidden sm:block">{getIcon()}</div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-wider mb-1">
              {title}
            </h2>
            <p className="text-sm opacity-90">
              Limited time offer - Shop now and save!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg transform -skew-x-12 shadow-lg">
            <span className="text-xl md:text-2xl font-bold tracking-wider skew-x-12 inline-block">
              {discount}
            </span>
          </div>
          <button className="bg-white text-black px-5 py-3 rounded-md text-sm font-semibold hover:bg-opacity-90 transition-all shadow-lg flex items-center group-hover:px-6">
            Shop Now
            <ChevronRightIcon size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-10 w-1/4 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
    </div>;
};
export default PromotionalBanner;