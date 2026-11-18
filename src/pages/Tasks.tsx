import { Check, Circle, CircleCheck, Pencil, Plus, Search, Sparkles, Trash2, X } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Priority = 'Low' | 'Medium' | 'High'
type Task = { id: string; title: string; details: string; dueDate: string; priority: Priority; completed: boolean; createdAt: number }
type TaskFilter = 'All' | 'Today' | 'Upcoming' | 'Completed'
const priorities: Priority[] = ['Low', 'Medium', 'High']
const filters: TaskFilter[] = ['All', 'Today', 'Upcoming', 'Completed']
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function Tasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('easpos.tasks.v1', [])
  const [filter, setFilter] = useState<TaskFilter>('All')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')

  const today = new Date().toISOString().slice(0, 10)
  const visibleTasks = useMemo(() => tasks
    .filter((task) => {
      if (filter === 'Today') return !task.completed && task.dueDate === today
      if (filter === 'Upcoming') return !task.completed && (!task.dueDate || task.dueDate > today)
      if (filter === 'Completed') return task.completed
      return true
    })
    .filter((task) => `${task.title} ${task.details}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => Number(a.completed) - Number(b.completed) || (a.dueDate || '9999').localeCompare(b.dueDate || '9999') || b.createdAt - a.createdAt),
  [tasks, filter, search, today])

  const resetForm = () => {
    setTitle(''); setDetails(''); setDueDate(''); setPriority('Medium'); setEditingId(null); setFormOpen(false)
  }
  const startEdit = (task: Task) => {
    setTitle(task.title); setDetails(task.details); setDueDate(task.dueDate); setPriority(task.priority)
    setEditingId(task.id); setFormOpen(true)
  }
  const saveTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    if (editingId) {
      setTasks((current) => current.map((task) => task.id === editingId ? { ...task, title: cleanTitle, details: details.trim(), dueDate, priority } : task))
    } else {
      setTasks((current) => [{ id: newId(), title: cleanTitle, details: details.trim(), dueDate, priority, completed: false, createdAt: Date.now() }, ...current])
    }
    resetForm()
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="animate-fade-in">
      <p className="eyebrow">MAKE SPACE FOR WHAT MATTERS</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="page-title">Your tasks</h1><p className="mt-2 text-sm text-muted">One thing at a time. You’re doing just fine.</p></div>
        <button className="primary-button" onClick={() => { resetForm(); setFormOpen(true) }}><Plus size={16}/> Add a task</button>
      </div>

      <section className="task-summary glass-card mt-7">
        <div className="task-summary-copy"><div className="task-summary-icon"><Sparkles size={17}/></div><div><p className="text-sm font-medium">A little progress adds up</p><p className="mt-1 text-xs text-muted">{completedCount} of {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} complete</p></div></div>
        <div className="task-progress-wrap"><div className="task-progress-track"><div className="task-progress-fill" style={{ width: `${progress}%` }}/></div><span className="text-xs text-muted">{progress}%</span></div>
      </section>

      {formOpen && <form className="glass-card task-form mt-5" onSubmit={saveTask}>
        <div className="section-heading"><div><p className="eyebrow">{editingId ? 'UPDATE YOUR PLAN' : 'A SMALL NEXT STEP'}</p><h2 className="section-title">{editingId ? 'Edit task' : 'Create a task'}</h2></div><button type="button" className="icon-button" aria-label="Close form" onClick={resetForm}><X size={17}/></button></div>
        <label className="form-label mt-5">Task name<input autoFocus required maxLength={120} className="form-input" placeholder="What would you like to get done?" value={title} onChange={(event) => setTitle(event.target.value)}/></label>
        <label className="form-label mt-4">A few details <span className="text-muted">(optional)</span><textarea maxLength={400} rows={2} className="form-input form-textarea" placeholder="Add a note to yourself..." value={details} onChange={(event) => setDetails(event.target.value)}/></label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="form-label">Due date<input type="date" className="form-input" value={dueDate} onChange={(event) => setDueDate(event.target.value)}/></label><label className="form-label">Priority<select className="form-input" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>{priorities.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <div className="mt-5 flex justify-end gap-2"><button type="button" className="subtle-button" onClick={resetForm}>Cancel</button><button type="submit" className="primary-button"><Check size={15}/>{editingId ? 'Save changes' : 'Add task'}</button></div>
      </form>}

      <div className="task-toolbar mt-7">
        <div className="task-filters" role="tablist" aria-label="Filter tasks">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={`task-filter${filter === item ? ' task-filter-active' : ''}`} onClick={() => setFilter(item)}>{item}{item === 'All' && <span>{tasks.length}</span>}</button>)}</div>
        <label className="task-search"><Search size={15}/><input aria-label="Search tasks" placeholder="Search tasks..." value={search} onChange={(event) => setSearch(event.target.value)}/></label>
      </div>

      <section className="task-list glass-card mt-4" aria-label="Task list">
        {visibleTasks.length ? visibleTasks.map((task) => {
          const overdue = !task.completed && task.dueDate && task.dueDate < today
          return <article className={`task-row${task.completed ? ' task-row-completed' : ''}`} key={task.id}>
            <button className={`task-check${task.completed ? ' task-check-done' : ''}`} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`} onClick={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))}>{task.completed ? <CircleCheck size={20}/> : <Circle size={20}/>}</button>
            <div className="task-content"><h3 className="task-title">{task.title}</h3>{task.details && <p className="task-details">{task.details}</p>}<div className="task-meta">{task.dueDate && <span className={overdue ? 'task-overdue' : ''}>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${task.dueDate}T12:00:00`))}{overdue ? ' · overdue' : ''}</span>}<span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span></div></div>
            <div className="task-actions"><button className="icon-button" aria-label={`Edit ${task.title}`} onClick={() => startEdit(task)}><Pencil size={15}/></button><button className="icon-button task-delete" aria-label={`Delete ${task.title}`} onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}><Trash2 size={15}/></button></div>
          </article>
        }) : <div className="empty-state task-empty"><div className="empty-icon">{search ? <Search size={18}/> : <Check size={19}/>}</div><p className="mt-3 text-sm font-medium text-slate-200">{search ? 'No matching tasks' : filter === 'Completed' ? 'Nothing completed just yet' : 'A clear page'}</p><p className="mt-1 text-xs text-muted">{search ? 'Try another search.' : 'Add a task when you’re ready to begin.'}</p>{!search && filter === 'All' && <button className="subtle-button mt-4" onClick={() => setFormOpen(true)}><Plus size={14}/> Create your first task</button>}</div>}
      </section>
    </div>
  )
}
