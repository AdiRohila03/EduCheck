import { useState } from "react";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isStaff: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? "Sign Up Data:" : "Login Data:", formData);
  };

  return (
    <div className={`container mx-auto flex justify-center items-center min-h-screen bg-gray-100 ${isSignUp ? "right-panel-active" : ""}`}>
      <div className="w-full max-w-2xl bg-gray-200 shadow-lg rounded-lg overflow-hidden flex">
        <div className="w-1/2 p-6 flex flex-col justify-center">
          {isSignUp ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-center">Create Account</h2>
              <input type="text" name="name" placeholder="Name" required className="w-full p-2 border rounded mt-4" onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded mt-2" onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required className="w-full p-2 border rounded mt-2" onChange={handleChange} />
              <label className="flex items-center mt-2">
                <input type="checkbox" name="isStaff" className="mr-2" onChange={handleChange} /> Are You a Teacher?
              </label>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4">Sign Up</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-center">Sign In</h2>
              <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded mt-4" onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required className="w-full p-2 border rounded mt-2" onChange={handleChange} />
              <a href="#" className="text-blue-500 text-sm mt-2 block text-center">Forgot your password?</a>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4">Sign In</button>
            </form>
          )}
        </div>

        <div className="w-1/2 flex flex-col justify-center items-center bg-primary text-white p-6">
          {isSignUp ? (
            <div className="text-center">
              <h1 className="text-black text-2xl font-bold">Welcome Back!</h1>
              <p className="text-black mt-2">To keep connected with us please login with your personal info</p>
              <button onClick={() => setIsSignUp(false)} className="mt-4 bg-blue-600 text-primary px-6 py-2 rounded">Sign In</button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className=" text-black text-2xl font-bold">New Here!</h1>
              <p className="text-black mt-2">Enter your personal details and start your journey with us</p>
              <button onClick={() => setIsSignUp(true)} className="mt-4 bg-blue-600 text-primary px-6 py-2 rounded">Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return <AuthForm />;
};

export default App;
