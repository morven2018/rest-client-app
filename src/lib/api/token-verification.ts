export interface TokenVerificationResponse {
  isValid: boolean;
  user?: {
    uid: string;
    email: string | null;
    emailVerified: boolean;
  };
  error?: string;
}

export const verifyToken = async (
  token: string
): Promise<TokenVerificationResponse> => {
  try {
    const backendResponse = await fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (backendResponse.ok) {
      return await backendResponse.json();
    }

    return await verifyTokenLocally(token);
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      isValid: false,
      error: 'Verification failed',
    };
  }
};

const verifyTokenLocally = async (
  token: string
): Promise<TokenVerificationResponse> => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }),
      }
    );

    const data = await response.json();

    if (data.users && data.users.length > 0) {
      return {
        isValid: true,
        user: {
          uid: data.users[0].localId,
          email: data.users[0].email,
          emailVerified: data.users[0].emailVerified,
        },
      };
    }

    return {
      isValid: false,
      error: 'Invalid token',
    };
  } catch {
    return {
      isValid: false,
      error: 'Verification failed',
    };
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    const expirationTime = decodedPayload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
};
