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
        <p>Prediction: {prediction}</p>
        <button onClick = {handleClick} className="btn">
          <strong>GO BACK</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>
          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Result;
