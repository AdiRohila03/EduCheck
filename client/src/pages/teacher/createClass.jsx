import { useState } from "react";
import { useNavigate } from "react-router-dom";
import onlineClass from "../../assets/img/OnlineClass.jpg";

export default function ClassroomForm() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    desc: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log("Form submitted", formData);
        try {
          // dispatch(signInStart());
          const res = await fetch("/api/teacher/create_class", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
      
          const data = await res.json();
          if (data.success === false) {
            // dispatch(signInFailure(error.message));
            return;
          }
          // dispatch(signInSuccess(data)); 
          navigate("/dashboard"); 
        } catch (error) {
          console.log(error.message);
          // dispatch(signInFailure(error.message));
        }
  };

  return (
    <>

      {/* Contact Section */}
      <section
        id="contact"
        className=" bg-gray-100 px-4 bg-cover bg-center min-h-screen flex justify-center items-center p-6"
        style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}
      >
        <div className="container mx-auto max-w-4xl bg-white shadow-lg p-6 rounded-lg" data-aos="fade-up">
          <header className="text-center mb-6">
            <h2 className="text-2xl font-bold">Create Classroom</h2>
            <p className="text-gray-600">Fill out the details below</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Classroom Name"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                />

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Classroom Code"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                />
                <small className="text-gray-500 block">This code is used by students to join your class</small>

                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                ></textarea>

                <div className="text-center">
                  <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                    Submit
                  </button>
                </div>
              </form>
            </div>
            {/* End Form */}

            {/* Extra content */}
            <div>
              <img src={onlineClass} alt="Online Class" className="rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
