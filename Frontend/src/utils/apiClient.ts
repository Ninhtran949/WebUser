const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    };

    let response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Nếu token expired, thử refresh
    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/user/token/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (refreshResponse.ok) {
          const { accessToken: newToken } = await refreshResponse.json();
          localStorage.setItem('accessToken', newToken);
          
          // Thử lại request với token mới
          response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              ...headers,
              'Authorization': `Bearer ${newToken}`,
            },
          });
        } else {
          localStorage.removeItem('accessToken');
          throw new Error('Please login again');
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        throw new Error('Please login again');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  },

  async get(url: string) {
    const response = await this.request(url);
    return response.json();
  },

  async post(url: string, data: any) {
    const response = await this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async patch(url: string, data: any) {
    const response = await this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }
};