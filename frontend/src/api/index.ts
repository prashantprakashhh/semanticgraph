const API_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
    try {
      // This is a safer way to get the token
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) return { 'Content-Type': 'application/json' };
  
      const token = JSON.parse(authStorage).state?.token;
      
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    } catch (error) {
      console.error("Could not parse auth token from localStorage", error);
      return { 'Content-Type': 'application/json' };
    }
  };
  
export const apiLogin = (credentials: any) => 
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  export const apiRegister = (credentials: any) =>
    fetch(`${API_URL}/auth/register`, { // <-- Uses the full URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

export const apiIngestText = (text: string) => 
  fetch(`${API_URL}/ingest`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ text }),
  });

export const apiGetGraphData = () => 
  fetch(`${API_URL}/graph/data`, {
    headers: getAuthHeaders(),
  });

