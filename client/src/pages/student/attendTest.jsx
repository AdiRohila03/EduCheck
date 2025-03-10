import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [ test, setTests ] = useState([]);
  const [ questions, setQuestions ] = useState([]);
  const [ timeLeft, setTimeLeft ] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/student/attend_test/${testId}`);
        setQuestions(response.data.questions || []);
        setTests(response.data.test || []);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setError(err.response.data.message);
        } else {
          console.log("Error fetching data:", err.message);
          setError("Failed to load data. Please try again");
        }
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchData();
  }, [ testId ]);

  useEffect(() => {
    if (!test.end_time) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(test.end_time).getTime();
      const timeDifference = endTime - now;

      if (timeDifference <= 0) {
        navigate(`/view_class/${test.belongs}`);
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [ test.end_time, navigate ]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="flex justify-center mt-10">
      <div className="w-3/4 bg-white shadow-md rounded-lg">
        <div className="bg-gray-100 p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">{test.name}</h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg text-gray-700">{test.desc}</p>
            {test.end_time && (
              <p className="text-red-500 text-lg">
                ⏳ {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </p>
            )}
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={() => navigate(`/view_class/${test.belongs}`)}>
            {questions.map((q) => (
              <div key={q.name} className="mb-6">
                <div className="flex justify-between items-center">
                  <h5 className="text-xl font-semibold">{q.name}</h5>
                  <span className="text-lg font-semibold">Mks: {q.max_score}</span>
                </div>
                <textarea
                  name={`${q._id}`}
                  rows="3"
                  placeholder="Your Answer"
                  required
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                ></textarea>
              </div>
            ))}
            {questions.length === 0 ? (
              <>
                <p className="text-2xl">No Questions Here</p>
                <button type="return" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary mt-4">
                  Return
                </button>
              </>
            ) : (
              <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary">
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return <TestPage />;
};

export default App;