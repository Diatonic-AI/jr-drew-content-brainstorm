'use client'
import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts'

const data = [
  { name: 'Dev', value: 5 },
  { name: 'Meetings', value: 2 },
  { name: 'Comms', value: 1 },
  { name: 'Break', value: 1 }
]

export default function ProductivityChart() {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} />
          <Tooltip />
          {data.map((_, i) => <Cell key={i} />)}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
