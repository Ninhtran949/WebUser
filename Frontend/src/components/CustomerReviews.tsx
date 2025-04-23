import React from 'react';
import { CustomerReview } from '../data/books';
import { StarIcon } from 'lucide-react';

interface CustomerReviewsProps {
  reviews: CustomerReview[];
}

const CustomerReviews = ({
  reviews
}: CustomerReviewsProps) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  size={16}
                  className={i < review.rating ? 'fill-yellow-400' : 'fill-gray-200'}
                />
              ))}
            </div>
            <p className="text-gray-700 mb-2">{review.content}</p>
            <p className="text-gray-500 text-sm">
              By {review.author} on {review.date}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;