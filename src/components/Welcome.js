import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="container">
            <div className="justify-content-center mt-5">
                <div className="card text-center">
                    <div className="card-header">
                        <h1>Welcome to Users Module</h1>
                    </div>
                    <div className="card-body">
                        <h2 className="card-text">Existing Users</h2>
                        <button className="btn btn-primary mx-auto" onClick={handleLoginClick}>
                            Login
                        </button>
                        <h2 className="card-text mt-3">New Users</h2>
                        <button className="btn btn-primary mx-auto" onClick={handleRegisterClick}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
