import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSpeech = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: input }),
      });

      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        setFeedback("CoachChad couldn’t handle your transcript. Probably too legendary.");
      }
    } catch (err) {
      setFeedback("CoachChad crashed trying to process that nonsense. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.transcript) {
        setInput(data.transcript);
      } else {
        setFeedback("CoachChad couldn’t transcribe that audio. Maybe mumbling isn’t a strategy?");
      }
    } catch (err) {
      setFeedback("Audio upload failed. CoachChad demands a clearer confession.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🎤 CoachChad: Your Brutally Honest Sales Coach
      </h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        style={{ marginBottom: '1rem', display: 'block' }}
      />

      <textarea
        rows={10}
        placeholder="Paste your sales convo transcript here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: '100%',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}
      />

      <button
        onClick={analyzeSpeech}
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#111827',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Me'}
      </button>

      {feedback && (
        <div
          style={{
            marginTop: '2rem',
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            fontSize: '0.9rem',
          }}
        >
          <h2 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📊 CoachChad’s Judgment</h2>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default App;
