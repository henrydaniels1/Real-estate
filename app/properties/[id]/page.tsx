import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PropertyDetailClient } from "./property-detail-client"
import { checkIsFavorite } from "./actions"

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

  const { data: { user } } = await supabase.auth.getUser()

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

  const amenities = [
    { label: "Bedrooms", value: property.bedrooms },
    { label: "Bathrooms", value: property.bathrooms },
    { label: "Kitchen", value: property.kitchens || 1 },
    { label: "sqft", value: property.area_sqft?.toLocaleString() },
    { label: "Garage", value: property.garages || 0 },
  ]

  const images = property.images?.length > 0 
    ? [property.image_url, ...property.images].filter(Boolean)
    : [property.image_url]

  const isFavorite = await checkIsFavorite(id)

  return (
    <PropertyDetailClient 
      property={property}
      userData={userData}
      amenities={amenities}
      images={images}
      isFavorite={isFavorite}
    />
  )
}
