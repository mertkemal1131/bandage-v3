import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

/**
 * ProtectedRoute — React Router v5 pattern
 * Renders the route only if the user is logged in.
 * Otherwise redirects to /login, preserving the intended URL in location.state
 * so LoginPage can redirect back after a successful login.
 */
export default function ProtectedRoute({ component: Component, ...rest }) {
  const user = useSelector(s => s.client.user);

  return (
    <Route
      {...rest}
      render={({ location, ...props }) =>
        user ? (
          <Component {...props} location={location} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: location } }}
          />
        )
      }
    />
  );
}
