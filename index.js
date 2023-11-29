// Import necessary modules
import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import db from "./connection/connect.js";
import routes from "./routes/routes.js";
import databaseData from "./services/databaselogic.js";

const app = express();

const dbData = databaseData(db);
const routesData = routes(dbData);

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
    secret: process.env.DATABASE_URL || "postgres://zlgkvyhm:9Dl2iTAP_BQuXejfaYIXoYeEItbNiVZ1@ella.db.elephantsql.com/zlgkvyhm",
  })
);

// Set up flash messages middleware
app.use(flash());

// API endpoint to add an expense
app.get("/", routesData.homeRoute);

app.post("/addExpense", routesData.getExpense);

// API endpoint to get all expenses
app.get("/allExpenses", routesData.getAllExpences);

// API endpoint to get expenses for a specific category
app.get("/expensesForCategory/:categoryId", routesData.getExpensesForCategory);

// API endpoint to delete an expense
app.delete("/deleteExpense/:expenseId", routesData.deleteAllExpences);

// API endpoint to get category totals
app.get("/categoryTotals", routesData.getCategoryTotals);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
