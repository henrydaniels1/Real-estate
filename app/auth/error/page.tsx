import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="mx-auto flex items-center gap-2 text-foreground"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">EverGreen</span>
          </Link>

          <Card className="border-border">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Authentication Error
              </CardTitle>
              <CardDescription>
                Something went wrong during authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {params?.error ? (
                <p className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  Error: {params.error}
                </p>
              ) : (
                <p className="mb-6 text-sm text-muted-foreground">
                  An unspecified error occurred during the authentication
                  process. Please try again.
                </p>
              )}
              <div className="flex flex-col gap-3">
                <Link href="/auth/login">
                  <Button className="w-full rounded-full bg-primary text-primary-foreground">
                    Try again
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-border bg-transparent"
                  >
                    Go to homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
