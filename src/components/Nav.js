import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Nav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        // localStorage.removeItem('loggedUser');
        
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/');
    };

    const getLinkClass = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <span>Communication Application</span>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className={getLinkClass('/chats')} to="/chats">Group Chat</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getLinkClass('/users')} to="/users">Manage Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getLinkClass('/documents')} to="/documents">Manage Documents</Link>
                        </li>
                        <li className="nav-item">
                            <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
                                Logout
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
