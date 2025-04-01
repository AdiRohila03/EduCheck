import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentScores = ({ test, attendedStudents, missedStudents }) => {
  const [ selectedStudent, setSelectedStudent ] = useState(null);

  const handleDownload = (answerFile) => {
    if (!answerFile || !answerFile.data) return;

    const byteCharacters = atob(answerFile.data);
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([ byteArray ], { type: answerFile.contentType });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "answer_file";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <nav className="md:w-1/4 w-full bg-white shadow-lg p-6 md:sticky top-0">
        <h2 className="text-xl font-bold text-gray-600">Attended Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Actual Score</th>
                <th className="border p-2">Max Score</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendedStudents.map((student, index) => {
                const totalActualScore = student.answers.reduce((acc, answer) => acc + (answer.actual_score ?? 0), 0);
                const totalMaxScore = student.answers.reduce((acc, answer) => acc + (answer.question?.max_score ?? 0), 0);

                return (
                  <tr key={index} className="border">
                    <td className="p-2">{student.student.name}</td>
                    <td className="p-2">{totalActualScore < 0 ? "N/A" : totalActualScore ?? "N/A"}</td>
                    <td className="p-2">{totalMaxScore ?? "N/A"}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:underline"
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-gray-600 mt-8">Not Attended Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {missedStudents.map((student, index) => (
                <tr key={index} className="border">
                  <td className="p-2">{student.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold border-b pb-2">{test.name}</h1>

        {selectedStudent ? (
          <div>
            <h2 className="text-xl font-bold mt-4">{selectedStudent.student.name} Answers</h2>
            {selectedStudent && selectedStudent.answers && selectedStudent.answers.length > 0 ? (
              selectedStudent.answers.map((answer, index) => (
                <div key={index} className="mt-4 border p-4 bg-white shadow-md">
                  <p><strong>Question:</strong> {answer.question.name}</p>
                  <p><strong>Expected Answer:</strong> {answer.question.answer}</p>

                  {answer.answer_file && (
                    <button
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => handleDownload(answer.answer_file)}
                    >
                      Download Answer File
                    </button>
                  )}

                  <form className="flex items-center mt-2">
                    <input
                      type="number"
                      min="-1"
                      max={answer.question.max_score}
                      name="actualScore"
                      defaultValue={answer.actual_score}
                      className="border p-2 w-16 mr-2"
                    />
                    / {answer.question.max_score}
                    <button type="submit" className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Update
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-4">No answers found for this student.</p>
            )}

          </div>
        ) : (
          <p className="text-gray-500 mt-4">Select a student to view their work.</p>
        )}
      </main>
    </div>
  );
};

const App = () => {
  const { testId } = useParams();
  const [ testData, setTestData ] = useState(null);
  const [ attendedStudents, setAttendedStudents ] = useState([]);
  const [ missedStudents, setMissedStudents ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/teacher/students_work/${testId}`);
        setAttendedStudents(response.data.attendedStudents);
        setMissedStudents(response.data.missedStudents);
        setTestData(response.data.test);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ testId ]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return testData ? (
    <StudentScores test={testData} attendedStudents={attendedStudents} missedStudents={missedStudents} />
  ) : null;
};

export default App;