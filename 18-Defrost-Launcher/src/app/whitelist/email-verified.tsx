'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmailVerified() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verificationStatus = searchParams.get('verificationStatus');
    const projectID = searchParams.get('projectID');

    if (verificationStatus && projectID) {
      // Store the verification status in localStorage
      localStorage.setItem('emailVerified', verificationStatus === 'success' ? 'true' : 'false');

      // Redirect to the specific project whitelist page
      router.push(`/whitelist/${projectID}`);
    } else {
      // If there's no status or projectID, redirect to a default page
      router.push('/');
    }
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader"></div>
    </div>
  );
}