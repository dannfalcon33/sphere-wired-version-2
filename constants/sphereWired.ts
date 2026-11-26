import type {
  AboutHighlight,
  CtaSectionContent,
  EncryptionOption,
  HeroContentConfig,
  NavLinkItem,
  ProtocolLayer,
  RegionKey,
  RegionNodeOption,
  RegionTelemetry,
  SolutionItem,
  SphereEnergyMode,
  SpherePaletteConfig,
} from '@/types/sphereWired';

export const SPHERE_MODE_PALETTES: Record<SphereEnergyMode, SpherePaletteConfig> = {
  mesh: {
    rim: 0xa855f7,
    emissive: 0xb968ff,
    accent: 0x38bdf8,
    spinMult: 1.0,
  },
  optical: {
    rim: 0xd946ef,
    emissive: 0xe879f9,
    accent: 0x818cf8,
    spinMult: 1.25,
  },
  relay: {
    rim: 0x8b5cf6,
    emissive: 0x7c3aed,
    accent: 0x22d3ee,
    spinMult: 1.4,
  },
  governance: {
    rim: 0xc084fc,
    emissive: 0xa855f7,
    accent: 0xf472b6,
    spinMult: 0.85,
  },
};

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Technology', href: '#technology' },
  { label: 'Network', href: '#network' },
  { label: 'About', href: '#about' },
];

export const HERO_CONTENT: HeroContentConfig = {
  kicker: 'THE FUTURE OF GLOBAL NETWORKING',
  headlinePrimary: 'CONNECTIVITY,',
  headlineAccent: 'REWIRED.',
  description:
    'Experience a decentralized, seamless, and high-performance digital ecosystem built on the next generation of data architecture. Take control of your network with Sphere Wired.',
  primaryCta: 'Get Started',
  secondaryCta: 'Explore Network',
};

export const SOLUTIONS_HEADER = {
  eyebrow: 'Solutions',
  title: 'Infrastructure engineered for deterministic global reach.',
  lead: 'Replace brittle single-carrier backbones with a self-healing mesh fabric sculpted for low-jitter data pipelines and sovereign edge workloads.',
};

export const SOLUTIONS_ITEMS: SolutionItem[] = [
  {
    id: 'mesh-routing',
    index: '01.',
    category: 'Routing Fabric',
    title: 'Autonomous Mesh Routing',
    summary:
      'Packets self-select optimal multi-hop paths across independent fiber and edge relays, bypassing congestion before latency spikes occur.',
    detail: '99.998% packet delivery across 64 metro corridors',
    gridPlacement: 'col-span-12 lg:col-start-1 lg:col-span-6',
  },
  {
    id: 'optical-encryption',
    index: '02.',
    category: 'Cryptographic Layer',
    title: 'Zero-Trust Optical Encryption',
    summary:
      'End-to-end post-quantum key exchange operates at the transport layer with negligible compute overhead on edge gateways.',
    detail: '256-bit lattice key rotation every 90 seconds',
    gridPlacement: 'col-span-12 lg:col-start-8 lg:col-span-5 lg:mt-20',
  },
  {
    id: 'edge-consensus',
    index: '03.',
    category: 'State Finality',
    title: 'Deterministic Edge Consensus',
    summary:
      'State synchronization across distributed validator clusters reaches finality in single-digit milliseconds without central bottlenecks.',
    detail: '4.2 ms median regional finality',
    gridPlacement: 'col-span-12 lg:col-start-2 lg:col-span-5 lg:-mt-8',
  },
  {
    id: 'elastic-bandwidth',
    index: '04.',
    category: 'Throughput Plane',
    title: 'Elastic Bandwidth Fabric',
    summary:
      'Scale cross-region throughput dynamically during burst workloads while keeping egress costs predictable and cryptographically auditable.',
    detail: '420 Gbps aggregate fabric headroom per metro zone',
    gridPlacement: 'col-span-12 lg:col-start-7 lg:col-span-6 lg:mt-10',
  },
];

