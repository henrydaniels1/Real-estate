import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!post) {
    return { title: "Post Not Found | EverGreen" }
  }

  return {
    title: `${post.title} | EverGreen Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!post) {
    notFound()
  }

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

      <article className="py-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Hero Image */}
          <div className="relative aspect-[21/9] mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.image_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4">{post.category || "General"}</Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author || "EverGreen Team"}
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.created_at)}
              </span>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-foreground">
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
              />
            </div>

            {/* Related Posts CTA */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Enjoyed this article?
                </h3>
                <Button asChild>
                  <Link href="/blog">Read More Articles</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
