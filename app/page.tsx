"use client"

import { useAuthStore } from '@/stores/useAuthStore';

export default function Home() {
  const { user } = useAuthStore();
  console.log(user);
  return (
    <div className="">
      <h1 className="text-3xl font-bold underline">
        {user ? (
          <p>Welcome, {user.name}!</p>
        ) : (
          <p>Please login</p>
        )}
      </h1>
    </div>
  );
}
