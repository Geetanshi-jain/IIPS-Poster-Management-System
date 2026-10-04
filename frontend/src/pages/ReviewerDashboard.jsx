import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Navbar from '../components/Navbar';

export default function ReviewerDashboard() {
  const [posters, setPosters] = useState([]);
  
  // Evaluation Modal State
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalPoster, setEvalPoster] = useState(null);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');
  
  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      const res = await api.get('posters/');
      setPosters(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const openEvaluation = (poster) => {
    setEvalPoster(poster);
    const initialScores = {};
    if (poster.event_criteria && poster.event_criteria.length > 0) {
      poster.event_criteria.forEach(c => initialScores[c] = 0);
    } else {
      initialScores['General Score'] = 0; // Fallback
    }
    setScores(initialScores);
    setFeedback('');
    setEvalModalOpen(true);
  };

  const handleScoreChange = (criterion, value) => {
    let num = parseInt(value);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 10) num = 10;
    setScores({...scores, [criterion]: num});
  };

  const submitEvaluation = async (e) => {
    e.preventDefault();
    try {
      await api.post('evaluations/submit/', {
        assignment: evalPoster.id, 
        total_score: 0, // Backend will recalculate
        criteria_scores: scores,
        feedback: feedback
      });
      alert('Evaluation submitted successfully!');
      setEvalModalOpen(false);
      fetchPosters();
    } catch(err) {
      alert('Failed to submit evaluation');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative pb-12">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Reviewer Portal</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b pb-2">Assigned Submissions</h2>
          <div className="space-y-4">
            {posters.map(p => (
              <div key={p.id} className="p-5 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{p.title}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded inline-block mt-2 ${p.status === 'EVALUATED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200'} border`}>
                    Status: {p.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {p.pdf_file && (
                    <a href={p.pdf_file.startsWith('http') ? p.pdf_file : `http://localhost:8000${p.pdf_file}`} target="_blank" rel="noreferrer" className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded font-bold shadow transition-colors text-center flex items-center">
                      View PDF
                    </a>
                  )}
                  {p.status !== 'EVALUATED' && (
                    <button onClick={() => openEvaluation(p)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-bold shadow transition-colors">
                      Evaluate Paper
                    </button>
                  )}
                </div>
                {p.status === 'EVALUATED' && (
                  <span className="text-green-600 font-bold">✓ Completed</span>
                )}
              </div>
            ))}
            {posters.length === 0 && <p className="text-gray-500 italic">No assigned posters.</p>}
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {evalModalOpen && evalPoster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-2 text-gray-800 border-b pb-2">Evaluate: {evalPoster.title}</h3>
            <p className="text-sm text-gray-600 mb-6">Enter a score between 0 and 10 for each criterion.</p>
            
            <form onSubmit={submitEvaluation}>
              <div className="space-y-4 mb-6">
                {Object.keys(scores).map(criterion => (
                  <div key={criterion} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <label className="font-semibold text-gray-700">{criterion}</label>
                    <input 
                      type="number" 
                      min="0" max="10" 
                      className="border-2 border-gray-300 p-2 rounded w-20 text-center font-bold text-lg"
                      value={scores[criterion]}
                      onChange={(e) => handleScoreChange(criterion, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="font-bold block mb-2 text-gray-700">Qualitative Feedback</label>
                <textarea 
                  className="w-full border-2 border-gray-300 p-3 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                  rows="4" 
                  placeholder="Provide your feedback here..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEvalModalOpen(false)} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-bold transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold shadow transition-colors">Submit Evaluation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
