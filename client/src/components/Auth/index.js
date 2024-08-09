import React, { useState } from 'react';
import { auth, googleProvider } from '../../firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Googlebutton from 'react-google-button';
import axios from 'axios';
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

      await axios.post('/api/users', {
        name: result.user.displayName,
        email: result.user.email,
        googleId: result.user.uid,
        accessToken: result.user.accessToken,
      });

      localStorage.setItem('user', JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
        googleId: result.user.uid,
        accessToken: result.user.accessToken,
      }));

      navigate("/predict");
    } catch (error) {
      console.error('Error during Google sign-in', error);
    }
  };

  return (
    <div className="Auth">
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <section>
        <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
          <div className="form-container sign-up-container">
            <form action="#">
              <h1>Sign Up</h1>
              <span>Or use your Email for registration</span>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button>Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form action="#">
              <h1>Sign In</h1>
              <span>Or sign in using your email address</span>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <button>Sign In</button>
              <Googlebutton onClick={signInWithGoogle} />
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>If you already have an account, sign in here</p>
                <button className="ghost" onClick={activateSignInPanel}>Sign In</button>
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
