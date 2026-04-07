import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';

interface GoogleSignInButtonProps {
  onSuccess: (userData: any) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for Google script to load
    const initializeGoogle = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
        });
      }
    };

    // Check if Google script is already loaded
    if (document.readyState === 'complete') {
      initializeGoogle();
    } else {
      window.addEventListener('load', initializeGoogle);
      return () => window.removeEventListener('load', initializeGoogle);
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Send Google token to backend
      const result = await authAPI.googleAuth(response.credential);
      
      // Save token and user data
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      toast.success('Signed in with Google successfully! 🎉');
      onSuccess(result.data);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(error.response?.data?.message || 'Google sign in failed');
    }
  };

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full flex justify-center" />
    </div>
  );
}
