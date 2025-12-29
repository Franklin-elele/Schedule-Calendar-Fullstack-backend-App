  
  export default function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      // Check if user info is attached to the request - Checks if the user is Logged In
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    };
  };
