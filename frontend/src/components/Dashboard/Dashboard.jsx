import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const { token, isAuthenticated, logout } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated){
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://tracker-fnbb.onrender.com/api/questions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(response.data);
    } catch (error) {
      toast.error('Error fetching questions');
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await axios.get('https://tracker-fnbb.onrender.com/api/questions/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(response.data.username);
    } catch (error) {
      toast.error('Error fetching user profile');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions();
      fetchUsername();
    }
  }, [isAuthenticated, token]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const response = await axios.get(`https://tracker-fnbb.onrender.com/api/questions/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Error searching questions');
    }
  };

  const handleDifficultyFilter = async () => {
    if (!difficultyFilter) {
      toast.error('Please select a difficulty');
      return;
    }
    try {
      const response = await axios.get('https://tracker-fnbb.onrender.com/api/questions/byDifficulty', {
        headers: { Authorization: `Bearer ${token}` },
        params: { difficulty: difficultyFilter },
      });
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Error filtering by difficulty');
    }
  };

  const handleRatingFilter = async () => {
    if (!ratingFilter) {
      toast.error('Please enter a rating');
      return;
    }
    try {
      const response = await axios.get('https://tracker-fnbb.onrender.com/api/questions/byRating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { minRating: ratingFilter },
      });
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Error filtering by rating');
    }
  };

  const handleTopicFilter = async () => {
    if (!topicFilter) {
      toast.error('Please select a topic');
      return;
    }
    try {
      const response = await axios.get('https://tracker-fnbb.onrender.com/api/questions/byTopic', {
        headers: { Authorization: `Bearer ${token}` },
        params: { topics: topicFilter },
      });
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Error filtering by topic');
    }
  };

  const handleTimeFilter = async () => {
    if (!timeFilter) {
      toast.error('Please select a time');
      return;
    }
    try {
      const response = await axios.get('https://tracker-fnbb.onrender.com/api/questions/byTimeSpent', {
        headers: { Authorization: `Bearer ${token}` },
        params: { maxTime: timeFilter.trim() },
      });
      setSearchResults(response.data);
    } catch (error) {
      toast.error('Error filtering by time');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const reload = () => {
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={reload} className="text-2xl font-bold text-gray-100">
                {username || 'Loading...'}
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/progress')}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Progress
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-800 shadow-lg rounded-lg px-4 py-6 sm:px-0">
          <QuestionForm onQuestionAdded={fetchQuestions} />
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] px-4 py-2 sm:px-0">
          <div className="flex-none pt-1">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex-none space-y-3 py-3">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-700 rounded-md text-sm bg-gray-800 text-white"
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <button
                  onClick={handleDifficultyFilter}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Enter rating (e.g., 1200)"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-700 rounded-md text-sm bg-gray-800 text-white"
                />
                <button
                  onClick={handleRatingFilter}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="px-2 py-2 border border-gray-700 rounded-md text-sm bg-gray-800 text-white"
                >
                  <option value="">Select Topic</option>
                  {[
                    'Arrays',
                    'Strings',
                    'Linked List',
                    'Stacks',
                    'Queues',
                    'Trees',
                    'Graphs',
                    'Dynamic Programming',
                    'Backtracking',
                    'Hashing',
                    'Sorting',
                    'Searching',
                    'Union Find',
                    'Memoization',
                    'Greedy',
                    'Bit Manipulation',
                    'Recursion',
                    'Divide and Conquer',
                    'Topological Sort',
                    'Shortest Path',
                    'DFS',
                    'BFS',
                    'Map',
                    'Heap',
                    'Trie',
                    'Prefix Sum'
                  ].map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleTopicFilter}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-700 rounded-md text-sm bg-gray-800 text-white"
                >
                  <option value="">Select Time</option>
                  {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((maxtime) => (
                    <option key={maxtime} value={`${maxtime}min`}>
                      {maxtime} min
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleTimeFilter}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto bg-gray-800 rounded-lg">
            <QuestionList
              questions={searchResults || questions}
              onQuestionUpdated={fetchQuestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;