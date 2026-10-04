import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [posters, setPosters] = useState([]);
  const [newPosterTitle, setNewPosterTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');

  useEffect(() => {
    api.get('events/').then(res => {
      setEvents(res.data);
      if(res.data.length > 0) setSelectedEvent(res.data[0].id);
    }).catch(console.error);
    api.get('posters/').then(res => setPosters(res.data)).catch(console.error);
  }, []);

  const handleSubmitPoster = async (e) => {
    e.preventDefault();
    try {
      await api.post('posters/', {
        title: newPosterTitle,
        event: selectedEvent,
        abstract: 'Detailed abstract of the research.',
        status: 'SUBMITTED'
      });
      alert('Poster Submitted Successfully!');
      setNewPosterTitle('');
      const pRes = await api.get('posters/');
      setPosters(pRes.data);
    } catch (err) {
      alert('Submission failed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Student Portal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-2">Submit New Poster</h2>
            <form onSubmit={handleSubmitPoster} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Event</label>
                <select className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Poster Title</label>
                <input className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. AI in Healthcare" value={newPosterTitle} onChange={e => setNewPosterTitle(e.target.value)} required />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold shadow-md transition-colors mt-2">Submit Poster</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-2">My Submissions</h2>
            <div className="space-y-3">
              {posters.map(p => (
                <div key={p.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-2">
                  <span className="font-bold text-lg text-gray-800">{p.title}</span>
                  <span className="w-fit text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200">Status: {p.status}</span>
                </div>
              ))}
              {posters.length === 0 && <p className="text-gray-500 italic">You haven't submitted any posters yet.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
