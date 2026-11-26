import type {
  FooterDisclaimerItem,
  FooterLinkGroup,
  LegalDocId,
  LegalDocument,
} from '@/types/sphereWired';

export const FOOTER_BRAND_INFO = {
  entity: 'Sphere Wired Foundation AG',
  registration: 'Registered in Zurich, Switzerland · Commercial Reg. CHE-418.920.314',
  summary:
    'Decentralized optical routing fabric and deterministic edge infrastructure engineered for sovereign enterprise connectivity worldwide.',
  headquarters: 'Bahnhofstrasse 42, 8001 Zurich · San Francisco · Singapore',
  contacts: [
    { label: 'General & Enterprise', value: 'network@spherewired.io' },
    { label: 'Security & PGP', value: 'security@spherewired.io' },
    { label: 'Legal & Compliance', value: 'legal@spherewired.io' },
  ],
  certifications: ['ISO/IEC 27001', 'SOC 2 Type II', 'GDPR Compliant', 'Zero-Knowledge Transport'],
};

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: 'Architecture',
    links: [
      { label: 'Mesh Routing Solutions', href: '#solutions' },
      { label: 'Protocol Stack', href: '#technology' },
      { label: 'Regional Telemetry', href: '#network' },
      { label: 'About Sphere Wired', href: '#about' },
    ],
  },
  {
    heading: 'Operations',
    links: [
      { label: 'Route Simulator', action: 'console' },
      { label: 'Provision Sandbox Node', action: 'deploy' },
      { label: 'Corridor Benchmarks', href: '#network' },
      { label: 'Request Private Access', href: '#about' },
    ],
  },
  {
    heading: 'Legal & Governance',
    links: [
      { label: 'Terms & Conditions', action: 'terms' },
      { label: 'Privacy Policy', action: 'privacy' },
      { label: 'Network Risk Disclaimer', action: 'disclaimer' },
      { label: 'Security & Disclosure Policy', action: 'security' },
    ],
  },
];

export const FOOTER_DISCLAIMERS: FooterDisclaimerItem[] = [
  {
    id: 'performance-disclaimer',
    title: 'Telemetry & Benchmark Disclaimer',
    body: 'Latency, propagation time, throughput capacity, and uptime figures displayed across this website reflect rolling 30-day observations across benchmarked IXP peering corridors. Actual transport performance depends on last-mile carrier routing, local regulatory filtering, hardware acceleration, and workload packet profiles. No benchmark constitutes a binding service level guarantee outside an executed enterprise master agreement.',
  },
  {
    id: 'infrastructure-disclaimer',
    title: 'Non-Custodial Routing & Compliance Notice',
    body: 'Sphere Wired operates a zero-trust, non-custodial transport layer. Organizations deploying nodes or private relay keys remain solely responsible for cryptographic key custody, endpoint security, export-control compliance, and adherence to local telecommunications and data residency regulations within their operating jurisdictions.',
  },
  {
    id: 'terms-summary',
    title: 'Terms, Conditions & Intellectual Property',
    body: 'Access to the Sphere Wired web portal, route simulator, and sandbox provisioning tools is governed by our Terms & Conditions and Acceptable Use Policy. Prohibited uses include unauthorized network probing, volumetric traffic amplification, or circumvention of statutory sanctions. All trademarks, architectural diagrams, and interface designs are the property of Sphere Wired Foundation AG.',
  },
];

