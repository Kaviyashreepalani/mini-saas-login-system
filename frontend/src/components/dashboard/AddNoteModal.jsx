import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const COLORS = [
  { name: 'Blue', className: 'bg-blue-100 border-blue-500', circle: 'bg-blue-500' },
  { name: 'Red', className: 'bg-red-100 border-red-500', circle: 'bg-red-500' },
  { name: 'Green', className: 'bg-green-100 border-green-500', circle: 'bg-green-500' },
  { name: 'Yellow', className: 'bg-yellow-100 border-yellow-500', circle: 'bg-yellow-500' },
  { name: 'Purple', className: 'bg-purple-100 border-purple-500', circle: 'bg-purple-500' },
  { name: 'Gray', className: 'bg-gray-100 border-gray-500', circle: 'bg-gray-500' },
];

const AddNoteModal = ({ isOpen, onClose, onAdd, initialNote = null, isEditing = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [labels, setLabels] = useState('');
  const [color, setColor] = useState('blue');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setLabels(initialNote.labels ? initialNote.labels.join(', ') : '');
      setColor(initialNote.color || 'blue');
      setIsPinned(initialNote.isPinned || false);
    } else {
      resetForm();
    }
  }, [initialNote]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setLabels('');
    setColor('blue');
    setIsPinned(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const noteData = {
      id: initialNote?.id || `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      content: content.trim(),
      labels: labels
        .split(',')
        .map(l => l.trim())
        .filter(l => l.length > 0),
      color,
      isPinned,
      createdAt: initialNote?.createdAt || new Date().toISOString(),
    };

    onAdd(noteData);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter note title..."
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Write your note here..."
              rows="6"
            />
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Labels (comma-separated)
            </label>
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="work, personal, important..."
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name.toLowerCase())}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${
                    color === c.name.toLowerCase()
                      ? 'border-gray-800 scale-110'
                      : 'border-transparent hover:scale-105'
                  } ${c.circle}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Pin Option */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="pinNote"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="pinNote"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Pin this note to top
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {isEditing ? 'Update Note' : 'Add Note'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;