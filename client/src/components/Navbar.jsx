import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import React from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    <Link to="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 truncate">
                        TaskMaster
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        {user ? (
                            <>
                                <span className="text-sm lg:text-base text-gray-700 flex items-center gap-1 lg:gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">{user.username}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors text-sm lg:text-base"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm lg:text-base"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 border-t">
                        <div className="flex flex-col gap-3 pt-4">
                            {user ? (
                                <>
                                    <span className="text-gray-700 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {user.username}
                                    </span>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
