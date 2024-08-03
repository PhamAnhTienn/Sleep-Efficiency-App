import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import "./index.css";

const Predict = () => {
  const [formData, setFormData] = useState({
    Age: '',
    Gender: '',
    Bedtime: '',
    Bedtime_AMPM: '',
    Wakeup_time: '',
    Wakeup_time_AMPM: '',
    Sleep_duration: '',
    Awakenings: '',
    Caffeine_consumption: '',
    Alcohol_consumption: '',
    Smoking_status: '',
    Exercise_frequency: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      navigate('/result', { state: { prediction: data.result } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const signOutWithGoogle = async (e) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User information not found in local storage');
      }
  
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/auth");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="Predict">
      <div className="form-container">
        <h1>Predicting Sleep Efficiency</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="Age">Age:</label>
            <input
              type="number"
              name="Age"
              id="Age"
              className="input-text"
              value={formData.Age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="Gender">Gender:</label>
            <select
              name="Gender"
              id="Gender"
              className="input-text"
              value={formData.Gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="Bedtime">Bedtime:</label>
            <input
              type="number"
              name="Bedtime"
              id="Bedtime"
              className="input-text"
              value={formData.Bedtime}
              onChange={handleChange}
              required
            />
            <select
              name="Bedtime_AMPM"
              id="Bedtime_AMPM"
              className="input-text"
              value={formData.Bedtime_AMPM}
              onChange={handleChange}
              required
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="Wakeup_time">Wakeup time:</label>
            <input
              type="number"
              name="Wakeup_time"
              id="Wakeup_time"
              className="input-text"
              value={formData.Wakeup_time}
              onChange={handleChange}
              required
            />
            <select
              name="Wakeup_time_AMPM"
              id="Wakeup_time_AMPM"
              className="input-text"
              value={formData.Wakeup_time_AMPM}
              onChange={handleChange}
              required
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <div className="form-row-total">
            <div className="form-row">
              <label htmlFor="Sleep_duration">Sleep Duration (in hours):</label>
              <input
                type="number"
                name="Sleep_duration"
                id="Sleep_duration"
                className="input-text"
                value={formData.Sleep_duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="Awakenings">Awakenings during sleeping:</label>
              <input
                type="number"
                name="Awakenings"
                id="Awakenings"
                className="input-text"
                value={formData.Awakenings}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-combined">
            <div className="form-row">
              <label htmlFor="Caffeine_consumption">Caffeine Consumption Yesterday:</label>
              <select
                name="Caffeine_consumption"
                id="Caffeine_consumption"
                className="input-text"
                value={formData.Caffeine_consumption}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Yes or No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="Alcohol_consumption">Alcohol Consumption Yesterday:</label>
              <select
                name="Alcohol_consumption"
                id="Alcohol_consumption"
                className="input-text"
                value={formData.Alcohol_consumption}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Yes or No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="form-row-total">
            <div className="form-row">
              <label htmlFor="Smoking_status">Smoking Status:</label>
              <select
                name="Smoking_status"
                id="Smoking_status"
                className="input-text"
                value={formData.Smoking_status}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Yes or No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="Exercise_frequency">Exercise Frequency Each Week:</label>
              <input
                type="number"
                name="Exercise_frequency"
                id="Exercise_frequency"
                className="input-text"
                value={formData.Exercise_frequency}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-buttons">
            <button className="btn" type="submit" value="Predict">
              <strong>PREDICT</strong>
              <div id="container-stars">
                <div id="stars"></div>
              </div>
              <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </button>
            <button className="btn" onClick={signOutWithGoogle}>
              <strong>Sign Out</strong>
              <div id="container-stars">
                <div id="stars"></div>
              </div>
              <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Predict;
