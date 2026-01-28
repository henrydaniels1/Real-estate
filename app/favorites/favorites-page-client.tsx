"use client"

import { motion } from "framer-motion"
import { ListingsHeader } from "@/components/listings-header"
import { Footer } from "@/components/footer"
import { FavoritesClient } from "./favorites-client"

interface FavoritesPageClientProps {
  userData: any
  favoriteProperties: any[]
  userId: string
}

export function FavoritesPageClient({
  userData,
  favoriteProperties,
  userId,
}: FavoritesPageClientProps) {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ListingsHeader user={userData} activeTab="favorites" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Your Favorites
          </h1>
          <p className="mb-8 text-muted-foreground">
            Properties you have saved for later
          </p>
        </motion.div>

        {favoriteProperties.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <p className="mb-2 text-lg font-medium text-foreground">
                No favorites yet
              </p>
              <p className="text-sm text-muted-foreground">
                Start browsing properties and save your favorites here.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <FavoritesClient
              initialProperties={favoriteProperties}
              userId={userId}
            />
          </motion.div>
        )}
      </div>
      <Footer />
    </motion.div>
  )
}