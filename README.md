# Sphere Wired — Connectivity, Rewired.

[Español](#español) · [English](#english) · [Português (Brasil)](#português-brasil)

---

<a id="español"></a>
## Español

Aplicación web interactiva de alto impacto visual para **Sphere Wired**, diseñada a partir de un mockup conceptual de arquitectura de red descentralizada. Combina un sistema de maquetación basado en **CSS Grid de 12 columnas** con tipografía y espaciados fluidos mediante `clamp()`, animaciones y paralaje multicapa impulsados al 100% por **GSAP** (sin `useEffect`), y una **esfera mecánica 3D interactiva** construida proceduralmente con **Three.js**.

### Agente, Modelo de IA y Herramientas Utilizadas

- **Entorno y Agente**: **Google AI Studio Build** — agente de ingeniería de software encargado del diseño arquitectónico, descomposición modular, escritura de código, refactorización y verificación de compilación/linting.
- **Modelo de IA**: **Gemini 4 Neon** (`models/gemini-4-neon`).
- **Herramientas empleadas durante el desarrollo**:
  - Inspección visual del mockup de referencia para replicar paleta, tipografía, encuadre HUD y profundidad lumínica.
  - Gestión de dependencias NPM (`three`, `@types/three`, `gsap`, `@gsap/react`).
  - Verificación automatizada de compilación de producción con Next.js (`npm run build`) y análisis estático con ESLint 9 (`npm run lint`).
  - Generación procedural de texturas PBR en HTML5 Canvas y diseño vectorial SVG para el favicon de la esfera 3D.

### Stack Tecnológico

| Capa | Tecnología | Rol en el proyecto |
| --- | --- | --- |
| **Framework** | Next.js 15+ (App Router) & React 19 | Enrutamiento, renderizado SSR/Client Components, metadatos SEO y optimización de fuentes |
| **Lenguaje** | TypeScript 5 | Tipado estricto y centralizado de contenidos, telemetría, modos 3D y documentos legales |
| **Estilos & Layout** | Tailwind CSS v4 + CSS Grid 12 cols + `clamp()` | Maquetación fluida en 12 columnas, tokens responsivos y patrones multicapa por sección |
| **Tipografía** | `Orbitron`, `Plus Jakarta Sans`, `JetBrains Mono` | Jerarquía futurista geométrica (display), lectura limpia (cuerpo) y figuras tabulares (métricas) |
| **Animación & Scroll** | GSAP 3 + `@gsap/react` (`useGSAP`, `ScrollTrigger`, `ScrollTrigger.batch`, `quickTo`, `ticker`) | Coreografía de entrada, microtransiciones, paralaje reactivo al cursor, barra global de progreso y revelados al hacer scroll sin `useEffect` |
| **Gráficos 3D** | Three.js (`WebGLRenderer`, `MeshPhysicalMaterial`, `RoomEnvironment`, `ShaderMaterial`, `InstancedMesh`) | Escultura 3D procedural de la esfera metálica obsidiana-violeta con rotación automática e interacción `mousemove` + `lerp` |
| **Iconografía** | Lucide React | Iconos funcionales de interfaz (navegación móvil, cierre de modales, flechas, copiado) |

### Estructura del Proyecto

```text
/
├── index.html                        # Documento HTML descriptivo con metadatos SEO, OpenGraph, JSON-LD y favicon SVG
├── metadata.json                     # Metadatos del applet en AI Studio
├── README.md                         # Documentación multilingüe (ES / EN / PT-BR)
├── public/
│   └── favicon.svg                   # Recreación vectorial SVG de la esfera 3D del Hero
├── app/
│   ├── icon.svg                      # Favicon nativo de Next.js App Router (esfera 3D)
│   ├── layout.tsx                    # RootLayout, carga de Google Fonts y metadatos SEO sincronizados
│   ├── page.tsx                      # Punto de entrada principal (Server Component)
│   └── globals.css                   # Tokens clamp(), .sw-grid-12, estilos HUD y capas de fondo por sección
├── types/
│   └── sphereWired.ts                # Interfaces y tipos TypeScript centralizados
├── constants/
│   ├── sphereWired.ts                # Copy, paletas 3D, soluciones, protocolos, telemetría regional y CTA
│   └── footer.ts                     # Datos corporativos, columnas del footer, disclaimers y textos legales completos
├── lib/
│   ├── sphereTextures.ts             # Generador procedural de mapas PBR (albedo, bump, roughness, emissive y partículas)
│   └── utils.ts                      # Utilidades compartidas
└── components/
    ├── SphereWiredApp.tsx            # Orquestador cliente de estado (perfil 3D, modales y navegación)
    ├── ScrollProgressBar.tsx         # Barra global fija superior sincronizada con GSAP ScrollTrigger (scaleX)
    ├── Header.tsx                    # Barra de navegación fija en 12 columnas con CTA Launch App y microtransiciones GSAP
    ├── HeroSection.tsx               # Hero en 12 columnas con 6 capas de profundidad GSAP y la esfera 3D
    ├── WiredSphereCanvas.tsx         # Escena WebGL Three.js de la esfera 3D con mousemove + lerp y ticker GSAP
    ├── ContentSections.tsx           # Secciones Solutions, Technology, Network y About con layouts abstractos y fondos únicos
    ├── CtaSection.tsx                # Sección Call to Action final oscura de máximo impacto con paralaje al cursor (sin 3D)
    ├── Footer.tsx                    # Footer oscuro en 12 columnas con información corporativa, disclaimers y acceso legal
    ├── NetworkConsoleModal.tsx       # Consola interactiva Launch App (Simulador de Rutas + Aprovisionamiento de Nodos)
    └── LegalDocumentModal.tsx        # Visor modal de Términos y Condiciones, Privacidad, Riesgos y Seguridad
```

### Cómo Funciona

1. **Layout Responsivo en Grid de 12 Columnas y `clamp()`**: Todas las secciones comparten `.sw-grid-12` con márgenes, canaletas y escala tipográfica controlados con `clamp()` para escalar de forma fluida entre móvil y escritorio.
2. **Arquitectura 100% GSAP (Sin `useEffect`)**: Utiliza `useGSAP` y `contextSafe` para la barra superior de progreso (`ScrollProgressBar`), el `gsap.timeline` de entrada del Hero, el paralaje reactivo al cursor con `gsap.quickTo`, las microtransiciones de botones y el revelado uno a uno al hacer scroll mediante `ScrollTrigger.batch`.
3. **Esfera 3D Interactiva en Three.js**: Modelo procedural compuesto de múltiples piezas (núcleo con mapas PBR generados en Canvas, coronas polares concéntricas con dientes instanciados, bandas metálicas, halo Fresnel GLSL, 3 anillos orbitales con nodos deslizantes y partículas 3D). Rota lentamente de forma automática y responde al cursor mediante `mousemove` + `lerp`, ejecutándose con `gsap.ticker` en GPU y pacing `afterDraw` en WebGL por software.
4. **Flujos Interactivos**: **Get Started** hace scroll suave hacia la sección CTA final de alto impacto (`#get-started`) con un único botón **Launch App** y capas oscuras reactivas al cursor sin esfera 3D; **Explore Network** navega a `#network`; **Launch App** abre el simulador de rutas y aprovisionamiento de nodos; y los enlaces del **Footer** abren el visor modal con los documentos legales completos.

### Ejecución Local

```bash
npm install
npm run dev      # Servidor de desarrollo en el puerto 3000
npm run lint     # Verificación estática con ESLint
npm run build    # Compilación de producción
```

---

<a id="english"></a>
## English

An interactive, high-impact web application for **Sphere Wired**, built from a conceptual decentralized networking mockup. It combines a **12-column CSS Grid** layout system with fluid `clamp()` typography and spacing, 100% **GSAP**-driven animations and multi-layer parallax (zero `useEffect`), and a procedural interactive **3D mechanical sphere** rendered with **Three.js**.

### Agent, AI Model & Tools Used

- **Environment & Agent**: **Google AI Studio Build** — software engineering agent responsible for architectural design, modular decomposition, code implementation, refactoring, and build/lint verification.
- **AI Model**: **Gemini 4 Neon** (`models/gemini-4-neon`).
- **Tools used during development**:
  - Visual analysis of the reference mockup to match color palette, typography, HUD framing, and atmospheric depth.
  - NPM package management (`three`, `@types/three`, `gsap`, `@gsap/react`).
  - Automated Next.js production compilation (`npm run build`) and ESLint 9 static validation (`npm run lint`).
  - Procedural HTML5 Canvas PBR texture generation and custom vector SVG creation for the 3D sphere favicon.

### Tech Stack

| Layer | Technology | Role in the project |
| --- | --- | --- |
| **Framework** | Next.js 15+ (App Router) & React 19 | Routing, SSR/Client Components, SEO metadata, and font optimization |
| **Language** | TypeScript 5 | Strict centralized typing for content, telemetry, 3D energy modes, and legal docs |
| **Styling & Layout** | Tailwind CSS v4 + 12-Col CSS Grid + `clamp()` | Fluid 12-column layout, responsive tokens, and distinct multi-layer section backgrounds |
| **Typography** | `Orbitron`, `Plus Jakarta Sans`, `JetBrains Mono` | Geometric sci-fi display hierarchy, crisp body copy, and tabular numerals for metrics |
| **Animation & Scroll** | GSAP 3 + `@gsap/react` (`useGSAP`, `ScrollTrigger`, `ScrollTrigger.batch`, `quickTo`, `ticker`) | Entrance choreography, microtransitions, cursor parallax, global progress bar, and scroll reveals without `useEffect` |
| **3D Graphics** | Three.js (`WebGLRenderer`, `MeshPhysicalMaterial`, `RoomEnvironment`, `ShaderMaterial`, `InstancedMesh`) | Procedural multi-part obsidian-violet metallic 3D sphere with slow auto-rotation and `mousemove` + `lerp` interaction |
| **Icons** | Lucide React | Functional UI icons (mobile drawer toggle, modal close, directional arrows, copy confirmation) |

### Project Structure

```text
/
├── index.html                        # Descriptive HTML metadata document (SEO, OpenGraph, JSON-LD, SVG favicon)
├── metadata.json                     # AI Studio applet metadata
├── README.md                         # Multilingual documentation (ES / EN / PT-BR)
├── public/
│   └── favicon.svg                   # Vector SVG recreation of the Hero 3D sphere
├── app/
│   ├── icon.svg                      # Native Next.js App Router favicon (3D sphere)
│   ├── layout.tsx                    # RootLayout, Google Fonts setup, and synchronized SEO metadata
│   ├── page.tsx                      # Main Server Component entry point
│   └── globals.css                   # clamp() tokens, .sw-grid-12, HUD controls, and per-section depth backgrounds
├── types/
│   └── sphereWired.ts                # Centralized TypeScript interfaces and union types
├── constants/
│   ├── sphereWired.ts                # Hero, Solutions, Protocol stack, Network telemetry, 3D palettes, and CTA copy
│   └── footer.ts                     # Corporate details, footer directory, disclaimers, and full legal documents
├── lib/
│   ├── sphereTextures.ts             # Procedural PBR map generator (albedo, bump, roughness, emissive, particles)
│   └── utils.ts                      # Shared utility helpers
└── components/
    ├── SphereWiredApp.tsx            # Client state orchestrator (3D mode, modals, smooth navigation)
    ├── ScrollProgressBar.tsx         # Fixed top-edge global scroll indicator driven by GSAP ScrollTrigger (scaleX)
    ├── Header.tsx                    # Fixed 12-column header with Launch App HUD button and GSAP microtransitions
    ├── HeroSection.tsx               # 12-column Hero with 6 GSAP depth layers and the interactive 3D sphere
    ├── WiredSphereCanvas.tsx         # Three.js WebGL 3D sphere scene with mousemove + lerp and GSAP ticker
    ├── ContentSections.tsx           # Solutions, Technology, Network, and About with abstract layouts and unique depth layers
    ├── CtaSection.tsx                # High-impact dark final CTA section with cursor-reactive GSAP layers (no 3D sphere)
    ├── Footer.tsx                    # Dark 12-column footer with corporate registration, disclaimers, and legal links
    ├── NetworkConsoleModal.tsx       # Interactive Launch App console (Route Simulator + Sandbox Node Provisioning)
    └── LegalDocumentModal.tsx        # Accessible modal viewer for Terms & Conditions, Privacy, Disclaimer, and Security
```

### How It Works

1. **12-Column CSS Grid & `clamp()` Fluid System**: Every section uses `.sw-grid-12` alongside `clamp()` tokens for gutters, container padding, and typography so layouts adapt seamlessly from mobile to 1440px+ desktop viewports.
2. **100% GSAP Lifecycle (Zero `useEffect`)**: All motion and scroll hooks run through `useGSAP` and `contextSafe`—powering the top GPU-composited `ScrollProgressBar`, the Hero entrance `gsap.timeline`, cursor parallax via `gsap.quickTo`, button/tab microtransitions, and element-by-element viewport reveals via `ScrollTrigger.batch`.
3. **Procedural Three.js 3D Sphere**: Built as a composite multi-part `THREE.Group` (PBR-textured armored core, concentric polar turbine crowns with instanced teeth, metallic ribs, custom GLSL Fresnel rim halo, 3 orbital wire loops with sliding instanced nodes, and 3D particles). It auto-rotates slowly and smoothly interpolates cursor movement via `mousemove` + `lerp`, paced by `gsap.ticker` on GPUs and `afterDraw` on software WebGL.
4. **Interactive Flows**: **Get Started** scrolls smoothly to the darker high-impact final CTA section (`#get-started`) featuring a single **Launch App** button and cursor-reactive layered depth without the 3D sphere; **Explore Network** jumps to `#network`; **Launch App** opens the Route Simulator & Node Provisioning console; and **Footer** legal links open full readable policies inside `LegalDocumentModal`.

### Running Locally

```bash
npm install
npm run dev      # Start development server on port 3000
npm run lint     # Run ESLint static checks
npm run build    # Build for production
```

---

<a id="português-brasil"></a>
## Português (Brasil)

Aplicação web interativa de alto impacto visual para a **Sphere Wired**, construída a partir de um mockup conceitual de arquitetura de rede descentralizada. Combina um sistema de layout baseado em **CSS Grid de 12 colunas** com tipografia e espaçamentos fluidos via `clamp()`, animações e paralaxe em múltiplas camadas conduzidos 100% por **GSAP** (sem `useEffect`) e uma **esfera mecânica 3D interativa** criada proceduralmente com **Three.js**.

### Agente, Modelo de IA e Ferramentas Utilizadas

- **Ambiente e Agente**: **Google AI Studio Build** — agente de engenharia de software responsável pela arquitetura, organização modular, escrita de código, refatoração e validação de compilação e linting.
- **Modelo de IA**: **Gemini 4 Neon** (`models/gemini-4-neon`).
- **Ferramentas utilizadas no desenvolvimento**:
  - Análise visual do mockup de referência para reproduzir paleta de cores, tipografia, molduras HUD e profundidade luminosa.
  - Gerenciamento de dependências NPM (`three`, `@types/three`, `gsap`, `@gsap/react`).
  - Verificação automatizada de build de produção com Next.js (`npm run build`) e análise estática com ESLint 9 (`npm run lint`).
  - Geração procedural de texturas PBR em HTML5 Canvas e criação vetorial em SVG do favicon da esfera 3D.

### Stack Tecnológica

| Camada | Tecnologia | Papel no projeto |
| --- | --- | --- |
| **Framework** | Next.js 15+ (App Router) & React 19 | Roteamento, SSR/Client Components, metadados de SEO e otimização de fontes |
| **Linguagem** | TypeScript 5 | Tipagem estrita e centralizada para conteúdos, telemetria, modos 3D e documentos legais |
| **Estilos & Layout** | Tailwind CSS v4 + CSS Grid 12 cols + `clamp()` | Maquetação fluida em 12 colunas, tokens responsivos e planos de fundo exclusivos por seção |
| **Tipografia** | `Orbitron`, `Plus Jakarta Sans`, `JetBrains Mono` | Hierarquia futurista geométrica (títulos), leitura limpa (corpo) e numerais tabulares (métricas) |
| **Animação & Scroll** | GSAP 3 + `@gsap/react` (`useGSAP`, `ScrollTrigger`, `ScrollTrigger.batch`, `quickTo`, `ticker`) | Coreografia de entrada, microtransições, paralaxe reativo ao cursor, barra global de progresso e revelações ao rolar sem `useEffect` |
| **Gráficos 3D** | Three.js (`WebGLRenderer`, `MeshPhysicalMaterial`, `RoomEnvironment`, `ShaderMaterial`, `InstancedMesh`) | Escultura 3D procedural da esfera metálica obsidiana-violeta com rotação automática lenta e interação `mousemove` + `lerp` |
| **Ícones** | Lucide React | Ícones funcionais de interface (menu mobile, fechamento de modais, setas, cópia de chaves) |

### Estrutura do Projeto

```text
/
├── index.html                        # Documento HTML descritivo com metadados SEO, OpenGraph, JSON-LD e favicon SVG
├── metadata.json                     # Metadados do applet no AI Studio
├── README.md                         # Documentação multilíngue (ES / EN / PT-BR)
├── public/
│   └── favicon.svg                   # Recriação vetorial em SVG da esfera 3D do Hero
├── app/
│   ├── icon.svg                      # Favicon nativo do Next.js App Router (esfera 3D)
│   ├── layout.tsx                    # RootLayout, fontes do Google e metadados SEO sincronizados
│   ├── page.tsx                      # Ponto de entrada principal (Server Component)
│   └── globals.css                   # Tokens clamp(), .sw-grid-12, estilos HUD e camadas de fundo por seção
├── types/
│   └── sphereWired.ts                # Interfaces e tipos TypeScript centralizados
├── constants/
│   ├── sphereWired.ts                # Textos, paletas 3D, soluções, protocolos, telemetria regional e CTA
│   └── footer.ts                     # Dados corporativos, links do rodapé, disclaimers e documentos legais completos
├── lib/
│   ├── sphereTextures.ts             # Gerador procedural de mapas PBR (albedo, bump, roughness, emissive e partículas)
│   └── utils.ts                      # Funções utilitárias compartilhadas
└── components/
    ├── SphereWiredApp.tsx            # Orquestrador client-side de estado (modo 3D, modais e rolagem suave)
    ├── ScrollProgressBar.tsx         # Barra global fixa no topo sincronizada com GSAP ScrollTrigger (scaleX)
    ├── Header.tsx                    # Cabeçalho fixo em 12 colunas com botão Launch App e microtransições GSAP
    ├── HeroSection.tsx               # Hero em 12 colunas com 6 camadas de profundidade GSAP e a esfera 3D
    ├── WiredSphereCanvas.tsx         # Cena WebGL Three.js da esfera 3D com mousemove + lerp e ticker GSAP
    ├── ContentSections.tsx           # Seções Solutions, Technology, Network e About com layouts abstratos e fundos próprios
    ├── CtaSection.tsx                # Seção Call to Action final mais escura de alto impacto com paralaxe ao cursor (sem 3D)
    ├── Footer.tsx                    # Rodapé escuro em 12 colunas com registro corporativo, disclaimers e links legais
    ├── NetworkConsoleModal.tsx       # Console interativo Launch App (Simulador de Rotas + Provisionamento Sandbox)
    └── LegalDocumentModal.tsx        # Modal de leitura para Termos e Condições, Privacidade, Riscos e Segurança
```

### Como Funciona

1. **Grid Responsivo de 12 Colunas e `clamp()`**: Todas as seções utilizam `.sw-grid-12` combinado com variáveis `clamp()` para margens, espaçamentos e tipografia, mantendo proporções equilibradas do mobile ao desktop (1440px+).
2. **Arquitetura 100% GSAP (Sem `useEffect`)**: Todo o ciclo de animações e scroll roda via `useGSAP` e `contextSafe` — controlando a barra de progresso global (`ScrollProgressBar`), o `gsap.timeline` de entrada do Hero, o paralaxe reativo ao cursor (`gsap.quickTo`), microtransições em botões/abas e a aparição elemento por elemento no scroll via `ScrollTrigger.batch`.
3. **Esfera 3D Interativa com Three.js**: Construída como um `THREE.Group` composto por múltiplas peças procedurais (núcleo blindado com mapas PBR em Canvas, coroas polares concêntricas com dentes instanciados, faixas metálicas, halo Fresnel em GLSL, 3 anéis orbitais com nós luminosos deslizantes e partículas 3D). Gira lentamente de forma automática e acompanha o cursor suavemente usando `mousemove` + `lerp`, conduzida por `gsap.ticker` em GPU e `afterDraw` em WebGL via software.
4. **Fluxos Interativos**: **Get Started** rola suavemente até a seção CTA final de maior impacto (`#get-started`), posicionada antes do rodapé, com um único CTA (**Launch App**) e camadas escuras interativas ao cursor sem esfera 3D; **Explore Network** leva à seção `#network`; **Launch App** abre o simulador de rotas e gerador de tokens sandbox; e o **Footer** escuro reúne informações corporativas, disclaimers visíveis e acesso modal aos documentos legais completos.

### Execução Local

```bash
npm install
npm run dev      # Inicia o servidor de desenvolvimento na porta 3000
npm run lint     # Executa a verificação estática com ESLint
npm run build    # Gera o build de produção
```
