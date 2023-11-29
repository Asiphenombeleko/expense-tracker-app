// Import necessary modules
import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";


const app = express();

// Set up Handlebars as the view engine
app.engine(
    "handlebars",
    engine({
      layoutsDir: "./views/layouts",
    })
  );
  
  app.set("view engine", "handlebars");
  app.set("views", "./views");
  
  // Set up static files and body parsing middleware
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  // Set up session middleware
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: "Asiphe's",
    })
  );
  
  // Set up flash messages middleware
  app.use(flash());

// API endpoint to add an expense
app.post('/addExpense', (req, res) => {
    const { categoryId, amount } = req.body;
  
    // Validate inputs
    if (!categoryId || !amount) {
      return res.status(400).json({ error: 'Category ID and amount are required.' });
    }
  
    expenseTracker.addExpense(categoryId, amount);
    res.json({ success: true });
  });
  
  // API endpoint to get all expenses
  app.get('/allExpenses', (req, res) => {
    const expenses = expenseTracker.allExpenses();
    res.json(expenses);
  });
  
  // API endpoint to get expenses for a specific category
  app.get('/expensesForCategory/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    const filteredExpenses = expenseTracker.expensesForCategory(categoryId);
    res.json(filteredExpenses);
  });
  
  // API endpoint to delete an expense
app.delete('/deleteExpense/:expenseId', (req, res) => {
    const { expenseId } = req.params;
  
    // Validate input
    if (!expenseId) {
      return res.status(400).json({ error: 'Expense ID is required.' });
    }
  
    expenseTracker.deleteExpense(expenseId);
    res.json({ success: true });
  });
  
  // API endpoint to get category totals
  app.get('/categoryTotals', (req, res) => {
    const totals = expenseTracker.categoryTotals();
    res.json(totals);
  });





  // Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})