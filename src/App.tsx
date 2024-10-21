import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import QuizCreator from './components/QuizCreator';
import Quiz from './components/Quiz';
import { QuizData } from './types';
import { PlusCircle, BookOpen, Moon, Sun } from 'lucide-react';

function App() {
  const [quizzes, setQuizzes] = useState<{ [key: string]: QuizData }>({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const saveQuiz = (title: string, quizData: QuizData) => {
    const updatedQuizzes = { ...quizzes, [title]: quizData };
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500'}`}>
        <div className="container mx-auto px-4 py-8">
          <nav className="mb-8 flex justify-between items-center">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-white hover:text-yellow-300 transition-colors">
                  <BookOpen className="inline-block mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-white hover:text-yellow-300 transition-colors">
                  <PlusCircle className="inline-block mr-2" />
                  <span className="hidden sm:inline">Create Quiz</span>
                </Link>
              </li>
            </ul>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>
          <Routes>
            <Route path="/" element={<Home quizzes={quizzes} />} />
            <Route path="/create" element={<QuizCreator onSave={saveQuiz} />} />
            <Route path="/quiz/:title" element={<Quiz quizzes={quizzes} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;