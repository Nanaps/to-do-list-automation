import { test, expect } from '@playwright/test';

const TODO_URL = 'https://todolist.james.am/#';

test.describe('To-Do List Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TODO_URL);
  });

  test('TC_001 - Verify that user can access to do list website', async ({ page }) => {
    await expect(page).toHaveTitle(/To Do List/);
    await expect(page.locator('input.new-todo')).toBeVisible();
    await expect(page.locator('text=Double-click to edit a to do')).toBeVisible();
  });

  test('TC_002 - Verify that user can add to do list', async ({ page }) => {
    await page.fill('input.new-todo', 'Do homework');
    await page.press('input.new-todo', 'Enter');
    await expect(page.locator('.todo-list li')).toHaveText(/Do homework/);
  });

  test('TC_003 - Verify that user cannot add empty to do item', async ({ page }) => {
    await page.fill('input.new-todo', ' ');
    await page.press('input.new-todo', 'Enter');
    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  test('TC_004 - Verify that user cannot add more than 150 letters', async ({ page }) => {
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(4);
    await page.fill('input.new-todo', longText);
    expect(longText.length).toBeLessThanOrEqual(150);
  });

  test('TC_005 - Verify that user can update to do list', async ({ page }) => {;
    await page.fill('input.new-todo', 'To do homework');
    await page.press('input.new-todo', 'Enter');
    const todoItem = page.locator('.todo-list li')
    await expect(todoItem).toHaveText(/To do homework/);
    await todoItem.dblclick();
    await page.fill('.edit', 'Play game');
    await page.press('.edit', 'Enter');
    await expect(todoItem).toHaveText(/Play game/);
  });

  test('TC_006 - Verify that user cannot update to do list with empty text', async ({ page }) => {
    await page.fill('input.new-todo', 'To do homework');
    await page.press('input.new-todo', 'Enter');
    const todoItem = page.locator('.todo-list li')
    await expect(todoItem).toHaveText(/To do homework/);
    await todoItem.dblclick();
    await page.fill('.edit', ' ');
    await page.press('.edit', 'Enter');
    await expect(todoItem).toHaveText(/To do homework/);
  });

  test('TC_007 - Verify that user can mark task as completed', async ({ page }) => {
    await page.fill('input.new-todo', 'Exercise');
    await page.press('input.new-todo', 'Enter');
    const checkbox = page.locator('.todo-list li:has-text("Exercise") .toggle');
    await checkbox.click();
    await expect(page.locator('.todo-list li.completed')).toHaveCount(1);
  });

  test('TC_008 - Verify that user can unmark completed task to active', async ({ page }) => {
    await page.fill('input.new-todo', 'Read a book');
    await page.press('input.new-todo', 'Enter');
    const checkbox = page.locator('.todo-list li:has-text("Read a book") .toggle');
    await checkbox.click();
    await expect(page.locator('.todo-list li.completed')).toHaveCount(1);
    await checkbox.click();
    await expect(page.locator('.todo-list li.completed')).toHaveCount(0);
  });

  test('TC_009 - Verify that user can click "All" button', async ({ page }) => {
    await page.fill('input.new-todo', 'Watching TV');
    await page.press('input.new-todo', 'Enter');
    const activeButton = page.locator('a[href="#/"]');
    await activeButton.click();
    const todoItem = page.locator('.todo-list li:has-text("Watching TV")');
    await expect(todoItem).toHaveText(/Watching TV/);
  });

  test('TC_010 - Verify that user can click "Active" button', async ({ page }) => {
    await page.fill('input.new-todo', 'Watching TV');
    await page.press('input.new-todo', 'Enter');
    const activeButton = page.locator('a[href="#/active"]');
    await activeButton.click();
    const todoItem = page.locator('.todo-list li:has-text("Watching TV")');
    await expect(todoItem).toHaveText(/Watching TV/);
  });

  test('TC_011 - Verify that user can click "Completed" button', async ({ page }) => {
    await page.fill('input.new-todo', 'Watching TV');
    await page.press('input.new-todo', 'Enter');
    const checkbox = page.locator('.todo-list li:has-text("Watching TV") .toggle');
    await checkbox.click();
    const activeButton = page.locator('a[href="#/completed"]');
    await activeButton.click();
    const todoItem = page.locator('.todo-list li:has-text("Watching TV")');
    await expect(todoItem).toHaveText(/Watching TV/);
  });

  test('TC_012 - Verify that user can delete some to do list items', async ({ page }) => {
    await page.fill('input.new-todo', 'Have lunch');
    await page.press('input.new-todo', 'Enter');
    await page.fill('input.new-todo', 'Have dinner');
    await page.press('input.new-todo', 'Enter');
    const selectDelete = page.locator('.todo-list li:has-text("Have lunch")');
    await selectDelete.hover();
    const DeleteButton = page.locator('li:has-text("Have lunch") .destroy');
    await DeleteButton.click();
    await expect(page.locator('.todo-list li')).toHaveCount(1);
  });

  test('TC_013 - Verify that user can click clear button to delete completed list', async ({ page }) => {
    await page.fill('input.new-todo', 'Have breakfast');
    await page.press('input.new-todo', 'Enter');
    await page.fill('input.new-todo', 'Have lunch');
    await page.press('input.new-todo', 'Enter');
    await page.fill('input.new-todo', 'Have dinner');
    await page.press('input.new-todo', 'Enter');
    const firstcheckbox = page.locator('.todo-list li:has-text("Have breakfast") .toggle');
    await firstcheckbox.click();
    const secondcheckbox = page.locator('.todo-list li:has-text("Have lunch") .toggle');
    await secondcheckbox.click();
    const button = page.locator('text=Clear'); // or you can use button text, class, etc.
    await button.click();
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    const activeButton = page.locator('a[href="#/completed"]');
    await activeButton.click();
    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  test('TC_014 - Verify that number of items left is updated dynamically', async ({ page }) => {
    await page.fill('input.new-todo', 'Have breakfast');
    await page.press('input.new-todo', 'Enter');
    await page.fill('input.new-todo', 'Have lunch');
    await page.press('input.new-todo', 'Enter');
    await expect(page.locator('.todo-count')).toHaveText(/2\s*item\s*left/);
    const firstCheckbox = page.locator('.todo-list li .toggle').first();
    await firstCheckbox.click();
    await expect(page.locator('.todo-count')).toHaveText(/1\s*item\s*left/);
  });
});
