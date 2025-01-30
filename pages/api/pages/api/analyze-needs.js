import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { description, websiteAnalysis } = req.body;
    console.log('Analyzing needs:', { description, websiteAnalysis }); // Debug log

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `
    Based on this business description: "${description}" 
    and website analysis: "${websiteAnalysis}"
    
    Create a JSON response with exactly this structure:
    {
      "focus_areas": [
        {
          "area": "Area name",
          "impact": "Potential impact",
          "tasks": ["task1", "task2", "task3"]
        }
      ],
      "candidates": [
        {
          "name": "Name",
          "experience": "X years",
          "specialties": ["specialty1", "specialty2"],
          "achievements": "Key achievement",
          "availability": "Timing",
          "hourly_rate": "$X-Y",
          "skills_match": "X%"
        }
      ]
    }
    
    Ensure the response is valid JSON.`;

    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    console.log('Claude Response:', message.content); // Debug log

    // Parse the response to ensure it's valid JSON
    let analysisJson;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw response:', message.content);
      throw new Error('Failed to parse AI response');
    }

    return res.status(200).json({ analysis: analysisJson });
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze needs',
      details: error.message 
    });
  }
}
