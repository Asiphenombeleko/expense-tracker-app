import assert from "assert";
import pgPromise from "pg-promise";
import "dotenv/config";
import trackerService from "../services/databaselogic.js";

const connectionString = process.env.DATABASE_URL || "postgres://httjugcv:nsL8tId-QsmWQNfB_5CZHIntoLAmzYlS@ella.db.elephantsql.com/httjugcv"
const db = pgPromise()(connectionString);

describe("expenseTracker", () => {
  let tracker = trackerService(db);

  beforeEach(() => {
    tracker = trackerService(db);
  });

  describe("addExpense", () => {
    it("should add an expense to the database", async () => {
      // Pseudocode
      // 1. Create a mock expense data
      // 2. Call addExpense with the mock data
      // 3. Fetch data from the mock database and assert the new expense is there
      const mockExpense = {
        expense: "Test Expense",
        amount: 50,
        total: 100,
        category_id: 1,
      };

      await tracker.addExpense(
        mockExpense.expense,
        mockExpense.amount,
        mockExpense.total,
        mockExpense.category_id
      );

      const expenses = await db.any(
        "SELECT * FROM expense WHERE expense = $1",
        [mockExpense.expense]
      );

      assert.isNotEmpty(expenses);
      assert.deepInclude(expenses[0], mockExpense);
    });
  });

  describe("allExpenses", () => {
    it("should return all expenses from the state", () => {
      // Pseudocode
      // 1. Set some mock expenses in the state
      // 2. Call allExpenses and assert it returns the expected array
      const mockExpenses = [
        { id: 1, expense: "Expense 1" },
        { id: 2, expense: "Expense 2" },
      ];

      // Set mock expenses in the state
      tracker.state.expense = mockExpenses;

      const result = tracker.allExpenses();
      assert.deepEqual(result, mockExpenses);
    });
  });

  describe("expensesForCategory", () => {
    it("should return expenses filtered by category", async () => {
      // Pseudocode
      // 1. Set some mock expenses with different categories in the state
      // 2. Call expensesForCategory with a specific category
      // 3. Assert that the returned expenses belong to the specified category
      const mockExpenses = [
        { id: 1, expense: "Expense 1", category_id: 1 },
        { id: 2, expense: "Expense 2", category_id: 2 },
        { id: 3, expense: "Expense 3", category_id: 1 },
      ];

      // Set mock expenses in the state
      tracker.state.expense = mockExpenses;

      const categoryId = 1;
      const result = await tracker.expensesForCategory(categoryId);

      assert.isArray(result);
      assert.lengthOf(result, 2);

      result.forEach((expense) => {
        assert.equal(expense.category_id, categoryId);
      });
    });
  });

  describe("deleteExpense", () => {
    it("should delete an expense from the database", async () => {
      // Pseudocode
      // 1. Set some mock expenses in the state
      // 2. Call deleteExpense with a specific expenseId
      // 3. Fetch data from the mock database and assert the expense is deleted
      const mockExpenses = [
        { id: 1, expense: "Expense 1" },
        { id: 2, expense: "Expense 2" },
      ];

      // Set mock expenses in the state
      tracker.state.expense = mockExpenses;

      const expenseIdToDelete = 1;
      await tracker.deleteExpense(expenseIdToDelete);

      const remainingExpenses = await db.any(
        "SELECT * FROM expense WHERE id = $1",
        [expenseIdToDelete]
      );

      assert.isEmpty(remainingExpenses);
    });
  });

  describe("categoryTotals", () => {
    it("should return correct totals for each category based on mock expenses", async () => {
      // Pseudocode
      // 1. Set some mock expenses with different amounts in the state
      // 2. Call categoryTotals and assert the returned totals are correct
      const mockExpenses = [
        { id: 1, amount: 50 },
        { id: 2, amount: 100 },
        { id: 3, amount: 75 },
      ];

      // Set mock expenses in the state
      tracker.state.expense = mockExpenses;

      const result = await tracker.categoryTotals();

      assert.isArray(result);
      assert.lengthOf(result, 3);

      // Assert the correct totals based on your category logic
      assert.equal(result[0].total, 225); // Assuming logic for category 1
      assert.equal(result[1].total, 100); // Assuming logic for category 2
      assert.equal(result[2].total, 75); // Assuming logic for category 3
    });
  });

  describe("joinTables", () => {
    it("should return joined data from expense and category tables", async () => {
      // Pseudocode
      // 1. Set some mock data in both expense and category tables
      // 2. Call joinTables and assert the returned data is joined correctly
      const mockExpenses = [
        { id: 1, expense: "Expense 1", category_id: 1 },
        { id: 2, expense: "Expense 2", category_id: 2 },
      ];

      const mockCategories = [
        { id: 1, category_type: "Category 1" },
        { id: 2, category_type: "Category 2" },
      ];

      // Set mock data in both expense and category tables
      tracker.state.expense = mockExpenses;
      db.category = mockCategories;

      const result = await tracker.joinTables();

      assert.isArray(result);
      assert.lengthOf(result, 2);

      // Assert the correct joined data
      assert.deepInclude(result[0], {
        id: 1,
        expense: "Expense 1",
        category_type: "Category 1",
      });
      assert.deepInclude(result[1], {
        id: 2,
        expense: "Expense 2",
        category_type: "Category 2",
      });
    });
  });
});
