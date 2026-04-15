import { useState, useCallback } from 'react'
import { Copy, Check, Lock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const AMBIGUOUS = /[0Ol1I]/g

type StrengthLevel = 'weak' | 'fair' | 'strong' | 'very strong'

function getStrength(password: string): StrengthLevel {
  let score = 0
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const levels: StrengthLevel[] = ['weak', 'weak', 'fair', 'fair', 'strong', 'strong', 'very strong']
  return levels[score] ?? 'weak'
}

const STRENGTH_META: Record<StrengthLevel, { bars: number; color: string }> = {
  weak:          { bars: 1, color: 'bg-red-500' },
  fair:          { bars: 2, color: 'bg-yellow-500' },
  strong:        { bars: 3, color: 'bg-emerald-500' },
  'very strong': { bars: 4, color: 'bg-emerald-500' },
}

function randomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  let n: number
  do {
    crypto.getRandomValues(buf)
    n = buf[0]
  } while (n >= limit)
  return n % max
}

function generatePassword(
  length: number,
  opts: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean; excludeAmbiguous: boolean }
): string {
  let charset = [
    opts.uppercase ? CHARSET.uppercase : '',
    opts.lowercase ? CHARSET.lowercase : '',
    opts.numbers ? CHARSET.numbers : '',
    opts.symbols ? CHARSET.symbols : '',
  ].join('')
  if (opts.excludeAmbiguous) charset = charset.replace(AMBIGUOUS, '')
  if (!charset) return ''
  return Array.from({ length }, () => charset[randomIndex(charset.length)]).join('')
}

export default function App() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false,
  })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const regenerate = useCallback(() => {
    setPassword(generatePassword(length, opts))
    setCopied(false)
  }, [length, opts])

  const handleCopy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggle = (key: keyof typeof opts) => {
    const next = { ...opts, [key]: !opts[key] }
    const charsetActive = next.uppercase || next.lowercase || next.numbers || next.symbols
    if (!charsetActive) return
    setOpts(next)
  }

  const level = password ? getStrength(password) : null
  const meta = level ? STRENGTH_META[level] : null

  const charOptions = [
    { key: 'uppercase' as const, label: 'Uppercase', example: 'ABC' },
    { key: 'lowercase' as const, label: 'Lowercase', example: 'abc' },
    { key: 'numbers' as const, label: 'Numbers', example: '123' },
    { key: 'symbols' as const, label: 'Symbols', example: '!@#' },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">

        <CardHeader className="pb-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-none">Password Generator</h1>
              <p className="text-xs text-muted-foreground mt-1">Cryptographically secure</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 space-y-5">

          {/* Password display */}
          <div className="rounded-md bg-muted/50 border px-4 py-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm tracking-wide flex-1 truncate min-w-0 text-foreground/90 select-all">
                {password || <span className="text-muted-foreground/40">— — — — — — —</span>}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={regenerate}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCopy} disabled={!password}>
                  {copied
                    ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                    : <Copy className="w-3.5 h-3.5" />
                  }
                </Button>
              </div>
            </div>

            {/* Strength */}
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-all duration-300',
                      meta && i < meta.bars ? meta.color : 'bg-border'
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground capitalize">
                  {level ?? 'not generated'}
                </span>
                <Badge variant="secondary" className="text-xs h-4 px-1.5 rounded-sm">
                  {length} chars
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Length */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Length</span>
              <span className="text-sm text-muted-foreground tabular-nums">{length}</span>
            </div>
            <input
              type="range"
              min={6}
              max={64}
              step={1}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="pg-range"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6</span>
              <span>64</span>
            </div>
          </div>

          <Separator />

          {/* Character types */}
          <div className="space-y-3">
            <span className="text-sm font-medium">Character types</span>
            <div className="grid grid-cols-2 gap-2">
              {charOptions.map(({ key, label, example }) => (
                <button
                  key={key}
                  onClick={() => handleToggle(key)}
                  className={cn(
                    'flex items-center justify-between rounded-md border px-3 py-2.5 text-left transition-colors',
                    opts[key]
                      ? 'border-foreground/20 bg-muted/60'
                      : 'border-border opacity-40 hover:opacity-60'
                  )}
                >
                  <div>
                    <p className="text-sm font-medium leading-none">{label}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{example}</p>
                  </div>
                  <Switch
                    checked={opts[key]}
                    onCheckedChange={() => handleToggle(key)}
                    onClick={(e) => e.stopPropagation()}
                    className="scale-75 pointer-events-none"
                  />
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Exclude ambiguous */}
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleToggle('excludeAmbiguous')}
          >
            <div>
              <p className="text-sm font-medium">Exclude ambiguous</p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">0 O l 1 I</p>
            </div>
            <Switch
              checked={opts.excludeAmbiguous}
              onCheckedChange={() => handleToggle('excludeAmbiguous')}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <Separator />

          {/* Generate */}
          <Button onClick={regenerate} className="w-full" size="lg">
            Generate password
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
