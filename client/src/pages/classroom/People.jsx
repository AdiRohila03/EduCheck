const People = ({ teacher, students }) => {
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
              <h5 className="text-lg font-semibold">{teacher.firstName}</h5>
              <h5 className="text-lg font-semibold">{teacher.fullName}</h5>
            </div>
            
            <br />
            <h1 className="text-2xl font-bold text-blue-500">Students</h1>
            <hr className="my-2" />
            <ul className="mt-4 space-y-3">
              {students.map((student, index) => (
                <li key={index} className="bg-gray-100 p-3 rounded-md shadow">
                  <div className="flex justify-between">
                    <h6 className="text-md font-medium">{student.firstName}</h6>
                    <h6 className="text-md font-medium">{student.fullName}</h6>
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
    const teacher = { firstName: "John", fullName: "John Doe" };
    const students = [
      { firstName: "Alice", fullName: "Alice Johnson" },
      { firstName: "Bob", fullName: "Bob Smith" },
    ];
  
    return <People teacher={teacher} students={students} />;
  };
  
  export default App;