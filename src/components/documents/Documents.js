import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import Nav from '../Nav';
import { fetchDocuments, uploadDocument, updateDocument, deleteDocument } from '../api/apiService';
import Cookies from 'js-cookie';
const token = Cookies.get('token');

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [fileLabel, setFileLabel] = useState('');
    const [fileInput, setFileInput] = useState(null);
    const [editFileLabel, setEditFileLabel] = useState('');
    const [currentFileId, setCurrentFileId] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAndSetDocuments = async () => {
            try {
                const documentsData = await fetchDocuments(token);
                setDocuments(documentsData);
            } catch (error) {
                setErrorMessage('Error fetching documents:', error);
            }
        };

        fetchAndSetDocuments();
    }, []);

    const handleUpload = async () => {
        if (fileLabel.trim() === '' || !fileInput) {
            setErrorMessage('Please fill in the file label and select a file.');
            setShowError(true);
            return;        }

       

        try {
            const newUpload = await uploadDocument(fileLabel, fileInput, token);
            if (newUpload) {
                setDocuments((prevDocuments) => [...prevDocuments, newUpload]);
                setShowUploadModal(false);
                setFileLabel('');
                setFileInput(null);
                setShowError(false);
            }
        } catch (error) {            
            setErrorMessage('Failed to upload document.');
            setShowError(true);
        }
    };

    const handleDelete = async () => {
        try {
            const deleted = await deleteDocument(currentFileId, token);
            if (deleted) {
                setDocuments((prevDocuments) => prevDocuments.filter(upload => upload.id !== currentFileId));
                setShowDeleteModal(false);
            }
        } catch (error) {
            setErrorMessage('Failed to delete document.');
            setShowError(true);
        }
    };

    const handleEditSave = async () => {
        if (editFileLabel.trim() === '') {
            setErrorMessage('File label cannot be empty.');
            setShowError(true);
            return;
        }       

        try {
            const updatedDocument = await updateDocument(currentFileId, editFileLabel, token);
            if (updatedDocument) {
                setDocuments((prevDocuments) =>
                    prevDocuments.map(upload =>
                        upload.id === currentFileId ? { ...upload, label: editFileLabel } : upload
                    )
                );
                setShowEditModal(false);
                setShowError(false);
            }
        } catch (error) {
            setErrorMessage('Failed to update document.');
            setShowError(true);
        }
    };

    return (
        <>
            <Nav />
            <div className="container">
                <h1 className="text-center mt-3 mb-3">My Documents</h1>

                <Table striped hover id="documentListTable">
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>Filename</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="documentListTableBody">
                        {documents.map((upload) => (
                            <tr key={upload.id}>
                                <td>{upload.label}</td>
                                <td>{upload.filename}</td>
                                <td>
                                    <Button variant="danger" onClick={() => { setShowDeleteModal(true); setCurrentFileId(upload.id); }}>
                                        Delete
                                    </Button>
                                    <Button variant="primary" onClick={() => { setShowEditModal(true); setCurrentFileId(upload.id); setEditFileLabel(upload.label); }}>
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                    + Add Upload
                </Button>

                {/* Upload Modal */}
                <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Upload</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='mb-3'>
                            <div className="form-group">
                                <label htmlFor="fileLabel">File Label</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="fileLabel" 
                                    value={fileLabel}
                                    onChange={(e) => setFileLabel(e.target.value)}
                                    placeholder="File Label" 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fileInput">File</label><br />
                                <input type="file" className="form-control-file" id="fileInput" onChange={(e) => setFileInput(e.target.files[0])} />
                            </div>
                        </form>
                        {showError && (
                            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                                {errorMessage}
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleUpload}>Upload Now</Button>
                        <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className='mb-3'>
                            <div className="form-group">
                                <label htmlFor="edit_document_fileLabel">File Label</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="edit_document_fileLabel" 
                                    value={editFileLabel}
                                    onChange={(e) => setEditFileLabel(e.target.value)}
                                    placeholder="File Label" 
                                />
                            </div>
                        </form>
                        {showError && (
                            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                                {errorMessage}
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleEditSave}>Save</Button>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Delete File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this file?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleDelete}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Documents;
