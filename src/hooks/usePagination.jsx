import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const goToPage = (page) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const resetPage = () => {
        setCurrentPage(1);
    };

    const changeLimit = (newLimit) => {
        setLimit(newLimit);
        setCurrentPage(1); // Reset page when limit changes usually
    };

    return {
        currentPage,
        limit,
        goToPage,
        nextPage,
        prevPage,
        resetPage,
        changeLimit,
        setLimit
    };
};
