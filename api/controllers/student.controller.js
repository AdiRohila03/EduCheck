import { Classroom } from '../models/classroom.model.js';
import { Enrollment } from '../models/enrollment.model.js';
import { Test } from '../models/test.model.js';
import { TestTaken } from '../models/testTaken.model.js';
import { Answer } from '../models/answer.model.js';
import { Question } from '../models/question.model.js';
import natural from 'natural'; // A (NLP) library for Node.js
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
        const { answers } = req.body;
        const test = await Test.findById(req.params.testId);
        if (!test) return res.status(404).json({ message: "Test not found" });

        let totalScore = 0;
        const tokenizer = new natural.WordTokenizer();
        const tfidf = new natural.TfIdf();

        for (const ans of answers) {
            const answerText = tokenizer.tokenize(ans.response.toLowerCase()).join(" ");
            tfidf.addDocument(answerText);
        }

        for (let i = 0; i < answers.length; i++) {
            let maxSimilarity = 0;
            for (let j = 0; j < test.answers.length; j++) {
                const similarity = natural.JaroWinklerDistance(answers[ i ].response, test.answers[ j ]);
                maxSimilarity = Math.max(maxSimilarity, similarity);
            }
            totalScore += maxSimilarity * test.marksPerQuestion;
        }

        await TestTaken.create({ test: test._id, student: req.user._id, score: totalScore });
        res.status(200).json({ message: "Test submitted successfully", score: totalScore });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
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
        const testTaken = await TestTaken.findOne({ test: req.params.testId, student: req.user._id }).populate('test');
        if (!testTaken) return res.status(404).json({ message: "Test not found or not taken" });

        const answers = await Answer.find({ testTaken: testTaken._id }).populate('question');
        res.status(200).json({ testTaken, answers });
    } catch (error) {
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
