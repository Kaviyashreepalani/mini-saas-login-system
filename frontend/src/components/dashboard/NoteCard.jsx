import React from 'react';
import { Pin, Edit2, Trash2, Eye, PaintBucket } from 'lucide-react';

const NoteCard = ({ note, onDelete, onPin, onColorChange, onEdit, onView, colors }) => {
  const getColorClasses = (colorName) => {
    const color = colors.find(c => c.name.toLowerCase() === colorName?.toLowerCase());
    return color || colors[0];
  };

  const colorClasses = getColorClasses(note.color);

  return (
    <div
      className={`${colorClasses.className} rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 border-l-4 relative group`}
    >
      {/* Pin Button */}
      <button
        onClick={() => onPin(note.id)}
        className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
          note.isPinned
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50'
        }`}
        title={note.isPinned ? 'Unpin note' : 'Pin note'}
      >
        <Pin className="w-4 h-4" fill={note.isPinned ? 'currentColor' : 'none'} />
      </button>

      {/* Note Content */}
      <div className="mt-8 mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
          {note.content}
        </p>
      </div>

      {/* Labels */}
      {note.labels && note.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.labels.slice(0, 3).map((label, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-white bg-opacity-70 text-gray-700 rounded-full text-xs font-medium"
            >
              {label}
            </span>
          ))}
          {note.labels.length > 3 && (
            <span className="px-2 py-0.5 bg-white bg-opacity-70 text-gray-600 rounded-full text-xs">
              +{note.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-300 border-opacity-40">
        <div className="flex items-center gap-1">
          {/* View Button */}
          <button
            onClick={() => onView(note)}
            className="p-1.5 rounded hover:bg-white hover:bg-opacity-50 text-gray-600 hover:text-blue-600 transition-all"
            title="View note"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded hover:bg-white hover:bg-opacity-50 text-gray-600 hover:text-blue-600 transition-all"
            title="Edit note"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Color Change Button */}
          <button
            onClick={() => onColorChange(note.id)}
            className="p-1.5 rounded hover:bg-white hover:bg-opacity-50 text-gray-600 hover:text-purple-600 transition-all"
            title="Change color"
          >
            <PaintBucket className="w-4 h-4" />
          </button>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(note.id)}
          className="p-1.5 rounded hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all"
          title="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Timestamp */}
      {note.createdAt && (
        <p className="text-xs text-gray-500 mt-2 opacity-70">
          {new Date(note.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      )}
    </div>
  );
};

export default NoteCard;