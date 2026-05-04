"use client";

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Film, Layout, Zap, Settings, Shield, ChevronRight, Play } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo image handles the text itself based on the screenshot */}
            <img src="/logo/framefeed_logo.svg" alt="FrameFeed" className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity drop-shadow-md" />
          </div>
          <Link href="/convert">
            <Button className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-6 font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
              Launch App
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 z-10 flex flex-col items-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-sm font-medium text-slate-300 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            v1.0 is now live — Local &amp; Secure
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Turn Videos into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400">
              Perfect PDFs
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instantly extract key frames from your videos, review them intuitively, and compile them into high-quality, beautifully formatted PDF documents.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
            <Link href="/convert">
              <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(124,58,237,0.8)] hover:shadow-[0_0_60px_-10px_rgba(124,58,237,1)] transition-all hover:scale-105 text-lg font-bold border-0">
                Start Converting Free
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-lg font-semibold hover:scale-105">
                <Play className="mr-2 w-5 h-5" />
                How it works
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 border-t border-slate-800/50 relative z-10 bg-slate-950/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for Professionals</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Everything you need to extract and format video frames exactly how you want them, directly in your browser.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              delay={0.1}
              icon={<Zap className="w-6 h-6 text-violet-400" />}
              title="Lightning Fast"
              description="Powered by advanced FFmpeg processing to extract high-resolution frames in seconds, not minutes."
            />
            <FeatureCard 
              delay={0.2}
              icon={<Film className="w-6 h-6 text-indigo-400" />}
              title="Smart Extraction"
              description="Extract by precise FPS or total frame count. Control your video segments exactly as needed."
            />
            <FeatureCard 
              delay={0.3}
              icon={<Layout className="w-6 h-6 text-blue-400" />}
              title="Custom Layouts"
              description="Format your PDF perfectly. Choose from multiple grid sizes, margins, and page orientations."
            />
            <FeatureCard 
              delay={0.4}
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="Interactive Review"
              description="Review all extracted frames before generating your PDF. Click to toggle frames you don't need."
            />
            <FeatureCard 
              delay={0.5}
              icon={<Settings className="w-6 h-6 text-orange-400" />}
              title="Granular Control"
              description="Control extraction with exact start/end timestamps, adjust output quality, and overlay timecodes."
            />
            <FeatureCard 
              delay={0.6}
              icon={<Shield className="w-6 h-6 text-rose-400" />}
              title="Private & Secure"
              description="All processing happens entirely within your securely deployed container. Total data privacy."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 px-6 relative z-10 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How it works</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">Three incredibly simple steps from any video to a professional PDF document.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-20 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0" />
            
            <StepCard 
              delay={0.2}
              number="1"
              title="Upload & Configure"
              description="Drag and drop your video file. Set extraction parameters like FPS, quality, and PDF layout grid."
            />
            <StepCard 
              delay={0.4}
              number="2"
              title="Extract & Review"
              description="Our backend rapidly extracts the frames. You review the visual grid and select exactly which ones to keep."
            />
            <StepCard 
              delay={0.6}
              number="3"
              title="Generate PDF"
              description="Instantly compile the selected frames and download a beautifully formatted, high-resolution PDF."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-slate-800/50 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-violet-900/40 to-slate-900 border border-slate-700/50 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/30 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Ready to streamline <br className="hidden md:block" /> your workflow?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              Start extracting high-quality frames from your videos today. Fast, secure, and fully containerized.
            </p>
            <Link href="/convert" className="inline-block mt-4">
              <Button size="lg" className="h-16 px-12 bg-white text-slate-950 hover:bg-slate-200 rounded-full transition-all hover:scale-105 text-xl font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
                Launch FrameFeed
                <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-12 px-6 text-center text-slate-500 z-10 relative bg-slate-950">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
          <img src="/logo/framefeed_logo.svg" alt="FrameFeed Logo" className="h-12 w-auto" />
        </div>
        <p>© {new Date().getFullYear()} FrameFeed. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay }}
      className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all group backdrop-blur-sm hover:shadow-2xl hover:shadow-violet-900/10"
    >
      <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-900 transition-all shadow-lg text-white">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 text-lg leading-relaxed">{description}</p>
    </motion.div>
  )
}

function StepCard({ number, title, description, delay }: { number: string, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay, type: "spring" }}
      className="relative z-10 flex flex-col items-center text-center space-y-6"
    >
      <div className="w-24 h-24 bg-slate-950 border-4 border-slate-800 group-hover:border-violet-500 rounded-full flex items-center justify-center text-3xl font-black text-violet-400 shadow-2xl transition-colors">
        {number}
      </div>
      <div className="pt-4">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">{description}</p>
      </div>
    </motion.div>
  )
}
