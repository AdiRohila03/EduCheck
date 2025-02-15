import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-white shadow-md p-5 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-primary">EduCheck</span>
        </a>
        <button
          onClick={() => navigate("/view_class/1")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back
        </button>
      </div>
    </header>
  );
};

const ReviewTestPage = ({ test, answers, mark }) => {
  return (
    <div className="flex flex-col items-center mt-20">
      <Header />
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-5">
        <div className="bg-gray-100 p-6 rounded-t-lg">
          <h1 className="text-4xl font-semibold">{test.name}</h1>
          <p className="text-gray-600 text-lg">{test.desc}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-semibold">Review Test</p>
            <p className="text-xl font-semibold">{mark}</p>
          </div>
        </div>
        <div className="p-6">
          {answers.map((q) => (
            <div key={q.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="text-xl font-semibold">{q.qns}</h5>
              <textarea
                rows="3"
                defaultValue={q.ans.text}
                readOnly
                className="w-full p-3 mt-2 border rounded-lg bg-gray-100"
              ></textarea>
              <div className="mt-3">
                <label className="block text-gray-700 font-semibold">
                  Score Obtained
                </label>
                <input
                  type="text"
                  value={`${q.ans.actualScore} / ${q.ans.maxScore}`}
                  readOnly
                  className="w-20 p-2 border rounded-lg bg-gray-100 text-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const test = { id: 1, name: "Final Exam", desc: "This is Final Exam" };
  const mark = "125 / 300";
  const answers = [
    { id: 1, qns: "What is Food?", ans: { actualScore: 13, text: "something that people or animals eat.", maxScore: 100 } },
    { id: 2, qns: "What is Computer?", ans: { actualScore: 12, text: "an electronic machine that can store, find and arrange information, calculate amounts and control other machines.", maxScore: 100 } }
  ];

  return <ReviewTestPage test={test} answers={answers} mark={mark} />;
};

export default App;

