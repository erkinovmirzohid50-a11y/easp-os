import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ModulePageProps { title: string; description: string; icon?: LucideIcon; accent?: string }
export function ModulePage({ title, description, icon: Icon = Sparkles, accent = 'purple' }: ModulePageProps) {
  return <div className={`module-view module-accent-${accent} animate-fade-in`}>
    <p className="eyebrow">YOUR PERSONAL SPACE</p>
    <div className="module-page-heading"><div><h1 className="page-title">{title}</h1><p className="mt-2 text-sm text-muted">{description}</p></div><span className="module-heading-icon"><Icon size={20} /></span></div>
    <section className="glass-card module-placeholder mt-8"><div className="module-placeholder-icon"><Icon size={20} /></div><h2 className="mt-4 text-base font-medium">{title} is ready for you</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted">This space is here when you need it. Keep exploring your routines and make this workspace your own.</p></section>
    <a className="subtle-button mt-5" href="/"><ArrowUpRight size={15} /> Back to your space</a>
  </div>
}
