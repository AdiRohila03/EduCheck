import { useEffect, useState } from "react";
import logo from "../../assets/img/logo.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux'

const Header = () => {
  const { classId } = useParams(); // Get dynamic classId
  const [ room, setRooms ] = useState([]);
  const [ user, setUser ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/view_class/${classId}`);
        // console.log(response.data.user);

        setUser(response.data.user || []);
        setRooms(response.data.room || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (classId) fetchData(); // Fetch only if classId exists
  }, [ classId ]);

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
              <a href={`/create_test/${room._id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-folder-plus"></i> Create Test
              </a>
              <a href={`/update_class/${room._id}`} className="text-primary hover:text-secondary transition">
                <i className="bi bi-gear"></i> Modify Classroom
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
              <li><a href="/logout" className="block px-4 py-2 hover:bg-gray-200">Logout</a></li>
              <li className="px-4 py-2">Class Code: {room.code}</li>
              <li><a href={`/people/${room._id}`} className="block px-4 py-2 hover:bg-gray-200">People</a></li>
              {user.isStaff && (
                <li>
                  <a href={`/delete_class/${room._id}`} className="block px-4 py-2 text-red-600 hover:bg-red-100">
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

const formatDateTime = (isoString) => {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // AM/PM format
  });
};

const SortableItem = ({ item, index, status, Tstatus }) => {
  // console.log("status", status);
  // console.log("Tstatus", Tstatus);

  const { currentUser } = useSelector(state => state.user)
  const displayStatus = Tstatus === "not" ? status : Tstatus;

  return (
    <article className="p-6 bg-white shadow-md rounded-lg flex flex-col gap-2 border-l-4 border-blue-500">
      <h2 className="text-xl font-semibold text-gray-800">
        {currentUser?.user.isStaff ? (
          <a href={`/view_test/${item._id}`} className="text-primary hover:text-secondary transition">
            {index}. {item.name}
          </a>
        ) : (
          status === "late" || status === "not" ? (
          <span>{index}. {item.name}</span>
        ) : (
          <a href={`/attend_test/${item._id}`} className="text-primary hover:text-secondary transition">
            {index}. {item.name}
          </a>
        ))}
      </h2>
      <p className="text-gray-600 mt-2">{item.desc}</p>
      <p className={`mt-2 font-semibold ${displayStatus === "done" ? "text-green-500" :
          displayStatus === "late" ? "text-red-500" :
            displayStatus === "not" ? "text-yellow-500" :
              "text-blue-700"
        }`}>
        {displayStatus}
      </p>
      <div className="text-sm text-gray-500 mt-2">
        {item.start_time && <p><i className="bi bi-alarm"></i> Start time: {formatDateTime(item.start_time)}</p>}
        {item.end_time && <p><i className="bi bi-clock-history"></i> End time: {formatDateTime(item.end_time)}</p>}
      </div>
    </article>
  );
};

const TestsList = () => {
  const [ search, setSearch ] = useState("");
  const [ searchStatus, setSearchStatus ] = useState(""); // Default to empty for all tests
  const { classId } = useParams();
  const [ tests, setTests ] = useState([]);
  const [ testTaken, setTestTaken ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/view_class/${classId}`);
        let sortedTests = response.data.tests || [];
        sortedTests.sort((a, b) => new Date(a.create_time) - new Date(b.create_time));
        sortedTests = sortedTests.map((t, index) => ({ ...t, index: index + 1 }));
        setTests(sortedTests);
        setTestTaken(response.data.testTaken || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (classId) fetchData();
  }, [ classId ]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  // Filtering logic for name and combined status
  const filteredTests = tests.filter((test) => {
    const takenEntry = testTaken.find((entry) => entry?.test.toString() === test._id.toString());
    const testTStatus = takenEntry?.status || "not";

    return (
      test.name.toLowerCase().includes(search.toLowerCase()) &&
      (searchStatus === "" || test.status.toLowerCase() === searchStatus.toLowerCase() || testTStatus.toLowerCase() === searchStatus.toLowerCase())
    );
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Tests</h2>

        {/* Search by Name */}
        <input
          type="text"
          placeholder="Search Tests by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mt-4"
        />

        {/* Combined Status & Tstatus Filter Dropdown */}
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md mt-4 ${searchStatus === "" ? "text-gray-400" : "text-black"
            }`}
        >
          <option value="" disabled className="text-gray-400">
            Search Tests by Status
          </option>
          <option value="assigned" className="text-black">Assigned</option>
          <option value="done" className="text-black">Done</option>
          <option value="late" className="text-black">Late</option>
        </select>


        {/* Display Filtered Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {filteredTests.map((t) => {
            const takenEntry = testTaken.find((entry) => entry?.test.toString() === t._id.toString());
            return <SortableItem key={t._id} item={t} index={t.index} status={t.status} Tstatus={takenEntry?.status || "not"} />;
          })}
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
        <TestsList />
      </main>
    </div>
  );
};

export default App;