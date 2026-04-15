/** @jsxImportSource react */
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const cwd = process.cwd()

const CDN = 'https://cdn.jsdelivr.net/fontsource/fonts'

const [geist, geistBold, mono] = await Promise.all([
  fetch(`${CDN}/geist@latest/latin-400-normal.ttf`).then(r => r.arrayBuffer()),
  fetch(`${CDN}/geist@latest/latin-700-normal.ttf`).then(r => r.arrayBuffer()),
  fetch(`${CDN}/jetbrains-mono@latest/latin-400-normal.ttf`).then(r => r.arrayBuffer()),
])

// ─── Colors ────────────────────────────────────────
const C = {
  bg:       '#07070a',
  heading:  '#e2ddd5',
  muted:    '#4a4540',
  dimmer:   '#252220',
  gold:     '#c49a5a',
  surface:  'rgba(255,255,255,0.03)',
  border:   'rgba(255,255,255,0.07)',
  frame:    'rgba(255,255,255,0.05)',
  green:    '#5caa78',
  greenDim: '#2d5c3e',
}

const PASSWORD = 'xK9mP2vLnQ4rYfD3'

// ─── Component ────────────────────────────────────
const OG = () => (
  <div style={{
    width: 1200, height: 630,
    background: 'radial-gradient(ellipse 80% 60% at 75% 50%, #13110d 0%, #07070a 55%)',
    display: 'flex',
    fontFamily: 'Geist',
    position: 'relative',
  }}>

    {/* Frame */}
    <div style={{
      position: 'absolute',
      top: 36, left: 36, right: 36, bottom: 36,
      border: `1px solid rgba(255,255,255,0.05)`,
      borderRadius: 20,
      display: 'flex',
    }} />

    {/* ── LEFT ── */}
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingLeft: 88, paddingRight: 48, width: 530,
    }}>

      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: C.gold, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: C.bg }}>PG</span>
        </div>
        <span style={{ fontSize: 11, color: C.muted, letterSpacing: 3, fontWeight: 500 }}>
          PASSWORD GENERATOR
        </span>
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 28 }}>
        <span style={{ fontSize: 74, fontWeight: 800, color: C.heading, letterSpacing: -3, lineHeight: 1 }}>Secure</span>
        <span style={{ fontSize: 74, fontWeight: 800, color: C.heading, letterSpacing: -3, lineHeight: 1 }}>passwords,</span>
        <span style={{ fontSize: 74, fontWeight: 800, color: C.gold,    letterSpacing: -3, lineHeight: 1.1 }}>instantly.</span>
      </div>

      {/* Tagline */}
      <span style={{ fontSize: 17, color: C.muted, marginBottom: 44 }}>
        A simple password generator
      </span>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 10 }}>
        {['Crypto secure', 'Configurable', 'Free'].map(label => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center',
            paddingTop: 7, paddingBottom: 7, paddingLeft: 14, paddingRight: 14,
            border: `1px solid rgba(255,255,255,0.07)`,
            borderRadius: 8, background: 'rgba(255,255,255,0.03)',
          }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* ── RIGHT ── */}
    <div style={{
      flex: 1, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      paddingRight: 72,
    }}>
      <div style={{
        width: 430,
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid rgba(255,255,255,0.07)`,
        borderRadius: 16,
        paddingTop: 26, paddingBottom: 24, paddingLeft: 26, paddingRight: 26,
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.heading }}>Generated password</span>
          <span style={{ fontSize: 11, color: C.muted }}>Cryptographically secure</span>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', height: 1, background: 'rgba(255,255,255,0.07)' }} />

        {/* Password field */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid rgba(255,255,255,0.07)`,
          borderRadius: 8,
          paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16,
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 21,
            fontWeight: 500, color: C.heading, letterSpacing: 2,
          }}>{PASSWORD}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', width: 34, height: 2, background: C.green, borderRadius: 1 }} />
            ))}
            <span style={{
              fontFamily: 'JetBrains Mono', fontSize: 9,
              color: C.greenDim, letterSpacing: 2, marginLeft: 6,
            }}>VERY STRONG</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', height: 1, background: 'rgba(255,255,255,0.07)' }} />

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: C.muted }}>Length</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: C.heading }}>16</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['A–Z', 'a–z', '0–9', '!@#'].map((label, i) => (
              <div key={i} style={{
                display: 'flex', flex: 1, justifyContent: 'center',
                paddingTop: 6, paddingBottom: 6,
                border: `1px solid ${i < 3 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 6,
                background: i < 3 ? 'rgba(255,255,255,0.04)' : 'transparent',
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono', fontSize: 10,
                  color: i < 3 ? C.heading : C.dimmer,
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          background: C.heading, borderRadius: 8,
          paddingTop: 10, paddingBottom: 10,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.bg, letterSpacing: 0.5 }}>
            Generate password
          </span>
        </div>

      </div>
    </div>

  </div>
)

// ─── Generate ──────────────────────────────────────
const svg = await satori(<OG />, {
  width: 1200,
  height: 630,
  fonts: [
    { name: 'Geist', data: geist, weight: 400, style: 'normal' },
    { name: 'Geist', data: geistBold, weight: 700, style: 'normal' },
    { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
    { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
  ],
})

mkdirSync(resolve(cwd, 'public'), { recursive: true })
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
writeFileSync(resolve(cwd, 'public/og.png'), png)
console.log('✓ public/og.png generated')
