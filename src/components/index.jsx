"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Grid3X3, TrendingUp } from "lucide-react"

export default function Menu() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Round 2 Test</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-200 justify-between">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-purple-100 rounded-full w-fit">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Fibonacci 100</CardTitle>
              <CardDescription>Find 100th fibonacci number</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/fib" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Show</Button>
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 justify-between">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-red-100 rounded-full w-fit">
                <Gamepad2 className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>Line 98</CardTitle>
              <CardDescription>Clone of <a href="https://www.line98.vn/v/line-98-co-dien" className="text-blue-500 underline">Line 98</a> </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/line98" className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700">Play</Button>
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200 justify-between">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 bg-green-100 rounded-full w-fit">
                <Grid3X3 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Caro Game</CardTitle>
              <CardDescription>X - O game</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/caro" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">Play</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
