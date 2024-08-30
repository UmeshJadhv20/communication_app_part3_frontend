import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getLoggedInUser } from '../api/apiService';

const PrivateRoute = ({ element: Element }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const user = await getLoggedInUser(); 
                if (user) {
                    setIsLoggedIn(true); 
                } else {
                    setIsLoggedIn(false); 
                }
            } catch (error) {
                console.error('Error fetching user status:', error);
                setIsLoggedIn(false); 
            } finally {
                setIsLoading(false); 
            }
        };

        checkUserStatus(); 
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return isLoggedIn ? <Element /> : <Navigate to="/" />; 
};

export default PrivateRoute;
