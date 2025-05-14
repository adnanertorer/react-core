export const getAccessToken = () : string | null  => localStorage.getItem('access_token');
export const getRefreshToken = () : string | null => localStorage.getItem('refresh_token');

export const setToken = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const clearToken = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}