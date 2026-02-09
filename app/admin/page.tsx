import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, FileText, MessageSquare, Heart, Mail } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!adminUser) {
    redirect("/")
  }

  // Fetch stats
  const [
    propertiesResult,
    usersResult,
    blogResult,
    testimonialsResult,
    favoritesResult,
    inquiriesResult,
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("favorites").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
  ])

  const propertiesCount = propertiesResult.count || 0
  const usersCount = usersResult.count || 0
  const blogCount = blogResult.count || 0
  const testimonialsCount = testimonialsResult.count || 0
  const favoritesCount = favoritesResult.count || 0
  const inquiriesCount = inquiriesResult.count || 0

  // Fetch recent properties
  const { data: recentProperties } = await supabase
    .from("properties")
    .select("id, title, price, city, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch recent inquiries
  const { data: recentInquiries } = await supabase
    .from("inquiries")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Total Properties",
      value: propertiesCount,
      icon: Building2,
      href: "/admin/properties",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Registered Users",
      value: usersCount,
      icon: Users,
      href: "/admin/users",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Blog Posts",
      value: blogCount,
      icon: FileText,
      href: "/admin/blog",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Testimonials",
      value: testimonialsCount,
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Total Favorites",
      value: favoritesCount,
      icon: Heart,
      href: "/admin/properties",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Inquiries",
      value: inquiriesCount,
      icon: Mail,
      href: "/admin/inquiries",
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {adminUser.role === "super_admin" ? "Super Admin" : "Admin"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties?.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-muted-foreground">{property.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      ${property.price?.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(property.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentProperties || recentProperties.length === 0) && (
                <p className="text-center text-muted-foreground">No properties yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries?.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {inquiry.message?.substring(0, 50)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentInquiries || recentInquiries.length === 0) && (
                <p className="text-center text-muted-foreground">No inquiries yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
