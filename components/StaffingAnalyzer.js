import React, { useState } from 'react';

const StaffingAnalyzer = () => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeNeeds = async () => {
    setLoading(true);
    try {
      // First analyze the website
      const websiteRes = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website })
      });
      const websiteData = await websiteRes.json();

      // Then analyze needs with both inputs
      const needsRes = await fetch('/api/analyze-needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description,
          websiteAnalysis: websiteData.analysis
        })
      });
      const needsData = await needsRes.json();

      setRecommendations(needsData.analysis);
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {!submitted ? (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>AI Talent Matcher: Find Your Perfect VA in 60 Seconds</h1>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Business Email</label>
            <input
              type="email"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@business.com"
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Company Website</label>
            <input
              type="url"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://your-company.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Tell us about your business needs</label>
            <textarea
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', height: '120px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your business, current team structure, and what kind of support you're looking for..."
            />
          </div>

          <button
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={analyzeNeeds}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Find Your Perfect VA Match'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
            Thank you! Your custom staffing blueprint has been generated. We've also sent a copy to {email}.
          </div>

          {recommendations && (
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Your Custom Staffing Blueprint</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Your Growth Opportunities</h3>
                {recommendations.focus_areas?.map((area, index) => (
                  <div key={index} style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1e40af' }}>{area.area}</div>
                    <div style={{ fontSize: '14px', color: '#3b82f6', marginTop: '8px' }}>Impact: {area.impact}</div>
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>Key Tasks:</div>
                      <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                        {area.tasks.map((task, idx) => (
                          <li key={idx} style={{ fontSize: '14px', color: '#4b5563' }}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Top-Matched Virtual Assistants</h3>
                {recommendations.candidates?.map((candidate, index) => (
                  <div key={index} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>{candidate.name}</div>
                        <div style={{ fontSize: '14px', color: '#4b5563' }}>{candidate.experience} of experience</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#059669' }}>{candidate.skills_match} Match</div>
                        <div style={{ fontSize: '14px', color: '#4b5563' }}>{candidate.hourly_rate}/hour</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: '500' }}>Expertise: </span>
                        {candidate.specialties.join(', ')}
                      </div>
                      <div style={{ fontSize: '14px', marginTop: '8px' }}>
                        <span style={{ fontWeight: '500' }}>Achievement: </span>
                        {candidate.achievements}
                      </div>
                      <div style={{ fontSize: '14px', color: '#059669', marginTop: '8px' }}>
                        Available: {candidate.availability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Schedule a Call to Meet Your Matched VAs
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffingAnalyzer;
