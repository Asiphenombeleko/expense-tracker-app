// Define a factory function named expenseTracker

export default function expenseTracker(db) {
  // Create an object called state with an expenses array property
  const state = {
    expenses: [],
  };

  // Define a function named initializeState that fetches data from the database
  async function initializeState() {
    try {
      state.expenses = await db.any("SELECT * FROM expense");
    } catch (error) {
      console.error("Error fetching data from the database:", error);
    }
  }
 // Call the initializeState function to populate state.expenses on initialization
  initializeState();


  // Define a function named addExpense that takes categoryId and amount as parameters
  async function addExpense(expense, amount, total, category_id) {
    try {
      // Insert data into the database
      await db.none(
        "INSERT INTO expense (expense, amount, total , category_id) VALUES ($1, $2, $3, $4)",
        [expense, amount, total, category_id]
      );

      // Update state.expenses by fetching fresh data from the database
      await initializeState();
    } catch (error) {
      // Handle any errors that occurred during database insertion
      console.error("Error inserting data into the database:", error);
    }
  }

  // Define a function named allExpenses
  function allExpenses() {
    // Return the expenses array from state
    return state.expenses;
  }

  // Define a function named expensesForCategory that takes categoryId as a parameter
  async function expensesForCategory(categoryId) {
    // Filter the expenses array to only include items with the specified categoryId
    let results = await db.any("SELECT * FROM expense WHERE category_id = $1", [
      categoryId,
    ]);
    return results;
  }

  // Define a function named deleteExpense that takes expenseId as a parameter
  async function deleteExpense(expenseId) {
    try {
      // Delete data from the database
      await db.none("DELETE FROM expense WHERE id = $1", [expenseId]);

      // Update state.expenses by fetching fresh data from the database
      await initializeState();
    } catch (error) {
      // Handle any errors that occurred during database deletion
      console.error("Error deleting data from the database:", error);
    }
  }

  // Define a function named categoryTotals
  async function categoryTotals() {
    let results = await db.any("SELECT total FROM expense;");
    return results;
  }
  async function joinTables() {
    const expensesJoined = `
                    SELECT * FROM expense  
                    JOIN category ON category.id = expense.category_id
                    
                `;
    const results = await db.any(expensesJoined);
    return results;
  }

  // Return an object containing the defined functions as methods
  return {
    addExpense,
    allExpenses,
    expensesForCategory,
    deleteExpense,
    categoryTotals,
    joinTables
  };
}
