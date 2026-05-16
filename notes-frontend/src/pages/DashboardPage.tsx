import { useEffect, useState } from "react";

import api from "../services/api";

import type { Note } from "../types/note";

function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");

  const [editContent, setEditContent] = useState("");

  const [userId, setUserId] = useState("");

  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes");

      const sortedNotes = response.data.notes.sort(
        (a: Note, b: Note) =>
          Number(b.isPinned) - Number(a.isPinned)
      );

      setNotes(sortedNotes);

      const token = localStorage.getItem("token");

      if (token) {
        const payload = JSON.parse(
          atob(token.split(".")[1])
        );

        setUserId(payload.userId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    if (!title || !content) {
      return alert("Title and content required");
    }

    try {
      await api.post("/notes", {
        title,
        content,
      });

      setTitle("");
      setContent("");

      fetchNotes();
    } catch (error) {
      console.error(error);

      alert("Failed to create note");
    }
  };

  const deleteNote = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this note?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notes/${id}`);

      fetchNotes();
    } catch (error) {
      console.error(error);

      alert("Failed to delete note");
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);

    setEditTitle(note.title);

    setEditContent(note.content);
  };

  const updateNote = async (id: string) => {
    try {
      await api.put(`/notes/${id}`, {
        title: editTitle,
        content: editContent,
      });

      setEditingId(null);

      fetchNotes();
    } catch (error) {
      console.error(error);

      alert("Failed to update note");
    }
  };

  const togglePin = async (id: string) => {
    try {
      await api.patch(`/notes/${id}/pin`);

      fetchNotes();
    } catch (error) {
      console.error(error);

      alert("Failed to pin note");
    }
  };

  const toggleLock = async (id: string) => {
    const pin = window.prompt(
      "Enter 4-digit PIN"
    );

    if (!pin) return;

    try {
      await api.patch(`/notes/${id}/lock`, {
        pin,
      });

      fetchNotes();
    } catch (error) {
      console.error(error);

      alert("Failed to lock/unlock note");
    }
  };

  const shareNote = async (id: string) => {
    const email = window.prompt(
      "Enter email to share with"
    );

    if (!email) return;

    try {
      await api.post(`/notes/${id}/share`, {
        email,
      });

      alert("Note shared successfully");
    } catch (error) {
      console.error(error);

      alert("Failed to share note");
    }
  };

  const myNotes = notes.filter(
    (note) => note.ownerId === userId
  );

  const sharedNotes = notes.filter(
    (note) => note.ownerId !== userId
  );

  const pinnedCount = notes.filter(
    (note) => note.isPinned
  ).length;

  const sharedCount = sharedNotes.length;

  const totalCount = myNotes.length;

  const filterNotes = (notesList: Note[]) => {
    const query = searchQuery.toLowerCase();

    return notesList.filter((note) => {
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    });
  };

  const noteCardClass = (note: Note) => {
    if (darkMode) {
      if (note.isPinned) {
        return "bg-yellow-900/40 border-yellow-700 text-white";
      }

      if (note.isLocked) {
        return "bg-red-900/40 border-red-700 text-white";
      }

      return "bg-white/10 border-white/10 text-white";
    }

    if (note.isPinned) {
      return "bg-yellow-100/70 border-white/40";
    }

    if (note.isLocked) {
      return "bg-red-100/70 border-white/40";
    }

    return "bg-white/70 border-white/40";
  };

  const renderNoteCard = (note: Note) => {
    return (
      <div
        key={note.id}
        className={`backdrop-blur-lg border rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 ${noteCardClass(
          note
        )}`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          {editingId === note.id ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              className={`w-full border rounded-lg px-3 py-2 outline-none ${
                darkMode
                  ? "bg-white/10 border-white/10 text-white"
                  : "border-gray-300"
              }`}
            />
          ) : (
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold break-words">
                {note.title}
              </h2>

              {note.ownerId !== userId && (
                <p className="text-sm text-gray-500 mt-1">
                  Shared by: {note.owner.email}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => togglePin(note.id)}
              className="text-xl"
            >
              {note.isPinned ? "📌" : "📍"}
            </button>

            <button
              onClick={() => toggleLock(note.id)}
              className="text-xl"
            >
              {note.isLocked ? "🔒" : "🔓"}
            </button>
          </div>
        </div>

        {editingId === note.id ? (
          <textarea
            value={editContent}
            onChange={(e) =>
              setEditContent(e.target.value)
            }
            rows={4}
            className={`w-full border rounded-lg px-3 py-2 outline-none resize-none ${
              darkMode
                ? "bg-white/10 border-white/10 text-white"
                : "border-gray-300"
            }`}
          />
        ) : note.isLocked ? (
          <p className="text-gray-500 italic">
            🔒 This note is locked
          </p>
        ) : (
          <p
            className={`break-words ${
              darkMode ? "text-gray-200" : "text-gray-600"
            }`}
          >
            {note.content}
          </p>
        )}

        {note.isLocked && (
          <p className="mt-3 text-sm">
            🔒 Locked
          </p>
        )}

        <div className="flex flex-wrap gap-3 mt-4">
          {editingId === note.id ? (
            <button
              onClick={() => updateNote(note.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => startEditing(note)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          )}

          <button
            onClick={() => shareNote(note.id)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Share
          </button>

          <button
            onClick={() => deleteNote(note.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen p-6 transition duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
          : "bg-gradient-to-br from-indigo-100 via-white to-pink-100"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`backdrop-blur-lg border rounded-3xl p-6 shadow-xl mb-8 transition duration-300 ${
            darkMode
              ? "bg-white/10 border-white/10 text-white"
              : "bg-white/70 border-white/40"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Notes App
              </h1>

              <p
                className={`mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Manage your notes beautifully
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className="bg-black text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");

                  window.location.href = "/";
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className={`w-full border rounded-lg px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-indigo-400 ${
              darkMode
                ? "bg-white/10 border-white/10 text-white placeholder:text-gray-300"
                : "border-gray-300"
            }`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-500 text-white rounded-2xl p-4 shadow-lg">
              <p className="text-sm opacity-80">
                Total Notes
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalCount}
              </h2>
            </div>

            <div className="bg-yellow-400 text-white rounded-2xl p-4 shadow-lg">
              <p className="text-sm opacity-80">
                Pinned Notes
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {pinnedCount}
              </h2>
            </div>

            <div className="bg-pink-500 text-white rounded-2xl p-4 shadow-lg">
              <p className="text-sm opacity-80">
                Shared Notes
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {sharedCount}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 ${
                darkMode
                  ? "bg-white/10 border-white/10 text-white placeholder:text-gray-300"
                  : "border-gray-300"
              }`}
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              rows={4}
              className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 resize-none ${
                darkMode
                  ? "bg-white/10 border-white/10 text-white placeholder:text-gray-300"
                  : "border-gray-300"
              }`}
            />

            <button
              onClick={createNote}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition duration-300"
            >
              Create Note
            </button>
          </div>
        </div>

        {loading ? (
          <p
            className={
              darkMode ? "text-white" : "text-gray-700"
            }
          >
            Loading...
          </p>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              📝
            </div>

            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              No notes yet
            </h2>

            <p
              className={`mt-2 ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Create your first note and start organizing your ideas.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              My Notes
            </h2>

            {filterNotes(myNotes).length === 0 ? (
              <p
                className={
                  darkMode ? "text-gray-300" : "text-gray-500"
                }
              >
                No personal notes found.
              </p>
            ) : (
              filterNotes(myNotes).map((note) =>
                renderNoteCard(note)
              )
            )}

            <h2
              className={`text-2xl font-bold mt-10 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Shared With Me
            </h2>

            {filterNotes(sharedNotes).length === 0 ? (
              <p
                className={
                  darkMode ? "text-gray-300" : "text-gray-500"
                }
              >
                No shared notes found.
              </p>
            ) : (
              filterNotes(sharedNotes).map((note) =>
                renderNoteCard(note)
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;