import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ListingsHeader } from "@/components/listings-header"
import { Footer } from "@/components/footer"
import { FavoritesPageClient } from "./favorites-page-client"

export default async function FavoritesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/favorites")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const userData = {
    id: user.id,
    name: profile?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatarUrl: profile?.avatar_url,
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select("property_id, properties(*)")
    .eq("user_id", user.id)

  const favoriteProperties =
    favorites
      ?.map((f) => {
        const p = f.properties as any
        if (!p) return null
        return {
          id: p.id,
          title: p.title,
          location: `${p.city}, ${p.country}`,
          address: p.address,
          price: p.price,
          rating: p.rating,
          image_url: p.image_url,
          property_type: p.property_type,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area_sqft,
          status: p.status,
        }
      })
      .filter(Boolean) || []

  return (
    <FavoritesPageClient
      userData={userData}
      favoriteProperties={favoriteProperties as any[]}
      userId={user.id}
    />
  )
}
