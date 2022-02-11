import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPost } from '../api/post';
import { useNotification } from './NotificationProvider';

const SearchContext = createContext();

export default function SearchProvider({ children }) {
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();
    const { updateNotification } = useNotification();
    const handleSearch = async query => {
        const { error, posts } = await searchPost(query);
        if (error) return updateNotification('error', error);
        setSearchResult(posts);
    };
    const resetSearch = () => {
        setSearchResult([]);
        navigate('/');
    };

    return (
        <SearchContext.Provider value={{ searchResult, handleSearch, resetSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearch = () => useContext(SearchContext);
