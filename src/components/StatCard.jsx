export default function StatCard({ title, value, icon, color = "purple" }) {
    const colorClasses = {
      purple: "bg-purple-100 text-purple-800",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      orange: "bg-orange-100 text-orange-800",
    }
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
          <h3 className="ml-4 text-lg font-semibold text-gray-700">{title}</h3>
        </div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
      </div>
    )
  }
  
  