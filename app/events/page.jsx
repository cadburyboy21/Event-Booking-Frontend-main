import EventCard from "@/app/components/EventCard";
import axios from "axios";

export default async function EventsPage() {
    let events = [];
    let error = null;

    try {
        // Use API_URL for server-side calls (Docker network), NEXT_PUBLIC_API_URL for client-side
        const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        // Show only approved events to public
        console.log(response.data);
        events = response.data.filter(e => e.status === "approved");
    } catch (err) {
        error = err.message;
    }

    return (
        <main className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-6">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">All Events</h1>
                    <p className="text-gray-600 text-lg">Discover and book amazing events happening near you</p>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
                        Failed to load events: {error}
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Events Available</h2>
                        <p className="text-gray-500">Check back soon for upcoming events!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
