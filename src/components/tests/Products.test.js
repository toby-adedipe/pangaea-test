import { render, screen } from '@testing-library/react';
import Products from '../Products';

test('renders Products', () => {
  render(<Products />);
  const linkElement = screen.getByText(/All Products/i);
  expect(linkElement).toBeInTheDocument();
});
