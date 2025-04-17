import React from 'react';
import { EditorialReview } from '../data/books';
interface EditorialReviewsProps {
  reviews: EditorialReview[];
}
const EditorialReviews = ({
  reviews
}: EditorialReviewsProps) => {
  return <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Editorial Reviews</h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        {reviews.map((review, index) => <div key={index} className="mb-6 last:mb-0">
            <p className="text-gray-700 italic mb-2">{review.content}</p>
            <p className="text-gray-600 text-sm">— {review.source}</p>
          </div>)}
      </div>
    </section>;
};
export default EditorialReviews;