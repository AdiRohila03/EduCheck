const paginate = (items, page = 1, limit = 10) => {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedItems = items.slice(startIndex, endIndex);

    return {
        currentPage: page,
        totalPages: Math.ceil(items.length / limit),
        totalItems: items.length,
        perPage: limit,
        data: paginatedItems,
        hasNextPage: endIndex < items.length,
        hasPrevPage: startIndex > 0,
    };
};

export default paginate;