export const LEGAL_DOCUMENTS: Record<LegalDocId, LegalDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms & Conditions of Network Use',
    updatedAt: 'Effective November 1, 2026',
    summary:
      'These Terms & Conditions govern access to the Sphere Wired web application, interactive route simulation utilities, sandbox relay keys, and related protocol documentation.',
    sections: [
      {
        heading: '1. Scope of Services & Sandbox Environments',
        body: 'Sphere Wired provides decentralized transport routing specifications, interactive corridor telemetry previews, and sandbox provisioning tokens for evaluation purposes. Production SLA commitments, dedicated fiber capacity, and custom jurisdictional routing policies require a separate executed Enterprise Order Form.',
      },
      {
        heading: '2. Acceptable Use & Prohibited Conduct',
        body: 'Users and node operators agree not to transmit unlawful payloads, conduct denial-of-service attacks, probe third-party relays without explicit written authorization, or impersonate sovereign routing policies. Sphere Wired reserves the right to revoke sandbox credentials immediately upon detection of abusive traffic patterns.',
      },
      {
        heading: '3. Cryptographic Keys & Operator Responsibility',
        body: 'Because Sphere Wired enforces end-to-end zero-trust encryption, lost private relay keys cannot be recovered by Sphere Wired Foundation AG. Operators are solely responsible for secure key generation, rotation schedules, and access control within their environments.',
      },
      {
        heading: '4. Limitation of Liability & Governing Law',
        body: 'To the fullest extent permitted by applicable law, Sphere Wired Foundation AG provides evaluation tools and web documentation on an "as-is" and "as-available" basis without implied warranties of merchantability or fitness for a particular purpose. These terms are governed by the substantive laws of Switzerland, with exclusive venue in Zurich.',
      },
    ],
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy & Data Minimization Policy',
    updatedAt: 'Effective November 1, 2026',
    summary:
      'Sphere Wired applies strict data minimization across both our transport protocol and our public web presence.',
    sections: [
      {
        heading: '1. Information You Voluntarily Provide',
        body: 'When you submit a Private Network Access request or provision a sandbox workspace identifier, we process only the business contact details (work email, organization name, and selected workload category) needed to fulfill onboarding and compliance verification.',
      },
      {
        heading: '2. Zero-Payload Inspection Architecture',
        body: 'Transport packets routed through Sphere Wired edge relays are encrypted end-to-end prior to ingress. Relays observe only transient routing headers required for hop selection and do not inspect, store, or monetize payload contents.',
      },
      {
        heading: '3. Retention & Data Subject Rights',
        body: 'Onboarding inquiries are retained only as long as necessary to establish or manage a commercial relationship. Under GDPR and the Swiss Federal Act on Data Protection (FADP), you may request access, rectification, portability, or erasure by writing to legal@spherewired.io.',
      },
    ],
  },
  disclaimer: {
    id: 'disclaimer',
    title: 'Network Performance & Risk Disclaimer',
    updatedAt: 'Effective November 1, 2026',
    summary:
      'Important disclosures regarding simulated metrics, decentralized routing variability, and forward-looking engineering descriptions.',
    sections: [
      {
        heading: '1. Representative Telemetry & Route Simulation',
        body: 'Corridor RTT metrics, node counts, and estimated latency outputs inside the Route Simulator are illustrative engineering figures derived from historical multi-region measurements. Real-world latency fluctuates with physical submarine cable maintenance, regional BGP announcements, and client access networks.',
      },
      {
        heading: '2. Decentralized Infrastructure Risks',
        body: 'Distributed peer-to-peer networks depend on independent infrastructure operators across multiple jurisdictions. While autonomous failover mitigates isolated node outages, unforeseen software defects, cryptographic breakthroughs, or regional regulatory directives may impact availability.',
      },
      {
        heading: '3. No Financial or Investment Solicitation',
        body: 'Nothing published on this website constitutes financial, legal, or investment advice, nor an offer to sell or solicitation to buy any digital asset, token, or security in any jurisdiction.',
      },
    ],
  },
  security: {
    id: 'security',
    title: 'Security Architecture & Vulnerability Disclosure',
    updatedAt: 'Effective November 1, 2026',
    summary:
      'Guidelines for coordinated vulnerability disclosure and cryptographic assurance across Sphere Wired infrastructure.',
    sections: [
      {
        heading: '1. Cryptographic Standards',
        body: 'Sphere Wired transport channels employ hybrid post-quantum key encapsulation paired with authenticated symmetric ciphers and automated 90-second ephemeral session rotation.',
      },
      {
        heading: '2. Coordinated Vulnerability Disclosure',
        body: 'Security researchers who identify potential vulnerabilities in the Sphere Wired protocol, relay software, or web infrastructure are invited to report findings confidentially to security@spherewired.io. We commit to acknowledging verified submissions within 24 hours and coordinating remediation prior to public disclosure.',
      },
      {
        heading: '3. Safe Harbor',
        body: 'Good-faith security research conducted exclusively against designated sandbox endpoints without accessing third-party customer data or degrading network availability will not result in legal action by Sphere Wired Foundation AG.',
      },
    ],
  },
};
