import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CreateTest = () => {
  const { classId } = useParams(); // Get dynamic classId
  // console.log(classId);
  
  const [formData, setFormData] = useState({
    name:  "",
    desc:  "",
    start_time:  "",
    end_time:  "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Creating Test:", formData);
    try {
          const res = await fetch(`/api/teacher/create_test/${classId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
      
      const data = await res.json();
      // console.log(data);
      
          if (data.success === false) {
            return;
          }
          navigate(`/view_class/${classId}`); 
        } catch (error) {
          console.log(error.message);
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-3/5 bg-white shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
        <div className="w-11/12 mx-auto">
          <h1 className="text-4xl font-bold text-primary text-center">
            { "Create Test"}
          </h1>
          <p className="text-lg text-gray-600 text-center">
            {"Create Test here and add questions later"}
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
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">End Time</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
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
  return <CreateTest />;
};

export default App;
