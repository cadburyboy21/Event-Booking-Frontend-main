"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Button from "../components/Button";
import axios from "axios";

export default function AdminPage() {
    const { isAuthenticated, token, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("events");
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {

        if (authLoading) return;

        if (!isAuthenticated || !isAdmin) {
            router.push("/login");
            return;
        }

        fetchData();
    }, [isAuthenticated, token, router, isAdmin, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
            if (activeTab === "events") {
                const response = await axios.get(`${API_BASE_URL}/api/admin/events`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEvents(response.data);
            } else if (activeTab === "bookings") {
                const response = await axios.get(`${API_BASE_URL}/api/admin/bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(response.data);
            } else if (activeTab === "users") {
                const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleEventStatusUpdate = async (eventId, status) => {
        setActionLoading(eventId);
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
            await axios.put(`${API_BASE_URL}/api/admin/events/${eventId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh events
            const response = await axios.get(`${API_BASE_URL}/api/admin/events`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to update event status");
        } finally {
            setActionLoading(null);
        }
    };

    if (authLoading || loading && (events.length === 0 && bookings.length === 0 && users.length === 0)) {
        return <Loading fullScreen />;
    }

    return (
        <main className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("events")}
                        className={`px-6 py-3 font-semibold transition-all duration-200 ${activeTab === "events"
                            ? "text-gray-900 border-b-2 border-red-500"
                            : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Events ({events.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`px-6 py-3 font-semibold transition-all duration-200 ${activeTab === "bookings"
                            ? "text-gray-900 border-b-2 border-red-500"
                            : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Bookings ({bookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-6 py-3 font-semibold transition-all duration-200 ${activeTab === "users"
                            ? "text-gray-900 border-b-2 border-red-500"
                            : "text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        Users ({users.length})
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Events Tab */}
                {activeTab === "events" && (
                    <div className="grid gap-6">
                        {events.map((event) => {
                            const eventDate = new Date(event.eventDate);
                            const formattedDate = eventDate.toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            });

                            const statusColors = {
                                pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                                approved: "bg-green-500/20 text-green-300 border-green-500/30",
                                rejected: "bg-red-500/20 text-red-300 border-red-500/30",
                            };

                            return (
                                <div
                                    key={event._id}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                                            <p className="text-gray-600 mb-2">{event.description}</p>
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span>📅 {formattedDate}</span>
                                                <span>📍 {event.location}</span>
                                                <span>🎫 {event.availableSeats}/{event.totalSeats} seats</span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : event.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                    </div>

                                    {event.status === "pending" && (
                                        <div className="flex gap-3 mt-4">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleEventStatusUpdate(event._id, "approved")}
                                                disabled={actionLoading === event._id}
                                            >
                                                {actionLoading === event._id ? "Processing..." : "Approve"}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleEventStatusUpdate(event._id, "rejected")}
                                                disabled={actionLoading === event._id}
                                            >
                                                {actionLoading === event._id ? "Processing..." : "Reject"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {events.length === 0 && (
                            <div className="text-center py-16 text-gray-500">No events found</div>
                        )}
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === "bookings" && (
                    <div className="grid gap-6">
                        {bookings.map((booking) => {
                            const event = typeof booking.event === "string" ? null : booking.event;
                            const user = typeof booking.user === "string" ? null : booking.user;

                            return (
                                <div
                                    key={booking._id}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {event ? event.title : "Event not found"}
                                            </h3>
                                            <p className="text-gray-600 mb-1">
                                                User: <span className="text-gray-900">{user ? user.name : "Unknown"}</span>
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                Email: <span className="text-gray-900">{user ? user.email : "Unknown"}</span>
                                            </p>
                                            <p className="text-gray-600">
                                                Ticket ID: <span className="text-red-600 font-mono">{booking.ticketId}</span>
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${booking.status === "confirmed"
                                            ? "bg-green-100 text-green-800 border border-green-200"
                                            : "bg-red-100 text-red-800 border border-red-200"
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {bookings.length === 0 && (
                            <div className="text-center py-16 text-gray-500">No bookings found</div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {users.map((user) => {
                            const roleColors = {
                                user: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                                organizer: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                                admin: "bg-red-500/20 text-red-300 border-red-500/30",
                            };

                            return (
                                <div
                                    key={user._id}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                            <p className="text-gray-600 text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${user.role === 'user' ? 'bg-blue-100 text-blue-800 border-blue-200' : user.role === 'organizer' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </div>
                            );
                        })}
                        {users.length === 0 && (
                            <div className="text-center py-16 text-gray-500 col-span-full">No users found</div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
