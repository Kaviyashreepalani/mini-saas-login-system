import React from 'react';
import { Clock, Pin, Palette, X } from 'lucide-react';

const NoteCard = ({ note, onDelete, onPin, onColorChange }) => {
  const colors = {
    default: 'bg-white',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div 
      className={`${colors[note.color] || colors.default} rounded-xl p-4 shadow-sm border hover:shadow-md transition-all duration-200 relative group`}
    >
      {note.isPinned && (
        <div className="absolute top-3 right-3">
          <Pin className="w-4 h-4 text-blue-600 fill-blue-600" />
        </div>
      )}
      
      <h3 className="font-semibold text-gray-800 mb-2 pr-8 line-clamp-2">
        {note.title}
      </h3>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-4 whitespace-pre-wrap">
        {note.content}
      </p>
      
      {note.labels && note.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.labels.map((label, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {note.reminder && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Clock className="w-3 h-3" />
          <span>{new Date(note.reminder).toLocaleString()}</span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onPin(note.id)} 
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`} />
        </button>
        
        <button 
          onClick={() => onColorChange(note.id)} 
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Change color"
        >
          <Palette className="w-4 h-4 text-gray-600" />
        </button>
        
        <button 
          onClick={() => onDelete(note.id)} 
          className="p-1 hover:bg-red-100 rounded ml-auto transition-colors"
          title="Delete"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;