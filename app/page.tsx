'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Shirt, User, LogIn } from 'lucide-react';
import { useAuth } from '../lib/firebase';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/explore');
    }
  }, [user, loading, router]);

  // handleLogout removed because logout is handled elsewhere; keep router logic minimal

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to explore
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 pt-11 pb-8">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-8">
        <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center">
          <Shirt className="text-white" size={24} />
        </div>
      </div> */}

      {/* Hero Image */}
      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="w-60 h-80 bg-gradient-to-br from-primary-orange to-orange-300 rounded-[16px] flex items-center justify-center">
          <Shirt className="text-white" size={120} />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-2">Find the Best</h1>
      <p className="text-lg text-gray-600 text-center mb-8">Collections for you</p>

      {/* Buttons */}
      <Button onClick={() => router.push('/login')} className="w-full mb-4 button-primary flex items-center justify-center">
        <LogIn className="mr-2" size={18} />
        Login
      </Button>
      <Button onClick={() => router.push('/signup')} className="w-full button-outline flex items-center justify-center">
        <User className="mr-2" size={18} />
        Sign Up
      </Button>
    </div>
  );
}