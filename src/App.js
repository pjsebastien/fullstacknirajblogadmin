import React, { useState } from 'react';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { Route, Routes } from 'react-router-dom';
import CreatePost from './components/CreatePost';
import Home from './components/Home';
import NavBarComponent from './components/NavBarComponent';
import NotFound from './components/NotFound';
import SearchForm from './components/SearchForm';
import Updatepost from './components/UpdatePost';

export default function App() {
    const [closedNav, setClosedNav] = useState(false);
    const toggleNav = () => {
        setClosedNav(!closedNav);
    };
    const getNavWidth = () => (closedNav ? 'w-16' : 'w-56');
    return (
        <div className="flex ">
            {/* nav section */}
            <div
                className={
                    getNavWidth() + ' min-h-screen  transition-width border border-r'
                }
            >
                <div className="sticky top-0">
                    <NavBarComponent closed={closedNav} />
                </div>
            </div>

            {/* content section */}
            <div className="flex-1 min-h-screen bg-gray-100 ">
                <div className="sticky top-0">
                    <div className="flex items-center ">
                        <button onClick={toggleNav} className="p-2">
                            {closedNav ? (
                                <AiOutlineMenuUnfold size={28} />
                            ) : (
                                <AiOutlineMenuFold size={28} />
                            )}
                        </button>
                        <SearchForm />
                    </div>
                </div>

                <div className="max-w-screen-lg mx-auto ">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/update-post/:slug" element={<Updatepost />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
