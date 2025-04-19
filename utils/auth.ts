export function isUserAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return !!token; 
    }
    return false;
}

export function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export function logoutUser() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
    }
}