export const TECHNOLOGY_HEADER = {
  eyebrow: 'Technology',
  title: 'Four layered protocols operating as one unified fabric.',
  lead: 'Inspect each architectural layer to explore engineering specifications and dynamically tune the Sphere Wired core energy profile.',
};

export const PROTOCOL_LAYERS: ProtocolLayer[] = [
  {
    id: 'mesh',
    index: '01.',
    name: 'Mesh Core',
    role: 'Transport & Discovery',
    description:
      'Peer-to-peer topology engine that continuously maps link quality, jitter, and hop cost across every participating edge relay without centralized lookup tables.',
    specs: [
      { label: 'Path Failover', value: '< 1.8 ms' },
      { label: 'Peer Discovery', value: 'DHT-v4 Federated' },
      { label: 'Packet Overhead', value: '0.64%' },
    ],
  },
  {
    id: 'optical',
    index: '02.',
    name: 'Optical Consensus',
    role: 'Verification & Finality',
    description:
      'Parallel quorum verification pipeline combining threshold signatures with low-jitter optical clocks to guarantee ordered settlement under heavy load.',
    specs: [
      { label: 'Quorum Finality', value: '4.2 ms' },
      { label: 'Byzantine Tolerance', value: '33% fault bound' },
      { label: 'Signature Scheme', value: 'BLS12-381 + Kyber' },
    ],
  },
  {
    id: 'relay',
    index: '03.',
    name: 'Edge Relay',
    role: 'Ingress & Routing',
    description:
      'Hardware-accelerated ingress nodes placed at IXP exchanges worldwide, terminating client tunnels close to users and multiplexing traffic onto the core mesh.',
    specs: [
      { label: 'Active IXP Points', value: '148 Exchanges' },
      { label: 'Tunnel Setup', value: '0-RTT Handshake' },
      { label: 'Peak Throughput', value: '1.4 Tbps' },
    ],
  },
  {
    id: 'governance',
    index: '04.',
    name: 'Autonomous Governance',
    role: 'Policy & Telemetry',
    description:
      'Declarative routing policies let organizations enforce data residency, compliance boundaries, and failover priorities programmatically across every node.',
    specs: [
      { label: 'Policy Propagation', value: '120 ms global' },
      { label: 'Audit Retention', value: 'Cryptographic log' },
      { label: 'Jurisdiction Locks', value: '42 Regions' },
    ],
  },
];

export const NETWORK_HEADER = {
  eyebrow: 'Network',
  title: 'Measured capacity across every sovereign region.',
  lead: 'Continuous corridor benchmarks verified across independent exchange operators and encrypted edge relays.',
};

