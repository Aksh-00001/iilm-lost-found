import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ReportItemPage from './ReportItemPage';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        if (data.item.owner._id !== user._id) {
          toast.error('Not authorized');
          navigate('/dashboard');
          return;
        }
        setItem(data.item);
      } catch {
        toast.error('Item not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return item ? <ReportItemPage editItem={item} /> : null;
};

export default EditItemPage;
