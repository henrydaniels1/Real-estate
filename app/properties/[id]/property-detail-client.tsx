"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  MapPin,
  Star,
  Phone,
  Mail,
  BedDouble,
  Bath,
  ChefHat,
  Maximize,
  Car,
} from "lucide-react"
import { ListingsHeader } from "@/components/listings-header"
import { Footer } from "@/components/footer"
import { toggleFavorite } from "./actions"

interface PropertyDetailClientProps {
  property: any
  userData: any
  amenities: { label: string; value: any }[]
  images: string[]
  isFavorite: boolean
}

const iconMap: Record<string, any> = {
  Bedrooms: BedDouble,
  Bathrooms: Bath,
  Kitchen: ChefHat,
  sqft: Maximize,
  Garage: Car,
}

export function PropertyDetailClient({
  property,
  userData,
  amenities,
  images,
  isFavorite: initialIsFavorite,
}: PropertyDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFavoriteToggle = async () => {
    if (!userData) {
      toast({
        title: "Authentication required",
        description: "Please log in to add properties to favorites.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await toggleFavorite(property.id)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setIsFavorite(result.isFavorite)
        toast({
          title: result.isFavorite ? "Added to favorites" : "Removed from favorites",
          description: result.isFavorite 
            ? "Property has been added to your favorites." 
            : "Property has been removed from your favorites.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = property.title
    const text = `Check out this amazing property: ${title}`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (error) {
        // User cancelled sharing or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Property link has been copied to your clipboard.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDownload = async () => {
    try {
      const imageUrl = images[selectedImage]
      if (!imageUrl) {
        toast({
          title: "Error",
          description: "No image available to download.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_image_${selectedImage + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Download started",
        description: "Image is being downloaded to your device.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      })
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
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ListingsHeader user={userData} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/properties"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Image Gallery */}
            <div className="mb-6 grid gap-4">
              <motion.div 
                className="relative aspect-video overflow-hidden rounded-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Badge className="bg-primary text-primary-foreground">
                      {property.property_type}
                    </Badge>
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
                      onClick={handleFavoriteToggle}
                      disabled={isLoading}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
              <div className="grid grid-cols-3 gap-4">
                {images.slice(0, 6).map((img: string, index: number) => (
                  <motion.div
                    key={index}
                    className={`relative aspect-video overflow-hidden rounded-lg cursor-pointer border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-primary/20" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
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
                {amenities.map((amenity, index) => {
                  const Icon = iconMap[amenity.label]
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      <span className="font-medium text-foreground">
                        {amenity.value}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {amenity.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
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
                  
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-2 font-semibold text-foreground">Property Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium text-foreground capitalize">{property.property_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium text-foreground capitalize">{property.status.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Area:</span>
                          <span className="font-medium text-foreground">{property.area_sqft?.toLocaleString()} sqft</span>
                        </div>
                        {property.state && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">State:</span>
                            <span className="font-medium text-foreground">{property.state}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-border p-4">
                      <h3 className="mb-2 font-semibold text-foreground">Location</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-medium text-foreground text-right">{property.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">City:</span>
                          <span className="font-medium text-foreground">{property.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country:</span>
                          <span className="font-medium text-foreground">{property.country}</span>
                        </div>
                        {(property.latitude && property.longitude) && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Coordinates:</span>
                            <span className="font-medium text-foreground text-xs">{property.latitude}, {property.longitude}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Property Features & Amenities
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(property.amenities || ["Garden", "Gym", "Garage", "Pool", "Security", "Air Conditioning"]).map(
                      (amenity: string, index: number) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-3 rounded-lg border border-border p-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">
                            {amenity}
                          </span>
                        </motion.div>
                      )
                    )}
                  </div>
                  
                  <div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-3 font-semibold text-foreground">Room Details</h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{property.bedrooms}</span>
                        <span className="text-sm text-muted-foreground">Bedrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{property.bathrooms}</span>
                        <span className="text-sm text-muted-foreground">Bathrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{property.kitchens || 1}</span>
                        <span className="text-sm text-muted-foreground">Kitchens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{property.garages || 0}</span>
                        <span className="text-sm text-muted-foreground">Garages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{property.area_sqft?.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">Sq Ft</span>
                      </div>
                    </div>
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
            </motion.div>
          </motion.div>

          {/* Sidebar - Contact Agent */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="sticky top-24 border-border">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                  Contact Agent
                </h3>
                <div className="mb-6 flex items-center gap-4">
                  <motion.div 
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    JD
                  </motion.div>
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Schedule a Visit
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                    >
                      Send Message
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </motion.div>
  )
}