import { useState } from "react";
import logo from "../../assets/img/logo.png";

const Header = ({ user, test }) => {
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
              <a href={`/create_qn/${test.id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-folder-plus"></i> Create Question
              </a>
              <a href={`/update_test/${test.id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-gear"></i> Modify Test
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
              {user.isStaff && (
                <li>
                  <a href={`/delete_test/${test.id}`} className="block px-4 py-2 text-red-600 hover:bg-red-100">
                    Delete {test.name} <i className="bi bi-trash"></i>
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

const QuestionsList = ({ questions }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {questions.map((q, index) => (
            <article key={q.id} className="p-6 bg-white shadow-md rounded-lg">
              <h5 className="text-lg font-semibold text-gray-800">{index + 1}. {q.name}</h5>
              <div className="text-sm text-gray-500 mt-2 flex items-center justify-between">
                <span><i className="bi bi-award"></i> Max Score: {q.maxScore}</span>
                <div className="flex space-x-4">
                  <a href={`/update_qn/${q.id}`} className="text-green-500 hover:text-green-700"><i className="bi bi-gear"></i> Edit</a>
                  <a href={`/delete_qn/${q.id}`} className="text-red-500 hover:text-red-700"><i className="bi bi-trash"></i> Delete</a>
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
  const [user] = useState({ isStaff: true, firstName: "John" });
  const [test] = useState({ id: 1, name: "Final Exam" });
  const [questions] = useState([
    { id: 1, name: "What is React?", maxScore: 5 },
    { id: 2, name: "Explain the Virtual DOM.", maxScore: 10 }
  ]);

  return (
    <div className="font-sans text-gray-900">
      <Header user={user} test={test} />
      <main className="pt-24">
        <QuestionsList questions={questions} />
      </main>
    </div>
  );
};

export default App;
