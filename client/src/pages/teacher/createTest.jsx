import { useState } from "react";

const CreateTest = ({ existingTest }) => {
  const [formData, setFormData] = useState({
    name: existingTest?.name || "",
    desc: existingTest?.desc || "",
    startTime: existingTest?.startTime || "",
    endTime: existingTest?.endTime || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(existingTest ? "Updating Test:" : "Creating Test:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-3/5 bg-white shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
        <div className="w-11/12 mx-auto">
          <h1 className="text-4xl font-bold text-primary text-center">
            {existingTest ? existingTest.name : "Create Test"}
          </h1>
          <p className="text-lg text-gray-600 text-center">
            {existingTest ? "Update Test" : "Create Test here and add questions later"}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Test Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                  required
                />
              </div>
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
  return <CreateTest existingTest={null} />;
};

export default App;
