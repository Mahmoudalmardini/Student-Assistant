/**
 * React Hooks for Student Assistant API
 * Custom hooks for easy integration with the Student Assistant API
 */

import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Unauthorized - please login again');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Custom hook for authentication
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (identifier, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
  };
}

// Custom hook for bus management
export function useBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/buses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buses');
      }

      const data = await response.json();
      setBuses(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBus = useCallback(async (busData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(busData),
      });

      if (!response.ok) {
        throw new Error('Failed to create bus');
      }

      const newBus = await response.json();
      setBuses(prev => [...prev, newBus]);
      return newBus;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const updateBusLocation = useCallback(async (busId, latitude, longitude) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/buses/${busId}/location`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error('Failed to update bus location');
      }

      const updatedBus = await response.json();
      setBuses(prev => prev.map(bus => 
        bus.id === busId ? { ...bus, ...updatedBus } : bus
      ));
      return updatedBus;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  return {
    buses,
    loading,
    error,
    createBus,
    updateBusLocation,
    refetch: fetchBuses,
  };
}

// Custom hook for tracking
export function useTracking() {
  const [activeBuses, setActiveBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveBuses = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/tracking/buses/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch active buses');
      }

      const data = await response.json();
      setActiveBuses(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBusLocation = useCallback(async (busId, locationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/tracking/bus/${busId}/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error('Failed to update bus location');
      }

      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const getBusLocationHistory = useCallback(async (busId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/tracking/bus/${busId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bus location history');
      }

      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchActiveBuses();
  }, [fetchActiveBuses]);

  return {
    activeBuses,
    loading,
    error,
    updateBusLocation,
    getBusLocationHistory,
    refetch: fetchActiveBuses,
  };
}

// Custom hook for colleges
export function useColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/colleges', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch colleges');
      }

      const data = await response.json();
      setColleges(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCollege = useCallback(async (collegeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/colleges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(collegeData),
      });

      if (!response.ok) {
        throw new Error('Failed to create college');
      }

      const newCollege = await response.json();
      setColleges(prev => [...prev, newCollege]);
      return newCollege;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  return {
    colleges,
    loading,
    error,
    createCollege,
    refetch: fetchColleges,
  };
}

// Example React components using these hooks:

/*
// Login Component
function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.identifier, formData.password);
      // Redirect or update UI
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username/University ID"
        value={formData.identifier}
        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

// Bus List Component
function BusList() {
  const { buses, loading, error } = useBuses();

  if (loading) return <div>Loading buses...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Buses</h2>
      {buses.map(bus => (
        <div key={bus.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{bus.plateNumber}</h3>
          <p>Model: {bus.model}</p>
          <p>Capacity: {bus.capacity}</p>
          <p>Status: {bus.isActive ? 'Active' : 'Inactive'}</p>
          {bus.currentLatitude && bus.currentLongitude && (
            <p>Location: {bus.currentLatitude}, {bus.currentLongitude}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Active Buses Map Component
function ActiveBusesMap() {
  const { activeBuses, loading, error } = useTracking();

  if (loading) return <div>Loading active buses...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Active Buses</h2>
      {activeBuses.map(bus => (
        <div key={bus.busId} style={{ border: '1px solid #green', margin: '10px', padding: '10px' }}>
          <h3>{bus.plateNumber}</h3>
          <p>Driver: {bus.driver?.firstName} {bus.driver?.lastName}</p>
          <p>Location: {bus.currentLatitude}, {bus.currentLongitude}</p>
          <p>Last Update: {new Date(bus.lastLocationUpdate).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

// Main App Component
function App() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <header>
        <h1>Student Assistant Dashboard</h1>
        <p>Welcome, {user?.firstName} {user?.lastName} ({user?.role})</p>
        <button onClick={logout}>Logout</button>
      </header>
      
      <main>
        <BusList />
        <ActiveBusesMap />
      </main>
    </div>
  );
}
*/
