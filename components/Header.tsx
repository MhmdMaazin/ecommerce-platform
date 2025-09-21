'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/firebase';
import { Button } from './ui/button';
import { LogOut, LogIn, UserPlus } from 'lucide-react';
import { signOutUser } from '../lib/firebase';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.replace('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">EcomStore</h1>
        <div className="flex gap-2">
          {user ? (
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => router.push('/login')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogIn size={18} />
                Login
              </Button>
              <Button 
                onClick={() => router.push('/signup')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <UserPlus size={18} />
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}