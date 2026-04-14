import { createClient } from "@/lib/supabase/server"
import type { Property } from "@/types/property"

export async function fetchProperties(status?: string): Promise<Property[]> {
  const supabase = await createClient()

  let query = supabase.from("properties").select("*").order("created_at", { ascending: false })
  if (status) query = query.eq("status", status)

  const { data, error } = await query
  if (error) console.error("Error fetching properties:", error)

  return (data || []).map((p) => ({
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
}

export async function fetchUserAndFavorites() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, favorites: [] as string[] }

  const [{ data: favData }, { data: profile }] = await Promise.all([
    supabase.from("favorites").select("property_id").eq("user_id", user.id),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ])

  return {
    favorites: favData?.map((f) => f.property_id) || [] as string[],
    user: {
      id: user.id,
      email: user.email || "",
      name: profile?.full_name || user.email?.split("@")[0] || "User",
      avatarUrl: profile?.avatar_url,
    },
  }
}
