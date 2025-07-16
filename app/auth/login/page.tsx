"use client"

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

const SigninPage = () => {
  const { setUser, isExpired } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: ""
  });

  // Check for expired session on mount
  useEffect(() => {
    if (isExpired()) {
      useAuthStore.getState().clearUser();
    }
  }, [isExpired]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      if (response.status === 200) {
        toast.success("Login successful");
        
        // Make sure your backend returns the token in response.data.token
        setUser({
          ...response.data,
          token: response.data.token || response.headers['authorization']?.split(' ')[1]
        });
        console.log(response);
        
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 md:p-8'>
      <div className='w-full max-w-lg'>
        {/* Card Header */}
        <div className='bg-gradient-to-br from-[#04ced9] to-[#787d87] rounded-t-2xl p-6 text-center shadow-xl'>
          <div className='py-2'>
            <h1 className='text-3xl font-bold text-black'>Welcome to</h1>
            <h2 className='text-4xl font-extrabold text-white mt-2'>AI HealthPal</h2>
            <p className='text-gray-900 mt-3'>Login your account to get started</p>
          </div>
        </div>

        {/* Card Body */}
        <div className='bg-white shadow-2xl rounded-b-2xl p-6 md:p-8'>
          <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className='relative'>
              <label className='block text-gray-700 text-md font-medium mb-2' htmlFor='email'>
                Email
              </label>
              <div className='relative'>
                <FaEnvelope className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  id='email'
                  type='email'
                  placeholder='pavan@gmail.com'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent transition'
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className='relative'>
              <label className='block text-gray-700 text-md font-medium mb-2' htmlFor='password'>
                Password
              </label>
              <div className='relative'>
                <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent transition'
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-gradient-to-r from-[#00ADB5] to-[#393E46] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:ring-opacity-50'
            >
              Sign in
            </button>

            {/* Signup Link */}
            <div className='text-center text-md text-gray-500 mt-4'>
              Create an account?{' '}
              <Link href='/auth/register' className='text-[#00ADB5] font-medium hover:underline'>
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;