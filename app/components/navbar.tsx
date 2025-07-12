"use client"

import Link from 'next/link';
import { FaBrain } from 'react-icons/fa';
import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

const Navbar = () => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)

  return (
    <header className='w-full flex justify-between items-center shadow-lg p-4 bg-gradient-to-br from-[#00ADB5] to-[#787d87] text-white sticky top-0 z-50'>
      <div className='text-xl md:text-2xl font-bold flex items-center gap-2 ml-2 sm:ml-4 lg:ml-12'>
        <FaBrain className="text-white" />  
        <h1 className='hidden sm:block'>AI HealthPal</h1>
      </div>
      
      <nav className='flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4 lg:mr-12'>
        <div className='hidden sm:block'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-transparent hover:bg-[#00858d] border-white text-white hover:text-white"
              >
                AI Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              <DropdownMenuLabel className="font-semibold">AI Features</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
                className="cursor-pointer hover:bg-gray-100"
              >
                Symptom Checker
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
                disabled
                className="cursor-not-allowed opacity-70"
              >
                Prescription OCR
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Link href="/profile" passHref>
          <Button 
            className="bg-white text-[#00ADB5] hover:bg-gray-100 hover:text-[#00858d]"
          >
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">👤</span>
          </Button>
        </Link>
        
        {/* Mobile menu button (simplified for small screens) */}
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="bg-transparent hover:bg-[#00858d] border-white text-white"
              >
                ☰
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white mr-2">
              <DropdownMenuLabel className="font-semibold">Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
                className="cursor-pointer hover:bg-gray-100"
              >
                Symptom Checker
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
                disabled
                className="cursor-not-allowed opacity-70"
              >
                Prescription OCR
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  )
}

export default Navbar