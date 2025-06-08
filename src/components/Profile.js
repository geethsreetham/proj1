import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';
import logo from '../assets/logo.png';

function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setUsername(response.data.username);
        setName(response.data.name);
        setDob(response.data.dob ? response.data.dob.split('T')[0] : '');
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/user/profile', { username, name, dob }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      setSuccess('');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <img src={logo} alt="Novelink Logo" className="profile-logo" />
        <h2>Profile</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        {user ? (
          <form onSubmit={handleSubmit}>
            <label>
              Email (read-only):
              <input type="email" value={user.email} readOnly />
            </label>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              Full Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </label>
            <button type="submit">Update Profile</button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;