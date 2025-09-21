import Home from '@/app/[locale]/page';
import { render } from '@testing-library/react';

jest.mock('@/components/layout/team/team', () => ({
  __esModule: true,
  default: () => <div data-testid="team-mock">Team Mock</div>,
}));

jest.mock('@/components/layout/greetings/Greetings', () => ({
  __esModule: true,
  default: () => <div data-testid="greetings-mock">Greetings Mock</div>,
}));

describe('Home', () => {
  it('Should render properly without throwing errors', () => {
    expect(() => render(<Home />)).not.toThrow();
  });

  it('Should render GreetingsSection and Team components', () => {
    const { getByTestId } = render(<Home />);

    expect(getByTestId('greetings-mock')).toBeInTheDocument();
    expect(getByTestId('team-mock')).toBeInTheDocument();
  });

  it('Should render GreetingsSection before Team', () => {
    const { container } = render(<Home />);

    const greetings = container.querySelector('[data-testid="greetings-mock"]');
    const team = container.querySelector('[data-testid="team-mock"]');

    if (!greetings || !team) {
      throw new Error('Expected both components to be rendered');
    }

    const greetingsIndex = Array.from(container.children).indexOf(greetings);
    const teamIndex = Array.from(container.children).indexOf(team);

    expect(greetingsIndex).toBeLessThan(teamIndex);
  });
});
