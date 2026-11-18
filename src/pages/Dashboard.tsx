import { ArrowUpRight, Check, Clock3, Plus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

export function Dashboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">{dateLabel}</p><h1 className="page-title mt-2">A fresh start, <span className="text-gradient">Erkinov.</span></h1><p className="mt-2 text-sm text-muted">Small steps make meaningful days. What matters today?</p></div>
        <Link to="/tasks" className="primary-button"><Plus size={16} /> Add a task</Link>
      </div>
      <section className="hero-card glass-card">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="relative z-10 max-w-xl"><div className="hero-label"><Sparkles size={14} /> YOUR DAILY SPACE</div><h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Make today <span className="text-accent">count</span>, gently.</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-400">You don't have to do it all at once. Start with one thing that brings you closer to where you want to be.</p><Link to="/focus" className="hero-link mt-6">Find your focus <ArrowUpRight size={15} /></Link></div>
        <div className="hero-decoration" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit-core"><Sparkles size={24}/></div></div>
      </section>
      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="stat-card glass-card"><div className="stat-icon stat-violet"><Check size={17}/></div><p className="stat-label">Tasks completed</p><div className="stat-value">0 <span>/ 0</span></div><div className="stat-foot">Your day is still yours to shape</div></div>
        <div className="stat-card glass-card"><div className="stat-icon stat-mint"><Sparkles size={17}/></div><p className="stat-label">Habits in motion</p><div className="stat-value">0 <span>today</span></div><div className="stat-foot">Consistency over perfection</div></div>
        <div className="stat-card glass-card"><div className="stat-icon stat-blue"><Clock3 size={17}/></div><p className="stat-label">Focus time</p><div className="stat-value">0 <span>min</span></div><div className="stat-foot">Every focused minute matters</div></div>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card section-card"><div className="section-heading"><div><p className="eyebrow">YOUR PRIORITIES</p><h3 className="section-title">Today's tasks</h3></div><Link to="/tasks" className="text-xs text-accent transition hover:text-white">See all <ArrowUpRight className="inline" size={13}/></Link></div><div className="empty-state"><div className="empty-icon"><Check size={19}/></div><p className="mt-3 text-sm font-medium text-slate-200">A clear page</p><p className="mt-1 text-xs text-muted">Add a task when you're ready to begin.</p><Link to="/tasks" className="subtle-button mt-4"><Plus size={14}/> Create your first task</Link></div></div>
        <div className="glass-card section-card"><div className="section-heading"><div><p className="eyebrow">A MOMENT FOR YOU</p><h3 className="section-title">Daily intention</h3></div><Sparkles size={16} className="text-accent"/></div><div className="intention-card"><span className="quote-mark">“</span><p className="relative text-sm leading-6 text-slate-300">You can make progress without rushing. Give your attention to what is here.</p><div className="mt-4 h-px bg-white/[0.07]"/><p className="mt-3 text-xs text-muted">A reminder to return to the present</p></div></div>
      </section>
    </div>
  )
}
