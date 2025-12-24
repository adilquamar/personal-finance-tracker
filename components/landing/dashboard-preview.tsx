interface Transaction {
  description: string
  date: string
  price: string
  category: string
}

const sampleTransactions: Transaction[] = [
  { description: 'Grocery Shopping', date: 'Dec 20, 2024', price: '$156.40', category: 'Food' },
  { description: 'Electric Bill', date: 'Dec 19, 2024', price: '$98.50', category: 'Utilities' },
  { description: 'Coffee Shop', date: 'Dec 18, 2024', price: '$12.75', category: 'Food' },
]

export function DashboardPreview() {
  return (
    <div className="relative mt-12 md:mt-16">
      <div className="relative mx-auto max-w-5xl">
        {/* Dashboard Mockup */}
        <div className="relative rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          {/* Mock Browser Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="h-6 w-64 mx-auto rounded-md bg-gray-100" />
            </div>
          </div>

          {/* Mock Dashboard Content */}
          <div className="p-6 md:p-8 bg-white">
            {/* Dashboard Header */}
            <div className="mb-6">
              <h2 className="text-2xl text-gray-900 mb-1">Dashboard</h2>
              <p className="text-gray-500">Track your daily expenses</p>
            </div>

            {/* Add Expense Button */}
            <button className="w-full bg-indigo-100 text-indigo-700 rounded-xl p-4 flex items-center justify-center gap-2 mb-6">
              <span className="text-lg">+</span>
              <span>Add New Expense</span>
            </button>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-lg text-gray-800 mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {sampleTransactions.map((expense, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.date}</p>
                      </div>
                      <p className="text-gray-900 font-medium">{expense.price}</p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                      {expense.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

