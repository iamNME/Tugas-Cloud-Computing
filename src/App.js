import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import LupaPassword from './pages/lupa-password';
import NotFound from './pages/404';
import Private from './pages/private';
import PrivateRoute from './components/PrivateRoute';

import FirebaseProvider from './components/FirebaseProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './config/theme';
import { SnackbarProvider } from 'notistack'

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider autoHideDuration={3000} maxSnack={3}>
          <FirebaseProvider>
            <Router>
              <Switch>
                <PrivateRoute path='/' exact component={Private} />
                <PrivateRoute path='/transaksi' component={Private} />
                <PrivateRoute path='/produk' component={Private} />
                <PrivateRoute path='/pengaturan' component={Private} />
                <Route path='/register' component={Register} />
                <Route path='/login' component={Login} />
                <Route path='/lupa-password' component={LupaPassword} />
                <Route component={NotFound} />
              </Switch>
            </Router>
          </FirebaseProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;