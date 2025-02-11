import { useState } from "react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password Change Request:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      <div className="w-1/3 bg-gray-200 shadow-lg rounded-lg p-6">
        <h4 className="text-2xl font-bold text-primary mb-6">Change Password</h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-blue-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  return <ChangePassword />;
};

export default App;
