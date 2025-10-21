"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Interactive background element - placeholder for future background animations */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-background via-background to-secondary/10"
        aria-label="Interactive background element"
      />

      {/* Hero content */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-start pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Spin up and Spin down a container for{" "}
            <span className="text-primary">railway.com</span>
          </h1>

          {/* CTA Button */}
          <div className="flex justify-center pt-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6 h-auto"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
