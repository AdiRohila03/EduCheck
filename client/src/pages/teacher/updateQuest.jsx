import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateQuestion = () => {
    const { qnId } = useParams();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        name: "",
        answer: "",
        max_score: "",
    });
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    // Fetch question data when component mounts
    useEffect(() => {
        const fetchQuestionData = async () => {
            try {
                const response = await axios.get(`/api/teacher/view_qn/${qnId}`);
                 setFormData({
                    name: response.data.qn.name,
                    answer: response.data.qn.answer,
                    max_score: response.data.qn.max_score,
                });
            } catch (err) {
                console.log(err.message);
                setError("An error occurred while fetching the question data");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionData();
    }, [ qnId ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [ e.target.name ]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/teacher/update_qn/${qnId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                navigate(`/view_test/${data.qn.test}`);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="w-3/5 bg-white shadow-lg rounded-lg p-10 bg-cover" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
                <div className="w-11/12 mx-auto">
                    <h1 className="text-4xl font-bold text-primary text-center">Update Question</h1>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Question Text</label>
                            <textarea
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Answer</label>
                            <input
                                type="text"
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Score</label>
                            <input
                                type="number"
                                name="max_score"
                                value={formData.max_score}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
                                required
                            />
                        </div>

                        <div className="text-center mt-6">
                            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateQuestion;
