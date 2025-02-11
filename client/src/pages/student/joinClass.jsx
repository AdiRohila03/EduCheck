import onlineClass from "../../assets/img/OnlineClass.jpg";


const JoinClass = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Classroom join request submitted");
    };
  
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white shadow-lg py-4 px-6 flex justify-between items-center">
          <nav className="flex items-center">
            <i className="bi bi-list text-2xl cursor-pointer text-gray-700"></i>
          </nav>
        </header>
  
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: "url('/assets/img/hero-bg.png')" }}>
          <div className="container mx-auto text-center">
            <h2 className="text-xl font-bold text-blue-600 uppercase tracking-widest">Join</h2>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">Join Classroom</p>
  
            <div className="flex flex-wrap mt-10 justify-center gap-8">
              {/* Join Form */}
              <div className="w-full md:w-1/2 p-8 bg-white shadow-xl rounded-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input 
                    type="text" 
                    name="code" 
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Classroom Code" 
                    required 
                  />
                  <div className="text-center mt-6">
                    <button 
                      type="submit" 
                      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all">
                      Join Class
                    </button>
                  </div>
                </form>
              </div>
              {/* Extra Content */}
              <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
                <img 
                  src={onlineClass} 
                  alt="Online Class" 
                  className="rounded-xl shadow-lg w-full md:w-3/4 transition-transform transform hover:scale-105" 
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  const App = () => {
    return <JoinClass />;
  };
  
  export default App;
  