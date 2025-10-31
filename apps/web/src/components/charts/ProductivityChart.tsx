import { Card, CardContent, CardHeader, CardTitle } from '@diatonic/ui'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'


const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

interface ProductivityData {
  name: string
  value: number
}

interface ProductivityChartProps {
  data?: ProductivityData[]
  title?: string
}

const DEFAULT_DATA: ProductivityData[] = [
  { name: 'Development', value: 5 },
  { name: 'Meetings', value: 2 },
  { name: 'Communication', value: 1 },
  { name: 'Breaks', value: 1 }
]

export function ProductivityChart({ data = DEFAULT_DATA, title = 'Time Distribution' }: ProductivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
