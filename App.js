// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    // Send token to backend
    fetch('http://localhost:3000/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: res.tokenId }),
    })
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        {!isAuthenticated && (
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            style={{ marginTop: '100px' }}
            isSignedIn={true}
          />
        )}

        <Switch>
          <Route path="/dashboard">
            {isAuthenticated ? <Dashboard /> : <Redirect to="/" />}
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Dashboard() {
  return <h2>Dashboard</h2>;
}

export default App;