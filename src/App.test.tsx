import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders todo header', () => {
  render(<App />);
  const expected = screen.getByText(/to-do list/i);
  expect(expected).toBeInTheDocument();
});

test("renders no items", () => {
  render(<App />);
  const expected = screen.getByText(/no items/i);
  expect(expected).toBeInTheDocument();
});

test("renders add item button", () => {
  render(<App />);
  const expected = screen.getByText(/add item/i);
  expect(expected).toBeInTheDocument();
});

test("renders search bar", () => {
  render(<App />);
  const expected = screen.getByTestId('search-bar');
  expect(expected).toBeInTheDocument();
});

test("renders add item modal when add button is clicked", () => {
  render(<App />);
  const addBtn = screen.getByText(/add item/i);

  act(() => {
    fireEvent.click(addBtn);
  });

  const nameField = screen.getByTestId("name");
  expect(nameField).toBeInTheDocument();
  const saveBtn = screen.getByTestId("add");
  expect(saveBtn).toBeInTheDocument();
  const cancelBtn = screen.getByText(/cancel/i);
  expect(cancelBtn).toBeInTheDocument();
});