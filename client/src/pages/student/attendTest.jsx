import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TestPage = ({ test, questions }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!test.endTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(test.endTime).getTime();
      const timeDifference = endTime - now;

      if (timeDifference <= 0) {
        navigate("/view_class/:id");
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [test.endTime, navigate]);

  return (
    <div className="flex justify-center mt-10">
      <div className="w-3/4 bg-white shadow-md rounded-lg">
        <div className="bg-gray-100 p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">{test.name}</h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg text-gray-700">{test.desc}</p>
            {test.endTime && (
              <p className="text-red-500 text-lg">
                ⏳ {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </p>
            )}
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={() => navigate("/view_class/:id")}>  
            {questions.map((q) => (
              <div key={q.id} className="mb-6">
                <h5 className="text-xl font-semibold">{q.text}</h5>
                <textarea
                  name={`q-${q.id}`}
                  rows="3"
                  placeholder="Your Answer"
                  required
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                ></textarea>
              </div>
            ))}
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const test = { id: 1, name: "Final Exam", desc: "This is the final test.", endTime: "2026-02-20T12:00:00Z" };
  const questions = [
    { id: 1, text: "Explain React components." },
    { id: 2, text: "What is JSX?" }
  ];

  return <TestPage test={test} questions={questions} />;
};

export default App;
