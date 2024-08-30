import Cookies from 'js-cookie';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const userList = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await response;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return await response;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return await response.json();
};

export const updateUser = async (id, userData, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  return await response;
};

export const getUserById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return await response;
};

export const deleteUser = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await response;
};


export const getLoggedInUser = async () => {
  const token = Cookies.get('token');

  try {
    const response = await fetch(`${API_BASE_URL}/get_auth_user`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 403 || response.status == 401) {
      console.log('User is not logged in');
      return null;
    }
    return await response.json();
  } catch (error) {
      return null;
  }
};

export const fetchDocuments = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return await response.json();
  } catch (error) {
    return [];
  }
};


export const uploadDocument = async (label, fileInput, token) => {
  const formData = new FormData();
  formData.append('label', label);
  formData.append('file', fileInput);

  try {
    const response = await fetch(`${API_BASE_URL}/document-upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }
    return await response.json();
  } catch (error) {
    return null;
  }
};


export const updateDocument = async (id, label, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/document-edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ label }),
    });
    if (!response.ok) {
      throw new Error('Failed to update document');
    }
    return await response.json();
  } catch (error) {
    return null;
  }
};


export const deleteDocument = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/document-delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
    return await response.json();
  } catch (error) {
      return null;
  }
};

export const getChatList = async (token) => {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return await response;
};

export const sendChat = async (newMessage, token) => {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMessage),
  });
  return await response;
};


