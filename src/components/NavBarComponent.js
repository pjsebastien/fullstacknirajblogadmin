import React from 'react';
import { AiOutlineFileAdd, AiOutlineHome } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, value, closed, Icon }) => {
    const commonClasses =
        'flex items-center space-x-2 w-full p-2 block whitespace-nowrap';
    const activeClass = commonClasses + ' bg-blue-500 text-white';
    const inactiveClass = commonClasses + ' text-gray-500';
    return (
        <NavLink
            to={to}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
            {Icon}
            <span
                className={
                    closed
                        ? 'w-0 transition-width overflow-hidden'
                        : 'w-full transition-width overflow-hidden'
                }
            >
                {value}
            </span>
        </NavLink>
    );
};

export default function NavBarComponent({ closed }) {
    return (
        <nav>
            <div className="flex justify-center">
                <img
                    className="w-24 p-3 transition-width"
                    src="./ousekondor-admin.png"
                    alt="logo website"
                />
            </div>
            <ul className="">
                <li>
                    <NavItem
                        closed={closed}
                        to="/"
                        value="Accueil"
                        Icon={<AiOutlineHome size={24} />}
                    />
                </li>
                <li>
                    <NavItem
                        closed={closed}
                        to="/create-post"
                        value="Créer une publication"
                        Icon={<AiOutlineFileAdd size={24} />}
                    />
                </li>
            </ul>
        </nav>
    );
}
