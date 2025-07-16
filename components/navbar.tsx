"use client"

import Link from 'next/link';
import { FaBrain, FaUser, FaCalendarAlt, FaClinicMedical, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard, MdMedicalServices } from 'react-icons/md';
import * as React from "react"
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

const Navbar = () => {
  const router = useRouter();
  const { user} = useAuthStore();

  const handleLogout = () => {
    //logout();
    toast.success("Logged out successfully");
    router.push('/');
  };

  return (
    <header className='w-full bg-gradient-to-br from-[#04ced9] to-[#787d87] text-white sticky top-0 z-50 border-b border-white/10'>
      <div className='container mx-auto flex justify-between items-center p-4'>
        {/* Logo Section */}
        <Link href="/" className='flex items-center gap-3 group'>
          <div className='p-2 bg-white rounded-lg group-hover:rotate-12 transition-transform'>
            <FaBrain className="text-[#00ADB5] text-xl" />
          </div>
          <h1 className='text-xl font-bold hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80'>
            AI HealthPal
          </h1>
        </Link>
        
        {/* Navigation */}
        <nav className='flex items-center gap-4'>
          {/* Main Features Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white gap-1">
                <MdMedicalServices className="text-lg" />
                <span className="hidden md:inline">Services</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#393E46] border border-white/10 text-white">
              <DropdownMenuLabel>AI Health Tools</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="hover:bg-[#00ADB5] cursor-pointer"
                  onClick={() => router.push('/symptom-checker')}
                >
                  <FaClinicMedical className="mr-2" />
                  Symptom Checker
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-[#00ADB5] cursor-pointer"
                  onClick={() => router.push('/prescription-analyzer')}
                >
                  <FaCalendarAlt className="mr-2" />
                  Prescription Analyzer
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-[#00ADB5] cursor-pointer"
                  onClick={() => router.push('/book/appointments')}
                >
                  <FaCalendarAlt className="mr-2" />
                  Booking Appointments
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role-Specific Navigation */}
          {user?.role === 'doctor' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white gap-1">
                  <FaClinicMedical className="text-lg" />
                  <span className="hidden md:inline">Doctor</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#393E46] border border-white/10 text-white">
                <DropdownMenuLabel>Doctor Dashboard</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="hover:bg-[#00ADB5] cursor-pointer"
                    onClick={() => router.push('/doctor/appointments')}
                  >
                    <FaCalendarAlt className="mr-2" />
                    My Appointments
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-[#00ADB5] cursor-pointer"
                    onClick={() => router.push('/doctor/patients')}
                  >
                    <FaUser className="mr-2" />
                    My Patients
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user?.role === 'admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white gap-1">
                  <FaCog className="text-lg" />
                  <span className="hidden md:inline">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#393E46] border border-white/10 text-white">
                <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    className="hover:bg-[#00ADB5] cursor-pointer"
                    onClick={() => router.push('/admin/users')}
                  >
                    <FaUser className="mr-2" />
                    User Management
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-[#00ADB5] cursor-pointer"
                    onClick={() => router.push('/admin/analytics')}
                  >
                    <MdDashboard className="mr-2" />
                    System Analytics
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback className="bg-[#00ADB5] text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#393E46] border border-white/10 text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  className="hover:bg-[#00ADB5] cursor-pointer"
                  onClick={() => router.push('/profile')}
                >
                  <FaUser className="mr-2" />
                  Profile
                </DropdownMenuItem>
                {user.role === 'user' && (
                  <DropdownMenuItem 
                    className="hover:bg-[#00ADB5] cursor-pointer"
                    onClick={() => router.push('/appointments')}
                  >
                    <FaCalendarAlt className="mr-2" />
                    My Appointments
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login" passHref>
              <Button 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white gap-1"
              >
                <FaUser className="text-sm" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar