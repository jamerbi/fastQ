import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizData, QuizSettings } from '../types';
import { Save } from 'lucide-react';

interface QuizCreatorProps {
  onSave: (title: string, quizData: QuizData) => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState('');
  const [answers, setAnswers] = useState('');
  const [settings, setSettings] = useState<QuizSettings>({
    showAnswersAtEnd: true,
    questionCount: 0,
    randomOrder: false,
  });
  const navigate = useNavigate();

  const parseQuizData = (): QuizData => {
    const questionLines = questions.split('\n');
    const answerLines = answers.split('\n');

    const parsedQuestions = [];
    let currentQuestion: any = {};

    for (const line of questionLines) {
      if (line.trim() === '') continue;
      if (line.match(/^\d+\./)) {
        if (Object.keys(currentQuestion).length > 0) {
          parsedQuestions.push(currentQuestion);
        }
        currentQuestion = { question: line.replace(/^\d+\.\s*/, ''), options: [] };
      } else if (line.match(/^[A-D]\./)) {
        currentQuestion.options.push(line.replace(/^[A-D]\.\s*/, ''));
      }
    }

    if (Object.keys(currentQuestion).length > 0) {
      parsedQuestions.push(currentQuestion);
    }

    const parsedAnswers = answerLines
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return {
      questions: parsedQuestions,
      answers: parsedAnswers,
      settings: {
        ...settings,
        questionCount: settings.questionCount || parsedQuestions.length,
      },
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quizData = parseQuizData();
    onSave(title, quizData);
    navigate('/');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">Create New Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Quiz Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-300 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter quiz title..."
            required
          />
        </div>
        <div>
          <label htmlFor="questions" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Questions:
          </label>
          <textarea
            id="questions"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            className="w-full h-40 p-2 border rounded focus:ring-2 focus:ring-purple-300 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter questions here..."
            required
          />
        </div>
        <div>
          <label htmlFor="answers" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
            Answers:
          </label>
          <textarea
            id="answers"
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
            className="w-full h-20 p-2 border rounded focus:ring-2 focus:ring-purple-300 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter answers here..."
            required
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Quiz Settings</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showAnswersAtEnd"
              checked={settings.showAnswersAtEnd}
              onChange={(e) => setSettings({ ...settings, showAnswersAtEnd: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="showAnswersAtEnd" className="text-gray-700 dark:text-gray-300">
              Show answers at the end of the quiz
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="randomOrder"
              checked={settings.randomOrder}
              onChange={(e) => setSettings({ ...settings, randomOrder: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="randomOrder" className="text-gray-700 dark:text-gray-300">
              Randomize question order
            </label>
          </div>
          <div>
            <label htmlFor="questionCount" className="block mb-1 text-gray-700 dark:text-gray-300">
              Number of questions to attempt (0 for all):
            </label>
            <input
              type="number"
              id="questionCount"
              value={settings.questionCount}
              onChange={(e) => setSettings({ ...settings, questionCount: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-300 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition-colors flex items-center justify-center"
        >
          <Save className="mr-2" />
          Save Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizCreator;