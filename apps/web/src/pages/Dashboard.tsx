import type { ComponentType, SVGProps } from 'react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ActivitySquare, BarChart3, PlugZap, Sparkles } from 'lucide-react'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@diatonic/ui'

import { useEntitiesStore } from '../stores/entities'

interface MetricCard {
  title: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'steady'
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export default function Dashboard() {
  const sessions = useEntitiesStore((state) => state.sessions)

  const metrics = useMemo<MetricCard[]>(
    () => [
      { title: 'Active sessions', value: '12', delta: '+18%', trend: 'up', icon: ActivitySquare },
      { title: 'Avg. sync latency', value: '2.5s', delta: '-6%', trend: 'down', icon: PlugZap },
      { title: 'Automations shipped', value: '34', delta: '+12%', trend: 'up', icon: Sparkles }
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="uppercase tracking-wide">
            Beta workspace
          </Badge>
          <h1 className="text-3xl font-semibold">
            Session intelligence overview
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Observe capture health, pipeline automation, and human-in-the-loop reviews from a single place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Share snapshot</Button>
          <Button>
            <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
            Start live capture
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map(({ title, value, delta, trend, icon: Icon }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-semibold">{value}</div>
                <p
                  className={trend === 'down' ? 'text-xs text-emerald-500' : 'text-xs text-primary'}
                >
                  {delta} vs last 24h
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle>Recent sessions</CardTitle>
              <p className="text-sm text-muted-foreground">Live view of the last three captures reported.</p>
            </div>
            <Button variant="secondary" size="sm">
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                <div>
                  <p className="text-sm font-medium">{session.title}</p>
                  <p className="text-xs text-muted-foreground">Owner: {session.owner}</p>
                </div>
                <Badge variant={session.status === 'completed' ? 'success' : session.status === 'running' ? 'default' : 'secondary'}>
                  {session.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Realtime ingest window</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div className="h-full w-3/4 rounded-full bg-primary" />
                </div>
                <span className="text-xs text-muted-foreground">75%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Automation success</p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
                92% over past 24h
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Upcoming maintenance window</p>
              <Skeleton className="h-6 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
