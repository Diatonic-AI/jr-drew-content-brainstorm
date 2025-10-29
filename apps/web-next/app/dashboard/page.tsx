'use client'
import { Sidebar } from '@/components/layout/sidebar'
import { StatCard } from '@/components/custom/stat-card'
import { DailyTimeline } from '@/components/custom/daily-timeline'
import dynamic from 'next/dynamic'

const ProductivityChart = dynamic(() => import('@/components/charts/productivity-chart'), { ssr: false })

export default function DashboardPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Time" value="0h 00m" />
          <StatCard title="Focus Time" value="0h 00m" />
          <StatCard title="Break Time" value="0h 00m" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border p-4">
            <h2 className="text-xl font-semibold mb-2">Timeline</h2>
            <DailyTimeline blocks={[]} />
          </div>
          <div className="rounded-2xl border p-4">
            <h2 className="text-xl font-semibold mb-2">Category Breakdown</h2>
            <ProductivityChart />
          </div>
        </div>
      </div>
    </div>
  )
}
