import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import logo from "../../assets/img/logo.png";

const Header = () => {
  const { testId } = useParams();
  const [ user, setUser ] = useState([]);
  const [ test, setTests ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/teacher/view_test/${testId}`);
        setUser(response.data.user || []);
        setTests(response.data.test || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchData();
  }, [ testId ]);

  const handleDeleteTest = async () => {
    if (window.confirm(`Are you sure you want to delete the test: ${test.name}?`)) {
      try {
        const response = await axios.delete(`/api/teacher/delete_test/${testId}`);
        if (response.data.message === "Test deleted successfully") {
          alert("Test deleted successfully");
          window.location.href = "/dashboard";
        } else {
          setError("Failed to delete the test");
        }
      } catch (err) {
        setError("An error occurred while deleting the test",err.message);
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <header className="fixed top-0 w-full bg-white shadow-md p-5">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-primary">EduCheck</span>
        </a>
        <nav className="flex space-x-6 text-lg">
          <a href="/dashboard" className="text-primary hover:text-secondary transition">Home</a>
          {user.isStaff && (
            <>
              <a href={`/create_qn/${test._id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-folder-plus"></i> Create Question
              </a>
              <a href={`/update_test/${test._id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-gear"></i> Modify Test
              </a>
            </>
          )}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-primary hover:text-secondary transition">
              <span>{user.name}</span>
              <i className="bi bi-person-circle"></i>
            </button>
            <ul className="absolute hidden group-hover:block bg-white shadow-lg p-3 right-0 mt-2 rounded-lg text-sm w-40">
              <li><a href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</a></li>
              <li><a href="/" className="block px-4 py-2 hover:bg-gray-200">Logout</a></li>
              {user.isStaff && (
                <li>
                  <button
                    onClick={handleDeleteTest}
                    className="block px-4 py-2 text-red-600 hover:bg-red-100">
                    Delete {test.name} <i className="bi bi-trash"></i>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

const QuestionsList = () => {
  const [ questions, setQuestions ] = useState([]);
  const { testId } = useParams();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/teacher/view_test/${testId}`);
        let sortedQuestions = response.data.questions || [];
        sortedQuestions.sort((a, b) => new Date(a.create_time) - new Date(b.create_time));
        sortedQuestions = sortedQuestions.map((t, index) => ({ ...t, index: index + 1 }));
        setQuestions(sortedQuestions);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchData();
  }, [ testId ]);

  const handleDelete = async (qnId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        const res = await axios.delete(`/api/teacher/delete_qn/${qnId}`);
        const data = res.data;

        if (data.message === "Question deleted successfully") {
          setQuestions(questions.filter((q) => q._id !== qnId));
        } else {
          setError("Failed to delete the question");
        }
      } catch (error) {
        setError("An error occurred while deleting the question",error.message);
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {questions.map((q, index) => (
            <article key={q._id} className="p-6 bg-white shadow-md rounded-lg">
              <h5 className="text-lg font-semibold text-gray-800">{index + 1}. {q.name}</h5>
              {q.answer && (
                <div className="text-sm text-gray-700 mt-2">
                  <strong>Answer:</strong> {q.answer}
                </div>
              )}

              <div className="text-sm text-gray-500 mt-2 flex items-center justify-between">
                <span><i className="bi bi-award"></i> Max Score: {q.max_score}</span>
                <div className="flex space-x-4">
                  <a href={`/update_qn/${q._id}`} className="text-green-500 hover:text-green-700">
                    <i className="bi bi-gear"></i> Edit
                  </a>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const App = () => {
  return (
    <div className="font-sans text-gray-900">
      <Header />
      <main className="pt-24">
        <QuestionsList />
      </main>
    </div>
  );
};

export default App;
