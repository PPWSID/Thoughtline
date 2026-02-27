import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../styles/Pagination.module.css';

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
            className={`${styles.pageButton} ${
              currentPage === i ? styles.activePage : styles.inactivePage
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
          <span key={i} className={styles.ellipsis}>...</span>
        );
      }
    }
    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.navButton}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className={styles.pageNumberWrapper}>
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.navButton}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
