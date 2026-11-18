import { FileText, Pencil, Plus, Search, Sparkles, Trash2, X } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Note = { id: string; title: string; body: string; updatedAt: number }
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('easpos.notes.v1', [])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const filtered = useMemo(() => notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => b.updatedAt - a.updatedAt), [notes, search])
  const reset = () => { setEditing(null); setTitle(''); setBody(''); setFormOpen(false) }
  const beginEdit = (note: Note) => { setEditing(note.id); setTitle(note.title); setBody(note.body); setFormOpen(true) }
  const save = (event: FormEvent) => { event.preventDefault(); if (!title.trim() && !body.trim()) return; const cleanTitle = title.trim() || 'Untitled note'; setNotes((list) => editing ? list.map((note) => note.id === editing ? { ...note, title: cleanTitle, body: body.trim(), updatedAt: Date.now() } : note) : [{ id: id(), title: cleanTitle, body: body.trim(), updatedAt: Date.now() }, ...list]); reset() }
  return <div className="animate-fade-in">
    <p className="eyebrow">CAPTURE A THOUGHT, KEEP IT CLOSE</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="page-title">Your notes</h1><p className="mt-2 text-sm text-muted">Ideas, reminders, and everything in between.</p></div><button className="primary-button" onClick={() => { reset(); setFormOpen(true) }}><Plus size={16}/> New note</button></div>
    <label className="notes-search mt-7"><Search size={16}/><input aria-label="Search notes" placeholder="Search your notes..." value={search} onChange={(e) => setSearch(e.target.value)}/></label>
    {formOpen && <form className="glass-card task-form mt-5" onSubmit={save}><div className="section-heading"><div><p className="eyebrow">MAKE A NOTE</p><h2 className="section-title">{editing ? 'Edit note' : 'New note'}</h2></div><button className="icon-button" type="button" aria-label="Close" onClick={reset}><X size={16}/></button></div><label className="form-label mt-5">Title<input className="form-input" autoFocus maxLength={140} placeholder="Give this note a name" value={title} onChange={(e) => setTitle(e.target.value)}/></label><label className="form-label mt-4">Your note<textarea className="form-input form-textarea note-editor" rows={7} maxLength={10000} placeholder="Let the thought land here..." value={body} onChange={(e) => setBody(e.target.value)}/></label><div className="mt-5 flex justify-end gap-2"><button type="button" className="subtle-button" onClick={reset}>Cancel</button><button type="submit" className="primary-button">Save note</button></div></form>}
    <div className="notes-grid mt-5">{filtered.length ? filtered.map((note) => <article className="note-card glass-card" key={note.id}><div className="note-card-top"><div className="note-icon"><FileText size={16}/></div><div className="task-actions"><button className="icon-button" aria-label={`Edit ${note.title}`} onClick={() => beginEdit(note)}><Pencil size={14}/></button><button className="icon-button task-delete" aria-label={`Delete ${note.title}`} onClick={() => setNotes((list) => list.filter((item) => item.id !== note.id))}><Trash2 size={14}/></button></div></div><button className="note-open" onClick={() => beginEdit(note)}><h2 className="note-title">{note.title}</h2><p className="note-preview">{note.body || 'An empty page, ready for a thought.'}</p></button><div className="note-date">Updated {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(note.updatedAt)}</div></article>) : <div className="glass-card goal-empty notes-empty"><div className="empty-icon"><Sparkles size={18}/></div><p className="mt-3 text-sm font-medium text-slate-200">{search ? 'No notes found' : 'Leave a thought here'}</p><p className="mt-1 text-xs text-muted">{search ? 'Try another search.' : 'Your ideas are saved on this device.'}</p>{!search && <button className="subtle-button mt-4" onClick={() => setFormOpen(true)}><Plus size={14}/> Write a note</button>}</div>}</div>
  </div>
}
