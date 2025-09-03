import { render } from '@testing-library/react';
import Home from '@/app/[locale]/page';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/components/layout/header/Header', () => ({
  Header: () => <div>Header Mock</div>,
}));

describe('Home', () => {
  it('Should render properly', () => {
    expect(() => render(<Home />)).not.toThrow();
  });
});
