import BookGrid from './BookGrid';
import { Book } from '../data/books';
interface CategorySectionProps {
  title?: string;
  books: Book[];
  columns?: number;
  showTitle?: boolean;
}
const CategorySection = ({
  title,
  books,
  columns = 6,
  showTitle = true
}: CategorySectionProps) => {
  return <section className="py-6 px-4 md:px-8 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        {showTitle && title && <h2 className="text-xl md:text-2xl font-bold mb-4  ">{title}</h2>}
        <BookGrid books={books} columns={columns} />
      </div>
    </section>;
};
export default CategorySection;