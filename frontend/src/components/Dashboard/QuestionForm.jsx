import { useState } from 'react';
import Select from 'react-select'; 
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function QuestionForm({ onQuestionAdded }) {
  const [formData, setFormData] = useState({
    platform: 'leetcode',
    url: '',
    difficulty: 'easy',
    rating: '',
    notes: '',
    topics: [],
    timeSpent: '' 
  });

  const { token } = useAuth();

  const dsaTopics = [
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
  ].map((topic) => ({ value: topic, label: topic }));

  const timeSpentOptions = Array.from({ length: 12 }, (_, i) => ({
    value: `${(i + 1) * 5}min`,
    label: `${(i + 1) * 5} min`
  })); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedRating = Math.round(formData.rating);
      const dataToSend = {
        ...formData,
        rating: sanitizedRating,
        topics: formData.topics.map((topic) => topic.value)
      };
      
      await axios.post('https://tracker-fnbb.onrender.com/api/questions', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Question added successfully!');
      setFormData({
        platform: 'leetcode',
        url: '',
        difficulty: 'easy',
        rating: '',
        notes: '',
        topics: [],
        timeSpent: ''
      });
      onQuestionAdded();
    } catch (error) {
      toast.error('Error adding question');
    }
  };

 
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#2d3748',
      borderColor: '#4a5568',
      color: 'white', 
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#2d3748', 
      color: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4a5568' : '#2d3748',
      color: state.isSelected ? 'white' : '#e2e8f0', 
      cursor: 'pointer',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#4a5568',
      color: 'white', 
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white', 
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white', 
      ':hover': {
        backgroundColor: '#e53e3e', 
      },
    }),
  };

  return (
    <div className="bg-gray-800 text-white shadow-md sm:rounded-md">
      <div className="px-6 py-5 sm:p-6">
        <h3 className="text-lg font-medium">Add New Question</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium">Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="leetcode">LeetCode</option>
              <option value="codeforces">CodeForces</option>
              <option value="gfg">GeeksForGeeks</option>
              <option value="codingninjas">Coding Ninjas</option>
            </select>
          </div>

          {/* Question URL */}
          <div>
            <label className="block text-sm font-medium">Question URL</label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* DSA Topics */}
          <div>
            <label className="block text-sm font-medium">DSA Topics</label>
            <Select
              isMulti
              value={formData.topics}
              onChange={(selected) => setFormData({ ...formData, topics: selected })}
              options={dsaTopics}
              styles={customSelectStyles} // Apply custom styles to Select component
              className="mt-1 block w-full text-base"
            />
          </div>

          {/* Difficulty or Rating */}
          {formData.platform === 'codeforces' ? (
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <input
                type="number"
                required
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Time Spent Dropdown */}
          <div>
            <label className="block text-sm font-medium">Time Spent</label>
            <select
              value={formData.timeSpent}
              onChange={(e) => setFormData({ ...formData, timeSpent: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select Time Spent</option>
              {timeSpentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionForm;
