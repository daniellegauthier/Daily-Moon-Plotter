"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  // Update the useState hooks to pre-fill the admin credentials
  const [email, setEmail] = useState("danielle.gauthier6@gmail.com")
  const [password, setPassword] = useState("President0erd!")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Update the handleSubmit function to check for the new admin email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login API call
    setTimeout(() => {
      // In a real app, you would validate credentials with your backend
      if (email === "danielle.gauthier6@gmail.com" && password === "President0erd!") {
        // Store user info in localStorage for demo purposes
        const userData = {
          name: "Dani Gauthier",
          email: "danielle.gauthier6@gmail.com",
          role: "admin",
          isLoggedIn: true,
        }

        localStorage.setItem("userData", JSON.stringify(userData))

        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        })
        router.push("/admin")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

