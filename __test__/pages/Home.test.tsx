import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

describe('Home', () => {
  it('Should render properly', () => {
    render(<Home />);

    const header = screen.getByRole('heading');
    const headerText = 'Hello Team';

    expect(header).toHaveTextContent(headerText);
  });
});
