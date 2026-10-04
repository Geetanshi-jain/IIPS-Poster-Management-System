import React, { useEffect, useState } from 'react';
import client from '../../api/client';
import Navbar from '../../components/Navbar';

export default function StudentDashboard() {
    const [posters, setPosters] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [title, setTitle] = useState('');

    const fetchData = async () => {
        try {
            const evRes = await client.get('events/');
            setEvents(evRes.data);
            const postRes = await client.get('posters/');
            setPosters(postRes.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const submitPoster = async (e) => {
        e.preventDefault();
        try {
            await client.post('posters/', { event: selectedEvent, title, abstract: 'Sample abstract', status: 'SUBMITTED' });
            setTitle(''); fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
                
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Submit New Poster</h2>
                    <form onSubmit={submitPoster} className="flex flex-col space-y-4">
                        <select className="border p-2 rounded" value={selectedEvent} onChange={e=>setSelectedEvent(e.target.value)} required>
                            <option value="">Select Event</option>
                            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                        </select>
                        <input className="border p-2 rounded" placeholder="Poster Title" value={title} onChange={e=>setTitle(e.target.value)} required />
                        <button className="bg-blue-600 text-white p-2 rounded w-48">Submit Poster</button>
                    </form>
                </div>

                <h2 className="text-2xl font-semibold mb-4">My Submissions</h2>
                <div className="grid gap-4">
                    {posters.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                            <h3 className="font-bold text-lg">{p.title}</h3>
                            <p className="text-sm text-gray-500">Status: <span className="font-semibold">{p.status}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
