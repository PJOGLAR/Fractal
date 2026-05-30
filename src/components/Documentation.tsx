import { useState } from 'react'
import './Documentation.css'

export function Documentation() {
  const [activeDoc, setActiveDoc] = useState<'architecture' | 'components'>('architecture')

  return (
    <div className="documentation">
      <h2 className="page-title">Documentación</h2>
      <p className="page-description">Arquitectura y estructura de tokens del Design System</p>

      <div className="doc-tabs">
        <button
          className={`doc-tab ${activeDoc === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveDoc('architecture')}
        >
          Arquitectura de Tokens
        </button>
        <button
          className={`doc-tab ${activeDoc === 'components' ? 'active' : ''}`}
          onClick={() => setActiveDoc('components')}
        >
          Estructura de Componentes
        </button>
      </div>

      <div className="doc-content">
        {activeDoc === 'architecture' && <TokenArchitectureDoc />}
        {activeDoc === 'components' && <ComponentStructureDoc />}
      </div>
    </div>
  )
}

function TokenArchitectureDoc() {
  return (
    <article className="doc-article">
      <h3>Estructura de 3 niveles</h3>
      <div className="doc-diagram">
        <span className="doc-level">Primitivo</span>
        <span className="doc-arrow">→</span>
        <span className="doc-level">Semántico</span>
        <span className="doc-arrow">→</span>
        <span className="doc-level">Componente</span>
      </div>

      <table className="doc-table">
        <thead><tr><th>Nivel</th><th>Ejemplo</th><th>Responde a</th></tr></thead>
        <tbody>
          <tr><td>Primitivo</td><td><code>core/purple/500</code></td><td>¿Qué valor tiene?</td></tr>
          <tr><td>Semántico</td><td><code>interactive/background/brand/main/medium</code></td><td>¿Para qué se usa?</td></tr>
          <tr><td>Componente</td><td><code>button-card/background/default</code></td><td>¿Dónde se aplica?</td></tr>
        </tbody>
      </table>

      <h3>Contextos</h3>

      <div className="doc-card">
        <h4>◆ Static tokens</h4>
        <p>Representan un color <strong>estable</strong> que <strong>no cambia</strong> con la interacción. Comunican estructura, jerarquía o información.</p>
        <ul>
          <li>Cuando el elemento <strong>no es interactivo</strong></li>
          <li>Cuando el color <strong>no cambia</strong> en hover / focus / pressed</li>
          <li>Cuando el elemento <strong>informa o estructura</strong></li>
          <li>Cuando el componente <strong>no recibe foco</strong></li>
        </ul>
      </div>

      <div className="doc-card">
        <h4>◆ Interactive tokens</h4>
        <p>Representan un color que <strong>responde a la interacción</strong> del usuario. Comunican estado, acción o disponibilidad.</p>
        <ul>
          <li>Cuando el usuario <strong>puede interactuar</strong></li>
          <li>Cuando hay estados: hover, focus, pressed, disabled</li>
          <li>Cuando el elemento <strong>recibe foco</strong></li>
          <li>Cuando el color indica <strong>acción o feedback inmediato</strong></li>
        </ul>
      </div>

      <div className="doc-card">
        <h4>◆ Expressive tokens</h4>
        <p>Representan colores <strong>decorativos o ilustrativos</strong>. Aportan personalidad visual e identidad de marca.</p>
        <ul>
          <li>Elementos decorativos en cards, banners o secciones</li>
          <li>Ilustraciones e iconografía expresiva</li>
          <li>Fondos de categorías o secciones temáticas</li>
        </ul>
      </div>

      <div className="doc-rule">
        <strong>Regla rápida:</strong> Si el usuario puede interactuar → interactive. Si no puede → static. Si es decorativo → expressive.
      </div>

      <h3>Elementos</h3>
      <table className="doc-table">
        <thead><tr><th>Elemento</th><th>Uso</th></tr></thead>
        <tbody>
          <tr><td><code>background</code></td><td>Fondos de contenedores, cards, botones</td></tr>
          <tr><td><code>foreground</code></td><td>Color de texto e iconos</td></tr>
          <tr><td><code>border</code></td><td>Color de bordes</td></tr>
          <tr><td><code>opacity</code></td><td>Capas de opacidad para estados (evita proliferación de variantes)</td></tr>
        </tbody>
      </table>

      <h3>Marcas</h3>
      <table className="doc-table">
        <thead><tr><th>Marca</th><th>Significado</th></tr></thead>
        <tbody>
          <tr><td><code>brand/main</code></td><td>Marca principal (purple)</td></tr>
          <tr><td><code>brand/accent</code></td><td>Marca madre/secundaria (cyan)</td></tr>
          <tr><td><code>neutral</code></td><td>Grises y neutros</td></tr>
          <tr><td><code>feedback</code></td><td>Estados de feedback (error, warning, success, info)</td></tr>
        </tbody>
      </table>

      <h3>Intensidades</h3>
      <p className="doc-note">Las intensidades son <strong>contextuales</strong> — describen prominencia visual dentro de su contexto, no un valor absoluto. <code>medium</code> en foreground puede ser 950 y en background puede ser 25. Ambos son "el valor principal" de su contexto.</p>
      <table className="doc-table">
        <thead><tr><th>Intensidad</th><th>Significado</th></tr></thead>
        <tbody>
          <tr><td><code>bold</code></td><td>El más prominente/intenso del contexto</td></tr>
          <tr><td><code>medium</code></td><td>El valor principal del contexto</td></tr>
          <tr><td><code>subtle</code></td><td>Versión suave/secundaria</td></tr>
          <tr><td><code>quiet</code></td><td>Apenas visible</td></tr>
        </tbody>
      </table>

      <h3>Modos de color (tematización)</h3>
      <p className="doc-note">La tematización (dark mode, alto contraste, etc.) se resuelve con <strong>modes nativos de Figma en la capa de primitivos</strong>. Los semánticos y los componentes no se enteran del cambio de mode.</p>

      <div className="doc-card">
        <h4>Principio</h4>
        <pre className="doc-code">{`Primitivos → tienen modes (Light, Dark, ...)
Semánticos → sin modes (un solo alias al primitivo)
Componentes → sin modes (alias al semántico)`}</pre>
        <p>Cuando un frame cambia de mode, Figma resuelve la cadena de alias usando el valor del primitivo en el mode activo. Semánticos y componentes no se modifican.</p>
      </div>

      <div className="doc-card">
        <h4>Cómo se resuelve un token</h4>
        <pre className="doc-code">{`Frame en Light:
  button-card/foreground/regular
    → static/foreground/brand/primary/regular
      → core/purple/500 (Light) = #8B5CF6

Frame en Dark:
  button-card/foreground/regular
    → static/foreground/brand/primary/regular
      → core/purple/500 (Dark) = #B89BFF`}</pre>
      </div>

      <h4>Tres formas de definir el valor Dark</h4>

      <div className="doc-card">
        <h4>1. Mismo valor (caso más común)</h4>
        <p>Si el primitivo funciona en ambos modes, repetís el valor.</p>
        <pre className="doc-code">{`core/purple/500
  Light → #8B5CF6
  Dark  → #8B5CF6`}</pre>
      </div>

      <div className="doc-card">
        <h4>2. Valor ajustado (cuando no da contraste)</h4>
        <p>Si el primitivo en dark no contrasta bien sobre fondos oscuros, asignás un valor distinto solo en el mode Dark. <strong>El nombre del primitivo no cambia.</strong></p>
        <pre className="doc-code">{`core/purple/500
  Light → #8B5CF6
  Dark  → #B89BFF   ← más claro/saturado para dark`}</pre>
        <p>Esta es la forma de alterar valores primitivos individuales sin tocar el resto del sistema.</p>
      </div>

      <div className="doc-card">
        <h4>3. Primitivo nuevo (último recurso)</h4>
        <p>Cuando ningún valor de la escala (5–950) sirve para dark, agregás un primitivo nuevo.</p>
        <p><strong>Forma simple — escala extendida:</strong></p>
        <pre className="doc-code">{`core/neutral/15           ← primitivo nuevo
  Light → #F8F8F8         (placeholder si no se usa)
  Dark  → #1A1A1A`}</pre>
        <p><strong>Forma dedicada — rama core/dark/:</strong></p>
        <pre className="doc-code">{`core/dark/purple/extra-bright
  Light → #B89BFF (placeholder)
  Dark  → #C9B0FF`}</pre>
        <p>Solo usar la rama <code>core/dark/</code> si necesitás muchos valores especiales y querés tenerlos visualmente separados.</p>
      </div>

      <div className="doc-card">
        <h4>Flujo de decisión</h4>
        <pre className="doc-code">{`¿El primitivo existente funciona en dark?
├── Sí → mismo valor en ambos modes
└── No → ¿Puedo ajustar el valor del mode Dark?
         ├── Sí → ajusto solo el valor Dark
         └── No → ¿Encaja en la escala normal?
                  ├── Sí → core/[color]/[nivel-nuevo]
                  └── No → core/dark/[color]/[nombre]`}</pre>
      </div>

      <p className="doc-note">El mismo principio sirve para cualquier mode futuro: high contrast, print, marca alterna, modo accesibilidad. Cada mode nuevo se configura en la colección de primitivos. Semánticos y componentes no cambian.</p>

      <h3>Flujo de cambio sin release</h3>
      <div className="doc-card">
        <h4>Cambio global de marca</h4>
        <p>Editás <code>core/purple/500</code> → se propaga a todos los semánticos y componentes automáticamente.</p>
      </div>
      <div className="doc-card">
        <h4>Cambio de decisión de diseño</h4>
        <p>Reasignás un semántico a otro primitivo → todos los componentes que lo usan cambian.</p>
      </div>
      <div className="doc-card">
        <h4>Cambio específico de un componente</h4>
        <p>Reasignás el token de componente → solo ese componente cambia, el resto queda igual.</p>
      </div>
    </article>
  )
}

function ComponentStructureDoc() {
  return (
    <article className="doc-article">
      <h3>Regla principal de escalabilidad</h3>
      <div className="doc-rule">
        <strong>Siempre usar subcarpeta con nombre de valor, incluso si hoy es 1 solo.</strong><br />
        Agregar es solo agregar, nunca renombrar.
      </div>

      <h3>Estructura base</h3>
      <pre className="doc-code">{`[componente]/
├── background/
│   └── [estado o variante]/
├── foreground/
│   ├── typography/
│   │   └── [rol o tamaño]/
│   │       ├── font-size
│   │       ├── font-weight
│   │       ├── font-family
│   │       ├── line-height
│   │       ├── letter-spacing
│   │       └── color
│   └── asset/
│       └── [tipo]/
│           ├── color
│           └── size
├── border/
│   ├── corner/
│   │   └── [parte]/
│   ├── width/
│   │   └── [nombre]/
│   └── color/
│       └── [estado]/
└── spacing/
    ├── padding/
    │   └── [dirección o tamaño]/
    └── gap/
        └── [nombre]/`}</pre>

      <h3>Orden de carpetas</h3>
      <ol className="doc-ordered-list">
        <li>background</li>
        <li>foreground</li>
        <li>border</li>
        <li>spacing</li>
        <li>asset</li>
      </ol>

      <h3>Patrones de variación</h3>
      <table className="doc-table">
        <thead><tr><th>Patrón</th><th>Componentes</th><th>Subcarpeta por</th></tr></thead>
        <tbody>
          <tr><td><strong>State</strong></td><td>16</td><td>default, hover, pressed, focus, disabled</td></tr>
          <tr><td><strong>Size</strong></td><td>9</td><td>xs, sm, md, lg, xl</td></tr>
          <tr><td><strong>Type</strong></td><td>9</td><td>info, error, success, warning</td></tr>
          <tr><td><strong>Style</strong></td><td>5</td><td>solid, ghost, outline, link, neutral</td></tr>
          <tr><td><strong>Selected</strong></td><td>4</td><td>selected, unselected</td></tr>
          <tr><td><strong>Appearance</strong></td><td>2</td><td>default, inverse</td></tr>
          <tr><td><strong>Hierarchy</strong></td><td>2</td><td>high, medium, low</td></tr>
          <tr><td><strong>Behavior</strong></td><td>1</td><td>expanded, collapsed</td></tr>
        </tbody>
      </table>

      <h3>¿Qué genera subcarpeta?</h3>
      <table className="doc-table">
        <thead><tr><th>Pregunta</th><th>Si SÍ → subcarpeta por</th></tr></thead>
        <tbody>
          <tr><td>¿Cambia por tamaño?</td><td>sm, md, lg</td></tr>
          <tr><td>¿Cambia por estado?</td><td>default, hover, pressed, focus, disabled</td></tr>
          <tr><td>¿Cambia por variante semántica?</td><td>info, success, error, warning</td></tr>
          <tr><td>¿Cambia por estilo visual?</td><td>solid, ghost, outline, link</td></tr>
          <tr><td>¿Cambia por selección?</td><td>selected, unselected</td></tr>
          <tr><td>¿Cambia por apariencia?</td><td>default, inverse</td></tr>
        </tbody>
      </table>

      <h3>Reglas de naming</h3>
      <table className="doc-table">
        <thead><tr><th>Regla</th><th>Descripción</th></tr></thead>
        <tbody>
          <tr><td>Siempre subcarpeta</td><td>Incluso con 1 solo valor</td></tr>
          <tr><td>Nombre por rol</td><td>typography: title, description, label</td></tr>
          <tr><td>Nombre por tamaño</td><td>Cuando el mismo rol varía por size: sm, md, lg</td></tr>
          <tr><td>Nombre por estado</td><td>default, hover, pressed, focus, disabled</td></tr>
          <tr><td>No incluye instancias</td><td>No toma tokens de building blocks anidados</td></tr>
          <tr><td>No repite</td><td>4 paddings iguales = 1 token</td></tr>
        </tbody>
      </table>
    </article>
  )
}
