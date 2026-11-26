'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CTA_SECTION_CONTENT } from '@/constants/sphereWired';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface CtaSectionProps {
  onLaunchApp: () => void;
}

export default function CtaSection({ onLaunchApp }: CtaSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const layerAbyssRef = useRef<HTMLDivElement | null>(null);
  const layerGridRef = useRef<HTMLDivElement | null>(null);
  const layerRingsRef = useRef<HTMLDivElement | null>(null);
  const layerBeamsRef = useRef<HTMLDivElement | null>(null);
  const layerFramesRef = useRef<HTMLDivElement | null>(null);
  const cursorSpotlightRef = useRef<HTMLDivElement | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      // 1. Calibrate darker multi-plane GSAP depth layers (no 3D sphere)
      const depthLayers = [
        { el: layerAbyssRef.current, depthX: 16, depthY: 12, scrollShift: -10, scale: 1.06 },
        { el: layerGridRef.current, depthX: 28, depthY: 18, scrollShift: 16, scale: 1.05 },
        { el: layerRingsRef.current, depthX: 44, depthY: 28, scrollShift: -18, scale: 1.04 },
        { el: layerBeamsRef.current, depthX: 54, depthY: 34, scrollShift: 22, scale: 1.06 },
        { el: layerFramesRef.current, depthX: 70, depthY: 44, scrollShift: -26, scale: 1.02 },
      ];

      depthLayers.forEach(({ el, scale }) => {
        if (el) {
          gsap.set(el, { scale, force3D: true });
        }
      });

      if (prefersReducedMotion) return;

      // 2. ScrollTrigger depth separation across all 5 darker background layers
      depthLayers.forEach(({ el, scrollShift }) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { yPercent: -scrollShift * 0.45 },
          {
            yPercent: scrollShift * 0.45,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.65,
            },
          }
        );
      });

      // 3. Cursor-reactive GSAP quickTo parallax + interactive dark-violet spotlight
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

      const spotlightEl = cursorSpotlightRef.current;
      const moveSpotX = spotlightEl
        ? gsap.quickTo(spotlightEl, 'x', { duration: 0.55, ease: 'power3.out' })
        : null;
      const moveSpotY = spotlightEl
        ? gsap.quickTo(spotlightEl, 'y', { duration: 0.55, ease: 'power3.out' })
        : null;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = sectionEl.getBoundingClientRect();
        const isNearSection =
          rect.bottom > -200 && rect.top < window.innerHeight + 200;
        if (!isNearSection) return;

        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;

        movers.forEach(({ depthX, depthY, moveX, moveY }) => {
          moveX(-nx * depthX);
          moveY(-ny * depthY);
        });

        if (moveSpotX && moveSpotY) {
          const localX = e.clientX - rect.left - rect.width / 2;
          const localY = e.clientY - rect.top - rect.height / 2;
          moveSpotX(localX * 0.55);
          moveSpotY(localY * 0.55);
        }
      };

      const handleMouseLeave = () => {
        movers.forEach(({ moveX, moveY }) => {
          moveX(0);
          moveY(0);
        });
        if (moveSpotX && moveSpotY) {
          moveSpotX(0);
          moveSpotY(0);
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      sectionEl.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      // 4. Sequenced one-by-one GSAP tween reveal when entering viewport on scroll
      const stepItems = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-cta-step]',
        sectionEl
      );
      const trimBars = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-cta-trim]',
        sectionEl
      );

      gsap.set(stepItems, { autoAlpha: 0, y: 34, scale: 0.97 });
      gsap.set(trimBars, { scaleX: 0, autoAlpha: 0 });

      ScrollTrigger.batch(stepItems, {
        start: 'top 94%',
        interval: 0.12,
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.68,
            stagger: 0.11,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform',
          });
        },
        onEnterBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform',
          });
        },
      });

      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          gsap.to(trimBars, {
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        },
      });

      gsap.delayedCall(0.25, () => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        sectionEl.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    { scope: sectionRef }
  );

  // GSAP microtransitions for the sole high-impact Launch App CTA
  const handleCtaMotion = contextSafe(
    (state: 'enter' | 'leave' | 'down' | 'up') => {
      if (state === 'enter') {
        gsap.to('[data-gsap-cta-btn]', {
          y: -3,
          scale: 1.03,
          duration: 0.18,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to('[data-gsap-cta-bracket]', {
          scale: 1.12,
          opacity: 1,
          duration: 0.18,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else if (state === 'leave') {
        gsap.to('[data-gsap-cta-btn]', {
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to('[data-gsap-cta-bracket]', {
          scale: 1,
          opacity: 0.78,
          duration: 0.22,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else if (state === 'down') {
        gsap.to('[data-gsap-cta-btn]', {
          y: 0.5,
          scale: 0.985,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to('[data-gsap-cta-btn]', {
          y: -3,
          scale: 1.03,
          duration: 0.15,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    }
  );

  return (
    <section
      id="get-started"
      ref={sectionRef}
      className="relative overflow-hidden min-h-[clamp(38rem,82vh,54rem)] flex items-center bg-[#04020A] border-t border-white/[0.08]"
    >
      {/* DEPTH LAYER 0: Darker Abyssal Obsidian-Violet Base Wash */}
      <div
        ref={layerAbyssRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%] z-0 sw-cta-abyss"
      />

      {/* DEPTH LAYER 1: Dark Precision Architectural Grid */}
      <div
        ref={layerGridRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%] z-[1] sw-cta-grid"
      />

      {/* DEPTH LAYER 2: Concentric Dark-Violet Radial Wave Rings */}
      <div
        ref={layerRingsRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%] z-[2] sw-cta-rings"
      />

      {/* DEPTH LAYER 3: Opposing Diagonal Deep Indigo & Violet Sheen Beams */}
      <div
        ref={layerBeamsRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%] z-[3] sw-cta-beams"
      />

      {/* CURSOR-REACTIVE ATMOSPHERIC DARK-VIOLET SPOTLIGHT */}
      <div
        ref={cursorSpotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(24rem,46vw,44rem)] aspect-square rounded-full z-[4]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.24) 0%, rgba(76, 29, 149, 0.12) 38%, transparent 72%)',
        }}
      />

      {/* DEPTH LAYER 4: Foreground Sculptural Geometric Framing Planes (Fastest Cursor Depth) */}
      <div
        ref={layerFramesRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%] z-[5] flex items-center justify-center"
      >
        <div className="relative w-[clamp(20rem,58vw,56rem)] h-[clamp(18rem,44vw,32rem)] border border-purple-400/[0.11] rounded-sm">
          <span className="absolute -top-[1px] -left-[1px] w-7 h-7 border-t-2 border-l-2 border-purple-400/45" />
          <span className="absolute -top-[1px] -right-[1px] w-7 h-7 border-t-2 border-r-2 border-purple-400/45" />
          <span className="absolute -bottom-[1px] -left-[1px] w-7 h-7 border-b-2 border-l-2 border-indigo-400/45" />
          <span className="absolute -bottom-[1px] -right-[1px] w-7 h-7 border-b-2 border-r-2 border-indigo-400/45" />
          <div className="absolute inset-[clamp(1.25rem,3vw,2.75rem)] border border-white/[0.04]" />
        </div>
      </div>

      {/* Edge Dark Vignette for Maximum Central Impact & Clean Transition to Footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{
          background:
            'radial-gradient(ellipse 76% 68% at 50% 50%, transparent 20%, rgba(3, 2, 8, 0.78) 78%, rgba(3, 2, 8, 0.98) 100%)',
        }}
      />

      {/* CENTERED 12-COLUMN HIGH-IMPACT CTA CONTENT */}
      <div className="relative z-10 w-full py-[clamp(5.5rem,10vw,9.5rem)]">
        <div className="sw-grid-12">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex flex-col items-center text-center">
            {/* Bracketed Kicker */}
            <div
              data-gsap-cta-step
              className="relative inline-flex items-center px-[clamp(0.85rem,1.4vw,1.2rem)] py-[clamp(0.32rem,0.55vw,0.45rem)] mb-[clamp(1.25rem,2.2vw,1.85rem)]"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-[#A855F7]/85"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-[#A855F7]/85"
              />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-[#A855F7]/85"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-[#A855F7]/85"
              />
              <p
                className="font-sans font-semibold tracking-[0.18em] text-[#C084FC] uppercase"
                style={{ fontSize: 'var(--hero-kicker-size)' }}
              >
                {CTA_SECTION_CONTENT.kicker}
              </p>
            </div>

            {/* Monumental Centered Headline */}
            <h2 className="w-full max-w-[18ch] sm:max-w-none flex flex-col items-center">
              <span
                data-gsap-cta-trim
                aria-hidden="true"
                className="flex items-center justify-center gap-3 w-full max-w-[clamp(14rem,32vw,28rem)] mb-3 origin-center"
              >
                <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-purple-300/50" />
                <span className="h-[3px] w-10 bg-gradient-to-r from-[#C084FC] to-[#38BDF8] skew-x-[-28deg]" />
                <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-purple-300/50" />
              </span>

              <span
                data-gsap-cta-step
                className="block sw-cta-headline-primary font-extrabold text-balance"
              >
                {CTA_SECTION_CONTENT.headlinePrimary}
              </span>

              <span
                data-gsap-cta-step
                className="block sw-cta-headline-accent font-extrabold mt-[clamp(0.1rem,0.45vw,0.4rem)] text-balance"
              >
                {CTA_SECTION_CONTENT.headlineAccent}
              </span>

              <span
                data-gsap-cta-trim
                aria-hidden="true"
                className="flex items-center justify-center gap-2.5 w-full max-w-[clamp(12rem,26vw,22rem)] mt-4 origin-center"
              >
                <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#A855F7]/70" />
                <span className="h-[5px] w-14 bg-gradient-to-r from-[#E879F9] via-[#A855F7] to-[#6366F1] skew-x-[-30deg]" />
                <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#6366F1]/70" />
              </span>
            </h2>

            {/* Centered High-Contrast Description */}
            <p
              data-gsap-cta-step
              className="mt-[clamp(1.4rem,2.6vw,2.2rem)] max-w-[54ch] text-[#CFC9E2] leading-[1.72] tracking-[0.01em]"
              style={{ fontSize: 'clamp(0.98rem, 1.2vw, 1.18rem)' }}
            >
              {CTA_SECTION_CONTENT.description}
            </p>

            {/* SOLE CTA BUTTON: Launch App */}
            <div
              data-gsap-cta-step
              className="mt-[clamp(2.25rem,3.8vw,3.25rem)] relative p-[8px]"
            >
              <span
                data-gsap-cta-bracket
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C084FC]/80 opacity-80"
              />
              <span
                data-gsap-cta-bracket
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#38BDF8]/80 opacity-80"
              />
              <span
                data-gsap-cta-bracket
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#818CF8]/80 opacity-80"
              />
              <span
                data-gsap-cta-bracket
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C084FC]/80 opacity-80"
              />

              <button
                data-gsap-cta-btn
                type="button"
                onClick={onLaunchApp}
                onMouseEnter={() => handleCtaMotion('enter')}
                onMouseLeave={() => handleCtaMotion('leave')}
                onMouseDown={() => handleCtaMotion('down')}
                onMouseUp={() => handleCtaMotion('up')}
                className="sw-btn-primary cursor-pointer whitespace-nowrap shrink-0 min-h-[54px] px-[clamp(2.4rem,4.4vw,3.8rem)] py-[clamp(0.95rem,1.35vw,1.15rem)] text-[clamp(0.98rem,1.15vw,1.12rem)] tracking-[0.03em]"
              >
                {CTA_SECTION_CONTENT.ctaLabel}
              </button>
            </div>

            {/* Quiet Unboxed Metadata Footnote */}
            <p
              data-gsap-cta-step
              className="mt-[clamp(1.75rem,3vw,2.5rem)] text-xs text-[#8D86A8] tracking-wide"
            >
              {CTA_SECTION_CONTENT.footnote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
