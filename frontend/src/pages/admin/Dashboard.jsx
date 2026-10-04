import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const fetchEvents = () => {
        client.get('events/').then(res => setEvents(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const createEvent = async (e) => {
        e.preventDefault();
        try {
            await client.post('events/', { title, description: desc, start_date: '2026-01-01', end_date: '2026-12-31', is_published: true });
            setTitle(''); setDesc('');
            fetchEvents();
        } catch (error) {
            console.error('Error creating event', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                    <form onSubmit={createEvent} className="flex flex-col space-y-4">
                        <input className="border p-2 rounded" placeholder="Event Title" value={title} onChange={e=>setTitle(e.target.value)} required />
                        <textarea className="border p-2 rounded" placeholder="Event Description" value={desc} onChange={e=>setDesc(e.target.value)} required />
                        <button className="bg-green-600 text-white p-2 rounded w-48">Publish Event</button>
                    </form>
                </div>

                <h2 className="text-2xl font-semibold mb-4">Manage Events</h2>
                <div className="grid gap-4">
                    {events.map(ev => (
                        <div key={ev.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{ev.title}</h3>
                                <p className="text-gray-600">{ev.description}</p>
                            </div>
                            <button onClick={() => alert('View Rankings functionality')} className="bg-blue-600 text-white px-4 py-2 rounded">View Rankings</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
