const {
  create,
  findAll,
  getAllQuestionsByPaperId,
  findOne,
  update,
  remove,
  getAllQuestionsAndAnswersByPaperId,
  scan,
} = require("../services/question.service");
const { validateQuestion } = require("../validators/question.validator");

// Create a question
exports.create = async (req, res) => {
  try {
    const { isValid, errors } = validateQuestion(req.body);

    // If validation fails, return a 400 error
    if (!isValid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const question = await create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// scan question
exports.scan = async (req, res) => {
  try {
    const file = req.file; // the file is in memory as a Buffer
    const buffer = file.buffer; // <-- this is your file content
    const {paperId} = req.body;
  
    // Example: log the file type and size
    console.log("MIME type:", file.mimetype);
    console.log("Size:", file.size);
    console.log("Buffer:", buffer);
    

    // const { isValid, errors } = validateQuestion(req.body);

    // If validation fails, return a 400 error
    // if (!isValid) {
    //   return res.status(400).json({ message: "Validation failed", errors });
    // }

    const result = await scan(paperId, file);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// async businessCardScan(file: Express.Multer.File) {
//   try {
//     if (!file) {
//       throw new Error('No file uploaded');
//     }

//     // Convert image to Base64 (no need for fs.readFileSync since file is in memory)
//     const base64Image = file.buffer.toString('base64'); // Directly use file.buffer

//     // Call AI service to extract business card data
//     const extractedData = await this.aiService.extractDataFromBusinessCard(
//       base64Image,
//     );

//     console.log({ extractedData });

//     return { success: true, data: extractedData };
//   } catch (error) {
//     console.error('Error processing business card:', error);
//     return { success: false, error: 'Failed to process business card' };
//   }
// }

// Find all questions with optional query parameters
exports.findAll = async (req, res) => {
  try {
    const { exam, medium, type } = req.query;
    const questions = await findAll({ exam, medium, type });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all questions by paper ID
exports.getAllQuestionsByPaperId = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const questions = await getAllQuestionsByPaperId(paperId);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all questions and answers by paper ID
exports.getAllQuestionsAndAnswersByPaperId = async (req, res) => {
  try {
    const paperId = req.params.paperId;
    const questions = await getAllQuestionsAndAnswersByPaperId(paperId);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find a question by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const question = await findOne(id);
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a question by ID
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedQuestion = await update(id, req.body);
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a question by ID
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    await remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
