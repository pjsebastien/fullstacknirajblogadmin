import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useSearch } from '../Context/SearchProvider';

export default function SearchForm() {
    const [query, setQuery] = useState('');
    const { handleSearch, resetSearch, searchResult } = useSearch();
    const handleSubmit = e => {
        e.preventDefault();
        if (!query.trim()) return;
        handleSearch(query);
    };

    const handleReset = e => {
        resetSearch();
        setQuery('');
    };
    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            resetSearch();
            setQuery('');
        }
    };

    let placeHolder = 'Rechercher...';
    return (
        <form className="relative" onSubmit={handleSubmit}>
            <input
                value={query}
                onKeyDown={handleKeyDown}
                onChange={({ target }) => setQuery(target.value)}
                className="border border-gray-500 outline-none rounded p-1 focus:ring-1 ring-blue-500 w-56"
                placeholder={placeHolder}
            />
            {searchResult.length ? (
                <button
                    onClick={handleReset}
                    className="absolute top-1/2 -translate-y-1/2 text-gray-700 right-2 "
                >
                    <AiOutlineClose />
                </button>
            ) : null}
        </form>
    );
}
