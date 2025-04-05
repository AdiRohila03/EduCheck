import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TestPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [test, setTest] = useState({});
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/student/attend_test/${testId}`);
        setQuestions(response.data.questions || []);
        setTest(response.data.test || {});
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchData();
  }, [testId]);

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
  }, [test.end_time, navigate]);

  const handleFileChange = (e, questionId) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = { ...prevFiles, [questionId]: e.target.files[0] };
      return newFiles;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const questionIds = [];

    Object.entries(selectedFiles).forEach(([questionId, file]) => {
      formData.append("files", file);
      questionIds.push(questionId);
    });
    
    formData.append("questionIds", JSON.stringify(questionIds));

    try {
       await axios.post(`/api/student/submit_test/${testId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/view_class/${test.belongs}`);
    } catch (err) {
      console.error("Error submitting test:", err.message);
    }
  };

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
          <form onSubmit={handleSubmit}>
            {questions.map((q) => (
              <div key={q.id} className="mb-6">
                <div className="flex justify-between items-center">
                  <h5 className="text-xl font-semibold">{q.name}</h5>
                  <span className="text-lg font-semibold">Mks: {q.max_score}</span>
                </div>
                <input
                  type="file"
                  name={`file-${q.id}`}
                  accept="image/*, application/pdf"
                  required
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                  onChange={(e) => handleFileChange(e, q.id)}
                />
              </div>
            ))}
            {questions.length === 0 ? (
              <>
                <p className="text-2xl">No Questions Here</p>
                <button type="button" onClick={() => navigate(-1)} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary mt-4">
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

export default TestPage;