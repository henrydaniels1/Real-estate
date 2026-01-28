"use client"

import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const stats = [
  { value: "15K+", label: "Properties Listed", description: "Across Indonesia" },
  { value: "8K+", label: "Happy Customers", description: "And counting" },
  { value: "200+", label: "Expert Agents", description: "Ready to help" },
  { value: "50+", label: "Cities Covered", description: "Nationwide presence" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export function StatsSection() {
  return (
    <section className="bg-blue-600 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="text-center group cursor-default"
            >
              <motion.div 
                className="mb-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl group-hover:text-blue-100 transition-colors"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <div className="text-lg font-medium text-white/90 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-white/70">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
