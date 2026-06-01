import { NavLink } from 'react-router';

function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center p-6">
        <h1 className="text-3xl font-bold mb-4">Check Your Email</h1>

        <p className="mb-6">
          We've sent a verification email to your inbox. Please verify your account before logging
          in.
        </p>

        <NavLink to="/login" className="btn btn-primary">
          Go To Login
        </NavLink>
      </div>
    </div>
  );
}

export default CheckEmail;
