import { createClient } from "@/lib/supabase/server"
import { PropertiesClient } from "./properties-client"

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data: rawProperties, error } = await supabase
    .from("properties")
    .select("*")
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let favorites: string[] = []
  let userData = null

  if (user) {
    const { data: favoritesData } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id)

    favorites = favoritesData?.map((f) => f.property_id) || []

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

  if (error) {
    console.error("Error fetching properties:", {
      message: error?.message || 'No message',
      details: error?.details || 'No details',
      hint: error?.hint || 'No hint',
      code: error?.code || 'No code',
      full_error: error,
      error_type: typeof error,
      error_keys: Object.keys(error || {})
    })
  }

  // Also log the raw response for debugging
  console.log("Raw properties response:", { data: rawProperties, error, count: rawProperties?.length })

  return (
    <PropertiesClient
      initialProperties={properties}
      initialFavorites={favorites}
      user={userData}
    />
  )
}
