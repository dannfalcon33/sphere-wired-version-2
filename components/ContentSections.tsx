'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import {
  ABOUT_CONTENT,
  ABOUT_HIGHLIGHTS,
  NETWORK_HEADER,
  NETWORK_REGIONS,
  PROTOCOL_LAYERS,
  SOLUTIONS_HEADER,
  SOLUTIONS_ITEMS,
  TECHNOLOGY_HEADER,
  WORKLOAD_OPTIONS,
} from '@/constants/sphereWired';
import type { RegionKey, SphereEnergyMode } from '@/types/sphereWired';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ContentSectionsProps {
  energyMode: SphereEnergyMode;
  onSelectEnergyMode: (mode: SphereEnergyMode) => void;
  onOpenDeployModal: () => void;
}

const KPI_OFFSET_CLASSES = ['lg:mt-0', 'lg:mt-7', 'lg:mt-2', 'lg:mt-9'];

export default function ContentSections({
  energyMode,
  onSelectEnergyMode,
  onOpenDeployModal,
}: ContentSectionsProps) {
  const sectionsRef = useRef<HTMLDivElement | null>(null);
  const [region, setRegion] = useState<RegionKey>('global');

  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [workload, setWorkload] = useState<string>(WORKLOAD_OPTIONS[0]);
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const activeLayer =
    PROTOCOL_LAYERS.find((layer) => layer.id === energyMode) ?? PROTOCOL_LAYERS[0];
  const currentRegion = NETWORK_REGIONS[region];

  const { contextSafe } = useGSAP(
    () => {
      const root = sectionsRef.current;
      if (!root) return;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) return;

      // 1. Parallax depth tweens for each section's unique background layers
      const sectionNodes = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-section]',
        root
      );
      sectionNodes.forEach((sectionEl) => {
        const depthNodes = gsap.utils.toArray<HTMLElement>(
          '[data-depth-speed]',
          sectionEl
        );
        depthNodes.forEach((layerEl) => {
          const speed = Number(layerEl.dataset.depthSpeed || '0');
          gsap.fromTo(
            layerEl,
            { yPercent: -speed * 50 },
            {
              yPercent: speed * 50,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionEl,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            }
          );
        });
      });

      // 2. Reliable element-by-element GSAP Tweens via ScrollTrigger.batch
      // Every item reveals with a crisp tween as soon as its layout enters the viewport on scroll
      const stepItems = gsap.utils.toArray<HTMLElement>('[data-gsap-step]', root);
      gsap.set(stepItems, { autoAlpha: 0, y: 34, scale: 0.98 });

      ScrollTrigger.batch(stepItems, {
        start: 'top 94%',
        interval: 0.12,
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            stagger: 0.1,
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

      // Recalculate ScrollTrigger geometry after fonts and dynamic sizing settle
      gsap.delayedCall(0.25, () => ScrollTrigger.refresh());
    },
    { scope: sectionsRef }
  );

  const handleSelectLayer = contextSafe((mode: SphereEnergyMode) => {
    onSelectEnergyMode(mode);
    gsap.fromTo(
      '[data-gsap-spec-panel]',
      { autoAlpha: 0.4, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
        clearProps: 'transform',
      }
    );
  });

  const handleSelectRegion = contextSafe((nextRegion: RegionKey) => {
    setRegion(nextRegion);
    gsap.fromTo(
      '[data-gsap-kpi-value]',
      { y: 8, opacity: 0.45 },
      {
        y: 0,
        opacity: 1,
        duration: 0.24,
        stagger: 0.04,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );
  });

  const handleSubmitAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedOrg = organization.trim();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Enter a valid work email address.');
      return;
    }
    if (trimmedOrg.length < 2) {
      setFormError('Enter your team or organization name.');
      return;
    }

    setFormError('');
    setSubmitted(true);
  };

  const regionKpis = [
    { label: 'Active Relay Nodes', value: currentRegion.nodes },
    { label: 'Median Propagation', value: currentRegion.latency },
    { label: 'Peak Throughput', value: currentRegion.throughput },
    { label: '30-Day Verified Uptime', value: currentRegion.uptime },
  ];

  return (
    <div ref={sectionsRef} className="relative z-10 bg-[#080511]">
      {/* =====================================================================
          SECTION 2: SOLUTIONS — Abstract Staggered 12-Col + Orbital Arc Depth
         ===================================================================== */}
      <section
        id="solutions"
        data-gsap-section
        className="relative overflow-hidden py-[var(--section-pad-y)] border-t border-white/[0.07]"
      >
        <div
          data-depth-speed="-0.12"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] z-0 sw-bg-solutions-wash"
        />
        <div
          data-depth-speed="0.22"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] z-[1] sw-bg-solutions-arcs"
        />
        <div
          data-depth-speed="-0.28"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-10%] z-[2] sw-bg-solutions-hatch"
        >
          <div className="absolute right-[8%] bottom-[14%] w-[clamp(14rem,28vw,28rem)] h-[clamp(14rem,28vw,28rem)] rounded-full border border-purple-400/12" />
        </div>

        <div className="relative z-10 sw-grid-12 gap-y-[clamp(2.25rem,4.5vw,3.5rem)]">
          <div className="col-span-12 lg:col-start-2 lg:col-span-6">
            <p
              data-gsap-step
              className="text-[clamp(0.76rem,0.9vw,0.86rem)] font-medium tracking-[0.14em] uppercase text-[#B97DFF] mb-3"
            >
              {SOLUTIONS_HEADER.eyebrow}
            </p>
            <h2
              data-gsap-step
              className="font-display font-bold text-[#F5F3FF] tracking-[0.02em] leading-[1.15] text-balance"
              style={{ fontSize: 'var(--section-heading-size)' }}
            >
              {SOLUTIONS_HEADER.title}
            </h2>
          </div>

          <div className="col-span-12 lg:col-start-8 lg:col-span-4 lg:mt-14 flex items-end">
            <p
              data-gsap-step
              className="text-[clamp(0.94rem,1.05vw,1.05rem)] text-[#BEB8D2] leading-[1.7] max-w-[42ch]"
            >
              {SOLUTIONS_HEADER.lead}
            </p>
          </div>

          {SOLUTIONS_ITEMS.map((item) => (
            <article
              key={item.id}
              data-gsap-step
              className={`${item.gridPlacement} group relative rounded-lg border border-white/[0.09] bg-[#100A20]/92 p-[clamp(1.5rem,2.6vw,2.25rem)] transition-colors duration-200 hover:border-purple-400/45`}
            >
              <div className="flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#A99ECA]">
                    <span className="font-mono text-[#B97DFF]">{item.index}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                  </div>
                  <h3 className="mt-2.5 font-display font-semibold text-[clamp(1.15rem,1.6vw,1.45rem)] text-white tracking-[0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[clamp(0.92rem,1vw,1rem)] text-[#C2BCD6] leading-[1.68] max-w-[54ch]">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-4 text-[13px] text-[#A29BB9] font-mono tabular-nums">
                  <span>{item.detail}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#B97DFF] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: TECHNOLOGY — Right-Weighted Abstract Layout + Dot Lattice Depth
         ===================================================================== */}
      <section
        id="technology"
        data-gsap-section
        className="relative overflow-hidden py-[var(--section-pad-y)] border-t border-white/[0.07]"
      >
        <div
          data-depth-speed="-0.1"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] z-0 sw-bg-tech-wash"
        />
        <div
          data-depth-speed="0.2"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] z-[1] sw-bg-tech-dots"
        />
        <div
          data-depth-speed="-0.3"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-10%] z-[2] sw-bg-tech-beams"
        >
          <div className="absolute left-[6%] top-[18%] w-[clamp(10rem,22vw,22rem)] h-[clamp(6rem,12vw,12rem)] border border-indigo-400/12 rotate-[-6deg]" />
        </div>

        <div className="relative z-10 sw-grid-12 gap-y-[clamp(2.25rem,4.5vw,3.25rem)] items-start">
          <div className="col-span-12 lg:col-start-1 lg:col-span-4 lg:mt-10 order-2 lg:order-1">
            <p
              data-gsap-step
              className="text-[clamp(0.94rem,1.05vw,1.05rem)] text-[#BDB7D2] leading-[1.7] max-w-[40ch]"
            >
              {TECHNOLOGY_HEADER.lead}
            </p>
          </div>

          <div className="col-span-12 lg:col-start-6 lg:col-span-7 order-1 lg:order-2">
            <p
              data-gsap-step
              className="text-[clamp(0.76rem,0.9vw,0.86rem)] font-medium tracking-[0.14em] uppercase text-[#B97DFF] mb-3"
            >
              {TECHNOLOGY_HEADER.eyebrow}
            </p>
            <h2
              data-gsap-step
              className="font-display font-bold text-[#F5F3FF] tracking-[0.02em] leading-[1.15] text-balance"
              style={{ fontSize: 'var(--section-heading-size)' }}
            >
              {TECHNOLOGY_HEADER.title}
            </h2>
          </div>

          <div className="col-span-12 lg:col-start-1 lg:col-span-7 order-3">
            <div
              data-gsap-spec-panel
              data-gsap-step
              className="rounded-lg border border-purple-400/22 bg-[#100A20]/94 p-[clamp(1.65rem,3vw,2.75rem)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 pb-5 border-b border-white/[0.08]">
                <h3 className="font-display font-bold text-[clamp(1.35rem,2vw,1.85rem)] text-white">
                  {activeLayer.index} {activeLayer.name}
                </h3>
                <span className="text-sm text-[#B97DFF] font-medium">
                  {activeLayer.role}
                </span>
              </div>

              <p className="mt-6 text-[clamp(0.95rem,1.08vw,1.08rem)] text-[#D2CDE2] leading-[1.72]">
                {activeLayer.description}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
                {activeLayer.specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-xs text-[#9B94B4] tracking-wide">
                      {spec.label}
                    </p>
                    <p className="mt-1.5 font-mono font-medium text-[clamp(1rem,1.35vw,1.25rem)] text-[#F4F1FF] tabular-nums">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[#9E97B6]">
                  Full protocol specification and SDK bindings available inside the
                  Sphere Wired console.
                </p>
                <button
                  type="button"
                  onClick={onOpenDeployModal}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#D8B4FE] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Deploy a test node
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-start-9 lg:col-span-4 lg:mt-8 order-4">
            <div className="flex flex-col divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {PROTOCOL_LAYERS.map((layer) => {
                const isSelected = layer.id === energyMode;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    data-gsap-step
                    onClick={() => handleSelectLayer(layer.id)}
                    className={`w-full text-left py-4 px-3.5 flex items-center justify-between gap-4 transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#191130] text-white'
                        : 'bg-[#0B0718]/75 text-[#A8A1BE] hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="flex items-baseline gap-3 min-w-0">
                      <span className="font-mono text-xs text-[#B97DFF] shrink-0">
                        {layer.index}
                      </span>
                      <span className="font-display font-semibold text-[clamp(0.95rem,1.15vw,1.1rem)] truncate">
                        {layer.name}
                      </span>
                    </span>
                    <span className="text-xs text-[#968FB0] whitespace-nowrap shrink-0">
                      {layer.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: NETWORK — Cascading KPIs & Indented Table + Meridian Depth
         ===================================================================== */}
      <section
        id="network"
        data-gsap-section
        className="relative overflow-hidden py-[var(--section-pad-y)] border-t border-white/[0.07]"
      >
        <div
          data-depth-speed="-0.14"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] z-0 sw-bg-network-wash"
        />
        <div
          data-depth-speed="0.24"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] z-[1] sw-bg-network-meridians"
        />
        <div
          data-depth-speed="-0.22"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-10%] z-[2] sw-bg-network-horizon"
        />

        <div className="relative z-10 sw-grid-12 gap-y-[clamp(2rem,3.8vw,3rem)]">
          <div className="col-span-12 lg:col-start-1 lg:col-span-6">
            <p
              data-gsap-step
              className="text-[clamp(0.76rem,0.9vw,0.86rem)] font-medium tracking-[0.14em] uppercase text-[#B97DFF] mb-3"
            >
              {NETWORK_HEADER.eyebrow}
            </p>
            <h2
              data-gsap-step
              className="font-display font-bold text-[#F5F3FF] tracking-[0.02em] leading-[1.15] text-balance"
              style={{ fontSize: 'var(--section-heading-size)' }}
            >
              {NETWORK_HEADER.title}
            </h2>
            <p
              data-gsap-step
              className="mt-4 text-[clamp(0.92rem,1.02vw,1.02rem)] text-[#B8B2CC] leading-relaxed max-w-[46ch]"
            >
              {NETWORK_HEADER.lead}
            </p>
          </div>

          <div className="col-span-12 lg:col-start-7 lg:col-span-6 flex items-end lg:justify-end">
            <div
              data-gsap-step
              role="tablist"
              aria-label="Filter network telemetry by region"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#120C24]/95 border border-white/[0.1]"
            >
              {(Object.keys(NETWORK_REGIONS) as RegionKey[]).map((key) => {
                const active = region === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => handleSelectRegion(key)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
                      active
                        ? 'bg-[#7C3AED] text-white'
                        : 'text-[#B2ACC7] hover:text-white'
                    }`}
                  >
                    {NETWORK_REGIONS[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-[var(--grid-gutter)] items-start">
            {regionKpis.map((kpi, idx) => (
              <div
                key={kpi.label}
                data-gsap-step
                className={`${KPI_OFFSET_CLASSES[idx]} rounded-lg border border-white/[0.09] bg-[#100A20]/94 p-[clamp(1.25rem,2vw,1.75rem)]`}
              >
                <p className="text-xs text-[#9C95B4]">{kpi.label}</p>
                <p
                  data-gsap-kpi-value
                  className="mt-2 font-mono font-semibold text-[clamp(1.35rem,2.2vw,2rem)] text-white tabular-nums"
                >
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          <div
            data-gsap-step
            className="col-span-12 lg:col-start-2 lg:col-span-10 rounded-lg border border-white/[0.09] bg-[#100A20]/95 overflow-x-auto"
          >
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-[#9A93B2]">
                  <th className="py-4 px-6 font-medium">Primary Corridor</th>
                  <th className="py-4 px-6 font-medium text-right">
                    Active Relays
                  </th>
                  <th className="py-4 px-6 font-medium text-right">
                    Median RTT
                  </th>
                  <th className="py-4 px-6 font-medium text-right">
                    Fabric Capacity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {currentRegion.clusters.map((row) => (
                  <tr
                    key={row.corridor}
                    className="hover:bg-white/[0.025] transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-[#F2EFFC]">
                      {row.corridor}
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums text-[#CBC5DE]">
                      {row.relays}
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums text-[#C084FC]">
                      {row.medianRtt}
                    </td>
                    <td className="py-4 px-6 text-right font-mono tabular-nums text-[#CBC5DE]">
                      {row.capacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: ABOUT — Sculpted Offset Split + Monolith Diagonal Depth
         ===================================================================== */}
      <section
        id="about"
        data-gsap-section
        className="relative overflow-hidden py-[var(--section-pad-y)] border-t border-white/[0.07]"
      >
        <div
          data-depth-speed="-0.12"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%] z-0 sw-bg-about-wash"
        />
        <div
          data-depth-speed="0.2"
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] z-[1] sw-bg-about-diagonals"
        />
        <div
          data-depth-speed="-0.26"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
        >
          <div className="absolute left-[-4%] top-[20%] w-[clamp(14rem,26vw,26rem)] h-[clamp(14rem,26vw,26rem)] border border-purple-400/10 rotate-45 bg-purple-900/[0.04]" />
          <div className="absolute right-[4%] bottom-[8%] w-[clamp(10rem,18vw,18rem)] h-[clamp(10rem,18vw,18rem)] border border-indigo-400/12 rotate-12" />
        </div>

        <div className="relative z-10 sw-grid-12 gap-y-[clamp(2.25rem,4.5vw,3.25rem)] items-start">
          <div className="col-span-12 lg:col-start-1 lg:col-span-5">
            <p
              data-gsap-step
              className="text-[clamp(0.76rem,0.9vw,0.86rem)] font-medium tracking-[0.14em] uppercase text-[#B97DFF] mb-3"
            >
              {ABOUT_CONTENT.eyebrow}
            </p>
            <h2
              data-gsap-step
              className="font-display font-bold text-[#F5F3FF] tracking-[0.02em] leading-[1.15] text-balance"
              style={{ fontSize: 'var(--section-heading-size)' }}
            >
              {ABOUT_CONTENT.title}
            </h2>
            <p
              data-gsap-step
              className="mt-5 text-[clamp(0.95rem,1.08vw,1.06rem)] text-[#C5BFD8] leading-[1.72] max-w-[48ch]"
            >
              {ABOUT_CONTENT.body}
            </p>
            <p
              data-gsap-step
              className="mt-4 text-[clamp(0.9rem,1vw,0.98rem)] text-[#9F98B8] leading-[1.7] max-w-[46ch]"
            >
              {ABOUT_CONTENT.secondaryBody}
            </p>

            <div className="mt-8 lg:ml-6 space-y-3 border-t border-white/[0.08] pt-6">
              {ABOUT_HIGHLIGHTS.map((highlight) => (
                <div
                  key={highlight.label}
                  data-gsap-step
                  className="flex flex-wrap items-baseline justify-between gap-2 text-xs"
                >
                  <span className="text-[#8E87A8]">{highlight.label}</span>
                  <span className="font-mono text-[#E3DDF5]">
                    {highlight.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-start-7 lg:col-span-6 lg:mt-8">
            <div
              data-gsap-step
              className="rounded-lg border border-white/[0.1] bg-[#110B22]/96 p-[clamp(1.5rem,2.8vw,2.35rem)]"
            >
              {submitted ? (
                <div className="py-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-[#7C3AED]/25 border border-purple-400/40 text-[#D8B4FE] mb-4">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-white">
                    Access credentials queued
                  </h3>
                  <p className="mt-2 text-sm text-[#C4BED8] leading-relaxed">
                    We registered <span className="text-white">{email}</span> for{' '}
                    <span className="text-white">{organization}</span> ({workload}
                    ). Provisioning instructions are ready in your workspace.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail('');
                      setOrganization('');
                    }}
                    className="mt-6 px-4 py-2.5 text-sm font-medium rounded border border-purple-400/35 text-[#E9D5FF] hover:border-purple-300/70 transition-colors cursor-pointer"
                  >
                    Submit another team
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitAccess} noValidate className="space-y-4">
                  <h3
                    data-gsap-step
                    className="font-display font-semibold text-[clamp(1.1rem,1.5vw,1.35rem)] text-white"
                  >
                    {ABOUT_CONTENT.formTitle}
                  </h3>
                  <p data-gsap-step className="text-sm text-[#AFA8C7]">
                    {ABOUT_CONTENT.formSubtitle}
                  </p>

                  <div
                    data-gsap-step
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                  >
                    <div>
                      <label
                        htmlFor="sw-email"
                        className="block text-xs font-medium text-[#C9C3DD] mb-1.5"
                      >
                        Work Email
                      </label>
                      <input
                        id="sw-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full h-11 px-3.5 rounded bg-[#0A0616] border border-white/[0.12] text-sm text-white placeholder:text-[#6E6787] focus:border-[#A855F7] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="sw-org"
                        className="block text-xs font-medium text-[#C9C3DD] mb-1.5"
                      >
                        Organization
                      </label>
                      <input
                        id="sw-org"
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Vertex Cloud Systems"
                        className="w-full h-11 px-3.5 rounded bg-[#0A0616] border border-white/[0.12] text-sm text-white placeholder:text-[#6E6787] focus:border-[#A855F7] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div data-gsap-step>
                    <label
                      htmlFor="sw-workload"
                      className="block text-xs font-medium text-[#C9C3DD] mb-1.5"
                    >
                      Primary Workload
                    </label>
                    <select
                      id="sw-workload"
                      value={workload}
                      onChange={(e) => setWorkload(e.target.value)}
                      className="w-full h-11 px-3.5 rounded bg-[#0A0616] border border-white/[0.12] text-sm text-white focus:border-[#A855F7] focus:outline-none"
                    >
                      {WORKLOAD_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs text-[#FCA5A5]">
                      {formError}
                    </p>
                  )}

                  <div data-gsap-step className="pt-2">
                    <button
                      type="submit"
                      className="sw-btn-primary w-full sm:w-auto cursor-pointer whitespace-nowrap"
                    >
                      Request Access
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
