import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, Trash2, X } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type EventItem = { id: string; title: string; date: string; time: string; createdAt: number }
type Task = { id: string; title: string; dueDate: string; completed: boolean }
type Goal = { id: string; title: string; targetDate: string; completed: boolean }
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function Calendar() {
  const [month, setMonth] = useState(new Date())
  const [selected, setSelected] = useState(new Date())
  const [events, setEvents] = useLocalStorage<EventItem[]>('easpos.events.v1', [])
  const [tasks] = useLocalStorage<Task[]>('easpos.tasks.v1', [])
  const [goals] = useLocalStorage<Goal[]>('easpos.goals.v1', [])
  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const range = eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) })
  const selectedKey = format(selected, 'yyyy-MM-dd')
  const dayItems = useMemo(() => [
    ...events.filter((event) => event.date === selectedKey).map((event) => ({ id: event.id, title: event.title, time: event.time, kind: 'Event' })),
    ...tasks.filter((task) => task.dueDate === selectedKey && !task.completed).map((task) => ({ id: task.id, title: task.title, time: '', kind: 'Task' })),
    ...goals.filter((goal) => goal.targetDate === selectedKey && !goal.completed).map((goal) => ({ id: goal.id, title: goal.title, time: '', kind: 'Goal' })),
  ].sort((a, b) => a.time.localeCompare(b.time)), [events, tasks, goals, selectedKey])
  const save = (event: FormEvent) => { event.preventDefault(); if (!title.trim()) return; setEvents((list) => [{ id: id(), title: title.trim(), date: selectedKey, time, createdAt: Date.now() }, ...list]); setTitle(''); setTime(''); setFormOpen(false) }
  return <div className="animate-fade-in">
    <p className="eyebrow">MAKE TIME FOR WHAT MATTERS</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="page-title">Your calendar</h1><p className="mt-2 text-sm text-muted">A little space to see what’s ahead.</p></div><button className="primary-button" onClick={() => setFormOpen((open) => !open)}><Plus size={16}/> Add an event</button></div>
    {formOpen && <form className="glass-card task-form mt-5" onSubmit={save}><div className="section-heading"><div><p className="eyebrow">PLAN A MOMENT</p><h2 className="section-title">New event · {format(selected, 'MMM d')}</h2></div><button type="button" className="icon-button" aria-label="Close" onClick={() => setFormOpen(false)}><X size={16}/></button></div><div className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px]"><label className="form-label">Event name<input autoFocus required maxLength={120} className="form-input" placeholder="What’s happening?" value={title} onChange={(e) => setTitle(e.target.value)}/></label><label className="form-label">Time<input type="time" className="form-input" value={time} onChange={(e) => setTime(e.target.value)}/></label></div><div className="mt-5 flex justify-end"><button className="primary-button" type="submit"><Plus size={15}/> Save event</button></div></form>}
    <div className="calendar-layout mt-7"><section className="glass-card calendar-card"><div className="calendar-heading"><div><p className="eyebrow">YOUR MONTH</p><h2 className="section-title">{format(month, 'MMMM yyyy')}</h2></div><div className="calendar-nav"><button className="icon-button" aria-label="Previous month" onClick={() => setMonth((value) => subMonths(value, 1))}><ChevronLeft size={17}/></button><button className="subtle-button" onClick={() => { const now = new Date(); setMonth(now); setSelected(now) }}>Today</button><button className="icon-button" aria-label="Next month" onClick={() => setMonth((value) => addMonths(value, 1))}><ChevronRight size={17}/></button></div></div><div className="calendar-grid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}{range.map((day) => { const key = format(day, 'yyyy-MM-dd'); const count = events.filter((event) => event.date === key).length + tasks.filter((task) => task.dueDate === key && !task.completed).length + goals.filter((goal) => goal.targetDate === key && !goal.completed).length; return <button key={key} className={`calendar-day${isSameMonth(day, month) ? '' : ' calendar-day-outside'}${isSameDay(day, selected) ? ' calendar-day-selected' : ''}${isSameDay(day, new Date()) ? ' calendar-day-today' : ''}`} onClick={() => setSelected(day)}><span>{format(day, 'd')}</span>{count > 0 && <i className="calendar-dot" aria-label={`${count} items`}/>}</button> })}</div></section>
      <section className="glass-card agenda-card"><div className="section-heading"><div><p className="eyebrow">YOUR AGENDA</p><h2 className="section-title">{format(selected, 'EEEE, MMM d')}</h2></div><CalendarDays size={17} className="text-accent"/></div><div className="agenda-items">{dayItems.length ? dayItems.map((item) => <article className="agenda-item" key={`${item.kind}-${item.id}`}><span className={`agenda-kind agenda-${item.kind.toLowerCase()}`}>{item.kind}</span><div className="min-w-0 flex-1"><p className="text-xs font-medium text-slate-200">{item.title}</p>{item.time && <p className="mt-1 flex items-center gap-1 text-[10px] text-muted"><Clock3 size={11}/>{item.time}</p>}</div>{item.kind === 'Event' && <button className="icon-button task-delete" aria-label={`Delete ${item.title}`} onClick={() => setEvents((list) => list.filter((event) => event.id !== item.id))}><Trash2 size={14}/></button>}</article>) : <div className="agenda-empty"><div className="empty-icon"><CalendarDays size={17}/></div><p className="mt-3 text-xs text-muted">Nothing planned for this day.</p><button className="goal-tasks-link mt-3" onClick={() => setFormOpen(true)}><Plus size={13}/> Add a moment</button></div>}</div></section></div>
  </div>
}
