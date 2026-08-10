import React from 'react';
import Link from 'next/link';

export function Footer() {
  const appStoreLink = "https://apps.apple.com/us/app/finalset-fitness/id6760131492";

  return (
    <footer className="py-16 px-6 border-t border-zinc-900 bg-black text-zinc-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              F
            </div>
            <span className="font-bold text-xl tracking-tight text-white">FinalSet Fitness</span>
          </div>
          <p className="max-w-sm mb-6 text-sm leading-relaxed">
            Data-Driven Fitness, Automated for You. Built for serious lifters who want structured training, macro tracking, and measurable progress.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/justinkvalo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://linkedin.com/in/justinkvalo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Product</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
            <li><a href={appStoreLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Download App</a></li>
            <li><Link href="/case-study" className="hover:text-white transition-colors">Case Study</Link></li>
            <li><Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Legal & Support</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><a href="mailto:finalset.help@gmail.com" className="hover:text-white transition-colors">Support Email</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© {new Date().getFullYear()} FinalSet Fitness. All rights reserved.</p>
        <p>Built by Justin Kvalo</p>
      </div>
    </footer>
  );
}
