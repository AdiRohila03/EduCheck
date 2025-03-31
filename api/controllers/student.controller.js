import { Classroom } from '../models/classroom.model.js';
import { Enrollment } from '../models/enrollment.model.js';
import { Test } from '../models/test.model.js';
import { TestTaken } from '../models/testTaken.model.js';
import { Answer } from '../models/answer.model.js';
import { Question } from '../models/question.model.js';
import moment from 'moment';
import paginate from '../utils/paginate.js';

// Join Classroom
export const joinClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findOne({ code: req.body.code });
        if (!classroom) {
            return res.status(400).json({ message: "Invalid classroom code" });
        }
        const alreadyEnrolled = await Enrollment.findOne({ classroom: classroom._id, student: req.user._id });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this class" });
        }
        await Enrollment.create({ room: classroom._id, student: req.user._id });
        res.status(200).json({ message: "Successfully joined classroom" });
    } catch (error) {
        console.log(error.message);        
        res.status(500).json({ message: error.message });
    }
};

// Attend Test
export const attendTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        
        const testTaken = await TestTaken.findOne({ test: req.params.testId, student: req.user._id });
        if (testTaken.status == "done") {
            return res.status(400).json({ message: "You have already taken this test" });
        }
        
        const questions = await Question.find({ test: req.params.testId });
        const questionArray = questions.map(question => ({
            id: question._id,
            name: question.name,
            max_score: question.max_score,
        }));

        res.status(200).json({
            test,
            questions: questionArray,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

// Submit Test
export const submitTest = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const studentId = req.user._id; 
    let questionIds;
    try {
        questionIds = JSON.parse(req.body.questionIds);
        if (!Array.isArray(questionIds)) throw new Error("Invalid questionIds format.");
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }

    if (questionIds.length !== req.files.length) {
      return res.status(400).send("Mismatch between questions and uploaded files.");
    }

    const answerDocs = req.files.map((file, index) => ({
      student: studentId,
      test: req.params.testId,
      question: questionIds[index],
      answer_file: {
        data: file.buffer,
        contentType: file.mimetype,
      },
    }));

      const savedAnswers = await Answer.insertMany(answerDocs);
      if (savedAnswers) {
        const testTakenExists = await TestTaken.findOneAndUpdate({
              test: req.params.testId,
              student: req.user._id
          },
            {
                status: "done",
                submittedAt: new Date()
         },
         { new: true }
          );
          await testTakenExists.save();
    }

    res.status(200).json({ message: "Files uploaded and answers saved.", answers: savedAnswers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving answers: " + err.message });
  }
};

// Fetch Assigned Tests
export const assignedTests = async (req, res) => {
    try {
        const enrolledClasses = await Enrollment.find({ student: req.user._id }).select('classroom');
        const classroomIds = enrolledClasses.map(enrollment => enrollment.classroom);

        const tests = await Test.find({ classroom: { $in: classroomIds }, dueDate: { $gte: moment().startOf('day') } });
        const paginatedTests = paginate(tests, req.query.page, 10);

        res.status(200).json({ assigned: paginatedTests });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch Missing Tests
export const missingTests = async (req, res) => {
    try {
        const enrolledClasses = await Enrollment.find({ student: req.user._id }).select('classroom');
        const classroomIds = enrolledClasses.map(enrollment => enrollment.classroom);

        const tests = await Test.find({ classroom: { $in: classroomIds }, dueDate: { $lt: moment().startOf('day') } });
        const paginatedTests = paginate(tests, req.query.page, 10);

        res.status(200).json({ missing: paginatedTests });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch Done Tests
export const doneTests = async (req, res) => {
    try {
        const completedTests = await TestTaken.find({ student: req.user._id }).populate('test');
        const paginatedTests = paginate(completedTests, req.query.page, 10);

        res.status(200).json({ completed: paginatedTests });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Review Test
export const reviewTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        const testTaken = await TestTaken.findOne({ test: req.params.testId, student: req.user._id }).populate('test');
        if (!testTaken) return res.status(404).json({ message: "Test not found or not taken" });

        // Fetch all questions for the test
        const questions = await Question.find({ test: req.params.testId });

        // Fetch the answers for each question by the student
        const answers = await Promise.all(questions.map(async (question) => {
            const answer = await Answer.findOne({ 
                test: req.params.testId, 
                student: req.user._id, 
                question: question._id 
            }).populate('question');
            
            if (answer) {
                return {
                    question: question,
                    answer: null,
                    file: answer.answer_file ? answer.answer_file.toString('base64') : null, // Convert binary file to base64 if it exists
                    actual_score: answer.actual_score,
                    max_score: question.max_score
                };
            }
            return {
                question: question,
                answer: null,
                file: null,
                actual_score: 0,
                max_score: question.max_score
            };
        }));

        res.status(200).json({ test, answers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// Create a testTaken route
// export const testTaken = async (req, res) => {
//     try {
//       const { test, student, submittedAt, ml_score, actual_score, status } = req.body;
  
//       const testTaken = new TestTaken({ test, student, submittedAt, ml_score, actual_score, status });
//       await testTaken.save();
  
//       res.status(201).json({ message: "Test created successfully", testTaken });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };
