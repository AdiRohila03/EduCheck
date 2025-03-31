import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { error } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(error.message));
        return;
      }
      dispatch(signInSuccess(data)); 
      navigate("/dashboard"); 
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-gray-200 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded mt-4" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required className="w-full p-2 border rounded mt-2" onChange={handleChange} />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4">Sign In</button>
        </form>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <p className="text-center mt-2">
        Dont have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;