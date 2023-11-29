// Define a function named expenseTracker
function expenseTracker() {
    // Create an object called state with an expenses array property
    const state = {
      expenses: [],
    };
  
    // Define a function named addExpense that takes categoryId and amount as parameters
    function addExpense(categoryId, amount) {
      // Create an object called expense with id, categoryId, and amount properties
      const expense = {
        id: state.expenses.length + 1, // Assign a unique ID based on the length of the expenses array
        categoryId,
        amount,
      };
  
      // Add the expense object to the expenses array
      state.expenses.push(expense);
    }
  
    // Define a function named allExpenses
    function allExpenses() {
      // Return the expenses array
      return state.expenses;
    }
  
    // Define a function named expensesForCategory that takes categoryId as a parameter
    function expensesForCategory(categoryId) {
      // Filter the expenses array to only include items with the specified categoryId
      return state.expenses.filter((expense) => expense.categoryId === categoryId);
    }
  
    // Define a function named deleteExpense that takes expenseId as a parameter
    function deleteExpense(expenseId) {
      // Filter out the expense with the specified ID from the expenses array
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== parseInt(expenseId)
      );
    }
  
    // Define a function named categoryTotals
    function categoryTotals() {
      // Create an object called totals to store category totals
      const totals = {};
  
      // Loop through each expense in the expenses array
      state.expenses.forEach((expense) => {
        // Check if the category already exists in totals
        if (totals[expense.categoryId]) {
          // If yes, add the expense amount to the existing total
          totals[expense.categoryId] += expense.amount;
        } else {
          // If no, create a new entry in totals with the expense amount
          totals[expense.categoryId] = expense.amount;
        }
      });
  
      // Return the totals object
      return totals;
    }
  
    // Return an object containing the defined functions as methods
    return {
      addExpense,
      allExpenses,
      expensesForCategory,
      deleteExpense,
      categoryTotals,
    };
  }
  
  // Export the expenseTracker function as the default export
  export default expenseTracker;
  