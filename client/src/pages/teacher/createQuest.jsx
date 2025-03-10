import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CreateQuestion = () => {
  const { testId } = useParams();
  const [ formData, setFormData ] = useState({
    name: "",
    answer: "",
    max_score: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [ e.target.name ]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/teacher/test/create_qn/${testId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return;
      }
      navigate(`/view_test/${testId}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-3/5 bg-white shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
        <div className="w-11/12 mx-auto">
          <h1 className="text-4xl font-bold text-primary text-center">
            {"Create Question"}
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Question Text</label>
              <textarea
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Answer</label>
              <input
                type="text"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Score</label>
              <input
                type="number"
                name="max_score"
                value={formData.max_score}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                required
              />
            </div>

            <div className="text-center mt-6">
              <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return <CreateQuestion />;
};

export default App;
