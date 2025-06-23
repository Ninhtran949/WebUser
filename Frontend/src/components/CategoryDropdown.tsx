import { Link } from 'react-router-dom';
import { TrendingUpIcon, StarIcon, BookOpenIcon, GiftIcon, CalendarIcon, BookmarkIcon, ShoppingBagIcon, GlobeIcon } from 'lucide-react';

interface FeaturedCategory {
  name: string;
  image: string;
}

interface Subcategory {
  name: string;
  links: string[];
}

interface CategoryDropdownProps {
  category: string;
  title: string;
  featuredCategories: FeaturedCategory[];
  subcategories: Subcategory[];
}

const CategoryDropdown = ({
  category,
  title,
  featuredCategories,
  subcategories
}: CategoryDropdownProps) => {
  return (
    <div className="w-full bg-white shadow-xl z-50 border-y border-gray-200">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-4 gap-8 py-8">
          {/* Column 1: Featured Categories */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase text-sm mb-4 border-b border-gray-200 pb-2 flex items-center">
              <TrendingUpIcon size={16} className="mr-2 text-blue-800" />
              Bestsellers
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={`/collection/${category}?sort=bestseller`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <StarIcon size={14} className="mr-2 text-yellow-500" />
                  <span className="group-hover:translate-x-1 transition-transform">
                     Bestsellers
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}?sort=nytimes`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <BookOpenIcon size={14} className="mr-2 text-blue-800" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    NY Times Bestsellers
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}?discount=30`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <GiftIcon size={14} className="mr-2 text-red-500" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    30% Off Bestsellers
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}?view=all`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <ShoppingBagIcon size={14} className="mr-2 text-green-600" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    All Bestsellers
                  </span>
                </Link>
              </li>
            </ul>
            <h3 className="font-bold text-gray-800 uppercase text-sm mt-6 mb-4 border-b border-gray-200 pb-2 flex items-center">
              <BookmarkIcon size={16} className="mr-2 text-blue-800" />
              We Recommend
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={`/collection/${category}?type=bookclub`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {title} Book Club
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}?type=monthly`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <CalendarIcon size={14} className="mr-2 text-purple-600" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    Monthly Picks
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}?best=2024`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <StarIcon size={14} className="mr-2 text-yellow-500" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    Best Books of 2024
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 2: Customer Favorites */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase text-sm mb-4 border-b border-gray-200 pb-2 flex items-center">
              <StarIcon size={16} className="mr-2 text-blue-800" />
              Customer Favorites
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={`/collection/${category}?filter=new`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    New Releases
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}?filter=coming`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Coming Soon
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}?filter=special`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <GiftIcon size={14} className="mr-2 text-red-500" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    Special Editions
                  </span>
                </Link>
              </li>
            </ul>
            <h3 className="font-bold text-gray-800 uppercase text-sm mt-6 mb-4 border-b border-gray-200 pb-2 flex items-center">
              <BookOpenIcon size={16} className="mr-2 text-blue-800" />
              Browse
            </h3>
            <ul className="space-y-2">
              {subcategories[0]?.links.slice(0, 4).map((link, index) => (
                <li key={index}>
                  <Link 
                    to={`/collection/${category}?subcategory=${encodeURIComponent(link.toLowerCase())}`}
                    className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Column 3: Top Subjects */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase text-sm mb-4 border-b border-gray-200 pb-2 flex items-center">
              <BookmarkIcon size={16} className="mr-2 text-blue-800" />
              Top Subjects
            </h3>
            <ul className="space-y-2">
              {subcategories.map(subcategory => (
                <li key={subcategory.name}>
                  <Link 
                    to={`/collection/${category}?subject=${encodeURIComponent(subcategory.name.toLowerCase())}`}
                    className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {subcategory.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to={`/collection/${category}/subjects`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform flex items-center">
                    See All Subjects
                    <span className="ml-1">›</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 4: Departments */}
          <div>
            <h3 className="font-bold text-gray-800 uppercase text-sm mb-4 border-b border-gray-200 pb-2 flex items-center">
              <ShoppingBagIcon size={16} className="mr-2 text-blue-800" />
              Departments
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={`/collection/${category}`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {title} Store
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}/subscriptions`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {title} Subscriptions
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}/paperback`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Paperback Store
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}/spanish`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <GlobeIcon size={14} className="mr-2 text-green-600" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    Libros en español
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/collection/${category}/annex`}
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Book Annex
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/gift-cards"
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <GiftIcon size={14} className="mr-2 text-red-500" />
                  <span className="group-hover:translate-x-1 transition-transform">
                    Gift Cards
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;