import { Link, useLocation } from 'react-router-dom'
import { List, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { path: '/', label: '首页/车队', icon: List },
  { path: '/profile', label: '档案', icon: UserRound },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-noir">
      <main className="pb-20">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-smoke/10 bg-noir/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {TABS.map((tab) => {
            const isActive = pathname === tab.path
            const Icon = tab.icon
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors',
                  isActive ? 'text-amber' : 'text-smoke hover:text-ghost-dim',
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.5} />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
