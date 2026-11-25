import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Calendar } from './pages/Calendar'
import { Dashboard } from './pages/Dashboard'
import { Focus } from './pages/Focus'
import { Goals } from './pages/Goals'
import { Habits } from './pages/Habits'
import { Insights } from './pages/Insights'
import { Lasul } from './pages/Lasul'
import { Notes } from './pages/Notes'
import { Tasks } from './pages/Tasks'
import './modules.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lasul" element={<Lasul />} />
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="goals" element={<Goals />} />
          <Route path="habits" element={<Habits />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="notes" element={<Notes />} />
          <Route path="focus" element={<Focus />} />
          <Route path="insights" element={<Insights />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
