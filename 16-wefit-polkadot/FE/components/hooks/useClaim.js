import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const useClaim = () => {
  const [isLoading, setIsLoading] = useState(false);

  const claim = useCallback(async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error('Failed to claim');
      }

      const data = await response.json();
      toast.success(`Claim reward success! Transaction hash is ${data.tx_hash}`);
      console.log(data.tx_hash);
      localStorage.setItem('tx_hash', data.tx_hash);
      return data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { claim, isLoading };
};

export default useClaim;