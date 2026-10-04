import React, { useEffect, useState } from 'react';
import client from '../api/client';
import Navbar from '../components/Navbar';

export default function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        client.get('events/').then(res => setEvents(res.data)).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6">Upcoming Poster Events</h1>
                <div className="grid gap-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-white p-6 rounded shadow-md">
                            <h2 className="text-2xl font-semibold text-blue-600">{event.title}</h2>
                            <p className="text-gray-700 mt-2">{event.description}</p>
                            <p className="text-sm text-gray-500 mt-4">Ends: {event.end_date}</p>
                        </div>
                    ))}
                    {events.length === 0 && <p>No published events available at the moment.</p>}
                </div>
            </div>
        </div>
    );
}
