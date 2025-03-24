"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, History, Home, Settings, Users } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Users,
    admin: true,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  // In a real app, you would check if the user is an admin
  const isAdmin = true

  return (
    <nav className="grid items-start gap-2 py-4">
      {navItems.map((item) => {
        // Skip admin items for non-admin users
        if (item.admin && !isAdmin) return null

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}

