import React, { Children } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import PromotionalBanner from '../components/PromotionalBanner';
import { bookCategories } from '../data/books';
import { BookOpenIcon, TrendingUpIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import { ChevronRightIcon } from 'lucide-react';
const HomePage = () => {
  return <main className="flex-grow">
      <HeroBanner />
      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <TrendingUpIcon size={24} className="text-blue-800" />
              </div>
              <h3 className="font-medium">Bestsellers</h3>
              <p className="text-xs text-gray-600 mt-1">Top books this month</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <SparklesIcon size={24} className="text-green-800" />
              </div>
              <h3 className="font-medium">New Releases</h3>
              <p className="text-xs text-gray-600 mt-1">Fresh off the press</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <BookOpenIcon size={24} className="text-purple-800" />
              </div>
              <h3 className="font-medium">Book Club</h3>
              <p className="text-xs text-gray-600 mt-1">Join the discussion</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <UsersIcon size={24} className="text-amber-800" />
              </div>
              <h3 className="font-medium">Author Events</h3>
              <p className="text-xs text-gray-600 mt-1">Meet your favorites</p>
            </div>
          </div>
        </div>
      </section>
      <PromotionalBanner title="NEW RELEASES" discount="10% OFF" bgColor="bg-gradient-to-r from-purple-900 to-indigo-800" textColor="text-white" />
      <CategorySection title="Bestsellers" books={bookCategories.bestsellers} columns={6} />
      <PromotionalBanner title="BESTSELLING BOOKS" discount="20% OFF" bgColor="bg-gradient-to-r from-blue-900 to-blue-700" textColor="text-white" />
      <CategorySection title="Trending Books" books={bookCategories.trending} columns={6} />
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 py-10 px-4 my-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold mb-2 md:mb-0">
              Featured Author Collections
            </h2>
            <button className="text-blue-800 font-medium flex items-center hover:underline">
              View All Featured Authors{' '}
              <ChevronRightIcon size={16} className="ml-1" />
            </button>
          </div>
          <CategorySection books={bookCategories.featured} columns={7} showTitle={false} />
        </div>
      </div>
      <PromotionalBanner title="SPECIAL OFFERS" discount="50% OFF" bgColor="bg-gradient-to-r from-gray-900 to-gray-700" textColor="text-white" />
      <CategorySection title="New Arrivals" books={bookCategories.newArrivals} columns={6} />
      <div className="bg-gradient-to-b from-pink-50 to-pink-100 py-10 px-4 my-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold mb-2 md:mb-0">
              Children's Books
            </h2>
            <button className="text-blue-800 font-medium flex items-center hover:underline">
              Explore Children's Collection{' '}
              <ChevronRightIcon size={16} className="ml-1" />
            </button>
          </div>
          <CategorySection books={bookCategories.childrens} columns={6} showTitle={false} />
        </div>
      </div>
      <section className="bg-blue-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-2">
            Stay Updated with BookStore
          </h2>
          <p className="mb-6">
            Subscribe to our newsletter for new releases, reading
            recommendations, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="email" placeholder="Your email address" className="flex-grow px-4 py-3 rounded-l text-gray-800 focus:outline-none" aria-label="Email for newsletter" />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-3 rounded-r transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>;
};
export default HomePage;