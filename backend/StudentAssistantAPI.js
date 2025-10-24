/**
 * Student Assistant API SDK
 * A simple JavaScript SDK for interacting with the Student Assistant API
 */

class StudentAssistantAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Helper method to make authenticated requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      
      if (response.status === 401) {
        this.logout();
        throw new Error('Unauthorized - please login again');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(identifier, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    
    this.token = data.access_token;
    localStorage.setItem('token', this.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }

  async register(userData) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  // User management methods
  async getUsers() {
    return await this.request('/users');
  }

  async getUserById(id) {
    return await this.request(`/users/${id}`);
  }

  async getUsersByRole(role) {
    return await this.request(`/users/role/${role}`);
  }

  async updateUser(id, userData) {
    return await this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Account management methods
  async createAccount(accountData) {
    return await this.request('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async getAccounts() {
    return await this.request('/accounts');
  }

  async getAccountById(id) {
    return await this.request(`/accounts/${id}`);
  }

  async getAccountsByRole(role) {
    return await this.request(`/accounts/role/${role}`);
  }

  async updateAccount(id, accountData) {
    return await this.request(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(accountData),
    });
  }

  async deleteAccount(id) {
    return await this.request(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // College management methods
  async createCollege(collegeData) {
    return await this.request('/colleges', {
      method: 'POST',
      body: JSON.stringify(collegeData),
    });
  }

  async getColleges() {
    return await this.request('/colleges');
  }

  async getCollegeById(id) {
    return await this.request(`/colleges/${id}`);
  }

  async updateCollege(id, collegeData) {
    return await this.request(`/colleges/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(collegeData),
    });
  }

  async deleteCollege(id) {
    return await this.request(`/colleges/${id}`, {
      method: 'DELETE',
    });
  }

  // Bus management methods
  async createBus(busData) {
    return await this.request('/buses', {
      method: 'POST',
      body: JSON.stringify(busData),
    });
  }

  async getBuses() {
    return await this.request('/buses');
  }

  async getBusById(id) {
    return await this.request(`/buses/${id}`);
  }

  async updateBus(id, busData) {
    return await this.request(`/buses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(busData),
    });
  }

  async deleteBus(id) {
    return await this.request(`/buses/${id}`, {
      method: 'DELETE',
    });
  }

  async updateBusLocation(busId, latitude, longitude) {
    return await this.request(`/buses/${busId}/location`, {
      method: 'PATCH',
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  // Route management methods
  async createRoute(routeData) {
    return await this.request('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }

  async getRoutes() {
    return await this.request('/routes');
  }

  async getRouteById(id) {
    return await this.request(`/routes/${id}`);
  }

  async updateRoute(id, routeData) {
    return await this.request(`/routes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(routeData),
    });
  }

  async deleteRoute(id) {
    return await this.request(`/routes/${id}`, {
      method: 'DELETE',
    });
  }

  // Tracking methods
  async updateBusLocationTracking(busId, locationData) {
    return await this.request(`/tracking/bus/${busId}/location`, {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  async getBusLocationHistory(busId) {
    return await this.request(`/tracking/bus/${busId}/history`);
  }

  async getAllActiveBusLocations() {
    return await this.request('/tracking/buses/active');
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StudentAssistantAPI;
} else if (typeof window !== 'undefined') {
  window.StudentAssistantAPI = StudentAssistantAPI;
}

// Usage examples:

/*
// Initialize the API
const api = new StudentAssistantAPI('http://localhost:3000');

// Login
try {
  const loginResult = await api.login('admin', 'admin123');
  console.log('Login successful:', loginResult);
} catch (error) {
  console.error('Login failed:', error);
}

// Get all buses
try {
  const buses = await api.getBuses();
  console.log('Buses:', buses);
} catch (error) {
  console.error('Failed to get buses:', error);
}

// Update bus location
try {
  await api.updateBusLocation('bus-id', 40.7128, -74.0060);
  console.log('Bus location updated');
} catch (error) {
  console.error('Failed to update bus location:', error);
}

// Get current user
const currentUser = api.getCurrentUser();
console.log('Current user:', currentUser);

// Check if authenticated
if (api.isAuthenticated()) {
  console.log('User is authenticated');
} else {
  console.log('User is not authenticated');
}
*/
