"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Home Buyer",
    content:
      "EverGreen made finding our dream home so easy. The verified listings gave us confidence, and our agent was incredibly helpful throughout the process.",
    rating: 5,
    initials: "SC",
  },
  {
    name: "Michael Wijaya",
    role: "Property Investor",
    content:
      "The market insights feature helped me make smart investment decisions. I've purchased three properties through EverGreen and couldn't be happier.",
    rating: 5,
    initials: "MW",
  },
  {
    name: "Putri Rahmawati",
    role: "First-time Seller",
    content:
      "Selling my apartment was stress-free with EverGreen. They handled everything professionally and got me a great price in just two weeks.",
    rating: 5,
    initials: "PR",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary">
            Testimonials
          </span>
          <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl text-balance">
            What our clients say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="mb-6 text-card-foreground leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-card-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
