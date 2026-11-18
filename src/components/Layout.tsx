import { NavLink, Outlet } from 'react-router-dom'
import {
  Activity, CalendarDays, CheckSquare2, ChevronDown, CircleDot, Command,
  FileText, Focus, Goal, LayoutDashboard, Menu, Sparkles, Target,
} from 'lucide-react'
import { useState } from 'react'

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare2 },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/habits', label: 'Habits', icon: Activity },
]
const workspaceLinks = [
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/notes', label: 'Notes', icon: FileText },
  { to: '/focus', label: 'Focus timer', icon: Focus },
  { to: '/insights', label: 'Insights', icon: Target },
]

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' nav-link-active' : ''}`

  return (
    <div className="min-h-screen bg-ink text-white">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark"><Sparkles size={18} strokeWidth={2.2} /></div>
          <span className="brand-name">easp<span>OS</span></span>
          <button className="icon-button ml-auto lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><Menu size={18} /></button>
        </div>
        <button className="workspace-switch">
          <div className="workspace-avatar">E</div>
          <span className="min-w-0 flex-1 text-left"><span className="block text-sm font-medium">Personal space</span><span className="mt-0.5 block text-xs text-muted">Free plan</span></span>
          <ChevronDown size={15} className="text-muted" />
        </button>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-caption">MENU</p>
          {primaryLinks.map(({ to, label, icon: Icon, ...rest }) => (
            <NavLink key={to} to={to} end={'end' in rest ? rest.end : undefined} className={navClass} onClick={() => setMobileOpen(false)}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Tasks' && <span className="nav-count">0</span>}
            </NavLink>
          ))}
          <p className="nav-caption nav-caption-spaced">YOUR SPACE</p>
          {workspaceLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClass} onClick={() => setMobileOpen(false)}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><CircleDot size={16} /></div><p className="text-sm font-medium">Make room to grow</p><p className="mt-1 text-xs leading-5 text-muted">Your personal space for a more intentional day.</p><div className="mt-3 flex items-center gap-1.5 text-xs text-accent"><Command size={13} /> A little progress adds up</div></div>
          <button className="profile-row"><div className="profile-avatar">E</div><span className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-medium">Erkinov</span><span className="mt-0.5 block text-xs text-muted">Personal workspace</span></span><ChevronDown size={15} className="text-muted" /></button>
        </div>
      </aside>
      <main className="main-shell">
        <header className="topbar">
          <button className="icon-button lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="topbar-context"><span className="topbar-dot" /> A little more intentional</div>
          <div className="topbar-right"><span className="hidden text-xs text-muted sm:block">Your space, your pace.</span><div className="topbar-avatar">E</div></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
