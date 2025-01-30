import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardList, Send } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto p-6">
      {!submitted ? (
        <Card>
          <CardHeader>
            <CardTitle>AI Talent Matcher: Find Your Perfect VA in 60 Seconds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@business.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company Website</label>
                <input
                  type="url"
                  className="w-full p-2 border rounded"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://your-company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tell us about your business needs</label>
                <textarea
                  className="w-full p-2 border rounded h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your business, current team structure, and what kind of support you're looking for..."
                />
              </div>

              <button
                className="w-full bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2"
                onClick={analyzeNeeds}
                disabled={loading}
              >
                {loading ? (
                  'Analyzing...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Find Your Perfect VA Match
                  </>
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Alert>
            <ClipboardList className="w-4 h-4" />
            <AlertDescription>
              Thank you! Your custom staffing blueprint has been generated. We've also sent a copy to {email}.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Your Custom Staffing Blueprint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Your Growth Opportunities</h3>
                  <div className="grid gap-6">
                    {recommendations?.focus_areas?.map((area, index) => (
                      <div key={index} className="border p-6 rounded-lg bg-blue-50">
                        <div className="text-lg font-medium text-blue-800">{area.area}</div>
                        <div className="text-sm text-blue-600 mt-2">Potential Impact: {area.impact}</div>
                        <div className="mt-3">
                          <div className="text-sm font-medium">Key Tasks:</div>
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {area.tasks.map((task, idx) => (
                              <li key={idx}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Top-Matched Virtual Assistants</h3>
                  <div className="grid gap-6">
                    {recommendations?.candidates?.map((candidate, index) => (
                      <div key={index} className="border p-6 rounded-lg hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-lg font-medium">{candidate.name}</div>
                            <div className="text-sm text-gray-600">
                              {candidate.experience} of experience
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {candidate.skills_match} Match
                            </div>
                            <div className="text-sm text-gray-600">
                              {candidate.hourly_rate}/hour
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm">
                            <span className="font-medium">Expertise: </span>
                            {candidate.specialties.join(', ')}
                          </div>
                          <div className="text-sm mt-2">
                            <span className="font-medium">Key Achievement: </span>
                            {candidate.achievements}
                          </div>
                          <div className="text-sm text-green-600 mt-2">
                            Available: {candidate.availability}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule a Call to Meet Your Matched VAs
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffingAnalyzer;
