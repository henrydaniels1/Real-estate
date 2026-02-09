"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  initials: string
}

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3)
        
        if (data && !error) {
          setTestimonials(data.map(t => ({
            ...t,
            initials: t.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
          })))
        }
      } catch (error) {
        console.log('Using default testimonials')
      }
    }

    fetchTestimonials()
  }, [supabase])

  useEffect(() => {
    const currentSectionRef = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, [])

  return (
    <section ref={sectionRef} className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-primary"
          >
            Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4 text-3xl font-semibold text-foreground md:text-4xl text-balance"
          >
            What our clients say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Join thousands of satisfied customers who found their perfect property with us
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              whileHover={{ y: -5 }}
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
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">No testimonials available at the moment.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
