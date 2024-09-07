// api.ts

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
  expiresIn: string;
}

interface ApiError {
  message: string;
  status: number;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw {
      message: errorData.message || 'An error occurred during login',
      status: response.status
    };
  }

  return response.json();
}

