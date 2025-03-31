import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateTest = () => {
    const { testId } = useParams();
    const [ formData, setFormData ] = useState({
        name: "",
        desc: "",
        start_time: "",
        end_time: "",
    });
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await axios.get(`/api/teacher/view_test/${testId}`);
                const formatDate = (date) => {
                    const d = new Date(date);
                    return d.toISOString().slice(0, 16); 
                };
                setFormData({
                    name: response.data.test.name,
                    desc: response.data.test.desc,
                    start_time: formatDate(response.data.test.start_time),
                    end_time: formatDate(response.data.test.end_time),
                });
            } catch (err) {
                console.log(err.message);
                setError("An error occurred while fetching the question data");
            } finally {
                setLoading(false);
            }
        };
        fetchTestData();
    }, [ testId ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [ e.target.name ]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/teacher/update_test/${testId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success === false) {
                return;
            }
            navigate(`/view_test/${testId}`);
        } catch (error) {
            console.log(error.message);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="w-3/5 bg-white shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
                <div className="w-11/12 mx-auto">
                    <h1 className="text-4xl font-bold text-primary text-center">
                        {"Update Test"}
                    </h1>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Test Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Start Time</label>
                                <input
                                    type="datetime-local"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">End Time</label>
                                <input
                                    type="datetime-local"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return <UpdateTest />;
};

export default App;
