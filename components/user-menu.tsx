"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border border-gray-700 bg-muted hover:bg-gray-800 focus:ring-0 focus:ring-offset-0"
        >
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-5 w-5 text-[hsl(var(--neon-blue))]" />
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--neon-blue))] text-[10px] font-bold text-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {user.rank}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700 text-gray-200">
        <DropdownMenuLabel className="flex items-center gap-2">
          <User className="h-4 w-4 text-[hsl(var(--neon-blue))]" />
          <span>{user.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 focus:bg-gray-800 focus:text-white"
          onClick={handleProfile}
        >
          <User className="h-4 w-4 text-[hsl(var(--neon-green))]" />
          <span>Hunter Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 focus:bg-gray-800 focus:text-white"
          onClick={handleSettings}
        >
          <Settings className="h-4 w-4 text-[hsl(var(--neon-purple))]" />
          <span>System Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-[hsl(var(--neon-red))] focus:bg-gray-800 focus:text-[hsl(var(--neon-red))]"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
