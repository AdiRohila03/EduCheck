import { useState } from "react";

const Profile = ({ user }) => {
  const [formData, setFormData] = useState({
    email: user.email,
    firstName: user.firstName,
    username: user.username,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-3/5 bg-gray-200 shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
        <div className="w-11/12 mx-auto">
          <h1 className="text-4xl font-bold text-primary">{user.firstName} Profile</h1>
          <p className="text-lg text-gray-600">Edit Your Information</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
              />
              <small className="text-gray-500">We'll never share your email with anyone else.</small>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary">
                Submit
              </button>
              <a href="/password" className="text-blue-600 hover:underline">
                Reset Password
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const user = { firstName: "John", email: "john@example.com", username: "john_doe" };

  return <Profile user={user} />;
};

export default App;
