// import React from 'react';
// import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import LoginPage from '@pages/LoginPage';
// import RegisterPage from '@pages/RegisterPage';
// import HomePage from '@pages/HomePage';
// import { AuthProvider, useAuth } from '../context/AuthContext';

// const PrivateRoute: React.FC<{ component: React.ComponentType; path: string }> = ({ component: Component, ...rest }) => {
//   const authContext = useAuth();
//   const user = authContext ? authContext.user : null;

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         user ? (
//           <Component {...props as any} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// const App: React.FC = () => {
//   return (
//   <AuthProvider>
//     <Router>
//       <Switch>
//         <Route path="/login" component={LoginPage} />
//         <Route path="/register" component={RegisterPage} />
//         <PrivateRoute path="/homepage" component={HomePage} />
//           {/* Redirection par défaut */}
//           <Redirect from="/" to="/homepage" />
//       </Switch>
//     </Router>
//   </AuthProvider>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import HomePage from '@pages/HomePage';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Import our custom CSS
import '@scss/style.scss'


const PrivateRoute: React.FC<{ component: React.ComponentType<any>; path: string }> = ({ component: Component, ...rest }) => {
  const auth = useAuth();
  const user = auth?.user;

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <PrivateRoute path="/homepage" component={HomePage} />
          <Redirect from="/" to="/homepage" />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
