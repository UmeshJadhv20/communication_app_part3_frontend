import React, { useState, useEffect } from 'react';
import Nav from '../Nav';
import { Modal, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getLoggedInUser, userList, deleteUser } from '../api/apiService';

const token = Cookies.get('token');

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUserIndex, setCurrentUserIndex] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const user = await getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                setError('Failed to fetch logged-in user');
            }
        };

        const fetchUsers = async () => {
            try {
                const responseFetchUser = await userList(token);
                if (responseFetchUser.ok) {
                    const data = await responseFetchUser.json();
                    setUsers(data);
                } else {
                    setError('Failed to fetch users');
                }
            } catch (error) {
                setError('Error fetching users');
            }
        };

        fetchLoggedInUser();
        fetchUsers();
    }, [token]);

    const handleEdit = (index) => {
        navigate(`/users/edit-user/${users[index].id}`);
    };

    const handleShowDeleteModal = (index) => {
        setShowDeleteModal(true);
        setCurrentUserIndex(index);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setCurrentUserIndex(null);
    };

    const handleDelete = async () => {
        try {
            const userId = users[currentUserIndex].id;
            const responseDelete = await deleteUser(userId, token);

            if (responseDelete.ok) {
                const updatedUsers = users.filter((_, index) => index !== currentUserIndex);
                setUsers(updatedUsers);
                handleCloseDeleteModal();
            } else {
                setError('Failed to delete user');
            }
        } catch (error) {
            setError('Error deleting user');
        }
    };

    return (
        <>
            <Nav />
            <div className="container">
                <h2 className="mt-4">User List</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Edit
                                    </button>
                                    {loggedInUser && loggedInUser.id !== user.id && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleShowDeleteModal(index)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this user?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default UsersList;
