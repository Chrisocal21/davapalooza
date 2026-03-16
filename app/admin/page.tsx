'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // TODO: Wire to actual auth API
    if (password === 'admin') {
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display text-primary mb-2">
            Admin Access
          </h1>
          <p className="text-muted">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary transition-colors"
              autoFocus
              required
            />
            {error && (
              <p className="text-danger text-sm mt-2">{error}</p>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  )
}
