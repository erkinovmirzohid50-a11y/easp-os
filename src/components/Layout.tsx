import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Activity, Bookmark, CalendarDays, CheckSquare2, FileText, Focus, Goal, Home, Lightbulb, Settings, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AnimatedBackground } from './AnimatedBackground'
import './redesign.css'

export type LayoutContext = { setHasScrolledPastHero: (value: boolean) => void }

const links = [
  { to: '/', label: 'Home', icon: Home, color: 'purple', end: true },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare2, color: 'green' },
  { to: '/goals', label: 'Goals', icon: Goal, color: 'cyan' },
  { to: '/habits', label: 'Habits', icon: Activity, color: 'turquoise' },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, color: 'pink' },
  { to: '/notes', label: 'Notes', icon: FileText, color: 'purple' },
  { to: '/focus', label: 'Focus', icon: Focus, color: 'blue' },
  { to: '/insights', label: 'Insights', icon: Lightbulb, color: 'burgundy' },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark, color: 'teal' },
  { to: '/settings', label: 'Settings', icon: Settings, color: 'slate' },
]

export function Layout() {
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false)
  const { pathname } = useLocation()
  const isDashboard = pathname === '/'
  return (
    <div className="app-shell relative isolate min-h-screen text-white">
      <AnimatedBackground />
      <main className={isDashboard ? 'dashboard-shell' : 'module-shell'}>
        <Outlet context={{ setHasScrolledPastHero } satisfies LayoutContext} />
      </main>
      {(!isDashboard || hasScrolledPastHero) && (
        <nav className="floating-dock" aria-label="Module navigation">
          {links.map(({ to, label, icon: Icon, color, end }) => (
            <NavLink key={to} to={to} end={end} aria-label={label} title={label} className={({ isActive }) => `dock-link dock-${color}${isActive ? ' dock-active' : ''}`}>
              <Icon size={19} strokeWidth={1.8} /><span className="dock-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
      <span className="sr-only" aria-live="polite">{hasScrolledPastHero ? 'Menu available' : ''}</span>
      <span className="brand-corner" aria-hidden="true"><Sparkles size={13} /> easpOS</span>
    </div>
  )
}
