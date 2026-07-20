import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange, total }) => {
  if (pages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
      <p className="text-xs text-gray-500">
        Page {page} of {pages} {total !== undefined && `· ${total} total`}
      </p>
      <div className="flex gap-2">
        <button
          className="btn-secondary !px-2.5 !py-1.5"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          className="btn-secondary !px-2.5 !py-1.5"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
