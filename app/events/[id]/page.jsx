"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/app/components/Button";
import Loading from "@/app/components/Loading";
import axios from "axios";

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, token, isAdmin, isOrganizer } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.get(`${API_BASE_URL}/api/events/${params.id}`);
                console.log(response);
                setEvent(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load event");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [params.id]);

    const handleBooking = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setBooking(true);
        setError("");
        setSuccess("");

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
            await axios.post(`${API_BASE_URL}/api/bookings/${params.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess("Booking successful! Check your email for the ticket.");
            setTimeout(() => router.push("/dashboard"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Booking failed. Please try again.");
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (error && !event) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl">
                    {error}
                </div>
            </main>
        );
    }

    if (!event) {
        return null;
    }

    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedTime = eventDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const canBook = isAuthenticated && !isAdmin && !isOrganizer && event.status === "approved" && event.availableSeats > 0;

    return (
        <main className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Event Image */}
                    {event.image && (
                        <div className="relative h-64 md:h-80 overflow-hidden">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${event.image}`}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-8 border-b border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${event.status === "approved" ? "bg-green-100 text-green-800 border border-green-200" :
                                event.status === "pending" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
                                    "bg-red-100 text-red-800 border border-red-200"
                                }`}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Alerts */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                                {success}
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {event.description || "No description available"}
                            </p>
                        </div>

                        {/* Event Details */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
                                </div>
                                <p className="text-gray-700">{formattedDate}</p>
                                <p className="text-gray-500">{formattedTime}</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                                </div>
                                <p className="text-gray-700">{event.location}</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900">Available Seats</h3>
                                </div>
                                <p className="text-gray-700">
                                    <span className="text-2xl font-bold text-green-600">{event.availableSeats}</span> / {event.totalSeats}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold text-gray-900">Organizer</h3>
                                </div>
                                <p className="text-gray-700">
                                    {typeof event.organizer === "string" ? event.organizer : event.organizer.name}
                                </p>
                            </div>
                        </div>

                        {/* Booking Button */}
                        {canBook ? (
                            <Button
                                onClick={handleBooking}
                                disabled={booking}
                                size="lg"
                                className="w-full"
                            >
                                {booking ? "Booking..." : "Book Now"}
                            </Button>
                        ) : !isAuthenticated ? (
                            <Button
                                onClick={() => router.push("/login")}
                                size="lg"
                                className="w-full"
                            >
                                Login to Book
                            </Button>
                        ) : event.availableSeats === 0 ? (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg text-center">
                                Sorry, this event is sold out
                            </div>
                        ) : event.status !== "approved" ? (
                            <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-6 py-4 rounded-lg text-center">
                                This event is pending approval
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </main>
    );
}
