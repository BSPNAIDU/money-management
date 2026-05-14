import React, { useState } from "react";
import { supabase } from "./supabaseClient";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  const [salary, setSalary] = useState("");
  const [salarySaved, setSalarySaved] = useState(false);

  const [expense, setExpense] = useState({
    category: "Food",
    description: "",
    amount: "",
  });

  const [expenses, setExpenses] = useState([]);

  // Budget Percentages
  const categoryPercentages = {
    Food: 0.2,
    Travel: 0.15,
    Shopping: 0.15,
    Bills: 0.3,
    Entertainment: 0.1,
    Savings: 0.1,
  };

  // Budget Calculation
  const budgets = {};

  Object.keys(categoryPercentages).forEach((category) => {
    budgets[category] = salary * categoryPercentages[category];
  });

  // Category Totals
  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) +
      Number(item.amount);
  });

  // Overall Total
  const overallTotal = expenses.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  // Remaining Balance
  const remainingBalance =
    salary - overallTotal;

  // Savings Percentage
  const savingsPercentage =
    salary > 0
      ? (
          (remainingBalance / salary) *
          100
        ).toFixed(1)
      : 0;

  // Financial Status
  let financialStatus = "Moderate";

  if (savingsPercentage > 30) {
    financialStatus = "Excellent";
  } else if (savingsPercentage > 20) {
    financialStatus = "Good";
  } else if (savingsPercentage < 10) {
    financialStatus = "Risky";
  }

  // Chart Data
  const chartData = Object.keys(
    categoryTotals
  ).map((category) => ({
    name: category,
    value: categoryTotals[category],
  }));

  // Chart Colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
  ];

  // Add Expense
  const addExpense = async () => {

    if (
      !expense.description ||
      !expense.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    const spent =
      categoryTotals[expense.category] || 0;

    const exceeded =
      spent + Number(expense.amount) >
      budgets[expense.category];

    const status = exceeded
      ? "High Spending"
      : "Safe Spending";

    const { error } = await supabase
      .from("expenses")
      .insert([
        {
          category: expense.category,
          description:
            expense.description,
          amount: expense.amount,
          salary: salary,
          status: status,
        },
      ]);

    if (error) {
      console.log(error);
      alert("Error saving expense");
      return;
    }

    alert(
      "Expense Saved Successfully"
    );

    setExpenses([
      ...expenses,
      {
        ...expense,
        status,
      },
    ]);

    setExpense({
      category: "Food",
      description: "",
      amount: "",
    });
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2070&auto=format&fit=crop')",
        }}
      >

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl w-[900px] max-w-full border border-white/20">

          {/* LEFT SIDE */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-purple-700 text-white p-10">

            <img
              src="https://cdn-icons-png.flaticon.com/512/2489/2489756.png"
              alt="Finance"
              className="w-44 mb-6 animate-bounce"
            />

            <h1 className="text-5xl font-extrabold mb-4 text-center">
              Smart Finance Tracker
            </h1>

            <p className="text-lg text-center leading-8">
              Manage your salary,
              monitor expenses,
              track savings and analyze
              spending patterns with
              real-time analytics.
            </p>

          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white/90 p-10 flex flex-col justify-center">

            <h2 className="text-4xl font-bold text-blue-700 mb-3 text-center">
              Welcome Back
            </h2>

            <p className="text-gray-600 text-center mb-8">
              Login to continue your
              financial journey
            </p>

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border border-gray-300 p-4 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border border-gray-300 p-4 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() =>
                setLoggedIn(true)
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:scale-105 transition duration-300 font-bold text-lg"
            >
              Login Securely
            </button>

            <div className="flex justify-between mt-5 text-sm text-gray-600">
              <p>Forgot Password?</p>
              <p>Create Account</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // SALARY PAGE
  if (!salarySaved) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">

        <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">

          <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
            Enter Monthly Salary
          </h1>

          <input
            type="number"
            placeholder="Enter Salary"
            value={salary}
            onChange={(e) =>
              setSalary(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-lg mb-4"
          />

          <button
            onClick={() =>
              setSalarySaved(true)
            }
            className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Save Salary
          </button>

        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-5xl font-bold text-blue-700">
          Financial Analytics Dashboard
        </h1>

        <button
          onClick={() => {
            setLoggedIn(false);
            setSalarySaved(false);
          }}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-green-500">
          <h2 className="text-xl font-bold mb-2">
            Monthly Salary
          </h2>

          <p className="text-3xl font-bold text-green-600">
            ₹{salary}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-red-500">
          <h2 className="text-xl font-bold mb-2">
            Total Expenses
          </h2>

          <p className="text-3xl font-bold text-red-500">
            ₹{overallTotal}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-blue-500">
          <h2 className="text-xl font-bold mb-2">
            Remaining Balance
          </h2>

          <p className="text-3xl font-bold text-blue-600">
            ₹{remainingBalance}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-8 border-purple-500">
          <h2 className="text-xl font-bold mb-2">
            Financial Health
          </h2>

          <p className="text-2xl font-bold text-purple-600">
            {financialStatus}
          </p>
        </div>

      </div>

      {/* ADD EXPENSE */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">

        <h2 className="text-3xl font-bold mb-6 text-blue-700">
          Add Expense
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select
            value={expense.category}
            onChange={(e) =>
              setExpense({
                ...expense,
                category:
                  e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
          </select>

          <input
            type="text"
            placeholder="Description"
            value={expense.description}
            onChange={(e) =>
              setExpense({
                ...expense,
                description:
                  e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) =>
              setExpense({
                ...expense,
                amount:
                  e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={addExpense}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Expense
          </button>

        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
            Expense Pie Chart
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >

                {chartData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>

          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
            Expense Trend Graph
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={chartData}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                fill="#8884d8"
              />

            </BarChart>

          </ResponsiveContainer>
        </div>

      </div>

      {/* BUDGET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {Object.keys(
          budgets
        ).map((category) => {

          const spent =
            categoryTotals[
              category
            ] || 0;

          const exceeded =
            spent >
            budgets[category];

          return (
            <div
              key={category}
              className={`p-6 rounded-2xl shadow-xl text-white transition duration-300 hover:scale-105 ${
                exceeded
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >

              <h2 className="text-2xl font-bold mb-3">
                {category}
              </h2>

              <p className="text-lg">
                Budget:
                ₹{
                  budgets[
                    category
                  ]
                }
              </p>

              <p className="text-lg">
                Spent:
                ₹{spent}
              </p>

              <p className="mt-3 font-bold text-xl">
                {exceeded
                  ? "Budget Exceeded"
                  : "Within Budget"}
              </p>

            </div>
          );
        })}

      </div>

      {/* EXPENSE HISTORY */}
      <div className="bg-white p-6 rounded-2xl shadow-xl overflow-auto">

        <h2 className="text-3xl font-bold mb-6 text-blue-700">
          Expense History
        </h2>

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-200 text-lg">

              <th className="p-4 border">
                Category
              </th>

              <th className="p-4 border">
                Description
              </th>

              <th className="p-4 border">
                Amount
              </th>

              <th className="p-4 border">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {expenses.map(
              (
                item,
                index
              ) => {

                const exceeded =
                  categoryTotals[
                    item.category
                  ] >
                  budgets[
                    item.category
                  ];

                return (
                  <tr
                    key={index}
                    className={
                      exceeded
                        ? "bg-red-100"
                        : "bg-green-100"
                    }
                  >

                    <td className="p-4 border font-semibold">
                      {
                        item.category
                      }
                    </td>

                    <td className="p-4 border">
                      {
                        item.description
                      }
                    </td>

                    <td className="p-4 border font-bold">
                      ₹{
                        item.amount
                      }
                    </td>

                    <td className="p-4 border font-bold">
                      {exceeded
                        ? "High Spending"
                        : "Safe Spending"}
                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
}

export default App;