import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getLoggedInUser, getUserById, updateUser } from '../api/apiService';

const token = Cookies.get('token');

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [fullnameError, setFullnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const user = await getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                setError('Failed to fetch logged-in user');
            }
        };

        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(id, token);
                if (response.ok) {
                    const user = await response.json();
                    setFullname(user.name);
                    setEmail(user.email);
                } else {
                    setError('Failed to fetch user');
                    navigate('/users');
                }
            } catch (error) {
                setError('Error fetching user');
                navigate('/users');
            }
        };

        fetchUser();
    }, [id, navigate]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        let formErrors = {};

        if (!fullname) {
            formErrors.fullname = 'Please enter your fullname.';
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = 'Please enter a valid email address.';
        }

        setFullnameError(formErrors.fullname);
        setEmailError(formErrors.email);

        if (Object.keys(formErrors).length === 0) {
            try {
                const responseUpdate = await updateUser(id, { name: fullname, email: email }, token);

                if (responseUpdate.ok) {
                    navigate('/users');
                } else {
                    setError('Failed to update user');
                }
            } catch (error) {
                setError('Error updating user');
            }
        }
    };

    return (
        <div className="container">
            <div className="mt-5">
                <div className="card">
                    <div className="card-header">
                        Edit User Information
                    </div>
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSaveChanges} className="needs-validation" noValidate>
                            <div className="mb-3">
                                <label htmlFor="fullname" className="form-label">Fullname</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${fullnameError ? 'is-invalid' : ''}`} 
                                    id="fullname"  
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}  
                                />
                                {fullnameError && <div className="invalid-feedback">{fullnameError}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loggedInUser && loggedInUser.id == parseInt(id)} 
                                />
                                {emailError && <div className="invalid-feedback">{emailError}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
