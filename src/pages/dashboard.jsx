// src/pages/Dashboard.jsx
import { useState } from "react";

function Dashboard() {
  // Mock data for the dashboard
  const stats = [
    { name: "Total Products", value: "48", change: "+12%" },
    { name: "Pending Orders", value: "5", change: "-3%" },
    { name: "Monthly Revenue", value: "$12,650", change: "+18%" },
    { name: "Total Customers", value: "156", change: "+24%" },
  ];

  // Mock recent orders
  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2025-05-22",
      status: "Completed",
      total: "$1,250",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2025-05-23",
      status: "Processing",
      total: "$895",
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      date: "2025-05-24",
      status: "Pending",
      total: "$2,340",
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      date: "2025-05-25",
      status: "Shipped",
      total: "$1,120",
    },
    {
      id: "ORD-005",
      customer: "Charles Wilson",
      date: "2025-05-26",
      status: "Completed",
      total: "$750",
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <span className="shadow-sm rounded-md">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export
            </button>
          </span>
          <span className="ml-3 shadow-sm rounded-md">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New
            </button>
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm font-medium">
                  {stat.name}
                </h3>
                <span
                  className={`text-sm font-semibold ${
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              View all orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
