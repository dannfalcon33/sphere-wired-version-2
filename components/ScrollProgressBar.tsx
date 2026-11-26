'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollProgressBar() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-gsap-progress-fill]',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.15,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.delayedCall(0.25, () => ScrollTrigger.refresh());
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none bg-white/[0.04]"
    >
      <div
        data-gsap-progress-fill
        className="h-full w-full origin-left will-change-transform"
        style={{
          transform: 'scaleX(0)',
          background:
            'linear-gradient(90deg, #7C3AED 0%, #C084FC 55%, #38BDF8 100%)',
          boxShadow:
            '0 0 12px rgba(168, 85, 247, 0.75), 0 0 4px rgba(56, 189, 248, 0.6)',
        }}
      />
    </div>
  );
}
