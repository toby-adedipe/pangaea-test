import { render, screen } from '@testing-library/react';
import Nav from '../Nav';

test('renders Nav bar', () => {
  render(<Nav />);
  const linkElement = screen.getByText(/Shop/i);
  expect(linkElement).toBeInTheDocument();
});
