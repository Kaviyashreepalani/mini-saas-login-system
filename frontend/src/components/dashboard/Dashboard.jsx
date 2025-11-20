import React, { useState, useEffect } from 'react';
import { Plus, Calendar, User, X, Menu, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import NoteCard from './NoteCard';
import AddNoteModal from './AddNoteModal';
import api from '../../services/api';
import Toast from "./Toast";



const NOTES_STORAGE_KEY = 'dashboard_notes';

const COLORS = [
  { name: 'Blue', className: 'bg-blue-100 border-blue-500', circle: 'bg-blue-500' },
  { name: 'Red', className: 'bg-red-100 border-red-500', circle: 'bg-red-500' },
  { name: 'Green', className: 'bg-green-100 border-green-500', circle: 'bg-green-500' },
  { name: 'Yellow', className: 'bg-yellow-100 border-yellow-500', circle: 'bg-yellow-500' },
  { name: 'Purple', className: 'bg-purple-100 border-purple-500', circle: 'bg-purple-500' },
  { name: 'Gray', className: 'bg-gray-100 border-gray-500', circle: 'bg-gray-500' },
];

const Dashboard = ({ password }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
        } else {
          setNotes(demoNotes());
        }
      } catch {
        setNotes(demoNotes());
        showToast('Failed to load saved notes', 'error');
      }
    } else {
      setNotes(demoNotes());
    }
    setLoading(false);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        showToast('Failed to save notes', 'error');
      }
    }
  }, [notes, loading]);

  const fetchLogs = async () => {
    try {
      const data = await api.getLogs();
      setLogs(data);
    } catch (error) {
      setLogs([]);
      showToast('Failed to load login history', 'error');
    }
  };

  const demoNotes = () => {
    const now = new Date().toISOString();
    return [
      {
        id: `${Date.now()}-1`,
        title: 'Welcome to SaaS Login System! 🎉',
        content: 'Take notes, manage logins, and keep track of your sessions.',
        labels: ['welcome', 'user'],
        color: 'blue',
        isPinned: true,
        createdAt: now,
      },
      {
        id: `${Date.now()}-2`,
        title: 'Project Quick Tips',
        content: 'Pin important notes, organize by color, and never lose your tasks.',
        labels: ['tips', 'productivity'],
        color: 'yellow',
        isPinned: false,
        createdAt: now,
      },
    ];
  };

  const handleAddNote = (note) => {
    try {
      if (!note.id) note.id = `${Date.now()}-${Math.random()}`;
      note.createdAt = note.createdAt || new Date().toISOString();
      setNotes(prev => [note, ...prev]);
      showToast('Note added successfully! 🎉', 'success');
    } catch (error) {
      showToast('Failed to add note', 'error');
    }
  };

  const handleEditNote = (updatedNote) => {
    try {
      setNotes(prev =>
        prev.map(note => (note.id === updatedNote.id ? updatedNote : note))
      );
      setEditingNote(null);
      showToast('Note updated successfully! ✅', 'success');
    } catch (error) {
      showToast('Failed to update note', 'error');
    }
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        setNotes(prev => prev.filter(note => note.id !== id));
        showToast('Note deleted successfully! 🗑️', 'success');
      } catch (error) {
        showToast('Failed to delete note', 'error');
      }
    }
  };

  const handlePinNote = (id) => {
    try {
      setNotes(prev =>
        prev.map(note =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note
        )
      );
      const note = notes.find(n => n.id === id);
      showToast(
        note?.isPinned ? 'Note unpinned 📌' : 'Note pinned to top! 📌',
        'success'
      );
    } catch (error) {
      showToast('Failed to pin/unpin note', 'error');
    }
  };

  const handleColorChange = (id) => {
    try {
      setNotes(prev =>
        prev.map(note => {
          if (note.id === id) {
            const colorsArr = COLORS.map(c => c.name.toLowerCase());
            const currentIndex = colorsArr.indexOf(note.color);
            const nextColor = colorsArr[(currentIndex + 1) % colorsArr.length];
            return { ...note, color: nextColor };
          }
          return note;
        })
      );
      showToast('Color changed! 🎨', 'success');
    } catch (error) {
      showToast('Failed to change color', 'error');
    }
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const unpinnedNotes = notes.filter(n => !n.isPinned);

  // Sidebar UI with Login Activity
  const Sidebar = () => (
    <aside className={`fixed top-0 left-0 h-screen w-80 bg-white z-20 shadow-lg flex flex-col px-8 pt-10 border-r border-gray-100 transition-transform duration-300 overflow-y-auto ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <button
        className="absolute top-6 right-6 text-gray-400 hover:text-blue-600"
        title="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Profile Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
            <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
          </div>
        </div>
        <div className="space-y-3 mt-3">
          <div>
            <p className="text-xs text-gray-400">Email Address</p>
            <p className="font-medium text-gray-800">{user?.email}</p>
          </div>
          {password && (
            <div className="flex items-center mt-3 gap-2">
              <Key className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-700">Password: </span>
              <span className="font-semibold text-gray-600">{password}</span>
            </div>
          )}
        </div>
      </div>

      {/* Login Activity in Sidebar */}
      <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">Login Activity</h3>
            <p className="text-xs text-gray-500">Last 5 sessions</p>
          </div>
        </div>
        {logs.length > 0 ? (
          <div className="space-y-2">
            {logs.slice(0, 5).map((log, idx) => (
              <div
                key={idx}
                className="py-2 px-3 bg-blue-50 rounded-lg border-l-4 border-blue-400 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-blue-700">
                    Login #{logs.length - idx}
                  </span>
                </div>
                <span className="text-xs text-gray-700 font-mono block pl-4">
                  {new Date(log.login_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-xs">No login history</p>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="relative z-10 py-7 shadow-sm bg-white border-b border-gray-100 text-center">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">
          SAAS LOGIN SYSTEM
        </h1>
        <button
          onClick={logout}
          className="absolute top-5 right-8 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-800 text-white font-semibold shadow transition"
        >
          Logout
        </button>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-6 left-8 bg-blue-100 p-2 rounded hover:bg-blue-300 transition"
            title="Open profile sidebar"
          >
            <Menu className="w-5 h-5 text-blue-600" />
          </button>
        )}
      </header>

      {sidebarOpen && <Sidebar />}

      <main className={`flex-1 flex flex-col items-center justify-start mt-6 transition-all duration-300 ${
        sidebarOpen ? 'ml-80' : 'ml-0'
      }`}>
        {/* Notes Section */}
        <section className="w-full max-w-6xl px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-blue-800">Your Notes</h2>
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
                        onEdit={() => setEditingNote(note)}
                        onView={() => setViewingNote(note)}
                        colors={COLORS}
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
                        onEdit={() => setEditingNote(note)}
                        onView={() => setViewingNote(note)}
                        colors={COLORS}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-700 text-white rounded-full shadow-xl hover:bg-blue-700 hover:scale-110 transition-all flex items-center justify-center z-40"
        title="Add new note"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddNote}
      />

      {/* Edit Note Modal */}
      {editingNote && (
        <AddNoteModal
          isOpen={true}
          onClose={() => setEditingNote(null)}
          onAdd={handleEditNote}
          initialNote={editingNote}
          isEditing={true}
        />
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">{viewingNote.title}</h3>
              <button
                onClick={() => setViewingNote(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{viewingNote.content}</p>
              {viewingNote.labels && viewingNote.labels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {viewingNote.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-4">
                Created: {new Date(viewingNote.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;