import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import { getLoggedInUser } from '../api/apiService';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getLoggedInUser(); 
            if (user) {
                setLoggedUser(user);
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <>
            <Nav />
            <div className="container mt-5 text-center">
                <h2>Login Successful</h2>
                {loggedUser ? (
                    <p>
                        <b>Welcome !</b>  {loggedUser.email}
                    </p>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
};

export default LoginSuccess;
