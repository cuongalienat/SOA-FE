export const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const length = ratings.length;
    const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    const avgStars = totalStars / length;
    return { length, avgStars };
};