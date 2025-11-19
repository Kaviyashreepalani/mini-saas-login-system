import React, { useState, useEffect } from 'react';
import { Plus, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import NoteCard from './NoteCard';
import AddNoteModal from './AddNoteModal';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    loadDemoNotes();
  }, []);

  const loadDemoNotes = () => {
    const demoNotes = [
      {
        id: 1,
        title: 'Welcome to Your Dashboard! 🎉',
        content: 'This is your personal note-taking space. Click the + button at the bottom to add new notes. You can pin important notes, change colors, add labels, and set reminders!',
        labels: ['welcome', 'getting-started'],
        color: 'blue',
        isPinned: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Project Ideas',
        content: 'Build a todo app\nCreate a portfolio website\nLearn React advanced patterns',
        labels: ['projects', 'development'],
        color: 'green',
        isPinned: false,
        createdAt: new Date().toISOString(),
      },
    ];
    setNotes(demoNotes);
    setLoading(false);
  };

  const fetchLogs = async () => {
    try {
      const data = await api.getLogs();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleAddNote = (note) => {
    setNotes(prev => [note, ...prev]);
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handlePinNote = (id) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  const handleColorChange = (id) => {
    const colors = ['default', 'red', 'blue', 'green', 'yellow', 'purple'];
    setNotes(prev => 
      prev.map(note => {
        if (note.id === id) {
          const currentIndex = colors.indexOf(note.color);
          const nextColor = colors[(currentIndex + 1) % colors.length];
          return { ...note, color: nextColor };
        }
        return note;
      })
    );
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const unpinnedNotes = notes.filter(n => !n.isPinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
              <p className="text-sm text-gray-500">Your account details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-medium text-gray-800">{user?.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Recent Login Activity</h2>
              <p className="text-sm text-gray-500">Last 5 login sessions</p>
            </div>
          </div>
          
          {logs.length > 0 ? (
            <div className="space-y-2">
              {logs.slice(0, 5).map((log, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Login #{logs.length - idx}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No login history available yet</p>
              <p className="text-gray-400 text-xs mt-1">Your login sessions will appear here</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
              <p className="text-sm text-gray-500 mt-1">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No notes yet</h3>
              <p className="text-gray-500 text-sm mb-6">Click the + button to create your first note</p>
            </div>
          ) : (
            <>
              {pinnedNotes.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    Pinned
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pinnedNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={handleDeleteNote}
                        onPin={handlePinNote}
                        onColorChange={handleColorChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {unpinnedNotes.length > 0 && (
                <div>
                  {pinnedNotes.length > 0 && (
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                      Others
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unpinnedNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onDelete={handleDeleteNote}
                        onPin={handlePinNote}
                        onColorChange={handleColorChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        title="Add new note"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddNote}
      />
    </div>
  );
};

export default Dashboard;