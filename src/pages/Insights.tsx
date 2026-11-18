import { Activity, ArrowUpRight, Check, Clock3, Flame, Goal, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Task = { id: string; title: string; completed: boolean; dueDate: string }
type GoalItem = { id: string; title: string; completed: boolean }
type Habit = { id: string; completions: string[] }
type FocusSession = { id: string; minutes: number; completedAt: number }

export function Insights() {
  const [tasks] = useLocalStorage<Task[]>('easpos.tasks.v1', [])
  const [goals] = useLocalStorage<GoalItem[]>('easpos.goals.v1', [])
  const [habits] = useLocalStorage<Habit[]>('easpos.habits.v1', [])
  const [sessions] = useLocalStorage<FocusSession[]>('easpos.focus.sessions.v1', [])
  const today = new Date().toISOString().slice(0, 10)
  const weekStart = new Date(); weekStart.setHours(0, 0, 0, 0); weekStart.setDate(weekStart.getDate() - 6)
  const weekSessions = sessions.filter((session) => session.completedAt >= weekStart.getTime())
  const focusMinutes = weekSessions.reduce((sum, session) => sum + session.minutes, 0)
  const checkedHabits = habits.reduce((sum, habit) => sum + habit.completions.filter((day) => day >= today.slice(0, 8) + '01').length, 0)
  const completedTasks = tasks.filter((task) => task.completed).length
  const maxBars = Math.max(1, ...Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index))
    return weekSessions.filter((session) => new Date(session.completedAt).toDateString() === date.toDateString()).reduce((sum, session) => sum + session.minutes, 0)
  }))
  const bars = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index))
    return { label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date), minutes: weekSessions.filter((session) => new Date(session.completedAt).toDateString() === date.toDateString()).reduce((sum, session) => sum + session.minutes, 0) }
  })
  const taskRate = tasks.length ? Math.round(completedTasks / tasks.length * 100) : 0
  return <div className="animate-fade-in">
    <p className="eyebrow">NOTICE HOW FAR YOU’VE COME</p><div className="mt-2"><h1 className="page-title">Your insights</h1><p className="mt-2 text-sm text-muted">Progress isn’t always loud. Here are some things you’ve made happen.</p></div>
    <section className="insight-stats mt-7"><article className="glass-card insight-stat"><div className="stat-icon stat-violet"><Check size={17}/></div><p className="stat-label">Tasks completed</p><div className="stat-value">{completedTasks}<span> of {tasks.length}</span></div><p className="stat-foot">{taskRate}% of your list, at your pace</p></article><article className="glass-card insight-stat"><div className="stat-icon stat-mint"><Activity size={17}/></div><p className="stat-label">Habit check-ins</p><div className="stat-value">{checkedHabits}<span> this month</span></div><p className="stat-foot">{habits.length} routines being nurtured</p></article><article className="glass-card insight-stat"><div className="stat-icon stat-blue"><Clock3 size={17}/></div><p className="stat-label">Focus time</p><div className="stat-value">{focusMinutes}<span> min this week</span></div><p className="stat-foot">{weekSessions.length} completed sessions</p></article><article className="glass-card insight-stat"><div className="stat-icon stat-violet"><Goal size={17}/></div><p className="stat-label">Goals celebrated</p><div className="stat-value">{goals.filter((goal) => goal.completed).length}<span> of {goals.length}</span></div><p className="stat-foot">Every milestone matters</p></article></section>
    <section className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]"><article className="glass-card insight-chart"><div className="section-heading"><div><p className="eyebrow">YOUR LAST SEVEN DAYS</p><h2 className="section-title">Focused minutes</h2></div><span className="insight-chart-total"><Clock3 size={14}/>{focusMinutes} min</span></div><div className="bar-chart" role="img" aria-label="Daily focus minutes for the last seven days">{bars.map((bar) => <div className="bar-column" key={bar.label}><span className="bar-value">{bar.minutes || ''}</span><div className="bar-track"><div className="bar-fill" style={{ height: `${bar.minutes ? Math.max(8, bar.minutes / maxBars * 100) : 0}%` }}/></div><span className="bar-label">{bar.label}</span></div>)}</div></article><article className="glass-card insight-note"><div className="stat-icon stat-mint"><Flame size={17}/></div><p className="eyebrow mt-4">KEEP GOING GENTLY</p><h2 className="section-title mt-2">Your effort counts</h2><p className="mt-2 text-xs leading-5 text-muted">These numbers are here to help you notice your progress—not to judge it. Every small return is a win.</p><div className="mt-5 grid gap-2"><Link className="insight-link" to="/habits"><span><Activity size={14}/>Check in with a habit</span><ArrowUpRight size={14}/></Link><Link className="insight-link" to="/focus"><span><Target size={14}/>Make a little focus time</span><ArrowUpRight size={14}/></Link><Link className="insight-link" to="/goals"><span><Sparkles size={14}/>Revisit your direction</span><ArrowUpRight size={14}/></Link></div></article></section>
    <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3 text-xs text-muted"><Sparkles size={14} className="text-accent"/>Your private insights live only in this browser.</div>
  </div>
}
