import React, { useState } from 'react';
import { auth, googleProvider } from '../../firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Googlebutton from 'react-google-button';
import './index.css';

const Auth = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const navigate = useNavigate();

  const activateSignUpPanel = () => {
    setIsSignUpActive(true);
  };

  const activateSignInPanel = () => {
    setIsSignUpActive(false);
  };

  const signInWithGoogle = async (e) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      localStorage.setItem('token', result.user.accessToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate("/predict");
    } catch (error) {
      console.error('Error during Google sign-in', error);
    }
  };

  return (
    <div className="Auth">
      {/* Animated Wave Background */}
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      {/* Authentication Form Section */}
      <section>
        <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
          <div className="form-container sign-up-container">
            <form action="#">
              <h1>Sign Up</h1>
              <div className="social-container">
                <a href="https://Github.com/YasinDehfuli" target="_blank" rel="noopener noreferrer" className="social"><i className="fab fa-github"></i></a>
              </div>
              <span>Or use your Email for registration</span>
              <label>
                <input type="text" placeholder="Name" />
              </label>
              <label>
                <input type="email" placeholder="Email" />
              </label>
              <label>
                <input type="password" placeholder="Password" />
              </label>
              <button style={{ marginTop: '9px' }}>Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
              <h1>Sign In</h1>
              <div className="social-container">
                <a href="https://Github.com/YasinDehfuli" target="_blank" rel="noopener noreferrer" className="social"><i className="fab fa-github"></i></a>
              </div>
              <span>Or sign in using your email address</span>
              <label>
                <input type="email" placeholder="Email" />
              </label>
              <label>
                <input type="password" placeholder="Password" />
              </label>
              <button>Sign In</button>
              <Googlebutton onClick = {signInWithGoogle} />
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>If you already have an account, sign in here</p>
                <button className="ghost mt-5" onClick={activateSignInPanel}>Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Create Account</h1>
                <p>Sign up now if you don't have an account yet</p>
                <button className="ghost" onClick={activateSignUpPanel}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
