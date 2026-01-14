"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import axios from "axios";

export default function DashboardPage() {
    const { isAuthenticated, token, isAdmin, isOrganizer, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;


        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (isAdmin) {
            router.push("/admin");
            return;
        }

        if (isOrganizer) {
            router.push("/organizer");
            return;
        }

        const fetchBookings = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${API_BASE_URL}/api/bookings/my-bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Fetched bookings:", response.data);
                setBookings(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [isAuthenticated, token, router, isAdmin, isOrganizer]);

    if (authLoading || loading) {
        return <Loading fullScreen />;
    }

    return (
        <main className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
                    <a
                        href="/tickets"
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/50 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        View All Tickets ({bookings.length})
                    </a>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {bookings.length > 0 ? (
                    <div className="grid gap-6">
                        {bookings.map((booking) => {
                            const event = typeof booking.event === "string" ? null : booking.event;
                            if (!event) return null;

                            const eventDate = new Date(event.eventDate);
                            const formattedDate = eventDate.toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            });
                            const formattedTime = eventDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                    key={booking._id}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                                            <p className="text-gray-600">Ticket ID: <span className="text-red-600 font-mono">{booking.ticketId}</span></p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${booking.status === "confirmed"
                                            ? "bg-green-100 text-green-800 border border-green-200"
                                            : "bg-red-100 text-red-800 border border-red-200"
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-gray-500 text-sm">Date & Time</p>
                                                <p className="text-gray-900">{formattedDate} at {formattedTime}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-gray-500 text-sm">Location</p>
                                                <p className="text-gray-900">{event.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.ticket && (
                                        <a
                                            href={`/tickets/${booking.ticket.ticketId || booking.ticketId}`}
                                            className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300 mt-4"
                                        >
                                            View Ticket
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h2>
                        <p className="text-gray-600 mb-6">Start exploring events and book your first ticket!</p>
                        <button
                            onClick={() => router.push("/events")}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/50"
                        >
                            Browse Events
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
