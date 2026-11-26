# Sphere Wired — Connectivity, Rewired.

Aplicación web interactiva de alto impacto visual para **Sphere Wired**, diseñada a partir de un mockup conceptual de arquitectura de red descentralizada. Combina un sistema de maquetación basado en **CSS Grid de 12 columnas** con tipografía y espaciados fluidos mediante `clamp()`, animaciones y paralaje multicapa impulsados al 100% por **GSAP** (sin `useEffect`), y una **esfera mecánica 3D interactiva** construida proceduralmente con **Three.js**.

---

## Agente, Modelo de IA y Herramientas Utilizadas

- **Entorno y Agente**: **Google AI Studio Build** — agente de ingeniería de software encargado del diseño arquitectónico, descomposición modular, escritura de código, refactorización y verificación de compilación/linting.
- **Modelo de IA**: **Gemini 4 Neon** (`models/gemini-4-neon`).
- **Herramientas empleadas durante el desarrollo**:
  - Inspección visual del mockup de referencia para replicar paleta, tipografía, encuadre HUD y profundidad lumínica.
  - Gestión de dependencias NPM (`three`, `@types/three`, `gsap`, `@gsap/react`).
  - Verificación automatizada de compilación de producción con Next.js (`npm run build`) y análisis estático con ESLint 9 (`npm run lint`).
  - Generación procedural de texturas PBR en HTML5 Canvas y diseño vectorial SVG para el favicon de la esfera 3D.

---

## Stack Tecnológico

| Capa | Tecnología | Rol en el proyecto |
| --- | --- | --- |
| **Framework** | Next.js 15+ (App Router) & React 19 | Enrutamiento, renderizado SSR/Client Components, metadatos SEO y optimización de fuentes |
| **Lenguaje** | TypeScript 5 | Tipado estricto y centralizado de contenidos, telemetría, modos 3D y documentos legales |
| **Estilos & Layout** | Tailwind CSS v4 + CSS Grid 12 cols + `clamp()` | Maquetación fluida en 12 columnas, tokens responsivos y patrones multicapa por sección |
| **Tipografía** | `Orbitron`, `Plus Jakarta Sans`, `JetBrains Mono` | Jerarquía futurista geométrica (display), lectura limpia (cuerpo) y figuras tabulares (métricas) |
| **Animación & Scroll** | GSAP 3 + `@gsap/react` (`useGSAP`, `ScrollTrigger`, `ScrollTrigger.batch`, `quickTo`, `ticker`) | Coreografía de entrada, microtransiciones, paralaje reactivo al cursor, barra global de progreso y revelados al hacer scroll sin `useEffect` |
| **Gráficos 3D** | Three.js (`WebGLRenderer`, `MeshPhysicalMaterial`, `RoomEnvironment`, `ShaderMaterial`, `InstancedMesh`) | Escultura 3D procedural de la esfera metálica obsidiana-violeta con rotación automática e interacción `mousemove` + `lerp` |
| **Iconografía** | Lucide React | Iconos funcionales de interfaz (navegación móvil, cierre de modales, flechas, copiado) |

---

## Estructura del Proyecto

```text
/
├── index.html                        # Documento HTML descriptivo con metadatos SEO, OpenGraph, JSON-LD y favicon SVG
├── metadata.json                     # Metadatos del applet en AI Studio
├── README.md                         # Documentación técnica y funcional del proyecto
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

---

## Cómo Funciona

### 1. Layout Responsivo en Grid de 12 Columnas y `clamp()`
Todas las secciones principales (`Header`, `HeroSection`, `ContentSections`, `CtaSection` y `Footer`) comparten la clase `.sw-grid-12`, un CSS Grid de 12 columnas con márgenes y canaletas definidos mediante variables `clamp()`. La tipografía de titulares, textos y paddings escala de forma continua entre móvil y pantallas de escritorio de 1440px+ sin saltos bruscos.

### 2. Arquitectura 100% GSAP (Sin `useEffect`)
Todo el ciclo de vida de animaciones, eventos de scroll y transiciones de UI utiliza `useGSAP` y `contextSafe` de `@gsap/react`:
- **Barra de progreso global (`ScrollProgressBar.tsx`)**: Anima `scaleX` (propiedad compuesta en GPU) de `0` a `1` vinculada al progreso de scroll de `document.documentElement` mediante `ScrollTrigger`.
- **Entrada secuenciada del Hero (`HeroSection.tsx`)**: Un `gsap.timeline` revela progresivamente las capas de fondo, el header, el kicker con esquinas HUD, los titulares `CONNECTIVITY, REWIRED.`, los adornos geométricos y los botones CTA.
- **Paralaje reactivo al cursor (`gsap.quickTo`)**: Tanto el Hero como la sección final `CtaSection` desplazan múltiples capas de fondo a distintas velocidades según la posición normalizada del puntero.
- **Revelado elemento a elemento al hacer scroll (`ScrollTrigger.batch`)**: En `Solutions`, `Technology`, `Network`, `About`, `CtaSection` y `Footer`, los elementos con `data-gsap-step`, `data-gsap-cta-step` y `data-gsap-footer-item` aparecen uno a uno con tweens `gsap.to` justo al entrar su bloque en el viewport.
- **Microtransiciones (`contextSafe`)**: Los botones, corchetes HUD, cambios de capa de protocolo y filtros regionales ejecutan tweens cortos (`160ms–240ms`) con curvas `power3.out`.

### 3. Esfera 3D Interactiva en Three.js (`WiredSphereCanvas.tsx` + `sphereTextures.ts`)
- **Modelo compuesto multi-parte**: No es una primitiva simple; ensambla un núcleo blindado con mapas PBR procedurales (`albedo`, `bump`, `roughness`, `emissive`), dos coronas polares concéntricas con dientes radiales instanciados (`InstancedMesh`), bandas ecuatoriales de cromo pulido y titanio satinado, conductos ópticos emisivos, halo Fresnel en GLSL personalizado, 3 anillos orbitales con nodos deslizantes y nube de partículas 3D.
- **Rotación automática + `mousemove` con `lerp`**: En cada frame (controlado por `gsap.ticker` en GPU y con `afterDraw` para entornos WebGL por software), el núcleo gira lentamente de forma autónoma mientras interpola suavemente (`THREE.MathUtils.lerp`) la inclinación, el desplazamiento espacial y la luz de borde según las coordenadas del cursor y el progreso de scroll.
- **Acoplamiento interactivo**: Cambiar el protocolo activo en la sección **Technology** o dentro de la consola **Launch App** altera dinámicamente la velocidad y la paleta lumínica de la esfera.

### 4. Flujos de Navegación e Interactividad
- **Get Started**: Desplaza suavemente hacia la sección final de alto impacto (`#get-started`), ubicada justo antes del footer, con cinco capas más oscuras reactivas al cursor y un único CTA principal (**Launch App**).
- **Explore Network**: Navega directamente a la sección de telemetría regional (`#network`) con filtros interactivos y tabla de corredores con cifras tabulares.
- **Launch App**: Abre `NetworkConsoleModal`, que ofrece un **Route Simulator** (cálculo dinámico de latencia RTT según región, perfil de enrutamiento y cifrado post-cuántico) y un generador de claves sandbox (**Provision Node**).
- **Footer y Documentos Legales**: El footer oscuro incluye registro corporativo, contactos, bloque visible de disclaimers y botones que abren `LegalDocumentModal` para leer completos los Términos y Condiciones, Política de Privacidad, Aviso de Riesgos y Política de Seguridad.

---

## Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# 3. Verificar linting estático
npm run lint

# 4. Compilar para producción
npm run build
```
