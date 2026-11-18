import { Activity, Check, Circle, Flame, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Habit = { id: string; name: string; note: string; createdAt: number; completions: string[] }
const todayKey = () => new Date().toISOString().slice(0, 10)
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function Habits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('easpos.habits.v1', [])
  const [editing, setEditing] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const today = todayKey()
  const doneToday = habits.filter((habit) => habit.completions.includes(today)).length
  const closeForm = () => { setEditing(null); setName(''); setNote(''); setFormOpen(false) }
  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    setHabits((current) => editing
      ? current.map((habit) => habit.id === editing ? { ...habit, name: name.trim(), note: note.trim() } : habit)
      : [{ id: id(), name: name.trim(), note: note.trim(), createdAt: Date.now(), completions: [] }, ...current])
    closeForm()
  }
  const streak = (habit: Habit) => {
    let count = 0
    const date = new Date(`${today}T12:00:00`)
    while (habit.completions.includes(date.toISOString().slice(0, 10))) { count++; date.setDate(date.getDate() - 1) }
    return count
  }
  return <div className="animate-fade-in">
    <p className="eyebrow">SMALL ROUTINES, GENTLY BUILT</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="page-title">Your habits</h1><p className="mt-2 text-sm text-muted">Show up in small ways, and let the days add up.</p></div><button className="primary-button" onClick={() => { closeForm(); setFormOpen(true) }}><Plus size={16}/> Add a habit</button></div>
    <section className="habit-summary glass-card mt-7"><div className="task-summary-copy"><div className="goal-banner-icon"><Activity size={18}/></div><div><p className="text-sm font-medium">Today, at your pace</p><p className="mt-1 text-xs text-muted">{doneToday} of {habits.length} habits checked in</p></div></div><div className="habit-summary-count">{habits.length ? Math.round(doneToday / habits.length * 100) : 0}<span>% today</span></div></section>
    {formOpen && <form className="glass-card task-form mt-5" onSubmit={save}><div className="section-heading"><div><p className="eyebrow">A ROUTINE TO NURTURE</p><h2 className="section-title">{editing ? 'Edit habit' : 'Add a habit'}</h2></div><button type="button" className="icon-button" onClick={closeForm} aria-label="Close"><X size={16}/></button></div><label className="form-label mt-5">Habit name<input className="form-input" required maxLength={100} autoFocus placeholder="For example, take a short walk" value={name} onChange={(e) => setName(e.target.value)}/></label><label className="form-label mt-4">A gentle reminder <span className="text-muted">(optional)</span><input className="form-input" maxLength={180} placeholder="What helps you keep this routine?" value={note} onChange={(e) => setNote(e.target.value)}/></label><div className="mt-5 flex justify-end gap-2"><button className="subtle-button" type="button" onClick={closeForm}>Cancel</button><button className="primary-button" type="submit"><Check size={15}/>{editing ? 'Save changes' : 'Add habit'}</button></div></form>}
    <div className="goal-list-heading mt-8"><div><p className="eyebrow">YOUR RHYTHM</p><h2 className="section-title">Daily habits</h2></div><span className="text-xs text-muted">{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}</span></div>
    <section className="habit-list mt-4">{habits.length ? habits.map((habit) => { const complete = habit.completions.includes(today); return <article className={`habit-card glass-card${complete ? ' habit-done' : ''}`} key={habit.id}><button className={`task-check${complete ? ' task-check-done' : ''}`} aria-label={complete ? `Undo ${habit.name}` : `Complete ${habit.name}`} onClick={() => setHabits((list) => list.map((item) => item.id === habit.id ? { ...item, completions: complete ? item.completions.filter((day) => day !== today) : [...item.completions, today] } : item))}>{complete ? <Check size={18}/> : <Circle size={20}/>}</button><div className="goal-card-content"><h3 className="task-title">{habit.name}</h3>{habit.note && <p className="task-details">{habit.note}</p>}<div className="habit-streak"><Flame size={13}/>{streak(habit)} day streak <span>·</span> {habit.completions.length} total check-ins</div></div><div className="task-actions"><button className="icon-button" aria-label={`Edit ${habit.name}`} onClick={() => { setName(habit.name); setNote(habit.note); setEditing(habit.id); setFormOpen(true) }}><Pencil size={15}/></button><button className="icon-button task-delete" aria-label={`Delete ${habit.name}`} onClick={() => setHabits((list) => list.filter((item) => item.id !== habit.id))}><Trash2 size={15}/></button></div></article> }) : <div className="glass-card goal-empty"><div className="empty-icon"><Sparkles size={18}/></div><p className="mt-3 text-sm font-medium text-slate-200">Start with one small routine</p><p className="mt-1 text-xs text-muted">A habit can be as simple as a mindful pause.</p><button className="subtle-button mt-4" onClick={() => setFormOpen(true)}><Plus size={14}/> Add your first habit</button></div>}</section>
  </div>
}
