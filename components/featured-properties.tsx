import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { FeaturedPropertiesGrid } from "./featured-properties-grid"

export async function FeaturedProperties() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <section className="bg-gray-50 py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-4">
          <div>
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-blue-600">
              Featured Properties
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl lg:text-5xl text-balance">
              Discover our handpicked selections
            </h2>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="group rounded-full bg-white border-gray-200 hover:border-blue-600 hover:bg-blue-50">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <FeaturedPropertiesGrid properties={properties || []} />
      </div>
    </section>
  )
}
