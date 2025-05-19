import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function QuestionList({ questions, onQuestionUpdated }) {
  const { token } = useAuth();

  const handleRevisionToggle = async (questionId, currentStatus) => {
    try {
      await axios.patch(
        `https://tracker-fnbb.onrender.com/api/questions/${questionId}`,
        { needsRevision: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onQuestionUpdated();
    } catch (error) {
      toast.error('Error updating question');
    }
  };

const handleNotesUpdate = async (questionId, notes) => {
    try {
      await axios.patch(
        `https://tracker-fnbb.onrender.com/api/questions/${questionId}`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onQuestionUpdated();
    } catch (error) {
      toast.error('Error updating notes');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`https://tracker-fnbb.onrender.com/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onQuestionUpdated();
      toast.success('Question deleted successfully');
    } catch (error) {
      toast.error('Error deleting question');
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
      <ul className="divide-y divide-gray-700">
        {questions.map((question) => (
          <li key={question._id} className="px-4 py-4 sm:px-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-200">
                    {question.platform.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      question.difficulty === 'easy'
                        ? 'bg-green-700 text-green-200'
                        : question.difficulty === 'medium'
                        ? 'bg-yellow-700 text-yellow-200'
                        : 'bg-red-700 text-red-200'
                    }`}
                  >
                    {question.platform === 'codeforces'
                      ? `Rating: ${question.rating}`
                      : question.difficulty}
                  </span>
                  <span className="text-sm text-gray-400">{question.timeSpent}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteQuestion(question._id)}
                    className="p-1 rounded-md text-red-700 hover:bg-red-700 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      handleRevisionToggle(question._id, question.needsRevision)
                    }
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      question.needsRevision
                        ? 'bg-red-700 text-white hover:bg-red-700'
                        : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                    }`}
                  >
                    {question.needsRevision ? 'Needs Revision' : 'Mark for Revision'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {question.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 text-xs font-medium bg-blue-700 text-blue-200 rounded-md"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div>
                <a
                  href={question.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-200"
                >
                  {question.url}
                </a>
              </div>

              <div>
                <textarea
                  value={question.notes}
                  onChange={(e) => handleNotesUpdate(question._id, e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-600 rounded-md bg-gray-700 text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionList;
