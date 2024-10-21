import React, { useState } from 'react';
import { QuizData } from '../types';

interface QuizUploaderProps {
  onQuizData: (data: QuizData) => void;
}

const QuizUploader: React.FC<QuizUploaderProps> = ({ onQuizData }) => {
  const [questions, setQuestions] = useState('');
  const [answers, setAnswers] = useState('');

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
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quizData = parseQuizData();
    onQuizData(quizData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="questions" className="block mb-2 font-semibold">
          Questions:
        </label>
        <textarea
          id="questions"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          className="w-full h-40 p-2 border rounded"
          placeholder="Enter questions here..."
          required
        />
      </div>
      <div>
        <label htmlFor="answers" className="block mb-2 font-semibold">
          Answers:
        </label>
        <textarea
          id="answers"
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          className="w-full h-20 p-2 border rounded"
          placeholder="Enter answers here..."
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Start Quiz
      </button>
    </form>
  );
};

export default QuizUploader;