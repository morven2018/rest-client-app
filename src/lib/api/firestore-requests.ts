import 'server-only';

const mockRequests = [
  {
    id: '1',
    method: 'GET' as const,
    status: 'ok' as const,
    code: 200,
    variables: {},
    path: '/api/users',
    url_with_vars: 'https://api.example.com/users',
    Duration: 150,
    Date: '2024-01-15',
    Time: '10:30:25',
    Request_weight: '1.2 KB',
    Response_weight: '15.7 KB',
    Response: JSON.stringify(
      [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ],
      null,
      2
    ),
    Headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token123',
    },
    Body: '',
    createdAt: new Date('2024-01-15T10:30:25Z'),
    updatedAt: new Date('2024-01-15T10:30:25Z'),
  },
  {
    id: '2',
    method: 'POST' as const,
    status: 'ok' as const,
    code: 201,
    variables: {},
    path: '/api/users',
    url_with_vars: 'https://api.example.com/users',
    Duration: 230,
    Date: '2024-01-15',
    Time: '11:45:12',
    Request_weight: '0.8 KB',
    Response_weight: '2.1 KB',
    Response: JSON.stringify({ id: 3, name: 'Bob' }, null, 2),
    Headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token123',
    },
    Body: JSON.stringify({ name: 'Bob', email: 'bob@example.com' }),
    createdAt: new Date('2024-01-15T11:45:12Z'),
    updatedAt: new Date('2024-01-15T11:45:12Z'),
  },
  {
    id: '3',
    method: 'GET' as const,
    status: 'error' as const,
    code: 404,
    variables: {},
    path: '/api/users/999',
    url_with_vars: 'https://api.example.com/users/999',
    Duration: 89,
    Date: '2024-01-14',
    Time: '14:20:33',
    Request_weight: '0.5 KB',
    Response_weight: '0.9 KB',
    Response: JSON.stringify({ error: 'User not found' }, null, 2),
    Headers: {
      'Content-Type': 'application/json',
    },
    Body: '',
    createdAt: new Date('2024-01-14T14:20:33Z'),
    updatedAt: new Date('2024-01-14T14:20:33Z'),
  },
  {
    id: '4',
    method: 'PUT' as const,
    status: 'ok' as const,
    code: 200,
    variables: {},
    path: '/api/users/1',
    url_with_vars: 'https://api.example.com/users/1',
    Duration: 180,
    Date: '2024-01-14',
    Time: '16:55:47',
    Request_weight: '1.1 KB',
    Response_weight: '2.3 KB',
    Response: JSON.stringify({ id: 1, name: 'John Updated' }, null, 2),
    Headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token123',
    },
    Body: JSON.stringify({ name: 'John Updated' }),
    createdAt: new Date('2024-01-14T16:55:47Z'),
    updatedAt: new Date('2024-01-14T16:55:47Z'),
  },
  {
    id: '5',
    method: 'DELETE' as const,
    status: 'in process' as const,
    code: 0,
    variables: {},
    path: '/api/users/2',
    url_with_vars: 'https://api.example.com/users/2',
    Duration: 0,
    Date: '2024-01-13',
    Time: '09:15:22',
    Request_weight: '0.6 KB',
    Response_weight: '0 KB',
    Response: '',
    Headers: {
      Authorization: 'Bearer token123',
    },
    Body: '',
    createdAt: new Date('2024-01-13T09:15:22Z'),
    updatedAt: new Date('2024-01-13T09:15:22Z'),
  },
  {
    id: '6',
    method: 'GET' as const,
    status: 'not send' as const,
    code: 0,
    variables: { userId: { value: '123', type: 'string' } },
    path: '/api/users/{userId}',
    url_with_vars: 'https://api.example.com/users/123',
    Duration: 0,
    Date: '2024-01-13',
    Time: '17:40:18',
    Request_weight: '0.7 KB',
    Response_weight: '0 KB',
    Response: '',
    Headers: {
      'Content-Type': 'application/json',
    },
    Body: '',
    createdAt: new Date('2024-01-13T17:40:18Z'),
    updatedAt: new Date('2024-01-13T17:40:18Z'),
  },
  {
    id: '7',
    method: 'PATCH' as const,
    status: 'ok' as const,
    code: 200,
    variables: {},
    path: '/api/users/1/status',
    url_with_vars: 'https://api.example.com/users/1/status',
    Duration: 120,
    Date: '2024-01-12',
    Time: '08:30:45',
    Request_weight: '0.9 KB',
    Response_weight: '1.5 KB',
    Response: JSON.stringify({ id: 1, status: 'active' }, null, 2),
    Headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token123',
    },
    Body: JSON.stringify({ status: 'active' }),
    createdAt: new Date('2024-01-12T08:30:45Z'),
    updatedAt: new Date('2024-01-12T08:30:45Z'),
  },
];

export async function getRequests(authToken: string | undefined) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock requests data for development');
      return mockRequests;
    }

    /*
     const cookieStore = cookies();
     const userId = cookieStore.get('userId')?.value;
     if (!userId) return [];

    const requestsRef = collection(db, 'users', userId, 'requests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
     const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
       id: doc.id,
      ...doc.data()
     }));
*/
    return mockRequests;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return mockRequests;
  }
}
