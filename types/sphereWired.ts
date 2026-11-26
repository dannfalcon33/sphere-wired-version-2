export type SphereEnergyMode = 'mesh' | 'optical' | 'relay' | 'governance';

export type RegionKey = 'global' | 'na' | 'eu' | 'apac';

export type ModalTab = 'console' | 'deploy';

export type EncryptionLevel = 'standard' | 'post-quantum';

export type LegalDocId = 'terms' | 'privacy' | 'disclaimer' | 'security';

export interface SpherePaletteConfig {
  rim: number;
  emissive: number;
  accent: number;
  spinMult: number;
}

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface HeroContentConfig {
  kicker: string;
  headlinePrimary: string;
  headlineAccent: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface SolutionItem {
  id: string;
  index: string;
  category: string;
  title: string;
  summary: string;
  detail: string;
  gridPlacement: string;
}

export interface ProtocolSpec {
  label: string;
  value: string;
}

export interface ProtocolLayer {
  id: SphereEnergyMode;
  index: string;
  name: string;
  role: string;
  description: string;
  specs: ProtocolSpec[];
}

export interface RegionCluster {
  corridor: string;
  relays: string;
  medianRtt: string;
  capacity: string;
}

export interface RegionTelemetry {
  label: string;
  nodes: string;
  latency: string;
  throughput: string;
  uptime: string;
  clusters: RegionCluster[];
}

export interface RegionNodeOption {
  id: string;
  label: string;
  baseLatency: number;
  hops: number;
}

export interface EncryptionOption {
  id: EncryptionLevel;
  label: string;
  overhead: string;
}

export interface AboutHighlight {
  label: string;
  value: string;
}

export interface CtaSectionContent {
  kicker: string;
  headlinePrimary: string;
  headlineAccent: string;
  description: string;
  ctaLabel: string;
  footnote: string;
}

export interface FooterLinkItem {
  label: string;
  href?: string;
  action?: 'console' | 'deploy' | LegalDocId;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLinkItem[];
}

export interface FooterDisclaimerItem {
  id: string;
  title: string;
  body: string;
}

export interface LegalDocumentSection {
  heading: string;
  body: string;
}

export interface LegalDocument {
  id: LegalDocId;
  title: string;
  updatedAt: string;
  summary: string;
  sections: LegalDocumentSection[];
}
