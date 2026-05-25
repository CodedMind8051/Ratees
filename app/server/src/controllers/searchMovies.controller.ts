
const SearchMoviesController = async (query:string, page?:string) => {
    try {
        if (!query) {
            throw new Error('Query parameter is required');
        }


    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}

export { SearchMoviesController };