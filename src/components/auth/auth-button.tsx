'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">{user.email}</span>
      <Button onClick={handleLogout} size="sm">Logout</Button>
    </div>
  ) : (
    <Button onClick={handleLogin} size="sm">Login</Button>
  );
}
