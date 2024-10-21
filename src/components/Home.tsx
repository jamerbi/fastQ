import React from 'react';
import { Link } from 'react-router-dom';
import { QuizData } from '../types';
import { BookOpen } from 'lucide-react';

interface HomeProps {
  quizzes: { [key: string]: QuizData };
}

const Home: React.FC<HomeProps> = ({ quizzes }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
        <BookOpen className="inline-block mr-2" />
        Quiz Master
      </h1>
      {Object.keys(quizzes).length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">No quizzes available. Create one to get started!</p>
      ) : (
        <ul className="space-y-4">
          {Object.entries(quizzes).map(([title, quiz]) => (
            <li key={title}>
              <Link
                to={`/quiz/${encodeURIComponent(title)}`}
                className="block bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-lg p-4 transition-colors"
              >
                <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{quiz.questions.length} questions</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;