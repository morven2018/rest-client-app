import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('Table Components', () => {
  describe('Table', () => {
    it('renders with correct structure and data attributes', () => {
      render(
        <Table data-testid="table" className="custom-table">
          <tbody>
            <tr>
              <td>Test</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = screen.getByTestId('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-slot', 'table');
      expect(table).toHaveClass('w-full caption-bottom text-sm custom-table');

      const container = table.parentElement;
      expect(container).toHaveAttribute('data-slot', 'table-container');
      expect(container).toHaveClass('relative w-full overflow-x-auto');
    });

    it('renders children correctly', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td>Test Content</td>
            </tr>
          </tbody>
        </Table>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('TableHeader', () => {
    it('renders with correct attributes and classes', () => {
      render(
        <table>
          <TableHeader data-testid="table-header" className="custom-header">
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>
      );

      const header = screen.getByTestId('table-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'table-header');
      expect(header).toHaveClass('[&_tr]:border-b custom-header');
    });
  });

  describe('TableBody', () => {
    it('renders with correct attributes and classes', () => {
      render(
        <table>
          <TableBody data-testid="table-body" className="custom-body">
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>
      );

      const body = screen.getByTestId('table-body');
      expect(body).toBeInTheDocument();
      expect(body).toHaveAttribute('data-slot', 'table-body');
      expect(body).toHaveClass('[&_tr:last-child]:border-0 custom-body');
    });
  });

  describe('TableFooter', () => {
    it('renders with correct attributes and classes', () => {
      render(
        <table>
          <TableFooter data-testid="table-footer" className="custom-footer">
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>
      );

      const footer = screen.getByTestId('table-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'table-footer');
      expect(footer).toHaveClass(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0 custom-footer'
      );
    });
  });

  describe('TableRow', () => {
    it('renders with correct attributes and classes', () => {
      render(
        <table>
          <tbody>
            <TableRow data-testid="table-row" className="custom-row">
              <td>Row</td>
            </TableRow>
          </tbody>
        </table>
      );

      const row = screen.getByTestId('table-row');
      expect(row).toBeInTheDocument();
      expect(row).toHaveAttribute('data-slot', 'table-row');
      expect(row).toHaveClass(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors custom-row'
      );
    });
  });

  describe('TableHead', () => {
    it('renders with correct attributes and classes', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead data-testid="table-head" className="custom-head">
                Header
              </TableHead>
            </tr>
          </thead>
        </table>
      );

      const head = screen.getByTestId('table-head');
      expect(head).toBeInTheDocument();
      expect(head).toHaveAttribute('data-slot', 'table-head');
      expect(head).toHaveClass(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 custom-head'
      );
    });
  });

  describe('TableCell', () => {
    it('renders with correct attributes and classes', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell data-testid="table-cell" className="custom-cell">
                Cell
              </TableCell>
            </tr>
          </tbody>
        </table>
      );

      const cell = screen.getByTestId('table-cell');
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveAttribute('data-slot', 'table-cell');
      expect(cell).toHaveClass(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] custom-cell'
      );
    });
  });

  describe('TableCaption', () => {
    it('renders with correct attributes and classes', () => {
      render(
        <table>
          <TableCaption data-testid="table-caption" className="custom-caption">
            Caption
          </TableCaption>
        </table>
      );

      const caption = screen.getByTestId('table-caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveAttribute('data-slot', 'table-caption');
      expect(caption).toHaveClass(
        'text-muted-foreground mt-4 text-sm custom-caption'
      );
    });
  });

  describe('Integration Test', () => {
    it('renders a complete table structure correctly', () => {
      render(
        <Table>
          <TableCaption>Test Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>25</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane</TableCell>
              <TableCell>30</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>2 people</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText('Test Table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('2 people')).toBeInTheDocument();
    });
  });
});
