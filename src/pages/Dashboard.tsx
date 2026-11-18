import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Clock3, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
const phrases = [
  'MAKE TODAY COUNT.',
  'BUILD YOUR OWN FUTURE.',
  'ONE STEP AT A TIME.',
  'FOCUS ON WHAT MATTERS.',
  'PROGRESS OVER PERFECTION.',
  'YOUR TIME STARTS NOW.',
]
const modules = [
  { to: '/tasks', title: 'Tasks', detail: 'Small steps, in motion.', icon: Check, color: 'green' },
  { to: '/goals', title: 'Goals', detail: 'Keep your north star close.', icon: Sparkles, color: 'cyan' },
  { to: '/habits', title: 'Habits', detail: 'Build a rhythm that lasts.', icon: Clock3, color: 'turquoise' },
  { to: '/calendar', title: 'Calendar', detail: 'Make room for what matters.', icon: Clock3, color: 'pink' },
  { to: '/notes', title: 'Notes', detail: 'A home for your thoughts.', icon: Sparkles, color: 'purple' },
  { to: '/focus', title: 'Focus', detail: 'One thing at a time.', icon: Clock3, color: 'blue' },
  { to: '/insights', title: 'Insights', detail: 'Notice how far you’ve come.', icon: ArrowUpRight, color: 'burgundy' },
]

export function Dashboard() {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setPhraseIndex((index) => (index + 1) % phrases.length), 5200)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{dateLabel}</p>
          <h1 className="page-title mt-2">A little more intentional.</h1>
          <p className="mt-2 text-sm text-muted">Small steps. Bigger possibilities.</p>
        </div>
        <Link to="/tasks" className="primary-button"><Plus size={16} /> Add a task</Link>
      </div>

      <section className="hero-card glass-card" aria-label="Daily motivation">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="relative z-10 max-w-3xl">
          <div className="hero-label"><Sparkles size={14} /> YOUR DAILY SPACE</div>
          <h2 key={phraseIndex} className="hero-phrase"><span className="hero-word-glow">{phrases[phraseIndex]}</span></h2>
          <p className="hero-subtitle">Small steps. Bigger possibilities.</p>
        </div>
        <div className="hero-decoration" aria-hidden="true"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit-core"><Sparkles size={22} /></div></div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="A moment to take stock">
        <article className="stat-card glass-card"><div className="stat-icon stat-violet"><Check size={17} /></div><p className="stat-label">Tasks completed</p><div className="stat-value">0 <span>/ 0</span></div></article>
        <article className="stat-card glass-card"><div className="stat-icon stat-mint"><Sparkles size={17} /></div><p className="stat-label">Habits in motion</p><div className="stat-value">0 <span>today</span></div></article>
        <article className="stat-card glass-card"><div className="stat-icon stat-blue"><Clock3 size={17} /></div><p className="stat-label">Focus time</p><div className="stat-value">0 <span>min</span></div></article>
      </section>

      <div className="mt-9 mb-4 flex items-end justify-between gap-3">
        <div><p className="eyebrow">YOUR PERSONAL OPERATING SYSTEM</p><h2 className="section-title">A space for what matters</h2></div>
        <span className="hidden text-xs text-muted sm:block">Make it your own.</span>
      </div>
      <nav className="module-grid" aria-label="Your spaces">
        <Link to="/" className="module-link module-link-overview module-purple glass-card">
          <div className="module-link-icon"><Sparkles size={17} /></div>
          <div><h3>Dashboard overview</h3><p>Your day, with room to breathe.</p></div>
        </Link>
        {modules.map(({ to, title, detail, icon: Icon, color }) => (
          <Link key={to} to={to} className={`module-link module-${color} glass-card`}>
            <div className="module-link-icon"><Icon size={17} /></div>
            <div><h3>{title}</h3><p>{detail}</p></div>
          </Link>
        ))}
      </nav>

      <section className="mt-7 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card section-card">
          <div className="section-heading"><div><p className="eyebrow">YOUR PRIORITIES</p><h3 className="section-title">Today’s tasks</h3></div><Link to="/tasks" className="icon-button" aria-label="Open tasks"><ArrowUpRight size={16} /></Link></div>
          <div className="empty-state"><div className="empty-icon"><Check size={19} /></div><p className="mt-3 text-sm font-medium">A clear page is a good place to begin.</p><Link to="/tasks" className="mt-3 text-xs text-accent">Make your first small step <ArrowUpRight size={13} className="inline" /></Link></div>
        </div>
        <div className="glass-card section-card">
          <div className="section-heading"><div><p className="eyebrow">A MOMENT FOR YOU</p><h3 className="section-title">Daily intention</h3></div><Sparkles size={17} className="text-accent" /></div>
          <div className="mt-7"><p className="text-sm leading-6 text-muted">You don’t have to do everything today. Just choose what matters next.</p><Link to="/focus" className="subtle-button mt-5">Find a little focus <ArrowUpRight size={14} /></Link></div>
        </div>
      </section>
    </div>
  )
}
