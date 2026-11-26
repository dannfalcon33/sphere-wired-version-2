'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import WiredSphereCanvas from './WiredSphereCanvas';
import { HERO_CONTENT } from '@/constants/sphereWired';
import type { SphereEnergyMode } from '@/types/sphereWired';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreNetwork: () => void;
  energyMode: SphereEnergyMode;
}

export default function HeroSection({
  onGetStarted,
  onExploreNetwork,
  energyMode,
}: HeroSectionProps) {
  const heroRootRef = useRef<HTMLElement | null>(null);
  const contentColRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);

  // Depth Layer Refs managed by GSAP
  const layerNebulaRef = useRef<HTMLDivElement | null>(null);
  const layerGridRef = useRef<HTMLDivElement | null>(null);
  const layerStreaksRef = useRef<HTMLDivElement | null>(null);
  const layerHaloRef = useRef<HTMLDivElement | null>(null);
  const layerSphereRef = useRef<HTMLDivElement | null>(null);
  const layerBokehRef = useRef<HTMLDivElement | null>(null);

  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);
  const secondaryBtnRef = useRef<HTMLButtonElement | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const heroEl = heroRootRef.current;
      if (!heroEl) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      // 1. Place & calibrate background depth layers with GSAP
      const depthLayers = [
        { el: layerNebulaRef.current, depthX: 14, depthY: 10, scale: 1.04 },
        { el: layerGridRef.current, depthX: 24, depthY: 16, scale: 1.03 },
        { el: layerStreaksRef.current, depthX: 34, depthY: 22, scale: 1.05 },
        { el: layerHaloRef.current, depthX: 44, depthY: 28, scale: 1.0 },
        { el: layerBokehRef.current, depthX: 56, depthY: 36, scale: 1.02 },
      ];

      depthLayers.forEach(({ el, scale }) => {
        if (el) {
          gsap.set(el, { scale, force3D: true });
        }
      });

      if (prefersReducedMotion) return;

      // 2. GSAP Master Entrance Timeline — reveals depth layers & content one by one
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(
        [layerNebulaRef.current, layerGridRef.current, layerStreaksRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.75, stagger: 0.1 }
      )
        .fromTo(
          layerHaloRef.current,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 0.85 },
          '-=0.55'
        )
        .fromTo(
          layerSphereRef.current,
          { opacity: 0, scale: 0.92, y: 18 },
          { opacity: 1, scale: 1, y: 0, duration: 0.95, ease: 'expo.out' },
          '-=0.65'
        )
        .fromTo(
          document.querySelectorAll('[data-gsap-header]'),
          { opacity: 0, y: -14 },
          { opacity: 1, y: 0, duration: 0.48, stagger: 0.06 },
          '-=0.78'
        )
        .fromTo(
          '[data-gsap-hero-item]',
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.11,
            clearProps: 'transform',
          },
          '-=0.45'
        )
        .fromTo(
          '[data-gsap-trim]',
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.42'
        );

      // 3. GSAP ScrollTrigger — Depth Parallax Separation & 3D Sphere Scroll Binding
      ScrollTrigger.create({
        trigger: heroEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
        },
      });

      gsap.to(layerGridRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(layerStreaksRef.current, {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(layerHaloRef.current, {
        yPercent: 22,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(contentColRef.current, {
        yPercent: -12,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // 4. GSAP quickTo Depth Parallax driven by cursor position
      const movers = depthLayers
        .filter((d) => d.el !== null)
        .map((d) => ({
          depthX: d.depthX,
          depthY: d.depthY,
          moveX: gsap.quickTo(d.el!, 'x', {
            duration: 0.85,
            ease: 'power3.out',
          }),
          moveY: gsap.quickTo(d.el!, 'y', {
            duration: 0.85,
            ease: 'power3.out',
          }),
        }));

      const handleParallaxMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach(({ depthX, depthY, moveX, moveY }) => {
          moveX(-nx * depthX);
          moveY(-ny * depthY);
        });
      };

      window.addEventListener('mousemove', handleParallaxMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', handleParallaxMove);
      };
    },
    { scope: heroRootRef }
  );

  // GSAP Microtransition button hover & press tweens
  const animateButton = contextSafe(
    (el: HTMLButtonElement | null, state: 'enter' | 'leave' | 'down' | 'up') => {
      if (!el) return;
      if (state === 'enter') {
        gsap.to(el, {
          y: -2,
          scale: 1.02,
          duration: 0.16,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else if (state === 'leave') {
        gsap.to(el, {
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else if (state === 'down') {
        gsap.to(el, {
          y: 0.5,
          scale: 0.985,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(el, {
          y: -2,
          scale: 1.02,
          duration: 0.14,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    }
  );

  return (
    <section
      id="hero"
      ref={heroRootRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center bg-[#080511]"
    >
      {/* GSAP BACKGROUND DEPTH LAYER 0: Deep Obsidian-Violet Nebula Wash */}
      <div
        ref={layerNebulaRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%] z-0 sw-depth-nebula"
      />

      {/* GSAP BACKGROUND DEPTH LAYER 1: Architectural Violet Grid Field */}
      <div
        ref={layerGridRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%] z-[1] sw-depth-grid"
      />

      {/* GSAP BACKGROUND DEPTH LAYER 2: Diagonal Volumetric Light Streaks */}
      <div
        ref={layerStreaksRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%] z-[2] sw-depth-streaks"
      />

      {/* GSAP BACKGROUND DEPTH LAYER 3: Atmospheric Violet Backlight Halo behind Sphere */}
      <div
        ref={layerHaloRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-[-4%] lg:right-[3%] top-1/2 -translate-y-1/2 w-[clamp(24rem,52vw,52rem)] aspect-square rounded-full z-[2]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.34) 0%, rgba(124, 58, 237, 0.16) 38%, rgba(56, 189, 248, 0.05) 60%, transparent 74%)',
        }}
      />

      {/* GSAP BACKGROUND DEPTH LAYER 4: Interactive 3D Three.js Sphere */}
      <div
        ref={layerSphereRef}
        className="absolute inset-0 z-[3] pointer-events-none"
      >
        <WiredSphereCanvas
          scrollProgressRef={scrollProgressRef}
          energyMode={energyMode}
        />
      </div>

      {/* GSAP BACKGROUND DEPTH LAYER 5: Subtle Ambient Depth Bokeh */}
      <div
        ref={layerBokehRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-4%] z-[4]"
        style={{
          background:
            'radial-gradient(circle at 86% 24%, rgba(216, 180, 254, 0.12) 0%, transparent 22%), radial-gradient(circle at 48% 54%, rgba(147, 51, 234, 0.09) 0%, transparent 28%)',
        }}
      />

      {/* Measured contrast scrim on left & bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'linear-gradient(90deg, rgba(8, 5, 17, 0.78) 0%, rgba(8, 5, 17, 0.42) 48%, rgba(8, 5, 17, 0.04) 76%), linear-gradient(180deg, rgba(8, 5, 17, 0.25) 0%, transparent 22%, transparent 82%, rgba(8, 5, 17, 1) 100%)',
        }}
      />

      {/* FOREGROUND 12-COLUMN CSS GRID HERO CONTENT */}
      <div className="relative z-10 w-full pt-[calc(var(--header-height)+clamp(2rem,4vw,3.5rem))] pb-[clamp(4rem,8vw,7rem)]">
        <div className="sw-grid-12 items-center">
          <div
            ref={contentColRef}
            className="col-span-12 lg:col-span-7 flex flex-col items-start"
          >
            {/* Kicker with thin violet HUD corner brackets */}
            <div
              data-gsap-hero-item
              className="relative inline-flex items-center px-[clamp(0.7rem,1.2vw,1rem)] py-[clamp(0.28rem,0.5vw,0.4rem)] mb-[clamp(1rem,1.8vw,1.5rem)]"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-[#A855F7]/80"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-[#A855F7]/80"
              />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#A855F7]/80"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-[#A855F7]/80"
              />
              <p
                className="font-sans font-semibold tracking-[0.16em] text-[#B97DFF] uppercase"
                style={{ fontSize: 'var(--hero-kicker-size)' }}
              >
                {HERO_CONTENT.kicker}
              </p>
            </div>

            {/* Display Headline Block with Precision Sci-Fi Trim Hairlines */}
            <h1 className="w-full max-w-[16ch] lg:max-w-none select-text">
              <span
                data-gsap-trim
                aria-hidden="true"
                className="flex items-center justify-between w-full max-w-[clamp(18rem,44vw,40rem)] mb-2 origin-left"
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-[3px] w-7 bg-gradient-to-r from-[#D8B4FE] to-white/70 skew-x-[-28deg]" />
                  <span className="h-[1px] w-[clamp(3.5rem,8vw,7rem)] bg-white/35" />
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-[1px] w-[clamp(2.5rem,6vw,5.5rem)] bg-white/30" />
                  <span className="h-[3px] w-5 bg-white/60 skew-x-[-28deg]" />
                </span>
              </span>

              <span
                data-gsap-hero-item
                className="block sw-headline-primary font-extrabold whitespace-nowrap"
              >
                {HERO_CONTENT.headlinePrimary}
              </span>

              <span
                data-gsap-hero-item
                className="block sw-headline-accent font-extrabold mt-[clamp(0.1rem,0.4vw,0.35rem)] whitespace-nowrap"
              >
                {HERO_CONTENT.headlineAccent}
              </span>

              <span
                data-gsap-trim
                aria-hidden="true"
                className="flex items-center gap-2 w-full max-w-[clamp(14rem,32vw,26rem)] mt-3 origin-left"
              >
                <span className="h-[5px] w-8 bg-gradient-to-r from-[#A855F7] to-[#6366F1] skew-x-[-30deg]" />
                <span className="h-[1.5px] flex-1 bg-gradient-to-r from-[#C084FC]/85 via-[#A855F7]/40 to-transparent" />
                <span className="h-[5px] w-16 bg-gradient-to-r from-[#E879F9] to-[#7C3AED] skew-x-[-30deg]" />
                <span className="h-[1.5px] w-10 bg-purple-400/50" />
              </span>
            </h1>

            {/* Hero Description Copy */}
            <p
              data-gsap-hero-item
              className="mt-[clamp(1.25rem,2.4vw,2rem)] max-w-[52ch] text-[#D7D2E6] font-normal leading-[1.68] tracking-[0.01em]"
              style={{ fontSize: 'var(--hero-body-size)' }}
            >
              {HERO_CONTENT.description}
            </p>

            {/* Hero Dual Action Row */}
            <div
              data-gsap-hero-item
              className="mt-[clamp(1.85rem,3.2vw,2.75rem)] flex flex-wrap items-center gap-[clamp(0.95rem,1.8vw,1.5rem)]"
            >
              <button
                ref={primaryBtnRef}
                type="button"
                onClick={onGetStarted}
                onMouseEnter={() => animateButton(primaryBtnRef.current, 'enter')}
                onMouseLeave={() => animateButton(primaryBtnRef.current, 'leave')}
                onMouseDown={() => animateButton(primaryBtnRef.current, 'down')}
                onMouseUp={() => animateButton(primaryBtnRef.current, 'up')}
                className="sw-btn-primary cursor-pointer whitespace-nowrap shrink-0 min-h-[46px]"
              >
                {HERO_CONTENT.primaryCta}
              </button>

              <button
                ref={secondaryBtnRef}
                type="button"
                onClick={onExploreNetwork}
                onMouseEnter={() => animateButton(secondaryBtnRef.current, 'enter')}
                onMouseLeave={() => animateButton(secondaryBtnRef.current, 'leave')}
                onMouseDown={() => animateButton(secondaryBtnRef.current, 'down')}
                onMouseUp={() => animateButton(secondaryBtnRef.current, 'up')}
                className="sw-btn-hud cursor-pointer whitespace-nowrap shrink-0 min-h-[46px]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[5px] left-[5px] w-2 h-2 border-t border-l border-purple-200/55"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[5px] right-[5px] w-2 h-2 border-t border-r border-purple-200/55"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[5px] left-[5px] w-2 h-2 border-b border-l border-purple-200/55"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[5px] right-[5px] w-2 h-2 border-b border-r border-purple-200/55"
                />
                {HERO_CONTENT.secondaryCta}
              </button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden lg:block lg:col-span-5 min-h-[clamp(26rem,42vw,38rem)] pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
}
