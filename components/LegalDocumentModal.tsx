'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';
import { LEGAL_DOCUMENTS } from '@/constants/footer';
import type { LegalDocId } from '@/types/sphereWired';

gsap.registerPlugin(useGSAP);

interface LegalDocumentModalProps {
  docId: LegalDocId | null;
  onSelectDoc: (id: LegalDocId) => void;
  onClose: () => void;
}

const DOC_TABS: Array<{ id: LegalDocId; label: string }> = [
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'disclaimer', label: 'Risk Disclaimer' },
  { id: 'security', label: 'Security Policy' },
];

export default function LegalDocumentModal({
  docId,
  onSelectDoc,
  onClose,
}: LegalDocumentModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!docId) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { autoAlpha: 0, y: 16, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: 'power3.out' }
        );
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    { dependencies: [docId, onClose], scope: panelRef }
  );

  if (!docId) return null;

  const doc = LEGAL_DOCUMENTS[docId];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sw-legal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020106]/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-lg border border-white/[0.12] bg-[#0B0716] shadow-[0_28px_90px_rgba(0,0,0,0.85)] overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/[0.08]">
          <div>
            <p className="text-xs font-mono text-[#B97DFF]">{doc.updatedAt}</p>
            <h2
              id="sw-legal-title"
              className="mt-1 font-display font-bold text-base sm:text-lg text-white tracking-[0.03em]"
            >
              {doc.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal document"
            className="inline-flex items-center justify-center w-9 h-9 rounded border border-white/[0.1] text-[#B8B2CC] hover:text-white hover:border-purple-400/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Legal Document Switcher Tabs */}
        <div className="px-6 pt-3 pb-3 border-b border-white/[0.06] bg-[#070410] overflow-x-auto">
          <div className="inline-flex items-center gap-1.5">
            {DOC_TABS.map((tab) => {
              const active = tab.id === docId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectDoc(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#7C3AED] text-white'
                      : 'text-[#A6A0BD] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Legal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-sm text-[#CFC9E2] leading-relaxed">{doc.summary}</p>

          <div className="space-y-5">
            {doc.sections.map((section) => (
              <div
                key={section.heading}
                className="pt-4 border-t border-white/[0.06] first:border-t-0 first:pt-0"
              >
                <h3 className="text-sm font-semibold text-white">
                  {section.heading}
                </h3>
                <p className="mt-2 text-sm text-[#B3ADC8] leading-[1.72]">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#070410] flex items-center justify-between gap-4">
          <span className="text-xs text-[#8881A2]">
            Sphere Wired Foundation AG · Zurich
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded border border-purple-400/40 text-white hover:border-purple-300/80 transition-colors cursor-pointer whitespace-nowrap"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
