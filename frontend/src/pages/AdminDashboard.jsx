import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [posters, setPosters] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [criteria, setCriteria] = useState(['Design', 'Content']);
  const [leaderboards, setLeaderboards] = useState({});
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetPosters, setModalTargetPosters] = useState([]); // Array of poster IDs
  const [selectedReviewers, setSelectedReviewers] = useState([]); // Array of checked reviewer IDs
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => { fetchData(); }, []);
  
  const fetchData = async () => {
    try {
      const eRes = await api.get('events/');
      setEvents(eRes.data);
      const pRes = await api.get('posters/');
      setPosters(pRes.data);
      const rRes = await api.get('reviewers/');
      setReviewers(rRes.data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('events/', { title: newTitle, description: 'Created by Admin', start_date: '2026-01-01', end_date: '2026-12-31', is_published: true, results_published: false, criteria_list: criteria });
      alert('Event Created!');
      setNewTitle('');
      fetchData();
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handlePublishResults = async (eventId) => {
    try {
      await api.put(`events/${eventId}/`, {
        title: events.find(e=>e.id===eventId).title,
        description: 'Test', start_date: '2026-01-01', end_date: '2026-12-31', is_published: true, results_published: true
      });
      const res = await api.get(`events/${eventId}/rankings/`);
      setLeaderboards({ ...leaderboards, [eventId]: res.data });
      alert('Rankings Calculated successfully!');
    } catch (err) {
      alert('Failed to calculate rankings');
    }
  };

  const openAssignModal = (posterIds, title) => {
    setModalTargetPosters(posterIds);
    setModalTitle(title);
    setSelectedReviewers([]);
    setIsModalOpen(true);
  };

  const toggleReviewerSelection = (id) => {
    if (selectedReviewers.includes(id)) {
      setSelectedReviewers(selectedReviewers.filter(r => r !== id));
    } else {
      setSelectedReviewers([...selectedReviewers, id]);
    }
  };

  const submitBulkAssignment = async () => {
    if (selectedReviewers.length === 0) {
      alert("Please select at least one reviewer.");
      return;
    }
    try {
      await api.post('reviewers/bulk-assign/', {
        poster_ids: modalTargetPosters,
        reviewer_ids: selectedReviewers
      });
      alert('Reviewers successfully assigned!');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to assign reviewers.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 relative">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Admin Control Panel</h1>
        
        {/* Create Event Section */}
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-2">1. Create Event</h2>
          <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
            <input className="border p-3 rounded-lg" placeholder="Event Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
            <div className="bg-gray-50 p-4 border rounded">
                <label className="font-bold block mb-2">Evaluation Criteria (0-10 Score):</label>
                {criteria.map((c, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input className="border p-2 rounded flex-grow" value={c} onChange={e => {
                            const newC = [...criteria];
                            newC[idx] = e.target.value;
                            setCriteria(newC);
                        }} required />
                        <button type="button" onClick={() => setCriteria(criteria.filter((_, i) => i !== idx))} className="bg-red-500 text-white px-3 rounded">X</button>
                    </div>
                ))}
                <button type="button" onClick={() => setCriteria([...criteria, ''])} className="bg-gray-200 px-4 py-2 rounded font-bold">+ Add Criterion</button>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow self-start">Create Event</button>
          </form>
        </div>


        {/* Grouped Events & Posters Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-2">2. Manage Events & Assign Reviewers</h2>
          <div className="space-y-8">
            {events.map(ev => {
              const eventPosters = posters.filter(p => p.event === ev.id);
              const eventPosterIds = eventPosters.map(p => p.id);

              return (
                <div key={ev.id} className="border border-blue-200 rounded-lg overflow-hidden shadow-sm">
                  {/* Event Header */}
                  <div className="bg-blue-50 p-4 flex justify-between items-center border-b border-blue-200">
                    <h3 className="text-xl font-bold text-blue-800">{ev.title}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openAssignModal(eventPosterIds, `Assign Reviewers to ALL Posters in ${ev.title}`)} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-bold shadow transition-colors"
                        disabled={eventPosterIds.length === 0}
                      >
                        + Assign Reviewers to Entire Event
                      </button>
                      <button 
                        onClick={() => handlePublishResults(ev.id)} 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold shadow transition-colors"
                      >
                        Calculate Ranks
                      </button>
                    </div>
                  </div>
                  
                  {/* Posters List for this Event */}
                  <div className="p-4 bg-white space-y-3">
                    {eventPosters.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">No posters submitted for this event yet.</p>
                    ) : (
                      eventPosters.map(p => (
                        <div key={p.id} className="p-3 bg-gray-50 border border-gray-200 rounded flex justify-between items-center">
                          <div>
                            <span className="font-semibold">{p.title}</span>
                            <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded ml-3 border border-gray-300">{p.status}</span>
                          </div>
                          <button 
                            onClick={() => openAssignModal([p.id], `Assign Reviewers to Poster: ${p.title}`)} 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold shadow transition-colors"
                          >
                            + Add Reviewer(s)
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Leaderboard Section */}
                  {leaderboards[ev.id] && leaderboards[ev.id].length > 0 && (
                    <div className="bg-yellow-50 p-4 border-t border-blue-200">
                      <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">🏆 Official Leaderboard</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white border border-yellow-200 rounded-lg shadow-sm">
                          <thead className="bg-yellow-100 text-yellow-900 border-b border-yellow-200">
                            <tr>
                              <th className="p-3 font-bold w-20 text-center">Rank</th>
                              <th className="p-3 font-bold">Poster Title</th>
                              <th className="p-3 font-bold w-32 text-center">Avg Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaderboards[ev.id].map((rankItem) => (
                              <tr key={rankItem.poster_id} className="border-b last:border-0 hover:bg-yellow-50 transition-colors">
                                <td className="p-3 text-center font-extrabold text-xl text-yellow-700">#{rankItem.rank}</td>
                                <td className="p-3 font-semibold text-gray-800">{rankItem.title}</td>
                                <td className="p-3 text-center font-bold text-blue-700">{rankItem.score.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
            {events.length === 0 && <p className="text-gray-500 italic">No events created yet.</p>}
          </div>
        </div>
      </div>

      {/* Reusable Reviewer Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{modalTitle}</h3>
            
            <div className="mb-4 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
              {reviewers.length === 0 ? (
                <p className="text-gray-500 text-sm p-2">No reviewers available in the system.</p>
              ) : (
                reviewers.map(rev => (
                  <label key={rev.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer border-b last:border-0">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-blue-600 rounded"
                      checked={selectedReviewers.includes(rev.id)}
                      onChange={() => toggleReviewerSelection(rev.id)}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{rev.username}</div>
                      <div className="text-xs text-gray-500">{rev.email}</div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitBulkAssignment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow transition-colors"
                disabled={reviewers.length === 0}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
