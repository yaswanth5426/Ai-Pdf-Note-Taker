"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <Image src="/logo.svg" alt="logo" width={140} height={50} />
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-black transition">Features</a>
          <a href="#pricing" className="hover:text-black transition">Pricing</a>
          <a href="#testimonials" className="hover:text-black transition">Testimonials</a>
        </div>
        <Link href="/sign-in">
          <Button className="rounded-full px-6">Get Started</Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          AI-Powered PDF Notes
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight max-w-4xl">
          Simplify <span className="text-red-500">PDF</span>{" "}
          <span className="text-blue-500">Note</span>-Taking
          <br />with AI-Powered
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl">
          Elevate your note-taking experience with our AI-powered PDF app.
          Seamlessly extract key insights, summaries, and annotations from any
          PDF with just a few clicks.
        </p>
        <div className="flex gap-4 mt-10">
          <Link href="/sign-in">
            <Button className="rounded-full px-8 py-6 text-base">Get started</Button>
          </Link>
          <a href="#features">
            <Button variant="outline" className="rounded-full px-8 py-6 text-base">
              Learn more
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need</h2>
          <p className="text-gray-500 mb-14">Powerful features to supercharge your PDF workflow</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📄",
                title: "Upload any PDF",
                desc: "Upload and store unlimited PDFs securely in the cloud with instant access.",
              },
              {
                icon: "🤖",
                title: "Ask AI questions",
                desc: "Chat with your PDF using AI. Get instant answers from your documents.",
              },
              {
                icon: "📝",
                title: "Smart notes",
                desc: "Take rich notes alongside your PDF with auto-save and formatting tools.",
              },
              {
                icon: "⚡",
                title: "Blazing fast",
                desc: "Built on modern infrastructure for instant responses and zero lag.",
              },
              {
                icon: "🔒",
                title: "Secure & private",
                desc: "Your documents are encrypted and never shared with third parties.",
              },
              {
                icon: "📱",
                title: "Works everywhere",
                desc: "Access your notes and PDFs from any device, anytime.",
              },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition text-left">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-gray-500 mb-14">Start free, upgrade when you need more</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-4xl font-bold mb-6">₹0<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {["5 PDF uploads", "Unlimited notes", "AI Q&A", "Email support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-in">
                <Button variant="outline" className="w-full rounded-full">Get started free</Button>
              </Link>
            </div>
            {/* Pro */}
            <div className="bg-black rounded-2xl p-8 border border-black shadow-lg text-left text-white">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">₹1<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                {["Unlimited PDF uploads", "Unlimited notes", "Priority AI Q&A", "Priority support", "Help center access"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-in">
                <Button className="w-full rounded-full bg-white text-black hover:bg-gray-100">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by students & professionals</h2>
          <p className="text-gray-500 mb-14">See what people are saying about AI PDF Note Taker</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya S.",
                role: "Medical student",
                text: "This app completely changed how I study. I can ask questions about my textbooks and get instant answers!",
              },
              {
                name: "Rahul M.",
                role: "Software Engineer",
                text: "I use it for reading technical docs. The AI Q&A feature saves me hours of searching through PDFs.",
              },
              {
                name: "Ananya K.",
                role: "Law student",
                text: "Taking notes alongside my case PDFs is so seamless. Auto-save means I never lose my work.",
              },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition text-left">
                <p className="text-gray-600 text-sm mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-400 border-t">
        <p>© 2026 AI PDF Note Taker. Built by K Yaswanth.</p>
      </footer>
    </div>
  );
}