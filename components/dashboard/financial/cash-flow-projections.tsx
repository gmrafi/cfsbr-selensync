"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, Calendar, BarChart } from "lucide-react"

export default function CashFlowProjections() {
  const cashFlowData = [
    { month: "Jan", revenue: 480000, expenses: 420000, netCashFlow: 60000, cumulativeCash: 60000 },
    { month: "Feb", revenue: 520000, expenses: 440000, netCashFlow: 80000, cumulativeCash: 140000 },
    { month: "Mar", revenue: 580000, expenses: 460000, netCashFlow: 120000, cumulativeCash: 260000 },
    { month: "Apr", revenue: 640000, expenses: 480000, netCashFlow: 160000, cumulativeCash: 420000 },
    { month: "May", revenue: 720000, expenses: 500000, netCashFlow: 220000, cumulativeCash: 640000 },
    { month: "Jun", revenue: 800000, expenses: 520000, netCashFlow: 280000, cumulativeCash: 920000 },
    { month: "Jul", revenue: 880000, expenses: 540000, netCashFlow: 340000, cumulativeCash: 1260000 },
    { month: "Aug", revenue: 960000, expenses: 560000, netCashFlow: 400000, cumulativeCash: 1660000 },
    { month: "Sep", revenue: 1040000, expenses: 580000, netCashFlow: 460000, cumulativeCash: 2120000 },
    { month: "Oct", revenue: 1120000, expenses: 600000, netCashFlow: 520000, cumulativeCash: 2640000 },
    { month: "Nov", revenue: 1200000, expenses: 620000, netCashFlow: 580000, cumulativeCash: 3220000 },
    { month: "Dec", revenue: 1280000, expenses: 640000, netCashFlow: 640000, cumulativeCash: 3860000 },
  ]

  const totalRevenue = cashFlowData.reduce((sum, month) => sum + month.revenue, 0)
  const totalExpenses = cashFlowData.reduce((sum, month) => sum + month.expenses, 0)
  const netProfit = totalRevenue - totalExpenses
  const avgMonthlyGrowth = ((cashFlowData[11].revenue - cashFlowData[0].revenue) / cashFlowData[0].revenue / 11) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4e6aff]" />
          12-Month Cash Flow Projections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Annual Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-900">${(totalRevenue / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Net Profit</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">${(netProfit / 1000000).toFixed(1)}M</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Monthly Growth</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{avgMonthlyGrowth.toFixed(1)}%</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Year-End Cash</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              ${(cashFlowData[11].cumulativeCash / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value, name) => [`$${(value as number).toLocaleString()}`, name]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#4e6aff" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="netCashFlow" stroke="#10b981" strokeWidth={2} name="Net Cash Flow" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Flow Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Cash Flow Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Q1 Cash Flow:</span>
              <div className="font-semibold">${(cashFlowData[2].cumulativeCash / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <span className="text-gray-600">Q2 Cash Flow:</span>
              <div className="font-semibold">${(cashFlowData[5].cumulativeCash / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <span className="text-gray-600">Q4 Cash Flow:</span>
              <div className="font-semibold">${(cashFlowData[11].cumulativeCash / 1000).toFixed(0)}K</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
