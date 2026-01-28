"use client"

const stats = [
  { value: "15K+", label: "Properties Listed", description: "Across Indonesia" },
  { value: "8K+", label: "Happy Customers", description: "And counting" },
  { value: "200+", label: "Expert Agents", description: "Ready to help" },
  { value: "50+", label: "Cities Covered", description: "Nationwide presence" },
]

export function StatsSection() {
  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-foreground md:text-5xl">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-primary-foreground/90">
                {stat.label}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
