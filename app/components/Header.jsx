"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user, isAuthenticated, logout, isAdmin, isOrganizer } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
            <div className="container mx-auto flex justify-between items-center px-6 py-4">
                <Link href="/" className="group">
                    <img
                        src="/logo.svg"
                        alt="BookItNow"
                        className="h-8 w-full scale-[6] transition-all duration-300 group-hover:scale-[6.2]"
                    />
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link href="/events" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">
                        Events
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">
                                    Admin Panel
                                </Link>
                            )}

                            {isOrganizer && (
                                <Link href="/organizer" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">
                                    My Events
                                </Link>
                            )}

                            {!isAdmin && !isOrganizer && (
                                <Link href="/dashboard" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">
                                    My Bookings
                                </Link>
                            )}

                            {!isAdmin && (
                                <Link href="/tickets" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">
                                    My Tickets
                                </Link>
                            )}

                            <div className="flex items-center gap-4">
                                <span className="text-gray-600 text-sm">
                                    Welcome, <span className="text-gray-900 font-semibold">{user?.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium">
                                Login
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:shadow-red-500/50">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
