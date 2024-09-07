// userUtils.ts
"use client";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  
  export interface AuthData {
    user: User;
    token: string;
    tokenExpiry: string;
  }
  
  export function storeUserData(data: AuthData): void {
    localStorage.setItem('userData', JSON.stringify(data));
  }
  
  export function getUserData(): AuthData | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  
  export function clearUserData(): void {
    localStorage.removeItem('userData');
  }
  
  export function isAuthenticated(): boolean {
    const authData = getUserData();
    if (!authData) return false;
    
    const now = new Date();
    const expiryDate = new Date(authData.tokenExpiry);
    return now < expiryDate;
  } 