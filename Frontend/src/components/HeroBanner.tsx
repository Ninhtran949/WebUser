import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, BookOpenIcon, StarIcon, TrendingUpIcon, ChevronRightIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SignInDialog from './SignInDialog';
import { useNavigate } from 'react-router-dom'

const HeroBanner = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const bestsellerSectionRef = useRef(null);
  const slides = [
    {
      title: 'Bestselling Books',
      description: 'Discover the latest bestsellers and must-read titles',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop',
      bgImage: 'https://get.pxhere.com/photo/man-book-person-black-and-white-people-road-white-street-photography-city-reading-explore-hut-male-portrait-sitting-hat-fashion-clothing-black-monochrome-lady-streetphotography-flickr-bw-blackandwhite-project-candid-creativecommons-infrastructure-stadt-photograph-snapshot-germany-deutschland-sw-scene-bayern-bavaria-schwarzweis-stop-clothes-sitzend-32-menschen-strase-unposed-ungestellt-strasenfotografie-haltestelle-buch-lesen-mann-365-366-augsburg-erwachsener-project365-projekt-szene-adult-photoaday-pictureaday-project366-streettog-tog-zweisichtde-zweisichtig-bekleidung-kleidung-querformat-landscapeformat-samsunggalaxys6-photo-shoot-monochrome-photography-film-noir-human-positions-368419.jpg',
      icon: <TrendingUpIcon size={24} className="mr-2" />,
      textColor: 'text-white',
      layoutClass: ''
    },
    {
      title: 'New Releases',
      description: 'Be the first to read the hottest new titles this month',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2787&auto=format&fit=crop',
      bgImage: 'https://thumbs.dreamstime.com/b/young-hispanic-american-man-reading-red-book-street-new-yo-young-hispanic-american-man-hair-bun-wearing-glasses-yellow-125181248.jpg',
      icon: <BookOpenIcon size={24} className="mr-2" />,
      textColor: 'text-yellow-900',
      layoutClass: '' // căn phải, padding trái lớn để tránh ảnh người
    },
    {
      title: 'Award Winners',
      description: "Explore critically acclaimed books that everyone's talking about",
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2787&auto=format&fit=crop',
      bgImage:'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg',
      icon: <StarIcon size={24} className="mr-2" />,
      textColor: 'text-black',
      layoutClass: ''
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide: set interval only once on mount
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length]);

  // Manual navigation with transition
  const goToNextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(prev => prev === slides.length - 1 ? 0 : prev + 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };
  const goToPrevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };
  const handleShopNowClick = () => {
    if (isAuthenticated) {
      // User is logged in, scroll to bestseller section
      const bestsellerSection = document.getElementById('bestseller-section');
      if (bestsellerSection) {
        bestsellerSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // User is not logged in, show sign in dialog
      setShowSignInDialog(true);
    }
  };
  return (
    <div
      className="w-full py-12 px-4 transition-colors duration-500 relative"
      style={{
        backgroundImage: `url(${slides[currentSlide].bgImage || slides[currentSlide].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="hidden md:block">
          <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition z-30 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={goToPrevSlide} aria-label="Previous slide">
            <ArrowLeftIcon size={20} className="text-blue-800" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition z-30 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={goToNextSlide} aria-label="Next slide">
            <ArrowRightIcon size={20} className="text-blue-800" />
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 relative">
          <div className={`md:w-3/5 text-center md:text-left mb-8 md:mb-0 relative z-20 ${slides[currentSlide].layoutClass}`}>
            <div className="inline-flex items-center bg-white bg-opacity-50 px-4 py-1 rounded-full mb-4">
              {slides[currentSlide].icon}
              <span className="font-medium">Featured Collection</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-500 ${slides[currentSlide].textColor}`}>
              {slides[currentSlide].title}
            </h1>
            <p className={`text-lg mb-8 max-w-md transition-all duration-500 ${slides[currentSlide].textColor}`}>
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                className="bg-blue-800 text-white px-6 py-3 rounded-md hover:bg-blue-900 transition shadow-lg flex items-center"
                onClick={handleShopNowClick}
              >
                <BookOpenIcon size={18} className="mr-2" />
                Shop Now
              </button>
              <button 
                onClick={() => navigate('/collection/books')}
                className="border-2 border-blue-800 text-blue-800 px-6 py-3 rounded-md hover:bg-blue-100 transition flex items-center">
                View Collections
                <ChevronRightIcon size={18} className="ml-1" />
              </button>
            </div>
          </div>
          <div className="md:w-2/5">
            <div className="relative pb-[120%] md:pb-[140%] overflow-hidden rounded-lg shadow-xl">
              {slides.map((slide, index) => <img key={index} src={slide.image} alt={`Featured ${slide.title}`} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`} loading="eager" />)}
              <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold p-2 rounded-full shadow-md transform rotate-12">
                <StarIcon size={16} />
              </div>
              <div className="absolute bottom-4 left-4 bg-blue-800 text-white text-xs font-bold py-1 px-3 rounded-md shadow-md">
                FEATURED
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              {slides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-blue-800 w-6' : 'bg-gray-400'}`} aria-label={`Go to slide ${index + 1}`} />)}
            </div>
          </div>
        </div>
        <div className="flex md:hidden justify-center mt-6 gap-4">
          <button className="bg-white bg-opacity-80 p-3 rounded-full shadow-md transition z-30" onClick={goToPrevSlide} aria-label="Previous slide">
            <ArrowLeftIcon size={18} className="text-blue-800" />
          </button>
          <button className="bg-white bg-opacity-80 p-3 rounded-full shadow-md transition z-30" onClick={goToNextSlide} aria-label="Next slide">
            <ArrowRightIcon size={18} className="text-blue-800" />
          </button>
        </div>
      </div>
      {showSignInDialog && (
        <SignInDialog 
          isOpen={showSignInDialog} 
          onClose={() => setShowSignInDialog(false)} 
        />
      )}
    </div>
  );
};
export default HeroBanner;