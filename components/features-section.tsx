"use client"

import { Home, Shield, TrendingUp, Users } from "lucide-react"

const features = [
  {
    icon: Home,
    title: "Wide Property Selection",
    description:
      "Browse thousands of properties from houses, apartments, villas to commercial spaces across Indonesia.",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "All properties are verified by our team to ensure authenticity and protect your investment.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description:
      "Get real-time market data and trends to make informed decisions about your property investment.",
  },
  {
    icon: Users,
    title: "Expert Agents",
    description:
      "Connect with certified real estate agents who provide personalized guidance throughout your journey.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            Why Choose Us
          </span>
          <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl text-balance">
            The smarter way to buy and sell property
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We combine technology with expertise to deliver a seamless real estate experience
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
