import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizData, Question } from '../types';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface QuizProps {
  quizzes: { [key: string]: QuizData };
}

const Quiz: React.FC<QuizProps> = ({ quizzes }) => {
  const { title } = useParams<{ title: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (title && quizzes[decodeURIComponent(title)]) {
      const data = quizzes[decodeURIComponent(title)];
      setQuizData(data);
      let questions = [...data.questions];
      if (data.settings.randomOrder) {
        questions = questions.sort(() => Math.random() - 0.5);
      }
      if (data.settings.questionCount > 0 && data.settings.questionCount < questions.length) {
        questions = questions.slice(0, data.settings.questionCount);
      }
      setQuizQuestions(questions);
    }
    setLoading(false);
  }, [title, quizzes]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!quizData) {
    return <div className="text-center">Quiz not found. <button onClick={() => navigate('/')} className="text-blue-500 hover:underline">Go back to home</button></div>;
  }

  const handleAnswer = (answer: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = answer;
    setUserAnswers(newUserAnswers);

    if (!quizData.settings.showAnswersAtEnd) {
      setShowResults(true);
    } else if (currentQuestion === quizQuestions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, userAnswer, index) => {
      return userAnswer === quizData.answers[quizQuestions[index].question] ? score + 1 : score;
    }, 0);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (direction === 'next' && currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
    setShowResults(false);
  };

  if (showResults && quizData.settings.showAnswersAtEnd) {
    const score = calculateScore();
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">Quiz Results</h2>
        <p className="text-xl sm:text-2xl mb-4">
          You scored <span className="font-bold text-green-500">{score}</span> out of{' '}
          <span className="font-bold">{quizQuestions.length}</span>
        </p>
        <div className="space-y-4 mb-8">
          {quizQuestions.map((question, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold mb-2">{question.question}</p>
              <p className="text-sm">
                Your answer:{' '}
                <span
                  className={
                    userAnswers[index] === quizData.answers[question.question]
                      ? 'text-green-500 font-bold'
                      : 'text-red-500 font-bold'
                  }
                >
                  {quizData.answers[question.question] !== undefined
                    ? question.options[userAnswers[index].charCodeAt(0) - 65]
                    : 'Answer not available'}
                </span>
              </p>
              <p className="text-sm">
                Correct answer:{' '}
                <span className="text-green-500 font-bold">
                  {quizData.answers[question.question] !== undefined
                    ? question.options[quizData.answers[question.question].charCodeAt(0) - 65]
                    : 'Answer not available'}
                </span>
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors flex items-center justify-center mx-auto"
        >
          <RotateCcw className="mr-2" />
          Take Another Quiz
        </button>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">{title}</h2>
      <div className="mb-4 text-center">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </span>
      </div>
      <p className="text-lg sm:text-xl mb-6 text-center">{question.question}</p>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(String.fromCharCode(65 + index))}
            className="w-full text-left p-4 border rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors flex items-center"
          >
            <span className="w-8 h-8 flex items-center justify-center bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 rounded-full mr-4">
              {String.fromCharCode(65 + index)}
            </span>
            {option}
          </button>
        ))}
      </div>
      {showResults && !quizData.settings.showAnswersAtEnd && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="font-semibold mb-2">
            {userAnswers[currentQuestion] === quizData.answers[question.question] ? (
              <span className="text-green-500">Correct!</span>
            ) : (
              <span className="text-red-500">Incorrect</span>
            )}
          </p>
          <p>
            Correct answer:{' '}
            <span className="font-bold">
              {quizData.answers[question.question] !== undefined
                ? question.options[quizData.answers[question.question].charCodeAt(0) - 65]
                : 'Answer not available'}
            </span>
          </p>
        </div>
      )}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => handleNavigation('prev')}
          disabled={currentQuestion === 0}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <ArrowLeft className="mr-2" />
          Previous
        </button>
        <button
          onClick={() => handleNavigation('next')}
          disabled={currentQuestion === quizQuestions.length - 1}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next
          <ArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
