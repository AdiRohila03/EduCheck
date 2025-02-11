const StudentScores = ({ test, attendedStudents, missedStudents, studentAnswers }) => {
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <nav className="w-1/4 bg-white shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-600">Attended Students</h2>
          <table className="w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">ML Score</th>
                <th className="border p-2">Actual Score</th>
                <th className="border p-2">Max Score</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendedStudents.map((student, index) => (
                <tr key={index} className="border">
                  <td className="p-2">{student.firstName}</td>
                  <td className="p-2">{student.mlScore}</td>
                  <td className="p-2">{student.actualScore}</td>
                  <td className="p-2">{test.maxScore}</td>
                  <td className="p-2">
                    <a href={`/individual_work/${test.id}/${student.id}`} className="text-blue-600 hover:underline">
                      Verify
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <h2 className="text-xl font-bold text-gray-600 mt-8">Not Attended Students</h2>
          <table className="w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {missedStudents.map((student, index) => (
                <tr key={index} className="border">
                  <td className="p-2">{student.firstName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </nav>
  
        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold border-b pb-2">{test.name}</h1>
          <h2 className="text-xl font-bold mt-4">{studentAnswers.studentName} Answers</h2>
          {studentAnswers.answers.map((answer, index) => (
            <div key={index} className="mt-4 border p-4 bg-white shadow-md">
              <button className="text-left w-full font-bold" onClick={() => document.getElementById(answer.id).classList.toggle("hidden")}>
                {answer.question}
              </button>
              <div id={answer.id} className="hidden mt-2">
                <p>{answer.response}</p>
                <form className="flex items-center mt-2" method="post" action={`/update_work/${answer.questionId}/${studentAnswers.studentId}`}>
                  <input type="number" min="0" max={answer.maxScore} name="actualScore" defaultValue={answer.actualScore} className="border p-2 w-16 mr-2" />
                  / {answer.maxScore}
                  <button type="submit" className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                </form>
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  };
  
  const App = () => {
    const test = { id: 1, name: "Final Exam", maxScore: 100 };
    const attendedStudents = [
      { id: 1, firstName: "Alice", mlScore: 85, actualScore: 90 },
      { id: 2, firstName: "Bob", mlScore: 78, actualScore: 80 },
    ];
    const missedStudents = [{ id: 3, firstName: "Charlie" }];
    const studentAnswers = {
      studentId: 1,
      studentName: "Alice",
      answers: [
        { id: "q1", question: "What is 2+2?", response: "4", actualScore: 10, maxScore: 10, questionId: 1 },
        { id: "q2", question: "Define gravity", response: "Force pulling objects down", actualScore: 8, maxScore: 10, questionId: 2 },
      ],
    };
  
    return <StudentScores test={test} attendedStudents={attendedStudents} missedStudents={missedStudents} studentAnswers={studentAnswers} />;
  };
  
  export default App;
  