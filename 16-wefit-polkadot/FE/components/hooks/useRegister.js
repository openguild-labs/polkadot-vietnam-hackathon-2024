import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      const data = await response.json();
      toast.success(`Register successful! Transaction hash is ${data.tx_hash}`);
      console.log(data.tx_hash);
      localStorage.setItem('tx_hash_register', data.tx_hash);
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { register, isLoading };
};

export default useRegister;