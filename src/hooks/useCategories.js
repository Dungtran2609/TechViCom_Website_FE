import { useState, useEffect } from 'react';
import { categoryAPI } from '../api';

// Hook cho HomePage (categories đơn giản)
export const useHomeCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryAPI.getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setError('Không có dữ liệu categories');
        }
      } catch (err) {
        console.error('Error fetching home categories:', err);
        setError(err.message || 'Lỗi khi tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Hook cho Header (categories với subcategories và featured products)
export const useHeaderCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryAPI.getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setError('Không có dữ liệu categories');
        }
      } catch (err) {
        console.error('Error fetching header categories:', err);
        setError(err.message || 'Lỗi khi tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}; 