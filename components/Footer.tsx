'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  FOOTER_BRAND_INFO,
  FOOTER_DISCLAIMERS,
  FOOTER_LINK_GROUPS,
} from '@/constants/footer';
import type { FooterLinkItem, LegalDocId, ModalTab } from '@/types/sphereWired';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FooterProps {
  onOpenConsole: (tab: ModalTab) => void;
  onOpenLegal: (docId: LegalDocId) => void;
}

export default function Footer({ onOpenConsole, onOpenLegal }: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = footerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) return;

      const items = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-footer-item]',
        el
      );
      gsap.set(items, { autoAlpha: 0, y: 22 });

      ScrollTrigger.batch(items, {
        start: 'top 96%',
        interval: 0.1,
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform',
          });
        },
        onEnterBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power3.out',
            overwrite: 'auto',
            clearProps: 'transform',
          });
        },
      });
    },
    { scope: footerRef }
  );

  const handleLinkAction = (item: FooterLinkItem) => {
    if (!item.action) return;
    if (item.action === 'console' || item.action === 'deploy') {
      onOpenConsole(item.action);
      return;
    }
    onOpenLegal(item.action);
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative z-10 bg-[#030208] border-t border-white/[0.08] text-[#A8A2BF]"
    >
      {/* Upper Structured 12-Column Directory & Corporate Information */}
      <div className="pt-[clamp(3.5rem,6vw,5.25rem)] pb-[clamp(2.5rem,4.5vw,3.75rem)]">
        <div className="sw-grid-12 gap-y-[clamp(2.25rem,4vw,3.25rem)]">
          <div className="col-span-12 lg:col-span-5 space-y-5">
            <div data-gsap-footer-item className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="relative inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                style={{
                  background:
                    'radial-gradient(circle at 32% 28%, #e9d5ff 0%, #7c3aed 32%, #1d1035 68%, #07040f 100%)',
                  boxShadow: 'inset -3px -3px 6px rgba(3, 2, 8, 0.92)',
                }}
              />
              <span className="font-display font-bold tracking-[0.09em] text-base whitespace-nowrap">
                <span className="text-[#F5F3FF]">SPHERE </span>
                <span className="text-[#A855F7]">WIRED</span>
              </span>
            </div>

            <p
              data-gsap-footer-item
              className="text-sm text-[#9B95B4] leading-[1.7] max-w-[44ch]"
            >
              {FOOTER_BRAND_INFO.summary}
            </p>

            <div
              data-gsap-footer-item
              className="space-y-1.5 text-xs text-[#827C9B] pt-1"
            >
              <p className="font-medium text-[#C5C0DA]">
                {FOOTER_BRAND_INFO.entity}
              </p>
              <p>{FOOTER_BRAND_INFO.registration}</p>
              <p>{FOOTER_BRAND_INFO.headquarters}</p>
            </div>

            <div
              data-gsap-footer-item
              className="pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
            >
              {FOOTER_BRAND_INFO.contacts.map((contact) => (
                <div key={contact.label}>
                  <p className="text-[#787190]">{contact.label}</p>
                  <p className="mt-0.5 font-mono text-[#CFC9E2]">
                    {contact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-start-7 lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.heading} data-gsap-footer-item>
                <h3 className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-[#E4E0F2] mb-4">
                  {group.heading}
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[#9690AE] hover:text-white transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLinkAction(item)}
                          className="text-left text-[#9690AE] hover:text-white transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Dedicated Legal Disclaimers & Terms Summary Block */}
      <div className="border-t border-white/[0.07] bg-[#020105] py-[clamp(2.25rem,4vw,3.25rem)]">
        <div className="sw-grid-12 gap-y-6">
          <div
            data-gsap-footer-item
            className="col-span-12 flex flex-wrap items-baseline justify-between gap-4 pb-2"
          >
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#C8C2DC]">
              Disclaimers, Regulatory Information &amp; Terms Summary
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7D7696]">
              {FOOTER_BRAND_INFO.certifications.map((cert, idx) => (
                <React.Fragment key={cert}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span>{cert}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {FOOTER_DISCLAIMERS.map((disc) => (
            <div
              key={disc.id}
              data-gsap-footer-item
              className="col-span-12 lg:col-span-4 pr-0 lg:pr-4"
            >
              <h4 className="text-xs font-semibold text-[#D6D1E8] mb-2">
                {disc.title}
              </h4>
              <p className="text-xs text-[#827B9B] leading-[1.72]">
                {disc.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Legal & Copyright Strip */}
      <div className="border-t border-white/[0.06] bg-[#010003] py-6">
        <div className="sw-grid-12 items-center gap-y-4 text-xs text-[#7A7394]">
          <div
            data-gsap-footer-item
            className="col-span-12 md:col-span-6 flex flex-wrap items-center gap-x-3 gap-y-1"
          >
            <span>
              © {new Date().getFullYear()} {FOOTER_BRAND_INFO.entity}. All
              rights reserved.
            </span>
          </div>

          <div
            data-gsap-footer-item
            className="col-span-12 md:col-span-6 flex flex-wrap items-center md:justify-end gap-x-5 gap-y-2"
          >
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('disclaimer')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Risk Disclaimer
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('security')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Security Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
