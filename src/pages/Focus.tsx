import { useEffect, useState } from 'react'
import { Check, Clock3, Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type FocusSession = { id: string; minutes: number; completedAt: number }
const presets = [15, 25, 45, 60]
const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`

export function Focus() {
  const [sessions, setSessions] = useLocalStorage<FocusSession[]>('easpos.focus.sessions.v1', [])
  const [minutes, setMinutes] = useLocalStorage<number>('easpos.focus.duration.v1', 25)
  const [remaining, setRemaining] = useState(minutes * 60)
  const [running, setRunning] = useState(false)
  const [task, setTask] = useState('')
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer) }, [running])
  useEffect(() => { if (running && remaining === 0) { setRunning(false); setSessions((list) => [{ id: `${Date.now()}`, minutes, completedAt: Date.now() }, ...list]) } }, [remaining, running, minutes, setSessions])
  const setPreset = (value: number) => { setRunning(false); setMinutes(value); setRemaining(value * 60) }
  const reset = () => { setRunning(false); setRemaining(minutes * 60) }
  const today = new Date().toDateString()
  const minutesToday = sessions.filter((session) => new Date(session.completedAt).toDateString() === today).reduce((sum, session) => sum + session.minutes, 0)
  const progress = (minutes * 60 - remaining) / (minutes * 60) * 100
  return <div className="animate-fade-in">
    <p className="eyebrow">A LITTLE SPACE FOR ONE THING</p><div className="mt-2"><h1 className="page-title">Find your focus</h1><p className="mt-2 text-sm text-muted">One thing at a time. Let the rest wait.</p></div>
    <div className="focus-layout mt-7"><section className="glass-card focus-card"><div className="focus-card-heading"><div><p className="eyebrow">FOCUS SESSION</p><h2 className="section-title">Be here now</h2></div><div className="focus-today"><Clock3 size={14}/>{minutesToday} min today</div></div><label className="form-label mt-6">What are you focusing on? <span className="text-muted">(optional)</span><input className="form-input" maxLength={100} placeholder="One thing you want to give attention to" value={task} onChange={(e) => setTask(e.target.value)}/></label>
      <div className="timer-wrap"><div className="timer-ring" style={{ background: `conic-gradient(#a78bfa ${progress}%, rgba(255,255,255,.07) ${progress}% 100%)` }}><div className="timer-inner"><Sparkles size={18} className="text-accent"/><div className="timer-time">{formatTime(remaining)}</div><p className="text-[10px] text-muted">{running ? 'A moment for you' : remaining === 0 ? 'Session complete' : 'Minutes of presence'}</p></div></div></div>
      <div className="preset-row" aria-label="Session duration">{presets.map((preset) => <button key={preset} className={`preset-button${minutes === preset ? ' preset-active' : ''}`} onClick={() => setPreset(preset)}>{preset} min</button>)}</div><div className="focus-actions"><button className="focus-reset" aria-label="Reset timer" onClick={reset}><RotateCcw size={17}/></button><button className="focus-start" onClick={() => remaining === 0 ? reset() : setRunning((value) => !value)}>{running ? <Pause size={17} fill="currentColor"/> : remaining === 0 ? <Check size={18}/> : <Play size={17} fill="currentColor"/>}{running ? 'Pause' : remaining === 0 ? 'Start again' : 'Begin focus'}</button></div></section>
      <aside className="focus-side"><div className="glass-card focus-side-card"><div className="stat-icon stat-violet"><Sparkles size={17}/></div><p className="eyebrow mt-4">A GENTLE REMINDER</p><p className="mt-2 text-sm leading-6 text-slate-300">You don’t need to finish everything. Give this one moment your attention.</p></div><div className="glass-card focus-side-card"><p className="eyebrow">RECENT SESSIONS</p><h2 className="section-title">Your quiet wins</h2><div className="focus-history">{sessions.slice(0, 5).length ? sessions.slice(0, 5).map((session) => <div className="focus-history-row" key={session.id}><div className="focus-history-icon"><Check size={13}/></div><span className="flex-1 text-xs text-slate-300">{session.minutes} minute focus</span><span className="text-[9px] text-muted">{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(session.completedAt)}</span></div>) : <p className="mt-4 text-xs text-muted">Your completed sessions will find a home here.</p>}</div></div></aside></div>
  </div>
}
