import { PropertiesClient } from "./properties-client"
import { getFilterOptions } from "./actions"
import { fetchProperties, fetchUserAndFavorites } from "@/lib/properties"

export default async function PropertiesPage() {
  const [properties, { user, favorites }, filterOptions] = await Promise.all([
    fetchProperties(),
    fetchUserAndFavorites(),
    getFilterOptions(),
  ])

  return (
    <PropertiesClient
      initialProperties={properties}
      initialFavorites={favorites}
      user={user}
      filterOptions={filterOptions}
    />
  )
}
