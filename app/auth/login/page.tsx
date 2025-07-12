"use client"

import Link from 'next/link';
import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaLock, FaVenusMars, FaBirthdayCake } from 'react-icons/fa'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from "sonner"

interface SignupFormData {
    email: string;
    password: string;
}

interface ApiResponse {
    data: any;
    status: number;
    statusText: string;
    request?: any;
    userId: string;
    name: string;
    role: string;

}

const SigninPage = () => {
    const { setUser } = useAuthStore();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    interface ChangeEventType extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> { }

    console.log(formData);

    const handleChange = (e: ChangeEventType) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response: ApiResponse = await axios.post(
                `http://localhost:5000/api/auth/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (response.status == 200) {
                toast("User login is successfuly")
                setUser(
                    response.data
                )
                router.push("/")
            }
            console.log(formData);
            console.log(response);
        } catch (error: any) {
            toast(error?.response?.data?.message || error?.message || "An error occurred")
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center  p-4 md:p-8'>
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


                        <button
                            type='submit'
                            className='w-full bg-gradient-to-r from-[#00ADB5] to-[#393E46] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:ring-opacity-50'
                        >
                            sign in
                        </button>


                        <div className='text-center text-md text-gray-500 mt-4'>
                            create a account?{' '}
                            <Link href='/auth/register' className='text-[#00ADB5] font-medium hover:underline'>
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SigninPage