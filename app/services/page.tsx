import React from "react"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Home, 
  Key, 
  TrendingUp, 
  FileText, 
  Users, 
  Shield,
  ArrowRight,
  CheckCircle 
} from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Our Services | EverGreen",
  description: "Comprehensive real estate services for buying, selling, and renting properties",
}

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  key: Key,
  trending_up: TrendingUp,
  file_text: FileText,
  users: Users,
  shield: Shield,
}

const additionalServices = [
  {
    icon: FileText,
    title: "Legal Assistance",
    description: "Expert legal support for property transactions, contracts, and documentation.",
    features: ["Contract Review", "Title Verification", "Legal Documentation", "Dispute Resolution"],
  },
  {
    icon: TrendingUp,
    title: "Property Valuation",
    description: "Accurate market valuation to help you price your property competitively.",
    features: ["Market Analysis", "Comparative Studies", "Investment Potential", "Detailed Reports"],
  },
  {
    icon: Users,
    title: "Property Management",
    description: "Complete management services for rental property owners.",
    features: ["Tenant Screening", "Rent Collection", "Maintenance", "Financial Reporting"],
  },
  {
    icon: Shield,
    title: "Insurance Services",
    description: "Comprehensive property insurance options to protect your investment.",
    features: ["Home Insurance", "Landlord Insurance", "Tenant Insurance", "Natural Disaster Coverage"],
  },
]

export default async function ServicesPage() {
  const supabase = await createClient()
  
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("id")

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Our Services
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to your needs. From buying to selling, 
            we have got you covered every step of the way.
          </p>
        </div>
      </section>

      {/* Main Services from DB */}
      {services && services.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Core Services
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || Home
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild variant="link" className="p-0 text-primary">
                        <Link href="/contact">
                          Learn More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Additional Services */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Additional Services
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {additionalServices.map((service) => (
              <Card key={service.title}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="mb-2">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Contact us today to discuss how we can help you with your real estate needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                  <Link href="/properties">View Properties</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
