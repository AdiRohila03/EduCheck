import { useState } from "react";
import logo from "../assets/img/logo.png";

const Header = ({ user }) => {
  return (
    <header className="fixed top-0 w-full bg-white shadow-md p-5 transition-all">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-primary">EduCheck</span>
        </a>

        <nav className="flex space-x-6 text-lg">
          <a href="/" className="text-primary hover:text-secondary transition">Home</a>
          {user.isStaff ? (
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
              <span>{user.firstName}</span>
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

const ClassroomList = ({ rooms }) => {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Classroom</h2>
        <p className="text-3xl font-bold text-secondary">Your classrooms are here</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {rooms.map((room) => (
            <a key={room.id} href={`/view_class/${room.id}`} className="block transition-transform transform hover:scale-105">
              <div className={`p-8 rounded-lg shadow-lg border-t-4 ${room.color} border-primary`}>                
                <i className="ri-discuss-line text-4xl text-primary"></i>
                <h3 className="mt-3 text-xl font-semibold text-gray-800">{room.name}</h3>
                <p className="text-gray-600">{room.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [user] = useState({ isStaff: true, firstName: "John" });
  const [rooms] = useState([
    { id: 1, name: "Math Class", desc: "Algebra and Geometry", color: "bg-blue-200" },
    { id: 2, name: "Science Lab", desc: "Physics and Chemistry", color: "bg-green-200" }
  ]);

  return (
    <div className="font-sans text-gray-900">
      <Header user={user} />
      <main className="pt-24">
        <ClassroomList rooms={rooms} />
      </main>
    </div>
  );
};

export default App;
