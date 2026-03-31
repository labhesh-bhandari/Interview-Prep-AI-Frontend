import { useState, useEffect } from 'react';
import { LuX, LuListChecks } from 'react-icons/lu';
import SpinnerLoader from '../loaders/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const QuizModal = ({ isOpen, onClose, questions, onComplete }) => {
  const [quizData, setQuizData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && questions.length > 0) {
      setUserAnswers({});
      setSubmitted(false);
      setQuizData([]);
      generateQuizOptions();
    }
  }, [isOpen]);

  const generateQuizOptions = async () => {
    setLoading(true);
    try {
      const quizQuestions = questions.slice(0, 10);
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ_OPTIONS, {
        questions: quizQuestions.map((q) => ({
          question: q.question,
          answer: q.answer
        }))
      });

      const distractorsData = response.data; // array of { distractors: [...] }

      const quiz = quizQuestions.map((q, i) => {
        const correctAnswer = q.answer.length > 150
          ? q.answer.substring(0, 150) + '...'
          : q.answer;
        const distractors = distractorsData[i]?.distractors || ['Option A', 'Option B', 'Option C'];
        const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
        return { question: q.question, options, correctAnswer };
      });

      setQuizData(quiz);
    } catch (err) {
      console.error('Quiz generation failed', err);
      // Fallback — use questions as-is with dummy options
      const fallback = questions.slice(0, 10).map((q) => {
        const correctAnswer = q.answer.length > 150
          ? q.answer.substring(0, 150) + '...'
          : q.answer;
        const options = [correctAnswer, 'None of the above', 'I am not sure', 'All of the above'].sort(() => Math.random() - 0.5);
        return { question: q.question, options, correctAnswer };
      });
      setQuizData(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, option) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    const answers = quizData.map((q, i) => ({
      question: q.question,
      selected: userAnswers[i] || null,
      correct: q.correctAnswer,
      isCorrect: userAnswers[i] === q.correctAnswer,
    }));
    const score = answers.filter((a) => a.isCorrect).length;
    setSubmitted(true);
    onComplete({ score, total: quizData.length, answers });
  };

  const answeredCount = Object.keys(userAnswers).length;
  const allAnswered = quizData.length > 0 && answeredCount === quizData.length;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto py-8'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4'>

        {/* Header — sticky */}
        <div className='sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-xl'>
          <div className='flex items-center gap-2'>
            <LuListChecks className='text-indigo-600' size={18} />
            <div>
              <h3 className='font-semibold text-gray-900'>Quiz — {quizData.length} Questions</h3>
              {!loading && (
                <p className='text-xs text-gray-400'>
                  {answeredCount}/{quizData.length} answered
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 cursor-pointer'>
            <LuX size={20} />
          </button>
        </div>

        <div className='p-6'>
          {loading ? (
            <div className='py-12 flex flex-col items-center gap-3'>
              <SpinnerLoader />
              <p className='text-sm text-gray-500'>Preparing your quiz questions...</p>
            </div>
          ) : (
            <div className='space-y-8'>
              {quizData.map((q, qIdx) => (
                <div key={qIdx}>
                  <p className='text-[14px] font-medium text-gray-800 mb-3 leading-relaxed'>
                    <span className='text-indigo-500 font-semibold mr-2'>Q{qIdx + 1}.</span>
                    {q.question}
                  </p>
                  <div className='space-y-2'>
                    {q.options.map((option, oIdx) => {
                      let cls = 'border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50';

                      if (submitted) {
                        if (option === q.correctAnswer) {
                          cls = 'border border-green-400 bg-green-50 text-green-800';
                        } else if (userAnswers[qIdx] === option) {
                          cls = 'border border-red-300 bg-red-50 text-red-700';
                        } else {
                          cls = 'border border-gray-100 text-gray-400';
                        }
                      } else if (userAnswers[qIdx] === option) {
                        cls = 'border border-indigo-400 bg-indigo-50 text-indigo-800';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelect(qIdx, option)}
                          disabled={submitted}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all cursor-pointer flex items-start gap-3 ${cls}`}
                        >
                          <span className='shrink-0 mt-0.5 w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-semibold'>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!submitted && (
                <div className='pt-2 flex items-center justify-between border-t border-gray-100'>
                  <p className='text-xs text-gray-400'>
                    {allAnswered
                      ? 'All questions answered — ready to submit!'
                      : `${quizData.length - answeredCount} question${quizData.length - answeredCount !== 1 ? 's' : ''} remaining`}
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className='bg-black text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer'
                  >
                    Submit Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;