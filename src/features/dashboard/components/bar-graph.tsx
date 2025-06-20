
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
interface BarChartProps {
  data?: Array<{ name: string; value: number }>;
}

const defaultChartData = [
  { month: "Pending", desktop: 45 },
  { month: "In Progress", desktop: 32 },
  { month: "Resolved", desktop: 78 },
  { month: "Closed", desktop: 23 },
  { month: "Follow-up", desktop: 15 },
  { month: "Cancelled", desktop: 8 },
]

const chartConfig = {
  desktop: {
    label: "Contacts",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function BarChartComponent({ data }: BarChartProps = {}) {
  const chartData = data?.map(item => ({
    month: item.name,
    desktop: item.value
  })) || defaultChartData;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Status Overview</CardTitle>
        <CardDescription>Current contact distribution by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Contact management overview <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Real-time contact status data
        </div>
      </CardFooter>
    </Card>
  )
}
