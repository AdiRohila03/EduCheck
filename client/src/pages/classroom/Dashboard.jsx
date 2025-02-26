import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import axios from "axios";
import logo from "../../assets/img/logo.png";

const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  
  return (
    <header className="fixed top-0 w-full bg-white shadow-md p-5 transition-all">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-primary">EduCheck</span>
        </a>

        <nav className="flex space-x-6 text-lg">
          {currentUser?.user.isStaff ? (
            <a href="/create_class" className="text-primary hover:text-secondary transition">
              <i className="bi bi-folder-plus"></i> Create Classroom
            </a>
          ) : (
            <a href="/join_class" className="text-primary hover:text-secondary transition">
              <i className="bi bi-folder-plus"></i> Join Classroom
            </a>
          )}

          <div className="relative group">
            <button className="flex items-center space-x-2 text-primary hover:text-secondary transition">
              <span>{currentUser?.user.name || "Guest"}</span>
              <i className="bi bi-person-circle"></i>
            </button>
            <ul className="absolute hidden group-hover:block bg-white shadow-lg p-3 right-0 mt-2 rounded-lg text-sm w-40">
              <li><a href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</a></li>
              <li><a href="/logout" className="block px-4 py-2 hover:bg-gray-200">Logout</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

const ClassroomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/dashboard"); 
      console.log(response.data);
      
      setRooms(response.data.rooms || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-bold text-primary uppercase tracking-wide">Classroom</h2>
        <p className="text-3xl font-bold text-secondary">Your classrooms are here</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <a key={room.id} href={`/view_class/${room.id}`} className="block transition-transform transform hover:scale-105">
                <div className={`p-8 rounded-lg shadow-lg border-t-4 ${room.color || "bg-gray-200"} border-primary`}>
                  <i className="ri-discuss-line text-4xl text-primary"></i>
                  <h3 className="mt-3 text-xl font-semibold text-gray-800">{room.name}</h3>
                  <p className="text-gray-600">{room.desc}</p>
                </div>
              </a>
            ))
          ) : (
            <p className="text-red-500 mt-4">No classrooms available</p>
          )}
        </div>
      </div>
    </section>
  );
};

const ClassroomPage = () => {
  return (
    <div className="font-sans text-gray-900">
      <Header />
      <main className="pt-24">
        <ClassroomList />
      </main>
    </div>
  );
};

export default ClassroomPage;