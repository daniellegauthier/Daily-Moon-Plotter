import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Daily Plotter</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Track Your Daily Activities <br className="hidden sm:inline" />
              Visualize Patterns Over Lunar Cycles
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Monitor your mood, productivity, colors worn, and food consumption. Discover patterns and insights over
              lunar cycles.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section className="container py-12">
          <h2 className="mb-8 text-2xl font-bold">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Daily Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Record your mood, productivity, colors worn, and food consumption each day.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lunar Cycle Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <p>View your data plotted over the lunar cycle to discover patterns related to moon phases.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Analyze how colors worn and other factors correlate with your mood and productivity.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Daily Plotter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

