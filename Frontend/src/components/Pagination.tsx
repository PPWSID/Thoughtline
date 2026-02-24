import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showRange = 2; // Number of pages to show around current page
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - showRange && i <= currentPage + showRange)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`w-10 h-10 rounded-xl border font-bold transition-all ${
              currentPage === i
                ? 'bg-brand-light border-brand-light text-dark-bg transition-transform scale-110 z-10'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-brand-light/50 hover:text-brand-light hover:scale-105'
            }`}
          >
            {i}
          </button>
        );
      } else if (
        i === currentPage - showRange - 1 || 
        i === currentPage + showRange + 1
      ) {
        pages.push(
          <span key={i} className="text-gray-600 px-1">...</span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="mt-16 flex justify-center items-center space-x-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-brand-light hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-2">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-brand-light hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
