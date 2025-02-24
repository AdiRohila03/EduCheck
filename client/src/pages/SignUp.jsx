import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isStaff: false,
    teacherCode: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.isStaff && formData.teacherCode !== "Teacher@123") {
      setError("Invalid Code");
      return;
    }
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success === false) {
      setError(data.message);
      return;
    }

    navigate("/login"); // This will now work correctly because Login is a separate page
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-gray-200 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" required className="w-full p-2 border rounded mt-4" onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded mt-2" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required className="w-full p-2 border rounded mt-2" onChange={handleChange} />
          <label className="flex items-center mt-2">
            <input type="checkbox" name="isStaff" className="mr-2" onChange={handleChange} /> Are You a Teacher?
          </label>
          {formData.isStaff && (
            <>
              <input type="password" name="teacherCode" placeholder="Enter Unique Code" required className="w-full p-2 border rounded mt-2" onChange={handleChange} />
              {error && <p className="text-red-500 mt-1">{error}</p>}
            </>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4">Sign Up</button>
        </form>
        <p className="text-center mt-2">
          Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/login")}>Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
