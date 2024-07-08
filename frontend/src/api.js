import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = await axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    },
})
export const getBooks = () => api.get(`/books`);
export const getBookById = (id) => api.get(`/books/${id}`);
export const addBook = (book) => api.post(`/books`, book);
export const updateBook = (id, book) => api.put(`/books/${id}`, book);
export const deleteBook = (id) => api.delete(`/books/${id}`);

export const getAuthors = () => api.get(`/authors`);
export const getAuthorById = (id) => api.get(`/authors/${id}`);
export const addAuthor = (author) => api.post(`/authors`, author);
export const updateAuthor = (id, author) => api.put(`/authors/${id}`, author);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

export const getGenres = () => api.get(`/genres`);
export const addGenre = (genre) => api.post(`/genres`, genre);

export const searchBooksByTitle = (query) => api.get(`/search/title`, { params: { query } });
export const searchBooksByAuthor = (query) => api.get(`/search/author`, { params: { query } });
export const searchBooksByGenre = (query) => api.get(`/search/genre`, { params: { query } });

// export const searchBooksByTitle = async (query) => {
//   try {
//     const response = api.get(`/search/title?query=${query}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const searchBooksByAuthor = async (query) => {
//   try {
//     const response = api.get(`/search/author?query=${query}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const searchBooksByGenre = async (query) => {
//   try {
//     const response = api.get(`/search/genre?query=${query}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
