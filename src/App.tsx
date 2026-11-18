import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { ModulePage } from './pages/ModulePage'

const modules = [
  { path: 'tasks', title: 'Tasks', description: 'Turn your plans into small, focused next steps.' },
  { path: 'goals', title: 'Goals', description: 'Keep your longer-term direction within reach.' },
  { path: 'habits', title: 'Habits', description: 'Build gentle routines, one day at a time.' },
  { path: 'calendar', title: 'Calendar', description: 'See what is coming up and make room for what matters.' },
  { path: 'notes', title: 'Notes', description: 'A quiet place to capture thoughts and ideas.' },
  { path: 'focus', title: 'Focus timer', description: 'Make space for one thing at a time.' },
  { path: 'insights', title: 'Insights', description: 'Notice your progress and patterns over time.' },
]

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          {modules.map((module) => (
            <Route
              key={module.path}
              path={module.path}
              element={<ModulePage title={module.title} description={module.description} />}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
