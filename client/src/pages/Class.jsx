import { useState } from "react";

const Header = ({ user, room }) => {
  return (
    <header className="fixed top-0 w-full bg-white shadow-md p-5">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <img src="/assets/img/logo.png" alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-primary">EasyExam</span>
        </a>

        <nav className="flex space-x-6 text-lg">
          <a href="/dashboard" className="text-primary hover:text-secondary transition">Home</a>
          {user.isStaff && (
            <>
              <a href={`/create_test/${room.id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-folder-plus"></i> Create Test
              </a>
              <a href={`/update_class/${room.id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-gear"></i> Modify Classroom
              </a>
            </>
          )}
          <div className="relative group">
            <button className="flex items-center space-x-2 text-primary hover:text-secondary transition">
              <span>{user.firstName}</span>
              <i className="bi bi-person-circle"></i>
            </button>
            <ul className="absolute hidden group-hover:block bg-white shadow-lg p-3 right-0 mt-2 rounded-lg text-sm w-40">
              <li><a href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</a></li>
              <li><a href="/logout" className="block px-4 py-2 hover:bg-gray-200">Logout</a></li>
              <li className="px-4 py-2">Class Code: {room.code}</li>
              <li><a href={`/people/${room.id}`} className="block px-4 py-2 hover:bg-gray-200">People</a></li>
              {user.isStaff && (
                <li>
                  <a href={`/delete_class/${room.id}`} className="block px-4 py-2 text-red-600 hover:bg-red-100">
                    Delete {room.name} <i className="bi bi-trash"></i>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

const TestsList = ({ tests }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {tests.map((test) => (
            <article key={test.id} className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800">
                {test.status === "late" || test.status === "not" ? (
                  <span>{test.name}</span>
                ) : (
                  <a href={`/attend_test/${test.id}`} className="text-primary hover:text-secondary transition">
                    {test.name}
                  </a>
                )}
              </h2>
              <p className="text-gray-600 mt-2">{test.desc}</p>
              <p className={`mt-2 font-semibold ${test.status === "Assigned" ? "text-green-500" : test.status === "late" ? "text-red-500" : test.status === "not" ? "text-yellow-500" : "text-gray-700"}`}>{test.status}</p>
              <div className="text-sm text-gray-500 mt-2">
                {test.startTime && <p><i className="bi bi-alarm"></i> Start time: {test.startTime}</p>}
                {test.endTime && <p><i className="bi bi-clock-history"></i> End time: {test.endTime}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [user] = useState({ isStaff: true, firstName: "John" });
  const [room] = useState({ id: 1, name: "Math Class", code: "ABC123" });
  const [tests] = useState([
    { id: 1, name: "Algebra Test", desc: "Algebra basics", status: "Assigned", startTime: "10:00 AM", endTime: "11:00 AM" },
    { id: 2, name: "Geometry Test", desc: "Shapes and angles", status: "done", startTime: "1:00 PM", endTime: "2:00 PM" }
  ]);

  return (
    <div className="font-sans text-gray-900">
      <Header user={user} room={room} />
      <main className="pt-24">
        <TestsList tests={tests} />
      </main>
    </div>
  );
};

export default App;