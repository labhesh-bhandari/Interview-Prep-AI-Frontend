import { LuTrophy, LuRefreshCw, LuX, LuCheckCircle, LuXCircle } from 'react-icons/lu';

const QuizResults = ({ isOpen, onClose, onRetry, results }) => {
  if (!isOpen || !results) return null;

  const { score, total, answers } = results;
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage >= 80) return { text: 'Excellent work! 🎉', sub: "You're well prepared for this role." };
    if (percentage >= 60) return { text: 'Good job!', sub: 'A bit more practice and you\'ll nail it.' };
    if (percentage >= 40) return { text: 'Keep going!', sub: 'Review the answers below and try again.' };
    return { text: 'Keep practicing!', sub: "Don't give up — review the questions and retry." };
  };

  const msg = getMessage();
  const scoreColor = percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-orange-500' : 'text-red-500';
  const scoreBg = percentage >= 80 ? 'bg-green-50 border-green-200' : percentage >= 60 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200';

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto py-8'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4'>

        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h3 className='font-semibold text-gray-900'>Quiz Results</h3>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 cursor-pointer'>
            <LuX size={20} />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          {/* Score card */}
          <div className={`rounded-xl p-6 flex flex-col items-center border ${scoreBg}`}>
            <LuTrophy size={34} className={scoreColor} />
            <div className={`text-5xl font-bold mt-3 ${scoreColor}`}>{score}/{total}</div>
            <div className={`text-xl font-semibold mt-1 ${scoreColor}`}>{percentage}%</div>
            <p className='text-gray-700 font-medium mt-2 text-base'>{msg.text}</p>
            <p className='text-gray-500 text-sm text-center mt-1'>{msg.sub}</p>
          </div>

          {/* Answer breakdown */}
          <div>
            <h4 className='text-sm font-semibold text-gray-700 mb-3'>Answer Review</h4>
            <div className='space-y-3'>
              {answers.map((a, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-4 border ${a.isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/40'}`}
                >
                  <div className='flex items-start gap-2 mb-2'>
                    {a.isCorrect
                      ? <LuCheckCircle size={15} className='text-green-500 mt-0.5 shrink-0' />
                      : <LuXCircle size={15} className='text-red-400 mt-0.5 shrink-0' />
                    }
                    <p className='text-sm font-medium text-gray-800'>{i + 1}. {a.question}</p>
                  </div>
                  {!a.isCorrect && a.selected && (
                    <p className='text-xs text-red-600 ml-5 mb-1'>
                      <span className='font-medium'>Your answer: </span>{a.selected}
                    </p>
                  )}
                  {!a.isCorrect && (
                    <p className='text-xs text-green-700 ml-5'>
                      <span className='font-medium'>Correct: </span>{a.correct}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-3 justify-end pt-2 border-t border-gray-100'>
            <button
              onClick={onClose}
              className='text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer'
            >
              Close
            </button>
            <button
              onClick={onRetry}
              className='flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer'
            >
              <LuRefreshCw size={14} /> Retry Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;