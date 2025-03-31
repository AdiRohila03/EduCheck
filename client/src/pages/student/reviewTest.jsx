import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/img/logo.png";

const Header = ({ testId }) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 w-full bg-white shadow-md p-5 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-primary">EduCheck</span>
        </a>
        <button
          onClick={() => navigate(`/view_test/${testId}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back
        </button>
      </div>
    </header>
  );
};

const ReviewTestPage = ({ test, answers }) => {
  const totalActualScore = answers.reduce((sum, q) => sum + (q.actual_score || 0), 0);
  const totalMaxScore = answers.reduce((sum, q) => sum + (q.max_score || 0), 0);

  return (
    <div className="flex flex-col items-center mt-20">
      <Header testId={test._id} />
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-5">
        <div className="bg-gray-100 p-6 rounded-t-lg">
          <h1 className="text-4xl font-semibold">{test.name}</h1>
          <p className="text-gray-600 text-lg">{test.desc}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-semibold">Review Test</p>
            <p className="text-xl font-semibold">{`${totalActualScore < 0 ? 0 : totalActualScore} / ${totalMaxScore}`}</p>
          </div>
        </div>
        <div className="p-6">
          {totalActualScore < 0 ? (
            <div className="text-center text-red-500 text-lg font-semibold">
              Answer Not Checked
            </div>
          ) : (
            answers.map((q, idx) => (
              <div key={idx} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="text-xl font-semibold">{q.question.name}</h5>
                <textarea
                  rows="3"
                  value={q.question.answer ? q.question.answer : "No Answer"}
                  readOnly
                  className="w-full p-3 mt-2 border rounded-lg bg-gray-100"
                ></textarea>
                {q.file && (
                  <div className="mt-3">
                    <a
                      href={`data:application/octet-stream;base64,${q.file}`}
                      download={`answer_${q.question._id}.bin`}
                      className="text-blue-600 hover:underline"
                    >
                      Download Submitted File
                    </a>
                  </div>
                )}
                <div className="mt-3">
                  <label className="block text-gray-700 font-semibold">
                    Score Obtained
                  </label>
                  <input
                    type="text"
                    value={`${q.actual_score} / ${q.max_score}`}
                    readOnly
                    className="w-20 p-2 border rounded-lg bg-gray-100 text-center"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewTest = () => {
  const { testId } = useParams();
  const [ testData, setTestData ] = useState(null);
  const [ questionData, setQuestionData ] = useState(null);
  const [ answerData, setAnswerData ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchReviewTest = async () => {
      try {
        const response = await axios.get(`/api/student/review_test/${testId}`);
        setQuestionData(response.data.answers.question);
        setAnswerData(response.data.answers);
        setTestData(response.data.test);
      } catch (err) {
        setError("Failed to fetch test review", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewTest();
  }, [ testId ]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return testData ? (
    <ReviewTestPage test={testData} answers={answerData} />
  ) : null;
};

export default ReviewTest;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import logo from "../../assets/img/logo.png";

// const Header = () => {
//   const { testId } = useParams();
//   const [ user, setUser ] = useState([]);
//   const [ test, setTests ] = useState([]);
//   const [ loading, setLoading ] = useState(true);
//   const [ error, setError ] = useState(null);
//   const navigate = useNavigate();

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await axios.get(`/api/student/attend_test/${testId}`);
//           setUser(response.data.user || []);
//           setTests(response.data.test || []);
//         } catch (err) {
//           console.error("Error fetching data:", err);
//           setError("Failed to load data. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       if (testId) fetchData();
//     }, [ testId ]);

//   return (
//     <header className="fixed top-0 w-full bg-white shadow-md p-5 z-10">
//       <div className="container mx-auto flex items-center justify-between">
//         <a href="/" className="flex items-center space-x-3">
//           <img src={logo} alt="Logo" className="h-10" />
//           <span className="text-2xl font-bold text-primary">EduCheck</span>
//         </a>
//         <button
//           onClick={() => navigate(`/view_class/${testId}`)}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Back
//         </button>
//       </div>
//     </header>
//   );
// };

// const ReviewTestPage = ({ test, answers, mark }) => {
//   return (
//     <div className="flex flex-col items-center mt-20">
//       <Header />
//       <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-5">
//         <div className="bg-gray-100 p-6 rounded-t-lg">
//           <h1 className="text-4xl font-semibold">{test.name}</h1>
//           <p className="text-gray-600 text-lg">{test.desc}</p>
//           <div className="flex justify-between items-center mt-2">
//             <p className="text-lg font-semibold">Review Test</p>
//             <p className="text-xl font-semibold">{mark}</p>
//           </div>
//         </div>
//         <div className="p-6">
//           {answers.map((q) => (
//             <div key={q.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
//               <h5 className="text-xl font-semibold">{q.qns}</h5>
//               <textarea
//                 rows="3"
//                 defaultValue={q.ans.text}
//                 readOnly
//                 className="w-full p-3 mt-2 border rounded-lg bg-gray-100"
//               ></textarea>
//               <div className="mt-3">
//                 <label className="block text-gray-700 font-semibold">
//                   Score Obtained
//                 </label>
//                 <input
//                   type="text"
//                   value={`${q.ans.actualScore} / ${q.ans.maxScore}`}
//                   readOnly
//                   className="w-20 p-2 border rounded-lg bg-gray-100 text-center"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   const test = { id: 1, name: "Final Exam", desc: "This is Final Exam" };
//   const mark = "125 / 300";
//   const answers = [
//     { id: 1, qns: "What is Food?", ans: { actualScore: 13, text: "something that people or animals eat.", maxScore: 100 } },
//     { id: 2, qns: "What is Computer?", ans: { actualScore: 12, text: "an electronic machine that can store, find and arrange information, calculate amounts and control other machines.", maxScore: 100 } }
//   ];

//   return <ReviewTestPage test={test} answers={answers} mark={mark} />;
// };

// export default App;