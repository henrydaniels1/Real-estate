import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BedDouble,
  Bath,
  ChefHat,
  Maximize,
  Car,
  Heart,
  Share2,
  MapPin,
  Star,
  Phone,
  Mail,
} from "lucide-react"
import { ListingsHeader } from "@/components/listings-header"
import { Footer } from "@/components/footer"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !property) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userData = null
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    userData = {
      name: profile?.full_name || user.email?.split("@")[0] || "User",
      email: user.email || "",
      avatarUrl: profile?.avatar_url,
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const amenities = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
    { icon: ChefHat, label: "Kitchen", value: property.kitchens || 2 },
    { icon: Maximize, label: "sqft", value: property.area_sqft?.toLocaleString() },
    { icon: Car, label: "Garage", value: property.garages || 1 },
  ]

  const images = property.images?.length > 0 
    ? property.images 
    : [property.image_url, property.image_url, property.image_url]

  return (
    <div className="min-h-screen bg-background">
      <ListingsHeader user={userData} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Back Button */}
        <Link
          href="/properties"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6 grid gap-4">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={property.image_url || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {property.property_type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {images.slice(0, 3).map((img: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="mb-6">
              <div className="mb-2 flex items-start justify-between">
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {property.rating?.toFixed(1) || "4.5"}
                  </span>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.city}, {property.country}</span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </span>
                {property.status === "for_rent" && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>

              {/* Amenities */}
              <div className="mb-6 flex flex-wrap gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2"
                  >
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {amenity.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {amenity.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  About this property
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {property.description ||
                    "Welcome to this beautiful property. Experience a peaceful escape at this modern retreat set on a quiet hillside with stunning views of valleys and starry nights. This property offers a perfect blend of comfort and style, making it ideal for families or professionals seeking a premium living experience."}
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  The property features modern architecture with spacious rooms,
                  natural lighting, and premium finishes throughout. The
                  open-plan living area seamlessly connects to a fully equipped
                  kitchen and dining space, perfect for entertaining guests.
                </p>
              </TabsContent>

              <TabsContent value="features">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Property Features
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(property.amenities || ["Garden", "Gym", "Garage", "Pool", "Security", "Air Conditioning"]).map(
                    (amenity: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {amenity}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="location">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Location
                </h2>
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="relative aspect-video bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {property.address}, {property.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Reviews
                </h2>
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this property.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Contact Agent */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-border">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                  Contact Agent
                </h3>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      John Doe
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Real Estate Agent
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>agent@estateease.com</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Schedule a Visit
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
