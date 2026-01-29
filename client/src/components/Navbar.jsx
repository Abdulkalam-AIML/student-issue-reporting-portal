import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    // Hide Navbar on Landing, Login, and Register pages
    const hideNavbarRoutes = ['/', '/login', '/register', '/dashboard', '/admin-dashboard', '/admin-data'];
    // Handle potential trailing slashes
    const currentPath = location.pathname.replace(/\/$/, "");

    if (hideNavbarRoutes.includes(currentPath) || hideNavbarRoutes.includes(location.pathname)) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="bg-primary/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-accent">
                <Link to="/">Student Issue Requesting Portal</Link>
            </h1>
            <div className="flex items-center space-x-6">
                {user ? (
                    <>
                        <span className="text-gray-300 font-medium">Hello, <span className="text-white">{user.name}</span></span>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary py-1 px-4 text-sm hover:text-red-400 hover:border-red-500/30"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn-primary py-1 px-4 text-sm shadow-none">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
