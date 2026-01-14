"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Button from "../components/Button";
import Link from "next/link";
import axiosInstance from "../../utils/axiosInstance";
// import axios from "axios";

export default function OrganizerPage() {
    const { isAuthenticated, isOrganizer, loading: authLoading } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !isOrganizer) {
            router.push("/login");
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get("/api/events/organizer/my-events");
                setEvents(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [isAuthenticated, router, isOrganizer, authLoading]);

    if (authLoading || loading) {
        return <Loading fullScreen />;
    }

    if (!isAuthenticated || !isOrganizer) {
        return null;
    }

    return (
        <main className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">My Events</h1>
                    <div className="flex gap-4">
                        <Link href="/tickets">
                            <Button variant="secondary">
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                My Tickets
                            </Button>
                        </Link>
                        <Link href="/organizer/create">
                            <Button>
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Event
                            </Button>
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {events.length > 0 ? (
                    <div className="grid gap-6">
                        {events.map((event) => {
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

                            const statusColors = {
                                pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                                approved: "bg-green-500/20 text-green-300 border-green-500/30",
                                rejected: "bg-red-500/20 text-red-300 border-red-500/30",
                            };

                            return (
                                <div
                                    key={event._id}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                                            <p className="text-gray-600">{event.description}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : event.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-gray-500 text-sm">Date & Time</p>
                                                <p className="text-gray-900">{formattedDate}</p>
                                                <p className="text-gray-500 text-sm">{formattedTime}</p>
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

                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-gray-500 text-sm">Seats</p>
                                                <p className="text-gray-900">
                                                    <span className="text-green-600 font-semibold">{event.availableSeats}</span> / {event.totalSeats}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {event.status === "rejected" && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                                            This event was rejected by the admin
                                        </div>
                                    )}

                                    {event.status === "pending" && (
                                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm">
                                            Waiting for admin approval
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Created</h2>
                        <p className="text-gray-600 mb-6">Create your first event to get started!</p>
                        <Link href="/organizer/create">
                            <Button>Create Event</Button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
