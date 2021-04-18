import { render, screen } from '@testing-library/react';
import App from './App';

test('Just Blank Crap', () => {
  render(<App />);
  const linkElement = screen.getByText("Project Scenere");
  expect(linkElement).toBeInTheDocument();
}); 
