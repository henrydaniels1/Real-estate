import { createClient } from "@/lib/supabase/server"
import { PropertiesClient } from "../properties/properties-client"

export const metadata = {
  title: "Rent Properties | EverGreen",
  description: "Find your perfect rental property with EverGreen",
}

export default async function RentPage() {
  const supabase = await createClient()

  const { data: rawProperties, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "for_rent")
    .order("created_at", { ascending: false })

  // Map database fields to component expected format
  const properties = (rawProperties || []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    location: `${p.city}, ${p.country}`,
    address: p.address,
    property_type: p.property_type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    kitchens: p.kitchens,
    garages: p.garages,
    area: p.area_sqft,
    image_url: p.image_url,
    images: p.images || [],
    amenities: p.amenities || [],
    rating: p.rating,
    status: p.status,
  }))

  if (error) {
    console.error("Error fetching rental properties:", error)
  }

  // Get user and favorites
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let favorites: string[] = []
  if (user) {
    const { data: favData } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id)
    favorites = favData?.map((f) => f.property_id) || []
  }

  const userData = user
    ? {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
      }
    : null

  return (
    <PropertiesClient
      initialProperties={properties}
      initialFavorites={favorites}
      user={userData}
      pageTitle="Rental Properties"
      pageDescription="Find your perfect rental home"
      isRentPage={true}
    />
  )
}
