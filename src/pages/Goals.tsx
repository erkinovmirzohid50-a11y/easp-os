import { ArrowUpRight, Check, Circle, CircleCheck, Flag, Pencil, Plus, Sparkles, Target, Trash2, X } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Goal = { id: string; title: string; why: string; targetDate: string; completed: boolean; createdAt: number }
const goalId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function Goals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('easpos.goals.v1', [])
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  const resetForm = () => { setTitle(''); setWhy(''); setTargetDate(''); setEditingId(null); setFormOpen(false) }
  const beginEdit = (goal: Goal) => { setTitle(goal.title); setWhy(goal.why); setTargetDate(goal.targetDate); setEditingId(goal.id); setFormOpen(true) }
  const saveGoal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    if (editingId) {
      setGoals((current) => current.map((goal) => goal.id === editingId ? { ...goal, title: cleanTitle, why: why.trim(), targetDate } : goal))
    } else {
      setGoals((current) => [{ id: goalId(), title: cleanTitle, why: why.trim(), targetDate, completed: false, createdAt: Date.now() }, ...current])
    }
    resetForm()
  }

  const completedCount = goals.filter((goal) => goal.completed).length
  const activeGoals = goals.filter((goal) => !goal.completed)
  const displayedGoals = showCompleted ? goals.filter((goal) => goal.completed) : activeGoals

  return (
    <div className="animate-fade-in">
      <p className="eyebrow">KEEP YOUR NORTH STAR CLOSE</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="page-title">Goals that matter</h1><p className="mt-2 text-sm text-muted">Big things begin with a small, meaningful intention.</p></div><button className="primary-button" onClick={() => { resetForm(); setFormOpen(true) }}><Plus size={16}/> Add a goal</button></div>

      <section className="goal-banner glass-card mt-7"><div className="goal-banner-icon"><Target size={19}/></div><div className="min-w-0 flex-1"><p className="text-sm font-medium">Your direction, at your pace</p><p className="mt-1 text-xs text-muted">{activeGoals.length} active {activeGoals.length === 1 ? 'goal' : 'goals'} · {completedCount} celebrated</p></div><div className="goal-count"><span>{completedCount}</span><small>done</small></div></section>

      {formOpen && <form className="glass-card task-form mt-5" onSubmit={saveGoal}><div className="section-heading"><div><p className="eyebrow">{editingId ? 'REFINE YOUR INTENTION' : 'SOMETHING TO GROW TOWARD'}</p><h2 className="section-title">{editingId ? 'Edit goal' : 'Create a goal'}</h2></div><button type="button" className="icon-button" aria-label="Close form" onClick={resetForm}><X size={17}/></button></div>
        <label className="form-label mt-5">Goal name<input autoFocus required maxLength={120} className="form-input" placeholder="What would you love to work toward?" value={title} onChange={(event) => setTitle(event.target.value)}/></label>
        <label className="form-label mt-4">Why it matters <span className="text-muted">(optional)</span><textarea rows={2} maxLength={400} className="form-input form-textarea" placeholder="A reminder for the days you need one..." value={why} onChange={(event) => setWhy(event.target.value)}/></label>
        <label className="form-label mt-4">Target date <span className="text-muted">(optional)</span><input type="date" className="form-input" value={targetDate} onChange={(event) => setTargetDate(event.target.value)}/></label>
        <div className="mt-5 flex justify-end gap-2"><button type="button" className="subtle-button" onClick={resetForm}>Cancel</button><button type="submit" className="primary-button"><Check size={15}/>{editingId ? 'Save changes' : 'Add goal'}</button></div>
      </form>}

      <div className="goal-list-heading mt-8"><div><p className="eyebrow">YOUR JOURNEY</p><h2 className="section-title">{showCompleted ? 'Celebrated goals' : 'Active goals'}</h2></div><button className="goal-toggle" onClick={() => setShowCompleted((current) => !current)}>{showCompleted ? 'View active goals' : `Completed (${completedCount})`}<ArrowUpRight size={14}/></button></div>
      <section className="goal-list mt-4" aria-label={showCompleted ? 'Completed goals' : 'Active goals'}>
        {displayedGoals.length ? displayedGoals.map((goal) => <article className={`goal-card glass-card${goal.completed ? ' goal-card-completed' : ''}`} key={goal.id}>
          <button className={`task-check${goal.completed ? ' task-check-done' : ''}`} aria-label={goal.completed ? `Reopen ${goal.title}` : `Complete ${goal.title}`} onClick={() => setGoals((current) => current.map((item) => item.id === goal.id ? { ...item, completed: !item.completed } : item))}>{goal.completed ? <CircleCheck size={20}/> : <Circle size={20}/>}</button>
          <div className="goal-card-content"><div className="goal-card-title-row"><Flag size={14} className="text-accent"/><h3 className="task-title">{goal.title}</h3></div>{goal.why && <p className="task-details goal-why">{goal.why}</p>}{goal.targetDate && <p className="goal-date">Target · {new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${goal.targetDate}T12:00:00`))}</p>}</div>
          <div className="task-actions"><button className="icon-button" aria-label={`Edit ${goal.title}`} onClick={() => beginEdit(goal)}><Pencil size={15}/></button><button className="icon-button task-delete" aria-label={`Delete ${goal.title}`} onClick={() => setGoals((current) => current.filter((item) => item.id !== goal.id))}><Trash2 size={15}/></button></div>
        </article>) : <div className="glass-card goal-empty"><div className="empty-icon"><Sparkles size={18}/></div><p className="mt-3 text-sm font-medium text-slate-200">{showCompleted ? 'Your next milestone is waiting' : 'Start with what matters to you'}</p><p className="mt-1 text-xs text-muted">{showCompleted ? 'Complete a goal and it will be celebrated here.' : 'A goal doesn’t need to be big to be meaningful.'}</p>{!showCompleted && <button className="subtle-button mt-4" onClick={() => setFormOpen(true)}><Plus size={14}/> Add your first goal</button>}</div>}
      </section>
      <div className="mt-7 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3"><p className="text-xs text-muted">A goal is a direction, not a deadline.</p><Link to="/tasks" className="goal-tasks-link">Make a small plan <ArrowUpRight size={13}/></Link></div>
    </div>
  )
}
