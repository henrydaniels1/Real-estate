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
import { PropertyDetailClient } from "./property-detail-client"

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
      id: user.id,
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
    <PropertyDetailClient 
      property={property}
      userData={userData}
      amenities={amenities}
      images={images}
      formatPrice={formatPrice}
    />
  )
}
