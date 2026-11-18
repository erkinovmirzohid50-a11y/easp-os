import { ArrowUpRight, Sparkles } from 'lucide-react'

interface ModulePageProps {
  title: string
  description: string
}

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <div className="animate-fade-in">
      <p className="eyebrow">YOUR PERSONAL SPACE</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="page-title">{title}</h1><p className="mt-2 text-sm text-muted">{description}</p></div><button className="primary-button" disabled><Sparkles size={15}/> Coming next <ArrowUpRight size={14}/></button></div>
      <div className="glass-card module-placeholder mt-8"><div className="module-placeholder-icon"><Sparkles size={20}/></div><h2 className="mt-4 text-base font-medium">{title} is taking shape</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted">This space is ready for its next step. We're building easpOS one thoughtful module at a time.</p><div className="mt-6 flex items-center gap-2 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-accent"/> Project foundation complete</div></div>
    </div>
  )
}
