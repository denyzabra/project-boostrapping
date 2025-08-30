import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container py-10">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Create and Share Polls Easily
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create polls, share with friends, and get instant results. Simple, fast, and free.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/polls">
                <Button size="lg">Browse Polls</Button>
              </Link>
              <Link href="/polls/create">
                <Button variant="outline" size="lg">Create Poll</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Everything You Need for Polling
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides all the tools you need to create, share, and analyze polls.
              </p>
            </div>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Easy Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create polls in seconds with our intuitive interface. Add multiple options and customize your poll.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>See results update in real-time as people vote. Visual charts make it easy to understand the data.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Secure Voting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Our platform ensures one vote per user, maintaining the integrity of your poll results.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Polling App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
