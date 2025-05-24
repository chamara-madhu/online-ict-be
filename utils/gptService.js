const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// async function extractQuestionsFromText(base64) {
//   // Define messages with a prompt that requests JSON output
//   const messages = [
//     {
//       role: "system",
//       content:
//         "You are an AI assistant that extracts ICT multiple-choice questions from exam papers. Your job is to scan the image or pdf, identify all MCQs, and return them in structured JSON format.",
//     },
//     {
//       role: "user",
//       content: [
//         {
//           type: "text",
//           text: `
//       Please extract all ICT multiple-choice questions from the image or pdf below.

//       For each question, return the following fields:
//       - "question": the full question text
//       - "options": an array of 5 answer choices
//       - "answer": the correct option (exact text or letter)
//       - "difficulty": one of "easy", "medium", or "hard"

//       Format your response as JSON:
//       {
//         "questions": [
//           {
//             "question": "...",
//             "options": ["A", "B", "C", "D", "E"],
//             "answer": "...",
//             "difficulty": "easy"
//           },
//           ...
//         ]
//       }
//       Only include clear and complete multiple-choice questions.
//               `,
//         },
//         {
//           type: "image_url",
//           image_url: {
//             url: `data:image/jpeg;base64,${base64}`,
//           },
//         },
//       ],
//     },
//   ];

//   // Call OpenAI API
//   const response = await openai.chat.completions.create({
//     model: "gpt-4o",
//     messages,
//     // max_tokens: 500, // A reasonable limit
//     temperature: 0, // For consistent output
//   });

//   // Extract the response content
//   const rawContent = response.choices[0]?.message?.content;

//   if (!rawContent) {
//     throw new Error("No content returned from OpenAI API");
//   }

//   // Clean the response by removing ```json and ``` markers if present
//   let jsonString = rawContent.trim();
//   if (jsonString.startsWith("```json") && jsonString.endsWith("```")) {
//     jsonString = jsonString.slice(7, -3).trim(); // Remove ```json and ```
//   } else if (jsonString.startsWith("```") && jsonString.endsWith("```")) {
//     jsonString = jsonString.slice(3, -3).trim(); // Remove plain ```
//   }

//   try {
//     return JSON.parse(jsonString);
//   } catch (err) {
//     console.error("Failed to parse GPT response:", message);
//     throw new Error("Invalid JSON from GPT");
//   }
// }

async function extractQuestionsFromText(text) {
  //   const prompt = `
  //   You are an AI assistant that extracts ICT multiple-choice questions from past papers.

  //   Please scan the following text and extract all MCQs in the following JSON format:

  //       For each question, return the following fields:
  //       - "question": the full question text with options
  //       - "answerOptions": an array of 5 answer choices
  //       - "answer": the correct option
  //       - "difficulty": one of "easy", "medium", or "hard"

  //       Format your response as JSON:
  //       {
  //         "questions": [
  //           {
  //             "question": "What is the function of the CPU?",
  //             "answerOptions": [
  //                 "1. It stores data",
  //                 "2. It processes instructions",
  //                 "3. It displays output",
  //                 "4. It connects to the internet",
  //                 "5. It manages files"
  //                 ],
  //                 "answer": "4" or "4,5",
  //                 "difficulty": "medium"
  //             },
  //           ...
  //         ]
  //       }

  //   Only include clear, complete MCQs. Skip incomplete or ambiguous items.

  //   Text:
  //   """
  //   ${text}
  //   """
  //     `;

  const prompt = `
You are an AI assistant tasked with extracting multiple-choice questions (MCQs) from ICT-related past papers or similar educational texts. Your goal is to identify complete MCQs, including the question stem, exactly 5 answer options, the correct answer (if provided), difficulty level, and the related lesson from the A/L ICT syllabus. Ignore incomplete or ambiguous questions.

Please extract the all MCQ questions in the following JSON format:

For each question, include:
- "question": The full question text, formatted clearly for frontend display.
- "answerOptions": An array of exactly 5 answer choices, each prefixed with a number (e.g., "Option text").
- "answer": The correct option number(s) in an array format (e.g., [3] or [2,4]). If no correct answer is available, set it to [].
- "difficulty": One of "Easy", "Medium", or "Hard" based on:
  - Easy: Basic definitions or simple facts.
  - Medium: Concept understanding or basic reasoning.
  - Hard: Advanced reasoning or multiple concepts.
- "lesson": Choose the most relevant topic from the A/L ICT syllabus below.

A/L ICT Syllabus Topics:
- Concept of ICT
- Introduction to Computer
- Data Representation
- Fundamentals of Digital Circuits
- Computer Operating System
- Data Communication and Networking
- System Analysis and Design
- Database Management
- Programming
- Web Development
- Internet of Things
- ICT in Business
- New Trends and Future Directions of ICT

Output JSON format:
{
  "questions": [
    {
      "question": "Consider the following data:\n• A – temperature values given by a sensor\n• B – creator’s name and the date of creation of a file saved in a computer\n• C – collection of posts and responses shared on a social media platform\nWhich of the following correctly categorizes the above data?",
      "answerOptions": [
        "A – big data, B – continuous data, C – metadata",
        "A – continuous data, B – big data, C – metadata",
        "A – continuous data, B – metadata, C – big data",
        "A – metadata, B – big data, C – continuous data",
        "A – metadata, B – continuous data, C – big data"
      ],
      "answer": [3],
      "difficulty": "Medium",
      "lesson": "Data Representation"
    },
    ...
  ]
}

Text to analyze:
"""
${text}
"""
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const rawContent = completion.choices[0]?.message?.content?.trim();

  let jsonString = rawContent;

  if (jsonString.startsWith("```json") && jsonString.endsWith("```")) {
    jsonString = jsonString.slice(7, -3).trim();
  } else if (jsonString.startsWith("```") && jsonString.endsWith("```")) {
    jsonString = jsonString.slice(3, -3).trim();
  }

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse GPT response:", rawContent);
    throw new Error("Invalid JSON from GPT");
  }
}

module.exports = {
  extractQuestionsFromText,
};
