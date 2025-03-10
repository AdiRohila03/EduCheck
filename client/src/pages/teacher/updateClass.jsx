import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import onlineClass from "../../assets/img/OnlineClass.jpg";

export default function UpdateClass() {
    const { classId } = useParams();
    const [ formData, setFormData ] = useState({
        name: "",
        code: "",
        desc: ""
    });
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const response = await axios.get(`/api/teacher/view_class/${classId}`);
                setFormData({
                    name: response.data.room.name,
                    code: response.data.room.code,
                    desc: response.data.room.desc,
                });
            } catch (err) {
                console.log(err.message);
                setError("An error occurred while fetching the question data");
            } finally {
                setLoading(false);
            }
        };
        fetchClassData();
    }, [ classId ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [ e.target.name ]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/teacher/update_class/${classId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                navigate(`/view_class/${classId}`);
            } else {
                setError(data.message || "Failed to update the question");
            }
        } catch (error) {
            console.log(error.message);

            setError("An error occurred while updating the question");
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <>
            <section
                id="contact"
                className=" bg-gray-100 px-4 bg-cover bg-center min-h-screen flex justify-center items-center p-6"
                style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}
            >
                <div className="container mx-auto max-w-4xl bg-white shadow-lg p-6 rounded-lg" data-aos="fade-up">
                    <header className="text-center mb-6">
                        <h2 className="text-2xl font-bold">Modify Classroom</h2>
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
                        
                        <div>
                            <img src={onlineClass} alt="Online Class" className="rounded-lg shadow-md" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}