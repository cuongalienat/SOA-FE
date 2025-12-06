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

export const getVisiblePages = (current, total) => {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }

    let l;
    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }
    return rangeWithDots;
};
