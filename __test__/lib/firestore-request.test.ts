import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getRequests } from '@/lib/api/firestore-requests';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(),
}));

jest.mock('@/firebase/config', () => ({
  db: {},
}));

describe('getRequests', () => {
  const mockUserId = 'test-user-id';
  const mockRequests = [
    {
      id: '1',
      title: 'Request 1',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Request 2',
      createdAt: new Date('2024-01-02'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('return requests sorted by createdAt in descending order', async () => {
    const mockSnapshot = {
      docs: mockRequests.map((request) => ({
        id: request.id,
        data: () => ({
          title: request.title,
          createdAt: request.createdAt,
        }),
      })),
    };

    (collection as jest.Mock).mockReturnValue('requests-ref');
    (orderBy as jest.Mock).mockReturnValue('order-by-ref');
    (query as jest.Mock).mockReturnValue('query-ref');
    (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

    const result = await getRequests(mockUserId);

    expect(collection).toHaveBeenCalledWith(
      db,
      'users',
      mockUserId,
      'requests'
    );
    expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(query).toHaveBeenCalledWith('requests-ref', 'order-by-ref');
    expect(getDocs).toHaveBeenCalledWith('query-ref');

    expect(result).toEqual([
      {
        id: '1',
        title: 'Request 1',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        title: 'Request 2',
        createdAt: new Date('2024-01-02'),
      },
    ]);
  });

  it('return empty array when no requests exist', async () => {
    const mockSnapshot = {
      docs: [],
    };

    (collection as jest.Mock).mockReturnValue('requests-ref');
    (orderBy as jest.Mock).mockReturnValue('order-by-ref');
    (query as jest.Mock).mockReturnValue('query-ref');
    (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

    const result = await getRequests(mockUserId);

    expect(result).toEqual([]);
  });

  it('handle errors and return empty array', async () => {
    (collection as jest.Mock).mockReturnValue('requests-ref');
    (orderBy as jest.Mock).mockReturnValue('order-by-ref');
    (query as jest.Mock).mockReturnValue('query-ref');
    (getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'));

    const result = await getRequests(mockUserId);

    expect(result).toEqual([]);
  });

  it('transform Firestore document data correctly', async () => {
    const mockSnapshot = {
      docs: [
        {
          id: 'doc-1',
          data: () => ({
            title: 'Test Request',
            createdAt: new Date('2024-01-01'),
            status: 'pending',
            description: 'Test description',
          }),
        },
      ],
    };

    (collection as jest.Mock).mockReturnValue('requests-ref');
    (orderBy as jest.Mock).mockReturnValue('order-by-ref');
    (query as jest.Mock).mockReturnValue('query-ref');
    (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

    const result = await getRequests(mockUserId);

    expect(result).toEqual([
      {
        id: 'doc-1',
        title: 'Test Request',
        createdAt: new Date('2024-01-01'),
        status: 'pending',
        description: 'Test description',
      },
    ]);
  });
});
