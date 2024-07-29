import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction } = location.state || {};

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h1>Prediction Result</h1>
      <div className="result">
        <p><strong>Prediction:</strong> {prediction}</p>
        <button onClick = {handleClick} className='back-button'>Go Back</button>
      </div>
    </div>
  );
};

export default Result;
