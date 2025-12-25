'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[64px 64px]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              NotesFlow
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="px-5 py-2 text-white/60 hover:text-white transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-white text-black rounded-lg hover:bg-white/90 transition-all font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main heading */}
          <h1 className="text-center text-7xl md:text-9xl font-bold mb-8 tracking-tighter">
            <span className="block text-white">Notes that</span>
            <span className="block text-white/40">flow with you</span>
          </h1>

          <p className="text-center text-xl md:text-2xl text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
            A minimal workspace for your thoughts. Fast, focused, and beautifully simple.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/auth/signup"
              className="group relative px-10 py-4 bg-white text-black rounded-full font-semibold text-lg hover:scale-105 transition-transform duration-200 w-full sm:w-auto text-center"
            >
              Start for free
            </Link>
            <Link
              href="/auth/login"
              className="px-10 py-4 border border-white/20 text-white rounded-full hover:bg-white/5 transition-all font-semibold text-lg w-full sm:w-auto text-center"
            >
              Sign in
            </Link>
          </div>

          {/* Social proof - minimal */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              <span>10,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              <span>Lightning fast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Feature grid */}
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {/* Feature 1 */}
            <div
              className="group relative p-12 bg-black hover:bg-white/5 transition-all duration-300"
              onMouseEnter={() => setHoveredFeature(0)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="mb-6">
                <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Instant loads. Zero lag. Built for speed.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="group relative p-12 bg-black hover:bg-white/5 transition-all duration-300"
              onMouseEnter={() => setHoveredFeature(1)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="mb-6">
                <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Rich Editor</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Markdown, blocks, and code. Everything you need.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="group relative p-12 bg-black hover:bg-white/5 transition-all duration-300"
              onMouseEnter={() => setHoveredFeature(2)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="mb-6">
                <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Sync</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Collaborate seamlessly. Always in sync.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div
              className="group relative p-12 bg-black hover:bg-white/5 transition-all duration-300"
              onMouseEnter={() => setHoveredFeature(3)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="mb-6">
                <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Private & Secure</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  End-to-end encrypted. Your data, your control.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div
              className="group relative p-12 bg-black hover:bg-white/5 transition-all duration-300"
              onMouseEnter={() => setHoveredFeature(4)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="mb-6">
                <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Organized</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Nested pages, tags, and custom views.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div
              className="group relative p-12 bg-black hover:bg-white/5 transition-all duration-300"
              onMouseEnter={() => setHoveredFeature(5)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="mb-6">
                <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Cross-platform</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Works everywhere. Desktop, mobile, tablet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Start writing today
          </h2>
          <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto">
            Join thousands already using NotesFlow
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-12 py-5 bg-white text-black rounded-full hover:scale-105 transition-transform font-semibold text-lg"
          >
            Get started for free
          </Link>
          <p className="mt-8 text-white/30 text-sm">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-sm"></div>
              </div>
              <span className="text-xl font-bold text-white">NotesFlow</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              &copy; 2025 NotesFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

