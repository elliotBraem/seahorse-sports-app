import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_layout/_unauthenticated/')({
  component: RouteComponent,
})

/**
 * Landing Screen
 * First time coming to the app, not authenticated
 */
function RouteComponent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setIsVisible(true)
  }, [])

  return (
    <div className={`flex min-h-[100dvh] items-center justify-center p-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className="max-w-md w-full">
        <CardContent className="space-y-8 pt-6">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to Fanclub
            </h1>
            <p className="text-muted-foreground text-lg">
              Your ultimate platform for engaging with your favorite artists
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">🎯 Complete Quests</h2>
              <p className="text-muted-foreground">
                Engage in exciting challenges and earn rewards while supporting your artists
              </p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">🏆 Climb Leaderboards</h2>
              <p className="text-muted-foreground">
                Compete with other fans and showcase your dedication
              </p>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">👤 Personalized Profile</h2>
              <p className="text-muted-foreground">
                Track your achievements and build your fan identity
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div>
            <Link to="/login">
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Join thousands of fans already on the platform
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
