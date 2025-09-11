import Home from '@/app/[locale]/page';
import { render } from '@testing-library/react';

jest.mock('../__mocks__/next-intl/server');

jest.mock('@/components/layout/header/Header', () => ({
  Header: () => <div>Header Mock</div>,
}));

jest.mock('@/components/layout/team/teamWrapper', () => ({
  TeamWrapper: () => <div>Team Mock</div>,
}));

describe('Home', () => {
  it('Should render properly', () => {
    expect(() => render(<Home />)).not.toThrow();
  });
});
