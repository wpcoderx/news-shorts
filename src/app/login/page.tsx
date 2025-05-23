'use client';

import React from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container mx-auto p-4 flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Input type="email" placeholder="Email" className="mb-2" />
        <Input type="password" placeholder="Password" className="mb-4" />
        <Button className="w-full">Login</Button>
        <div className="mt-2 text-sm">
          Don't have an account?
          <Link href="/register" className="text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
