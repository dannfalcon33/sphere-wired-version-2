'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check, Copy, X } from 'lucide-react';
import {
  ENCRYPTION_OPTIONS,
  REGION_NODE_OPTIONS,
} from '@/constants/sphereWired';
import type {
  EncryptionLevel,
  ModalTab,
  SphereEnergyMode,
} from '@/types/sphereWired';

gsap.registerPlugin(useGSAP);

interface NetworkConsoleModalProps {
  isOpen: boolean;
  activeTab: ModalTab;
  onChangeTab: (tab: ModalTab) => void;
  energyMode: SphereEnergyMode;
  onChangeEnergyMode: (mode: SphereEnergyMode) => void;
  onClose: () => void;
}

export default function NetworkConsoleModal({
  isOpen,
  activeTab,
  onChangeTab,
  energyMode,
  onChangeEnergyMode,
  onClose,
}: NetworkConsoleModalProps) {
  const [selectedRegion, setSelectedRegion] = useState(REGION_NODE_OPTIONS[0].id);
  const [encryptionLevel, setEncryptionLevel] =
    useState<EncryptionLevel>('post-quantum');
  const [workspaceName, setWorkspaceName] = useState('');
  const [provisionedKey, setProvisionedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dialogRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { autoAlpha: 0, y: 18, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: 'power3.out' }
        );
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    { dependencies: [isOpen, onClose], scope: dialogRef }
  );

  if (!isOpen) return null;

  const currentRegion =
    REGION_NODE_OPTIONS.find((r) => r.id === selectedRegion) ??
    REGION_NODE_OPTIONS[0];
  const currentEncryption =
    ENCRYPTION_OPTIONS.find((opt) => opt.id === encryptionLevel) ??
    ENCRYPTION_OPTIONS[0];
  const simulatedLatency = (
    currentRegion.baseLatency +
    (encryptionLevel === 'post-quantum' ? 0.6 : 0) +
    (energyMode === 'optical' ? -1.1 : energyMode === 'relay' ? -0.4 : 0)
  ).toFixed(1);

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = workspaceName.trim();
    if (cleaned.length < 3) {
      setErrorMsg('Enter a workspace name of at least 3 characters.');
      return;
    }
    setErrorMsg('');
    const slug = cleaned
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 18);
    setProvisionedKey(`sw_live_${slug}_${selectedRegion.replace('-', '')}_89f4c2`);
  };

  const handleCopyKey = async () => {
    if (!provisionedKey) return;
    try {
      await navigator.clipboard.writeText(provisionedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sw-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05030C]/88"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-xl rounded-lg border border-purple-400/30 bg-[#100A20] shadow-[0_24px_80px_rgba(0,0,0,0.75)] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.08]">
          <div>
            <h2
              id="sw-modal-title"
              className="font-display font-bold text-base sm:text-lg text-white tracking-[0.04em]"
            >
              Sphere Wired Console
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex items-center justify-center w-9 h-9 rounded border border-white/[0.1] text-[#C4BED8] hover:text-white hover:border-purple-400/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="px-6 pt-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-md bg-[#090514] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => onChangeTab('console')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'console'
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-[#A9A2C0] hover:text-white'
              }`}
            >
              Route Simulator
            </button>
            <button
              type="button"
              onClick={() => onChangeTab('deploy')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'deploy'
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-[#A9A2C0] hover:text-white'
              }`}
            >
              Provision Node
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'console' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="sim-region"
                    className="block text-xs text-[#B6B0CC] mb-1.5"
                  >
                    Ingress Exchange
                  </label>
                  <select
                    id="sim-region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full h-11 px-3 rounded bg-[#090514] border border-white/[0.12] text-sm text-white focus:border-[#A855F7] focus:outline-none"
                  >
                    {REGION_NODE_OPTIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sim-profile"
                    className="block text-xs text-[#B6B0CC] mb-1.5"
                  >
                    Sphere Routing Profile
                  </label>
                  <select
                    id="sim-profile"
                    value={energyMode}
                    onChange={(e) =>
                      onChangeEnergyMode(e.target.value as SphereEnergyMode)
                    }
                    className="w-full h-11 px-3 rounded bg-[#090514] border border-white/[0.12] text-sm text-white focus:border-[#A855F7] focus:outline-none"
                  >
                    <option value="mesh">Mesh Core (Balanced)</option>
                    <option value="optical">Optical Consensus (Low Jitter)</option>
                    <option value="relay">Edge Relay (Max Throughput)</option>
                    <option value="governance">Sovereign Policy Lock</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#B6B0CC] mb-2">Transport Cipher</p>
                <div className="grid grid-cols-2 gap-2">
                  {ENCRYPTION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEncryptionLevel(opt.id)}
                      className={`py-2.5 px-3 text-xs sm:text-sm rounded border text-center transition-colors cursor-pointer ${
                        encryptionLevel === opt.id
                          ? 'border-[#A855F7] bg-[#1E133A] text-white'
                          : 'border-white/[0.1] bg-[#090514] text-[#A49DBB] hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Route Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
                <div>
                  <p className="text-xs text-[#9B94B4]">Estimated RTT</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-[#D8B4FE] tabular-nums">
                    {simulatedLatency} ms
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9B94B4]">Mesh Hops</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-white tabular-nums">
                    {currentRegion.hops}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9B94B4]">Overhead</p>
                  <p className="mt-1 font-mono text-lg font-semibold text-white tabular-nums">
                    {currentEncryption.overhead}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onChangeTab('deploy')}
                  className="sw-btn-primary cursor-pointer whitespace-nowrap"
                >
                  Continue to Provisioning
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProvision} className="space-y-4">
              <div>
                <label
                  htmlFor="deploy-ws"
                  className="block text-xs text-[#B6B0CC] mb-1.5"
                >
                  Workspace Identifier
                </label>
                <input
                  id="deploy-ws"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. core-edge-prod"
                  className="w-full h-11 px-3.5 rounded bg-[#090514] border border-white/[0.12] text-sm text-white placeholder:text-[#6E6787] focus:border-[#A855F7] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="deploy-region"
                  className="block text-xs text-[#B6B0CC] mb-1.5"
                >
                  Primary Relay Zone
                </label>
                <select
                  id="deploy-region"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full h-11 px-3.5 rounded bg-[#090514] border border-white/[0.12] text-sm text-white focus:border-[#A855F7] focus:outline-none"
                >
                  {REGION_NODE_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {errorMsg && (
                <p role="alert" className="text-xs text-[#FCA5A5]">
                  {errorMsg}
                </p>
              )}

              {provisionedKey && (
                <div className="p-3.5 rounded bg-[#090514] border border-purple-400/35">
                  <p className="text-xs text-[#B97DFF] mb-1.5">
                    Sandbox Relay Token Generated
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <code className="font-mono text-xs text-white truncate">
                      {provisionedKey}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1B1233] text-xs text-[#E9D5FF] hover:text-white cursor-pointer shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm text-[#B8B2CC] hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="sw-btn-primary cursor-pointer whitespace-nowrap"
                >
                  Generate Sandbox Key
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
