import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useAdminSession() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('signage_admin');
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  const doLogout = () => {
    localStorage.removeItem('signage_token');
    localStorage.removeItem('signage_admin');
    navigate('/login');
  };

  return { admin, doLogout };
}
