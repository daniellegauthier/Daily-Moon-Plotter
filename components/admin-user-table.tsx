"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    entriesCount: 28,
    lastActive: "2023-05-01",
    avgMood: 7.2,
    avgProductivity: 6.8,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    entriesCount: 15,
    lastActive: "2023-05-03",
    avgMood: 8.1,
    avgProductivity: 7.5,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    entriesCount: 22,
    lastActive: "2023-04-29",
    avgMood: 6.5,
    avgProductivity: 7.2,
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.williams@example.com",
    entriesCount: 10,
    lastActive: "2023-05-02",
    avgMood: 7.8,
    avgProductivity: 8.3,
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    entriesCount: 18,
    lastActive: "2023-04-30",
    avgMood: 6.9,
    avgProductivity: 6.2,
  },
]

export function AdminUserTable() {
  const [users, setUsers] = useState(sampleUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Entries</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Avg. Mood</TableHead>
            <TableHead>Avg. Productivity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.entriesCount}</TableCell>
              <TableCell>{user.lastActive}</TableCell>
              <TableCell>{user.avgMood.toFixed(1)}</TableCell>
              <TableCell>{user.avgProductivity.toFixed(1)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

