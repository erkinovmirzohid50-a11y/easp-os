import { useEffect, useRef, useState } from 'react'
import { Activity, ArrowUpRight, Bookmark, CalendarDays, CheckSquare2, CircleHelp, FileText, Focus, Goal, Lightbulb, Play, Settings, Sparkles } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import type { LayoutContext } from '../components/Layout'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Phrase = [string, string, string]
const phrases: Phrase[] = [
  ['MAKE', 'TODAY', 'COUNT.'], ['BUILD YOUR', 'OWN', 'FUTURE.'], ['ONE STEP', 'AT A', 'TIME.'],
  ['FOCUS ON', 'WHAT', 'MATTERS.'], ['PROGRESS', 'OVER', 'PERFECTION.'], ['YOUR TIME', 'STARTS', 'NOW.'],
]
type ModuleCard = { to: string; title: string; caption: string; color: string; icon: typeof Sparkles; key: string; kind: 'array' | 'number' }
const cards: ModuleCard[] = [
  { to: '/', title: 'Today / Overview', caption: 'A clear view of your day.', color: 'purple', icon: Sparkles, key: 'today', kind: 'array' },
  { to: '/tasks', title: 'Tasks', caption: 'Small steps, in motion.', color: 'green', icon: CheckSquare2, key: 'easpos.tasks.v1', kind: 'array' },
  { to: '/goals', title: 'Goals', caption: 'Keep your north star close.', color: 'cyan', icon: Goal, key: 'easpos.goals.v1', kind: 'array' },
  { to: '/habits', title: 'Habits', caption: 'Build a rhythm that lasts.', color: 'turquoise', icon: Activity, key: 'easpos.habits.v1', kind: 'array' },
  { to: '/calendar', title: 'Calendar', caption: 'Make room for what matters.', color: 'pink', icon: CalendarDays, key: 'easpos.events.v1', kind: 'array' },
  { to: '/notes', title: 'Notes', caption: 'A home for your thoughts.', color: 'purple', icon: FileText, key: 'easpos.notes.v1', kind: 'array' },
  { to: '/focus', title: 'Focus', caption: 'One thing at a time.', color: 'blue', icon: Focus, key: 'easpos.focus.sessions.v1', kind: 'array' },
  { to: '/insights', title: 'Insights', caption: 'Notice how far you’ve come.', color: 'burgundy', icon: Lightbulb, key: 'easpos.tasks.v1', kind: 'array' },
  { to: '/bookmarks', title: 'Bookmarks', caption: 'Keep the useful close.', color: 'teal', icon: Bookmark, key: 'easpos.bookmarks.v1', kind: 'array' },
  { to: '/settings', title: 'Settings', caption: 'Make this space your own.', color: 'slate', icon: Settings, key: 'easpos.settings.items.v1', kind: 'array' },
]
function storedCount(key: string) {
  try { const data = window.localStorage.getItem(key); const value = data ? JSON.parse(data) : []; return Array.isArray(value) ? value.length : 0 } catch { return 0 }
}

export function Dashboard() {
  const { setHasScrolledPastHero } = useOutletContext<LayoutContext>()
  const heroRef = useRef<HTMLElement>(null)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [tasks] = useLocalStorage<{ dueDate?: string; completed?: boolean }[]>('easpos.tasks.v1', [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setHasScrolledPastHero(!entry.isIntersecting), { threshold: 0.1 })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [setHasScrolledPastHero])

  useEffect(() => {
    const refresh = () => {
      const next: Record<string, number> = {}
      cards.forEach((card) => { next[card.key] = card.key === 'today' ? tasks.filter((task) => task.dueDate === new Date().toISOString().slice(0, 10) && !task.completed).length : storedCount(card.key) })
      setCounts(next)
    }
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [tasks])

  useEffect(() => {
    let timer = 0
    const start = () => { window.clearInterval(timer); if (!document.hidden) timer = window.setInterval(() => setPhraseIndex((i) => (i + 1) % phrases.length), 15000) }
    const visibility = () => { if (document.hidden) window.clearInterval(timer); else start() }
    start()
    document.addEventListener('visibilitychange', visibility)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', visibility) }
  }, [])

  return <div className="dashboard-scroll">
    <section className="motivation-hero" ref={heroRef} aria-label="Daily motivation">
      <div className="phrase-stage" aria-live="polite" aria-atomic="true" key={phraseIndex}>
        {phrases[phraseIndex].map((line, index) => <span className={`phrase-line phrase-line-${index + 1}`} key={`${phraseIndex}-${line}`}>{line}</span>)}
      </div>
      <span className="hero-scroll-hint" aria-hidden="true"><span /> Scroll to explore</span>
    </section>
    <section className="menu-section" aria-labelledby="menu-heading">
      <header className="menu-heading"><div><p className="eyebrow">YOUR PERSONAL SPACE</p><h1 id="menu-heading">Make room for what matters.</h1></div><p>A little more intentional, one day at a time.</p></header>
      <nav className="glass-menu-grid" aria-label="Your modules">
        {cards.map(({ to, title, caption, color, icon: Icon, key }) => (
          <Link to={to} key={to} className={`glass-menu-card card-${color}${to === '/' ? ' overview-card' : ''}`}>
            <span className="card-icon-tile"><Icon size={19} /></span>
            <Icon className="card-watermark" size={150} strokeWidth={1.1} aria-hidden="true" />
            <span className="card-info" aria-label={`${title} information`} title={caption}><CircleHelp size={15} /></span>
            <span className="card-copy"><span className="card-title">{title}</span><span className="card-caption">{caption}</span></span>
            <span className="card-open"><Play size={9} fill="currentColor" /> OPEN</span>
            <span className={`card-count${(counts[key] ?? 0) === 0 ? ' count-empty' : ''}`} aria-label={`${counts[key] ?? 0} items`}><ArrowUpRight size={13} />{counts[key] ?? 0}</span>
          </Link>
        ))}
      </nav>
      <footer className="menu-footer"><span><Sparkles size={14} /> Your space, your pace.</span><span>One small step is still progress.</span></footer>
    </section>
  </div>
}
