import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Blog | EverGreen",
  description: "Real estate news, tips, and insights from EverGreen experts",
}

export default async function BlogPage() {
  const supabase = await createClient()
  
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            EverGreen Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest real estate trends, market insights, and expert tips 
            to help you make informed property decisions.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts && posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {posts[0] && (
                <Card className="mb-12 overflow-hidden">
                  <div className="grid lg:grid-cols-2">
                    <div className="relative aspect-video lg:aspect-auto">
                      <Image
                        src={posts[0].image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"}
                        alt={posts[0].title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-4">{posts[0].category || "Featured"}</Badge>
                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        {posts[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {posts[0].excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {posts[0].author || "EverGreen Team"}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(posts[0].created_at)}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${posts[0].slug}`}
                        className="inline-flex items-center text-primary font-medium hover:underline"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              )}

              {/* Other Posts Grid */}
              {posts.length > 1 && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {posts.slice(1).map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-video">
                        <Image
                          src={post.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">
                          {post.category || "General"}
                        </Badge>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {formatDate(post.created_at)}
                          </span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-primary font-medium hover:underline"
                          >
                            Read More
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No blog posts available yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
