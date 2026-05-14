import React, { useState } from "react";
import { supabase } from "./supabaseClient";

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

  // Budget Split
  const categoryPercentages = {
    Food: 0.2,
    Travel: 0.15,
    Shopping: 0.15,
    Bills: 0.3,
    Entertainment: 0.1,
    Savings: 0.1,
  };

  // Calculate Budgets
  const budgets = {};

  Object.keys(categoryPercentages).forEach((category) => {
    budgets[category] = salary * categoryPercentages[category];
  });

  // Category Totals
  const categoryTotals = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) + Number(item.amount);
  });

  // Add Expense with Supabase
  const addExpense = async () => {
    if (!expense.description || !expense.amount) {
      alert("Please fill all fields");
      return;
    }

    const spent = categoryTotals[expense.category] || 0;

    const exceeded = spent > budgets[expense.category];

    const status = exceeded
      ? "High Spending"
      : "Safe Spending";

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          category: expense.category,
          description: expense.description,
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

    alert("Expense Saved Successfully");

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

  // Overall Total
  const overallTotal = expenses.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="bg-white p-10 rounded-xl shadow-lg w-96">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Money Management System
          </h1>

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border p-3 rounded mb-4"
          />

          <button
            onClick={() => setLoggedIn(true)}
            className="bg-blue-500 text-white w-full py-3 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // SALARY PAGE
  if (!salarySaved) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-xl shadow-lg w-96">
          <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
            Enter Monthly Salary
          </h1>

          <input
            type="number"
            placeholder="Enter Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />

          <button
            onClick={() => setSalarySaved(true)}
            className="bg-green-500 text-white w-full py-3 rounded hover:bg-green-600"
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Expense Dashboard
        </h1>

        <button
          onClick={() => {
            setLoggedIn(false);
            setSalarySaved(false);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">
            Monthly Salary
          </h2>

          <p className="text-2xl text-green-600 font-bold">
            ₹{salary}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">
            Total Expenses
          </h2>

          <p className="text-2xl text-red-500 font-bold">
            ₹{overallTotal}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">
            Remaining Balance
          </h2>

          <p className="text-2xl text-blue-600 font-bold">
            ₹{salary - overallTotal}
          </p>
        </div>

      </div>

      {/* Add Expense */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Add Expense
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <select
            value={expense.category}
            onChange={(e) =>
              setExpense({
                ...expense,
                category: e.target.value,
              })
            }
            className="border p-3 rounded"
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
                description: e.target.value,
              })
            }
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) =>
              setExpense({
                ...expense,
                amount: e.target.value,
              })
            }
            className="border p-3 rounded"
          />

          <button
            onClick={addExpense}
            className="bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Expense
          </button>

        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {Object.keys(budgets).map((category) => {

          const spent = categoryTotals[category] || 0;

          const exceeded = spent > budgets[category];

          return (
            <div
              key={category}
              className={`p-6 rounded-xl shadow-lg text-white ${
                exceeded ? "bg-red-500" : "bg-green-500"
              }`}
            >
              <h2 className="text-2xl font-bold mb-3">
                {category}
              </h2>

              <p>
                Budget: ₹{budgets[category]}
              </p>

              <p>
                Spent: ₹{spent}
              </p>

              <p className="mt-2 font-bold">
                {exceeded
                  ? "Budget Exceeded"
                  : "Within Budget"}
              </p>

            </div>
          );
        })}

      </div>

      {/* Expense History */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-auto">

        <h2 className="text-2xl font-bold mb-4">
          Expense History
        </h2>

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>

            {expenses.map((item, index) => {

              const exceeded =
                categoryTotals[item.category] >
                budgets[item.category];

              return (
                <tr
                  key={index}
                  className={
                    exceeded
                      ? "bg-red-100"
                      : "bg-green-100"
                  }
                >

                  <td className="p-3 border">
                    {item.category}
                  </td>

                  <td className="p-3 border">
                    {item.description}
                  </td>

                  <td className="p-3 border">
                    ₹{item.amount}
                  </td>

                  <td className="p-3 border font-bold">
                    {exceeded
                      ? "High Spending"
                      : "Safe Spending"}
                  </td>

                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;