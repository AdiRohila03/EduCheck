import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";
import logo from "../assets/img/logo.png";
import heroImg from "../assets/img/hero-img.png";
import aboutImg from "../assets/img/about.jpg";
import values1 from "../assets/img/values-1.png";
import values2 from "../assets/img/values-2.png";
import values3 from "../assets/img/values-3.png";

const Home = () => {
  const [ isOpen, setIsOpen ] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
        <div className="flex items-center">
          <img src={logo} alt="EduCheck Logo" className="h-10 mr-2" />
          <span className="text-2xl font-bold text-blue-900">EduCheck</span>
        </div>
        <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>
        <nav className={`absolute md:relative ${isOpen ? "top-16" : "top-0"} left-0 w-full md:w-auto bg-white md:bg-transparent md:flex flex-col md:flex-row md:space-x-6 shadow-md md:shadow-none p-4 md:p-0 ${isOpen ? "block" : "hidden"}`}>
          {[ 'Home', 'About', 'Benefits', 'Contact' ].map((item) => (
            <ScrollLink key={item} to={item.toLowerCase()} smooth={true} duration={500} className="text-blue-700 cursor-pointer block md:inline px-4 py-2 md:p-0">
              {item}
            </ScrollLink>
          ))}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900">We offer modern solutions for Online Exam</h1>
            <h2 className="text-xl text-gray-700 mt-4">We use Machine Learning for Exam Paper Evaluation</h2>
            <ScrollLink to="contact" smooth={true} duration={500} className="mt-6 inline-block bg-blue-700 text-white px-6 py-3 rounded shadow hover:bg-blue-800">
              Get Started
            </ScrollLink>
          </div>
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <img src={heroImg} alt="home" className="w-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h3 className="text-lg text-blue-700 uppercase font-bold">What is EduCheck</h3>
            <h2 className="text-2xl font-bold text-blue-900">Descriptive Answer Evaluation using ML</h2>
            <p className="text-gray-700 mt-4">
              An application that evaluates descriptive answers using NLP techniques and provides scores based on predefined correct answers.
            </p>
            <ScrollLink to="benefits" smooth={true} duration={500} className="mt-6 inline-block bg-blue-700 text-white px-6 py-3 rounded shadow hover:bg-blue-800">
              Read More
            </ScrollLink>
          </div>
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <img src={aboutImg} alt="About" className="w-full rounded-lg shadow-md" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-gray-100 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-lg text-blue-700 uppercase font-bold">Benefits of EduCheck</h2>
          <p className="text-2xl font-bold text-blue-900">Our Solution Benefits Teachers & Students</p>
          <div className="flex flex-wrap justify-center mt-10 gap-6">
            {[ values1, values2, values3 ].map((img, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/3 px-4 py-6">
                <div className="bg-white p-6 rounded shadow-md text-center">
                  <img src={img} alt="Benefit" className="mx-auto w-24 mb-4" />
                  <h3 className="text-xl font-bold text-blue-900">
                    {[ 'Fair Evaluation', 'Time Saving', 'Error-Free with High Accuracy' ][ index ]}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-lg text-blue-700 uppercase font-bold">Contact</h2>
          <p className="text-2xl font-bold text-blue-900">Contact Us</p>
          <div className="flex flex-col lg:flex-row mt-10 gap-6">
            <div className="w-full lg:w-1/2 bg-gray-100 p-6 rounded shadow-md text-center">
              <h3 className="text-xl font-bold text-blue-900">Address</h3>
              <p className="text-gray-700">3288, TNHB Colony, Madurai, TamilNadu, India</p>
              <h3 className="text-xl font-bold text-blue-900 mt-4">Call Us</h3>
              <p className="text-gray-700">+91 9789301535</p>
            </div>
            <div className="w-full lg:w-1/2">
              <form className="bg-gray-100 p-6 rounded shadow-md">
                <input type="text" placeholder="Your Name" className="w-full p-3 rounded border mb-4" required />
                <input type="email" placeholder="Your Email" className="w-full p-3 rounded border mb-4" required />
                <textarea placeholder="Message" className="w-full p-3 rounded border mb-4" rows="4" required></textarea>
                <button className="w-full bg-blue-700 text-white px-6 py-3 rounded shadow hover:bg-blue-800">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;