"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="bg-foreground py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-semibold text-background md:text-4xl lg:text-5xl text-balance">
            Ready to find your dream property?
          </h2>
          <p className="mb-8 max-w-2xl text-lg text-background/70">
            Whether you&apos;re buying, selling, or investing, we&apos;re here to help you every step of the way.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/properties">
              <Button
                size="lg"
                className="group rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sell">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-background/30 bg-transparent text-background hover:bg-background/10"
              >
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
