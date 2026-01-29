import {
    Github,
    Linkedin,
    Link2,
    Mail,
    Code2,
    Server,
    Database,
    Smartphone,
    Globe,
    ArrowRight,
    ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const skills = [
    { name: "Frontend", icon: Code2, items: ["React", "Next.js", "TypeScript", "TailwindCSS"] },
    { name: "Backend", icon: Server, items: ["Node.js", "Express", "Go", "Python"] },
    { name: "Database", icon: Database, items: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] },
    { name: "Mobile", icon: Smartphone, items: ["React Native", "Flutter"] },
]

const projects = [
    {
        name: "ShortURL",
        description: "Modern URL shortener with analytics and QR code generation",
        tech: ["Next.js", "Supabase", "TailwindCSS"],
        link: "/",
    },
]

const socials = [
    { name: "GitHub", icon: Github, link: "https://github.com/4lifbima" },
    { name: "LinkedIn", icon: Linkedin, link: "https://linkedin.com/in/alif-bima-pradana" },
    { name: "Email", icon: Mail, link: "mailto:alifbima.dev@gmail.com" },
]

export default function DeveloperPage() {
    return (
        <div className="min-h-[calc(100vh-5rem)]">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative">
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-primary to-orange-600 p-1 shadow-2xl shadow-primary/30">
                                <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                                    <span className="text-6xl md:text-8xl font-bold gradient-text">AB</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <p className="text-primary font-semibold mb-2 tracking-wide uppercase text-sm">Fullstack Developer</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                                Alif Bima <span className="gradient-text">Pradana</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
                                Passionate about building modern, scalable web applications with clean code and exceptional user experiences. Transforming ideas into reality through technology.
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {socials.map((social) => (
                                    <Button key={social.name} variant="outline" size="lg" asChild className="rounded-xl gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all">
                                        <Link href={social.link} target="_blank">
                                            <social.icon className="h-5 w-5" />
                                            {social.name}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tech Stack</h2>
                        <p className="text-muted-foreground text-lg">Technologies I work with daily</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skills.map((skill) => (
                            <div key={skill.name} className="luxury-card rounded-2xl p-6 group hover:border-primary/30">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <skill.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{skill.name}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skill.items.map((item) => (
                                        <span key={item} className="px-3 py-1.5 bg-muted rounded-lg text-sm font-medium text-muted-foreground">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="py-20">
                <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
                        <p className="text-muted-foreground text-lg">Some of my recent work</p>
                    </div>

                    <div className="grid gap-6">
                        {projects.map((project) => (
                            <div key={project.name} className="luxury-card rounded-2xl p-6 sm:p-8 group">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                                        <p className="text-muted-foreground mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map((t) => (
                                                <span key={t} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <Button asChild className="rounded-xl gap-2 shrink-0">
                                        <Link href={project.link}>
                                            View Project
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary/10 via-transparent to-orange-500/10">
                <div className="container mx-auto px-6 lg:px-8 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to work together?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                        I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                    </p>
                    <Button size="lg" asChild className="rounded-xl px-8 gap-2 shadow-lg shadow-primary/20">
                        <Link href="mailto:alifbima@example.com">
                            Get In Touch
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t">
                <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center font-bold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Link2 className="h-4 w-4" />
                    </div>
                    <span className="text-xl ml-2">Shortify</span><span className="text-primary text-xl">URL</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} ShortURL. All rights reserved.
                    </p>
                </div>
                </div>
            </footer>
        </div>
    )
}
