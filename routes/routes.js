
// Export a function that takes a 'services' object as a parameter.
export default function expenseRoutes(services) {
  // Define a function to render the "index" view
  async function homeRoute(req, res) {
  let allExpense =  await services.allExpenses()
  console.log(allExpense);
    //Render the "index" view
    res.render("index", {
        allExpense
    });
  }
  //Define a function to handle adding an expense
  async function getExpense(req, res) {
    //Extract categoryId and amount from the request body
    const { category, amount, expense } = req.body;
    console.log(req.body);

    // Calculate total based on categoryId
    let total = 0;

    if (category == 1) {
      total = amount * 4;
    }
    if (category == 2 || category == 5) {
      total = amount;
    }
    if (category == 3) {
      total = amount * 5 * 4;
    }
    if (category == 4) {
      total = amount * 2 * 4;
    }
    if (category == 6) {
      total = amount * 30;
    }
    // Call the services.addExpense function with the calculated total and categoryId
    await services.addExpense(expense, amount, total, category);

    // Redirect to the home route after adding the expense
    res.redirect("/");
  }
  //   Define a function to get all expenses
  async function getAllExpences(req, res) {
    // Retrieve all expenses from the services
    const expenses = await services.allExpenses();
    res.render("allExpense", {
      expenses,
    });
  }
  //   Define a function to get expenses for a specific category
  async function getExpensesForCategory(req, res) {
    let joiningData = await services.joiningTables();

    return data.reduce((result, item) => {
      const categoryType = item.category_type;
      if (!result[categoryType]) {
        result[categoryType] = {
          category_type: categoryType,
          total: 0,
        };
      }
      result[categoryType].total += parseFloat(item.total);

      return result;
    }, {});
   
  }
  
  //   Define a function to delete all expenses
  async function deleteAllExpences(req, res) {
    // Extract expenseId from request parameters
    const { expenseId } = req.params;

    // Validate input
    if (!expenseId) {
      // If expenseId is provided, delete the expense
      await services.deleteExpense(expenseId);
    }

    res.json({ success: true });
  }
  async function getCategoryTotals() {
    const totals = await services.categoryTotals();
    res.json(totals);
  }
  return {
    homeRoute,
    getExpense,
    getAllExpences,
    getExpensesForCategory,
    deleteAllExpences,
    getCategoryTotals,
  };
}
