import { useState } from "react";

const CreateQuestion = ({ existingQuestion }) => {
  const [formData, setFormData] = useState({
    questionText: existingQuestion?.questionText || "",
    answer: existingQuestion?.answer || "",
    maxScore: existingQuestion?.maxScore || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(existingQuestion ? "Updating Question:" : "Creating Question:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-3/5 bg-white shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
        <div className="w-11/12 mx-auto">
          <h1 className="text-4xl font-bold text-primary text-center">
            {existingQuestion ? "Update Question" : "Create Question"}
          </h1>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Question Text</label>
              <textarea
                name="questionText"
                value={formData.questionText}
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
                name="maxScore"
                value={formData.maxScore}
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
  return <CreateQuestion existingQuestion={null} />;
};

export default App;
