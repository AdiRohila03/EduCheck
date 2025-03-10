import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const People = () => {
  const { classId } = useParams();
    const [teacher, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/view_class/people/${classId}`); 
        console.log(response.data);
        
        setTeachers(response.data.teacher || []);
        setStudents(response.data.students || []);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);
  
    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
        <div className="w-3/5 bg-white shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
          <div className="w-11/12 mx-auto">
            <h1 className="text-4xl font-bold text-blue-500">People</h1>
            <p className="text-lg text-gray-600">Teachers and Students in this Classroom</p>
            
            <br />
            <h1 className="text-2xl font-bold text-blue-500">Teacher</h1>
            <hr className="my-2" />
            <div className="flex justify-between bg-gray-100 p-3 rounded-md">
              <h5 className="text-lg font-semibold">{teacher.name}</h5>
            </div>
            
            <br />
            <h1 className="text-2xl font-bold text-blue-500">Students</h1>
            <hr className="my-2" />
            <ul className="mt-4 space-y-3">
              {students.map((student) => (
                <li key={student._id} className="bg-gray-100 p-3 rounded-md shadow">
                  <div className="flex justify-between">
                    <h6 className="text-md font-medium">{student.name}</h6>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  const App = () => {
    return <People />;
  };
  
  export default App;