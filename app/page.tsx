import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Heart, Shield, Users } from "lucide-react"

// Custom Button component with brutal style
const BrutalButton = ({
  children,
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "white"
}) => {
  const baseStyles =
    "px-8 py-2 border-2 uppercase transition duration-200 text-sm font-bold tracking-wide shadow-brutal hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"

  const variantStyles = {
    primary:
      "border-[#002C5B] bg-[#002C5B] text-white shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)]",
    secondary:
      "border-[#002C5B] bg-[#EDFCA7] text-[#002C5B] shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)]",
    outline:
      "border-[#002C5B] bg-white text-[#002C5B] shadow-[1px_1px_rgba(0,44,91,0.8),2px_2px_rgba(0,44,91,0.8),3px_3px_rgba(0,44,91,0.8),4px_4px_rgba(0,44,91,0.8),5px_5px_0px_0px_rgba(0,44,91,0.8)]",
    white:
      "border-white bg-white text-[#002C5B] shadow-[1px_1px_rgba(255,255,255,0.8),2px_2px_rgba(255,255,255,0.8),3px_3px_rgba(255,255,255,0.8),4px_4px_rgba(255,255,255,0.8),5px_5px_0px_0px_rgba(255,255,255,0.8)]",
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Link component with brutal style
const BrutalLink = ({
  href = "#",
  children,
  className = "",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string
}) => {
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium text-[#002C5B] transition-all duration-200 
                 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#002C5B] 
                 after:transition-all after:duration-200 hover:after:w-full ${className}`}
      {...props}
    >
      {children}
    </Link>
  )
}

// Custom Section component with brutal style
const BrutalSection = ({
  children,
  className = "",
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  variant?: "default" | "alt" | "dark"
}) => {
  const variantStyles = {
    default: "bg-[#ECECE2]",
    alt: "bg-white",
    dark: "bg-[#002C5B] text-white",
  }

  return (
    <section className={`py-16 ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </section>
  )
}

// Custom Heading component with brutal style
const BrutalHeading = ({
  children,
  className = "",
  as: Component = "h2",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}) => {
  return (
    <Component
      className={`font-bold text-[#002C5B] uppercase tracking-tight relative inline-block ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#ECECE2]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#002C5B] bg-[#ECECE2] shadow-[0_4px_0_0_rgba(0,44,91,0.2)]">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-[#002C5B] bg-white shadow-[2px_2px_0_0_rgba(0,44,91,0.8)]">
              <Heart className="h-5 w-5 text-[#002C5B]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs font-medium text-[#002C5B] uppercase tracking-tight">Por una</span>
              <span className="text-lg font-bold text-[#002C5B] uppercase tracking-tight -mt-1">Causa Justa</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <BrutalLink href="#">Causas</BrutalLink>
            <BrutalLink href="#">Cómo funciona</BrutalLink>
            <BrutalLink href="#">Sobre nosotros</BrutalLink>
            <BrutalLink href="#">Contacto</BrutalLink>
          </nav>
          <div className="flex items-center gap-4">
            <BrutalButton variant="outline" className="hidden md:flex">
              Iniciar sesión
            </BrutalButton>
            <BrutalButton variant="primary">Registrarse</BrutalButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <BrutalSection className="relative overflow-hidden py-20 md:py-28">
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            <h1 className="max-w-3xl text-4xl font-bold uppercase tracking-tight text-[#002C5B] sm:text-5xl md:text-6xl border-b-4 border-[#EDFCA7] pb-2 mb-2">
              Conectando corazones con causas que importan
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[#002C5B] border-2 border-[#002C5B] bg-white p-4 shadow-[5px_5px_0_0_rgba(0,44,91,0.3)]">
              Ayuda a transformar vidas a través de donaciones seguras y transparentes. Cada contribución marca la
              diferencia en nuestra comunidad.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <BrutalButton variant="outline" className="text-base">
                Iniciar una causa
              </BrutalButton>
              <BrutalButton variant="secondary" className="text-base">
                Explorar causas
              </BrutalButton>
            </div>
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#000000]">
            <Image
              src="/banner2.png"
              alt="Personas ayudando en comunidad"
              fill
              className="object-cover opacity-20 "
              priority
            />
          </div>
        </BrutalSection>

        {/* Featured Campaigns Section */}
        <BrutalSection variant="alt" className="border-y-2 border-[#002C5B]">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <BrutalHeading className="text-3xl md:text-4xl">Causas destacadas</BrutalHeading>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
                Estas son algunas de las causas verificadas que necesitan tu apoyo ahora mismo
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden border-2 border-[#002C5B] bg-white transition-all transform  shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)]   "
                >
                  <div className="aspect-video overflow-hidden border-b-2 border-[#002C5B]">
                    <Image
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#002C5B] uppercase">{campaign.title}</h3>
                    <p className="mt-2 line-clamp-2 text-gray-600">{campaign.description}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold uppercase">${campaign.raised} recaudados</span>
                        <span className="text-gray-500">Meta: ${campaign.goal}</span>
                      </div>
                      <div className="h-4 w-full border-2 border-[#002C5B] bg-white">
                        <div
                          className="h-full bg-[#002C5B]"
                          style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <BrutalButton variant="secondary" className="mt-6 w-full">
                      Donar ahora
                    </BrutalButton>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <BrutalButton variant="outline" className="flex items-center justify-center mx-auto">
                Ver todas las causas
                <ArrowRight className="ml-2 h-4 w-4" />
              </BrutalButton>
            </div>
          </div>
        </BrutalSection>

        {/* Benefits Section */}
        <BrutalSection>
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <BrutalHeading className="text-3xl md:text-4xl">¿Por qué elegir Causa Justa?</BrutalHeading>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
                Nuestra plataforma está diseñada para brindar la mejor experiencia tanto para donantes como para
                organizaciones
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 border-2 border-[#002C5B] bg-white shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] transform transition-all duration-200"
                >
                  <div className="flex h-16 w-16 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] shadow-[3px_3px_0_0_rgba(0,44,91,0.8)]">
                    {benefit.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#002C5B] uppercase">{benefit.title}</h3>
                  <p className="mt-2 text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </BrutalSection>

        {/* Testimonials Section */}
        <BrutalSection variant="alt" className="border-y-2 border-[#002C5B]">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <BrutalHeading className="text-3xl md:text-4xl">Historias de impacto</BrutalHeading>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
                Conoce cómo tu ayuda transforma vidas en nuestra comunidad
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="border-2 border-[#002C5B] bg-white p-6 shadow-[5px_5px_0px_0px_rgba(0,44,91,0.8)] transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden border-2 border-[#002C5B] bg-gray-200 shadow-[2px_2px_0_0_rgba(0,44,91,0.8)]">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#002C5B] uppercase">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 border-l-2 border-[#EDFCA7] pl-3">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </BrutalSection>

        {/* How It Works Section */}
        <BrutalSection variant="default">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <BrutalHeading className="text-3xl md:text-4xl">Cómo funciona</BrutalHeading>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto pl-4 italic">
                En tres simples pasos puedes comenzar a ayudar o recibir apoyo para tu causa
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center border-2 border-[#002C5B] bg-[#EDFCA7] text-[#002C5B] text-2xl font-bold shadow-[3px_3px_0_0_rgba(0,44,91,0.8)]">
                    {index + 1}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-[#002C5B] uppercase">{step.title}</h3>
                  <p className="mt-2 text-[#002C5B] border-2 border-dashed border-[#002C5B] bg-white p-3">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BrutalSection>

        {/* CTA Section */}
        <BrutalSection variant="dark" className="border-y-2 border-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white uppercase md:text-4xl border-b-4 border-[#EDFCA7] pb-2 mb-2 inline-block">
              ¿Listo para hacer la diferencia?
            </h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto border-2 border-white p-4 shadow-[5px_5px_0_0_rgba(255,255,255,0.3)]">
              Únete a nuestra comunidad de donantes y organizaciones que están cambiando el mundo, una causa a la vez
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
              <button className="px-8 py-2 border-2 border-white uppercase bg-white text-[#002C5B] transition duration-200 font-bold tracking-wide shadow-[1px_1px_rgba(255,255,255,0.8),2px_2px_rgba(255,255,255,0.8),3px_3px_rgba(255,255,255,0.8),4px_4px_rgba(255,255,255,0.8),5px_5px_0px_0px_rgba(255,255,255,0.8)] hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] active:shadow-none text-base">
                Iniciar una causa
              </button>
              <button className="px-8 py-2 border-2 border-white uppercase bg-transparent text-white transition duration-200 font-bold tracking-wide shadow-[1px_1px_rgba(255,255,255,0.8),2px_2px_rgba(255,255,255,0.8),3px_3px_rgba(255,255,255,0.8),4px_4px_rgba(255,255,255,0.8),5px_5px_0px_0px_rgba(255,255,255,0.8)] hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none active:translate-x-[5px] active:translate-y-[5px] active:shadow-none text-base">
                Explorar causas
              </button>
            </div>
          </div>
        </BrutalSection>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#002C5B] bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center border-2 border-[#002C5B] bg-white shadow-[2px_2px_0_0_rgba(0,44,91,0.8)]">
                  <Heart className="h-5 w-5 text-[#002C5B]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#002C5B] uppercase tracking-tight">Por una</span>
                  <span className="text-lg font-bold text-[#002C5B] uppercase tracking-tight -mt-1">Causa Justa</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600 border-l-2 border-[#EDFCA7] pl-3">
                Conectando donantes con causas verificadas para crear un impacto positivo en la comunidad.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#002C5B] uppercase border-b-2 border-[#EDFCA7] pb-1 inline-block">
                Enlaces rápidos
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <BrutalLink href="#">Inicio</BrutalLink>
                </li>
                <li>
                  <BrutalLink href="#">Causas</BrutalLink>
                </li>
                <li>
                  <BrutalLink href="#">Cómo funciona</BrutalLink>
                </li>
                <li>
                  <BrutalLink href="#">Sobre nosotros</BrutalLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#002C5B] uppercase border-b-2 border-[#EDFCA7] pb-1 inline-block">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <BrutalLink href="#">Términos de servicio</BrutalLink>
                </li>
                <li>
                  <BrutalLink href="#">Política de privacidad</BrutalLink>
                </li>
                <li>
                  <BrutalLink href="#">Política de cookies</BrutalLink>
                </li>
                <li>
                  <BrutalLink href="#">FAQ</BrutalLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-[#002C5B] uppercase border-b-2 border-[#EDFCA7] pb-1 inline-block">
                Contacto
              </h3>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-600 border-l-2 border-[#002C5B] pl-2">info@Causa Justa.com</li>
                <li className="text-gray-600 border-l-2 border-[#002C5B] pl-2">+54 11 1234 5678</li>
                <li className="text-gray-600 border-l-2 border-[#002C5B] pl-2">Buenos Aires, Argentina</li>
              </ul>
              <div className="mt-4 flex gap-4">
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="flex h-8 w-8 items-center justify-center border-2 border-[#002C5B] bg-white text-[#002C5B] shadow-[2px_2px_0_0_rgba(0,44,91,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
                  >
                    <span className="sr-only">{social}</span>
                    {social === "Facebook" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    )}
                    {social === "Twitter" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    )}
                    {social === "Instagram" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    )}
                    {social === "LinkedIn" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 border-t-2 border-[#002C5B] pt-8 text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} <span className="font-bold uppercase">Causa Justa</span>. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sample data
const campaigns = [
  {
    title: "Reconstrucción escuela rural",
    description:
      "Ayuda a reconstruir una escuela rural dañada por las inundaciones recientes en la provincia de Córdoba.",
    image: "/placeholder.svg?height=225&width=400",
    raised: 15000,
    goal: 25000,
  },
  {
    title: "Equipamiento médico para hospital",
    description: "Contribuye a la compra de equipamiento médico esencial para el Hospital Infantil de Buenos Aires.",
    image: "/placeholder.svg?height=225&width=400",
    raised: 28000,
    goal: 30000,
  },
  {
    title: "Alimentos para comedores comunitarios",
    description:
      "Tu donación ayudará a proveer alimentos a 10 comedores comunitarios que asisten a más de 500 niños diariamente.",
    image: "/placeholder.svg?height=225&width=400",
    raised: 12000,
    goal: 20000,
  },
]

const benefits = [
  {
    title: "100% Transparente",
    description: "Seguimiento detallado de cada donación y reportes periódicos sobre el uso de los fondos.",
    icon: <Shield className="h-8 w-8 text-[#002C5B]" />,
  },
  {
    title: "Causas verificadas",
    description: "Todas las organizaciones y causas pasan por un riguroso proceso de verificación.",
    icon: <CheckCircle className="h-8 w-8 text-[#002C5B]" />,
  },
  {
    title: "Comunidad solidaria",
    description: "Forma parte de una comunidad comprometida con el cambio social positivo.",
    icon: <Users className="h-8 w-8 text-[#002C5B]" />,
  },
]

const testimonials = [
  {
    name: "María González",
    role: "Directora de Escuela",
    quote:
      "Gracias a las donaciones recibidas a través de Causa Justa, pudimos reconstruir nuestra escuela después de las inundaciones. El proceso fue transparente y eficiente.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Carlos Rodríguez",
    role: "Donante recurrente",
    quote:
      "Me encanta la transparencia de Causa Justa. Puedo ver exactamente cómo se utilizan mis donaciones y el impacto que generan en la comunidad.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Laura Méndez",
    role: "Voluntaria",
    quote:
      "Como voluntaria, he visto de primera mano cómo las donaciones transforman vidas. Causa Justa hace que el proceso sea simple tanto para donantes como para organizaciones.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
]

const steps = [
  {
    title: "Regístrate",
    description: "Crea una cuenta gratuita en nuestra plataforma en menos de 2 minutos.",
  },
  {
    title: "Elige una causa",
    description: "Explora las causas verificadas o inicia tu propia campaña de recaudación.",
  },
  {
    title: "Haz la diferencia",
    description: "Dona de forma segura y recibe actualizaciones sobre el impacto de tu contribución.",
  },
]
