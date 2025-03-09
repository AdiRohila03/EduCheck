import { Classroom } from "../models/classroom.model.js";
import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { TestTaken } from "../models/testTaken.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { User } from "../models/user.model.js";

// Create a classroom
export const createClassroom = async (req, res) => {
  try {
    const { name, desc, code } = req.body;
    const owner = req.user._id;

    const classroom = new Classroom({ owner, name, desc, code });
    await classroom.save();

    res.status(201).json({ message: "Classroom created successfully", classroom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update classroom
export const updateClassroom = async (req, res) => {
  try {
    const { classId } = req.params;
    const classroom = await Classroom.findByIdAndUpdate(classId, req.body, { new: true });

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom updated successfully", classroom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete classroom
export const deleteClassroom = async (req, res) => {
  try {
    const { classId } = req.params;
    const classroom = await Classroom.findByIdAndDelete(classId);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a test
export const createTest = async (req, res) => {
  try {
    const { name, desc, start_time, end_time } = req.body;
    const { classId } = req.params;
    // console.log(classId);
    
    const classroom = await Classroom.findById(classId);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const test = new Test({ belongs: classId, name, desc, start_time, end_time });
    await test.save();
    // console.log(test);
    

    res.status(201).json({ message: "Test created successfully", test });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update test
export const updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findByIdAndUpdate(testId, req.body, { new: true });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test updated successfully", test });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete test
export const deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findByIdAndDelete(testId);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View test with pagination and search
export const viewTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: "Test not found" });

    const questions = await Question.find({ test: testId, qn_text: { $regex: search, $options: "i" } })
      .limit(limit)
      .skip(skip);

    const totalQuestions = await Question.countDocuments({ test: testId, qn_text: { $regex: search, $options: "i" } });
    res.json({ test, questions, totalPages: Math.ceil(totalQuestions / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create question
export const createQuestion = async (req, res) => {
  try {
    const { qn_text, key, max_score } = req.body;
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const question = new Question({ test: testId, qn_text, key, max_score });
    await question.save();

    res.status(201).json({ message: "Question created successfully", question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  try {
    const { qnId } = req.params;
    const question = await Question.findByIdAndUpdate(qnId, req.body, { new: true });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question updated successfully", question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { qnId } = req.params;
    const question = await Question.findByIdAndDelete(qnId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch students' test work
export const studentWork = async (req, res) => {
  try {
    const { testId } = req.params;
    const enrolledStudents = await Enrollment.find({ test: testId }).populate("student");
    const testTake = await TestTaken.find({ test: testId }).populate("student");

    const attendedStudents = testTake.map(t => t.student);
    const missedStudents = enrolledStudents.filter(e => !attendedStudents.includes(e.student));

    res.json({ attendedStudents, missedStudents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch student's indivisual test work
export const individualWork = async (req, res) => {
  try {
    const { test_id, student_id } = req.params;

    const test = await Test.findById(test_id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const enrolledStudents = await Enrollment.find({ room: test.belongs }).select('student');
    const attendedStudents = await TestTaken.find({ test: test_id }).select('student');

    const missedStudents = enrolledStudents
      .filter(s => !attendedStudents.some(a => a.student.equals(s.student)))
      .map(s => s.student);

    const attendedUsers = await User.find({ _id: { $in: attendedStudents.map(a => a.student) } });
    const missedUsers = await User.find({ _id: { $in: missedStudents } });

    for (let student of attendedUsers) {
      const testRecord = await TestTaken.findOne({ test: test_id, student: student._id });
      student.ml_score = testRecord?.ml_score || 0;
      student.actual_score = testRecord?.actual_score || 0;
    }

    let maxScore = 0;
    const questions = await Question.find({ test: test_id });
    const student = await User.findById(student_id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const answers = [];
    for (let q of questions) {
      const answer = await Answer.findOne({ student: student_id, question: q._id });
      answers.push({ qns: q, ans: answer });
      maxScore += q.max_score;
    }

    test.max_score = maxScore;

    return res.render('teachers/students_work', {
      ans: answers,
      test,
      student,
      attended_s: attendedUsers,
      missed_s: missedUsers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update test work
export const updateWork = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { studentId, qnId } = req.params;
    const { actual_score } = req.body;

    const answer = await Answer.findOne({ student: studentId, question: qnId });
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    const testTake = await TestTaken.findOne({ student: studentId, test: answer.test });
    if (!testTake) return res.status(404).json({ error: "Test record not found" });

    testTake.actual_score -= answer.actual_score;
    testTake.actual_score += actual_score;
    answer.actual_score = actual_score;

    await answer.save();
    await testTake.save();

    res.json({ message: "Score updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// View test
// export const viewTest = async (req, res) => {
//   try {
//     const { testId } = req.params;
//     const test = await Test.findById(testId).populate("belongs");
//     const questions = await Question.find({ test: testId });

//     if (!test) {
//       return res.status(404).json({ message: "Test not found" });
//     }

//     res.status(200).json({ test, questions });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };