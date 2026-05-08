import React, { useState } from "react";

function App() {

  // Registration States
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // User State
  const [user, setUser] = useState(null);

  // Expense States
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);

  // Register Function
  const handleRegister = () => {

    if (!registerName || !registerEmail || !registerPassword) {
      alert("Please fill all registration fields");
      return;
    }

    const newUser = {
      name: registerName,
      email: registerEmail,
      password: registerPassword
    };

    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Registration Successful!");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
  };

  // Login Function
  const handleLogin = () => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      loginEmail === storedUser.email &&
      loginPassword === storedUser.password
    ) {

      setUser(storedUser);

      alert("Login Successful");

    } else {

      alert("Invalid Email or Password");
    }
  };

  // Add Expense
  const addExpense = () => {

    if (!amount || !description) {
      alert("Please fill all expense fields");
      return;
    }

    const newExpense = {
      amount: Number(amount),
      description,
      category
    };

    setExpenses([...expenses, newExpense]);

    setAmount("");
    setDescription("");
  };

  // Category Totals
  const categoryTotals = {
    Food: 0,
    Travel: 0,
    Shopping: 0,
    Bills: 0,
    Entertainment: 0
  };

  expenses.forEach((expense) => {
    categoryTotals[expense.category] += expense.amount;
  });

  // Overall Total
  const overallTotal = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Highest Expense Category
  const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  // Logout
  const handleLogout = () => {
    setUser(null);
  };

  // LOGIN + REGISTER PAGE
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center p-4">

        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl grid md:grid-cols-2 gap-6">

          {/* Register */}
          <div>

            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
              Register
            </h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full border p-3 rounded mb-4"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded mb-4"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded mb-4"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />

            <button
              onClick={handleRegister}
              className="bg-blue-500 hover:bg-blue-700 text-white w-full p-3 rounded"
            >
              Register
            </button>

          </div>

          {/* Login */}
          <div>

            <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">
              Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded mb-4"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded mb-4"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="bg-purple-500 hover:bg-purple-700 text-white w-full p-3 rounded"
            >
              Login
            </button>

          </div>

        </div>

      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-blue-600">
          Money Management Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* Add Expense Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Add Expense
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="number"
            placeholder="Amount"
            className="border p-3 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
          </select>

        </div>

        <button
          onClick={addExpense}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded"
        >
          Add Expense
        </button>

      </div>

      {/* Category Totals */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">

        {Object.entries(categoryTotals).map(([cat, total]) => (

          <div
            key={cat}
            className={`p-4 rounded-xl shadow-lg text-white text-center
            ${cat === highestCategory ? "bg-red-500" : "bg-green-500"}`}
          >

            <h3 className="text-xl font-bold">{cat}</h3>

            <p className="text-2xl mt-2">₹{total}</p>

          </div>

        ))}

      </div>

      {/* Overall Total */}
      <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg mb-8 text-center">

        <h2 className="text-3xl font-bold">
          Overall Total Expense
        </h2>

        <p className="text-4xl mt-4">
          ₹{overallTotal}
        </p>

      </div>

      {/* Expense History */}
      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">

        <h2 className="text-2xl font-bold mb-4">
          Expense History
        </h2>

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">Category</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Amount</th>
            </tr>
          </thead>

          <tbody>

            {expenses.map((expense, index) => (

              <tr key={index}>
                <td className="border p-3">{expense.category}</td>
                <td className="border p-3">{expense.description}</td>
                <td className="border p-3">₹{expense.amount}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;