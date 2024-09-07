'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { loginUser, LoginResponse } from '@/api/api'
import { storeUserData, isAuthenticated } from '@/lib/userUtils'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from '@/lib/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { setAuthStatus } = useAuth() // Correctly destructure setAuthStatus from useAuth

  useEffect(() => {
    // Check if the user is already authenticated
    if (isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      const data: LoginResponse = await loginUser(email, password)
      console.log('Login successful:', data)
      
      storeUserData({
        user: data.user,
        token: data.token,
        tokenExpiry: new Date(Date.now() + parseExpiresIn(data.expiresIn)).toISOString()
      })

      setAuthStatus(true, data.user)  // Update the global auth state

      toast({
        title: "Success",
        description: `Welcome back, ${data.user.firstName}!`,
      })
      router.push('/dashboard')
    } catch (error: unknown) {
      console.error('Login error:', error)
      let errorMessage = "An error occurred during login."

      if (error instanceof Error) {
        errorMessage = error.message
      }

      // Check if it's an ApiError
      if (typeof error === 'object' && error !== null && 'status' in error) {
        const apiError = error as { status: number, message: string };
        if (apiError.status === 401) {
          setLoginError("Incorrect email or password. Please try again.")
        } else {
          errorMessage = apiError.message || errorMessage
        }
      }

      // Check for network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If the user is authenticated, don't render the login form
  if (isAuthenticated()) {
    return null; // or you could return a loading indicator
  }

  const parseExpiresIn = (expiresIn: string): number => {
    const unit = expiresIn.slice(-1)
    const value = parseInt(expiresIn.slice(0, -1))
    switch(unit) {
      case 'h': return value * 60 * 60 * 1000
      case 'm': return value * 60 * 1000
      case 's': return value * 1000
      default: return 0
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full">
            <Button variant="ghost" onClick={() => console.log('Forgot password clicked')}>
              Forgot password?
            </Button>
            <Button variant="ghost" onClick={() => console.log('Sign up clicked')}>
              Sign up
            </Button>
          </div>
          <div className="flex justify-center space-x-4 w-full">
            <Button variant="outline" size="icon" onClick={() => console.log('GitHub login clicked')}>
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => console.log('Twitter login clicked')}>
              <Twitter className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}