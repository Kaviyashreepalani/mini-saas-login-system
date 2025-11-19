import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateNoteForm } from '../../utils/validation';

const AddNoteModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    labels: '',
    color: 'default',
    reminder: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateNoteForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const note = {
      id: Date.now(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      labels: formData.labels ? formData.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
      color: formData.color,
      reminder: formData.reminder || null,
      isPinned: false,
      createdAt: new Date().toISOString(),
    };

    onAdd(note);
    setFormData({ title: '', content: '', labels: '', color: 'default', reminder: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Create New Note</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Title"
            name="title"
            placeholder="Enter note title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Content
            </label>
            <textarea
              name="content"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.content
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
              }`}
              rows="5"
              placeholder="Enter note content"
              value={formData.content}
              onChange={handleChange}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <span>⚠</span>
                {errors.content}
              </p>
            )}
          </div>

          <Input
            label="Labels (comma separated)"
            name="labels"
            placeholder="work, personal, important"
            value={formData.labels}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Color
            </label>
            <div className="flex gap-2">
              {['default', 'red', 'blue', 'green', 'yellow', 'purple'].map(color => {
                const colorClasses = {
                  default: 'bg-white border-2 border-gray-300',
                  red: 'bg-red-100 border-2 border-red-300',
                  blue: 'bg-blue-100 border-2 border-blue-300',
                  green: 'bg-green-100 border-2 border-green-300',
                  yellow: 'bg-yellow-100 border-2 border-yellow-300',
                  purple: 'bg-purple-100 border-2 border-purple-300',
                };
                
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-full ${colorClasses[color]} hover:scale-110 transition-transform ${
                      formData.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                    title={color}
                  />
                );
              })}
            </div>
          </div>

          <Input
            label="Reminder (optional)"
            name="reminder"
            type="datetime-local"
            value={formData.reminder}
            onChange={handleChange}
          />

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit}>Add Note</Button>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;