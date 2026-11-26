'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants/sphereWired';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeaderProps {
  onLaunchApp: () => void;
}

export default function Header({ onLaunchApp }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      ScrollTrigger.create({
        start: 24,
        end: 'max',
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });
    },
    { scope: headerRef }
  );

  // GSAP microtransition hover/press tween on Launch App button
  const handleLaunchEnter = contextSafe(() => {
    gsap.to('[data-gsap-launch-btn]', {
      y: -1.5,
      scale: 1.025,
      duration: 0.18,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to('.hud-bracket', {
      scale: 1.08,
      opacity: 1,
      duration: 0.18,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  });

  const handleLaunchLeave = contextSafe(() => {
    gsap.to('[data-gsap-launch-btn]', {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to('.hud-bracket', {
      scale: 1,
      opacity: 0.78,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  });

  const handleNavHover = contextSafe(
    (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
      gsap.to(e.currentTarget, {
        y: enter ? -1 : 0,
        duration: 0.16,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  );

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#080511]/94 border-b border-white/[0.08]'
          : 'bg-gradient-to-b from-[#080511]/90 via-[#080511]/55 to-transparent border-b border-transparent'
      }`}
    >
      <div className="sw-grid-12 items-center h-[var(--header-height)]">
        {/* Zone 1 (Cols 1-4): Miniature 3D-shaded Sphere Mark + Brand Wordmark */}
        <div className="col-span-7 md:col-span-4 flex items-center min-w-0">
          <a
            href="#hero"
            data-gsap-header
            className="inline-flex items-center gap-[clamp(0.6rem,1vw,0.85rem)] group whitespace-nowrap shrink-0"
          >
            <span
              aria-hidden="true"
              className="relative inline-flex items-center justify-center w-[clamp(1.85rem,2.3vw,2.25rem)] h-[clamp(1.85rem,2.3vw,2.25rem)] rounded-full shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{
                background:
                  'radial-gradient(circle at 32% 28%, #f3e8ff 0%, #8b5cf6 28%, #2a174a 64%, #0b0618 100%)',
                boxShadow:
                  '0 0 18px rgba(168, 85, 247, 0.52), inset -4px -5px 9px rgba(5, 3, 12, 0.9), inset 2px 2px 5px rgba(255, 255, 255, 0.35)',
              }}
            >
              <span className="absolute inset-[3px] rounded-full border border-purple-300/35 rotate-[32deg] scale-y-[0.55]" />
              <span className="absolute inset-[1px] rounded-full border border-indigo-300/25 -rotate-[42deg] scale-x-[0.65]" />
            </span>

            <span className="font-display font-bold tracking-[0.09em] text-[clamp(0.92rem,1.25vw,1.22rem)] leading-none whitespace-nowrap shrink-0">
              <span className="text-[#F4F6FF] drop-shadow-[0_0_12px_rgba(226,232,255,0.28)]">
                SPHERE{' '}
              </span>
              <span className="bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#818CF8] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(168,85,247,0.45)]">
                WIRED
              </span>
            </span>
          </a>
        </div>

        {/* Zone 2 (Cols 5-9): Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex md:col-span-5 items-center justify-center gap-[clamp(1.25rem,2.6vw,2.6rem)]"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-gsap-header
              onMouseEnter={(e) => handleNavHover(e, true)}
              onMouseLeave={(e) => handleNavHover(e, false)}
              className="sw-nav-link whitespace-nowrap shrink-0 font-normal tracking-[0.01em]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3 (Cols 10-12): Primary Action ("Launch App") + Mobile Menu Toggle */}
        <div className="col-span-5 md:col-span-3 flex items-center justify-end gap-3">
          <div data-gsap-header className="relative p-[5px] shrink-0">
            <span
              aria-hidden="true"
              className="hud-bracket pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#C084FC]/80 opacity-80"
            />
            <span
              aria-hidden="true"
              className="hud-bracket pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-[#C084FC]/80 opacity-80"
            />
            <span
              aria-hidden="true"
              className="hud-bracket pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-[#818CF8]/80 opacity-80"
            />
            <span
              aria-hidden="true"
              className="hud-bracket pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#818CF8]/80 opacity-80"
            />

            <button
              data-gsap-launch-btn
              type="button"
              onClick={onLaunchApp}
              onMouseEnter={handleLaunchEnter}
              onMouseLeave={handleLaunchLeave}
              className="sw-btn-launch cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
            >
              Launch App
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded border border-purple-400/25 bg-[#150f27] text-purple-100 hover:border-purple-300/60 transition-colors shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0719] border-t border-purple-400/15 px-[var(--container-pad)] py-5">
          <nav aria-label="Mobile" className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-base font-medium text-[#DED9EE] hover:text-white border-b border-white/[0.06] last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