export const NETWORK_REGIONS: Record<RegionKey, RegionTelemetry> = {
  global: {
    label: 'Global Mesh',
    nodes: '14,820',
    latency: '11.4 ms',
    throughput: '1.42 Tbps',
    uptime: '99.998%',
    clusters: [
      { corridor: 'Ashburn — Frankfurt', relays: '3,410', medianRtt: '72.4 ms', capacity: '380 Gbps' },
      { corridor: 'Frankfurt — Singapore', relays: '2,890', medianRtt: '138.2 ms', capacity: '310 Gbps' },
      { corridor: 'Tokyo — San Jose', relays: '2,640', medianRtt: '94.6 ms', capacity: '340 Gbps' },
      { corridor: 'London — Sao Paulo', relays: '1,920', medianRtt: '146.1 ms', capacity: '220 Gbps' },
    ],
  },
  na: {
    label: 'North America',
    nodes: '5,420',
    latency: '8.2 ms',
    throughput: '540 Gbps',
    uptime: '99.999%',
    clusters: [
      { corridor: 'New York — Ashburn', relays: '1,540', medianRtt: '4.1 ms', capacity: '180 Gbps' },
      { corridor: 'Chicago — Dallas', relays: '1,210', medianRtt: '16.8 ms', capacity: '130 Gbps' },
      { corridor: 'San Jose — Seattle', relays: '1,480', medianRtt: '14.2 ms', capacity: '150 Gbps' },
      { corridor: 'Toronto — Montreal', relays: '1,190', medianRtt: '7.4 ms', capacity: '80 Gbps' },
    ],
  },
  eu: {
    label: 'Europe',
    nodes: '4,890',
    latency: '7.6 ms',
    throughput: '490 Gbps',
    uptime: '99.998%',
    clusters: [
      { corridor: 'Frankfurt — Amsterdam', relays: '1,490', medianRtt: '5.3 ms', capacity: '160 Gbps' },
      { corridor: 'London — Paris', relays: '1,320', medianRtt: '6.1 ms', capacity: '140 Gbps' },
      { corridor: 'Zurich — Milan', relays: '1,040', medianRtt: '4.8 ms', capacity: '100 Gbps' },
      { corridor: 'Stockholm — Warsaw', relays: '1,040', medianRtt: '13.5 ms', capacity: '90 Gbps' },
    ],
  },
  apac: {
    label: 'Asia-Pacific',
    nodes: '4,510',
    latency: '12.9 ms',
    throughput: '390 Gbps',
    uptime: '99.997%',
    clusters: [
      { corridor: 'Tokyo — Osaka', relays: '1,380', medianRtt: '5.9 ms', capacity: '130 Gbps' },
      { corridor: 'Singapore — Hong Kong', relays: '1,260', medianRtt: '28.4 ms', capacity: '115 Gbps' },
      { corridor: 'Seoul — Tokyo', relays: '1,020', medianRtt: '24.7 ms', capacity: '85 Gbps' },
      { corridor: 'Sydney — Singapore', relays: '850', medianRtt: '76.3 ms', capacity: '60 Gbps' },
    ],
  },
};

export const REGION_NODE_OPTIONS: RegionNodeOption[] = [
  { id: 'us-east', label: 'US-East (Ashburn)', baseLatency: 8.4, hops: 2 },
  { id: 'eu-central', label: 'EU-Central (Frankfurt)', baseLatency: 11.2, hops: 3 },
  { id: 'ap-northeast', label: 'AP-Northeast (Tokyo)', baseLatency: 14.8, hops: 3 },
  { id: 'sa-east', label: 'SA-East (Sao Paulo)', baseLatency: 19.6, hops: 4 },
];

export const ENCRYPTION_OPTIONS: EncryptionOption[] = [
  { id: 'post-quantum', label: 'Post-Quantum Lattice', overhead: '0.68%' },
  { id: 'standard', label: 'AES-256-GCM Direct', overhead: '0.41%' },
];

export const WORKLOAD_OPTIONS: string[] = [
  'Edge Relay Cluster',
  'Cross-Region Financial Mesh',
  'Private AI Inference Backbone',
  'Sovereign Data Routing',
];

export const ABOUT_CONTENT = {
  eyebrow: 'About Sphere Wired',
  title: 'Built by network engineers for resilient digital sovereignty.',
  body: 'Sphere Wired eliminates centralized chokepoints by uniting independent optical carriers, regional edge operators, and cryptographic verification under a single programmable fabric.',
  secondaryBody:
    'Every relay operates under deterministic routing policies, giving enterprise and infrastructure teams full visibility into where packets travel and how keys are verified.',
  formTitle: 'Request Private Network Access',
  formSubtitle:
    'Receive dedicated relay credentials and sandbox capacity for your engineering team.',
};

export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  { label: 'Compliance Alignment', value: 'ISO/IEC 27001 & SOC 2 Type II' },
  { label: 'Interconnect Footprint', value: '148 Global Exchange Points' },
  { label: 'Wire Specification', value: 'Open Auditable Protocol' },
];

export const CTA_SECTION_CONTENT: CtaSectionContent = {
  kicker: 'GLOBAL MESH ACTIVATION',
  headlinePrimary: 'YOUR NETWORK,',
  headlineAccent: 'UNBOUND.',
  description:
    'Step directly into the decentralized Sphere Wired fabric. Simulate encrypted corridors, inspect sovereign routes, and activate your edge relay footprint in seconds.',
  ctaLabel: 'Launch App',
  footnote: '148 Exchange Points · Zero-Trust Optical Transport · Deterministic Finality',
};
