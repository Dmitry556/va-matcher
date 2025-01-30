import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { description, websiteAnalysis } = req.body;

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.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,
    });

    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Based on this business description: "${description}" 
        and website analysis: "${websiteAnalysis}", 
        identify the top 3 focus areas and match the most relevant virtual assistant candidates.
        Provide output in JSON format with focus_areas and candidates arrays.`
      }]
    });

    return res.status(200).json({ analysis: JSON.parse(message.content) });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to analyze needs' });
  }
}
