"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/app/components/Button";
import axios from "axios";

export default function CreateEventPage() {
    const { isAuthenticated, token, isOrganizer } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
        location: "",
        totalSeats: "",
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isAuthenticated || !isOrganizer) {
        router.push("/login");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

            // Create FormData for multipart upload
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("eventDate", formData.eventDate);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("totalSeats", parseInt(formData.totalSeats));

            // Add image if selected
            if (image) {
                formDataToSend.append("image", image);
            }

            await axios.post(`${API_BASE_URL}/api/events`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            router.push("/organizer");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (all image types)
            if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed");
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB");
                return;
            }

            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError(""); // Clear any previous errors
        }
    };

    return (
        <main className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Event</h1>

                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                placeholder="Enter event title"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                                placeholder="Describe your event"
                            />
                        </div>

                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Date & Time *
                            </label>
                            <input
                                id="eventDate"
                                name="eventDate"
                                type="datetime-local"
                                required
                                value={formData.eventDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                placeholder="Event location"
                            />
                        </div>

                        <div>
                            <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700 mb-2">
                                Total Seats *
                            </label>
                            <input
                                id="totalSeats"
                                name="totalSeats"
                                type="number"
                                required
                                min="1"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                placeholder="Number of available seats"
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Image
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700 transition-all"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Event preview"
                                        className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-300"
                                    />
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                Upload an image for your event (all formats supported, max 5MB)
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                            <strong>Note:</strong> Your event will be submitted for admin approval before it appears publicly.
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? "Creating..." : "Create Event"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push("/organizer")}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
