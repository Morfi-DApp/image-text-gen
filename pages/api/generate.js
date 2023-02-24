import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const dreamAnalysisDescription = req.body.dreamAnalysisDescription || '';
  if (dreamAnalysisDescription.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid dream description",
      }
    });
    return;
  }
  const walkingInfluence = req.body.walkingInfluence || '';
  if (walkingInfluence.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid dream walking influence",
      }
    });
    return;
  }
  const dreamFeeling = req.body.dreamFeeling || '';
  if (dreamFeeling.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid dream Feeling",
      }
    });
    return;
  }
  const dreamOptimize = req.body.dreamOptimize || '';
  if (dreamOptimize.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid dream Optimize",
      }
    });
    return;
  }
  const dreamImageDescription = req.body.dreamImageDescription || '';
  if (dreamImageDescription.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid dream Image Description",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(dreamAnalysisDescription,dreamFeeling,walkingInfluence),
      temperature: 0.6,
      max_tokens:3500
    });

    const imageGen = await openai.createImage({
      prompt: `${dreamImageDescription}+${dreamOptimize}`,
      n: 1,
      size: "1024x1024",
    });

    res.status(200).json({ result: completion.data.choices[0].text,url:imageGen.data.data[0].url });
    console.log(res)
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(dreamAnalysisDescription,dreamFeeling,walkingInfluence) {
  
const dreamAnalysisprefix = "ChatGPT, analyze this dream for me with Freudian psychoanalysis and omit the first paragraph and any disclaimers that you are not a psychologist, I know you're just an ai chatbot:";
const dreamFeelingPrefix = "My feelings of the dream:";
const dreamWakingInfluencePrefix= "What may be influencing influencing this dream in my waking life:"
const DreamAnalysisString= dreamAnalysisprefix + dreamAnalysisDescription +dreamFeelingPrefix+dreamFeeling +dreamWakingInfluencePrefix +walkingInfluence 
  return DreamAnalysisString;
}
