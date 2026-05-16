import { useEffect, useState } from "react";

import api from "../services/api";

import type { Note } from "../types/note";

function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editContent, setEditContent] =
    useState("");
  
  const [userId, setUserId] =
    useState("");

  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes");

      const sortedNotes =
        response.data.notes.sort(
          (a: Note, b: Note) =>
            Number(b.isPinned) -
            Number(a.isPinned)
        );

      setNotes(sortedNotes);

      const token =
        localStorage.getItem("token");

      if (token) {

        const payload =
          JSON.parse(
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
      return alert(
        "Title and content required"
      );
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

  const deleteNote = async (
    id: string
  ) => {

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

  const startEditing = (
    note: Note
  ) => {

    setEditingId(note.id);

    setEditTitle(note.title);

    setEditContent(note.content);
  };

  const updateNote = async (
    id: string
  ) => {

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

  const togglePin = async (
    id: string
  ) => {

    try {

      await api.patch(
        `/notes/${id}/pin`
      );

      fetchNotes();

    } catch (error) {

      console.error(error);

      alert("Failed to pin note");
    }
  };

  const toggleLock = async (
    id: string
  ) => {

    const pin = window.prompt(
      "Enter 4-digit PIN"
    );

    if (!pin) return;

    try {

      await api.patch(
        `/notes/${id}/lock`,
        {
          pin,
        }
      );

      fetchNotes();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to lock/unlock note"
      );
    }
  };

  const shareNote = async (
    id: string
  ) => {

    const email = window.prompt(
      "Enter email to share with"
    );

    if (!email) return;

    try {

      await api.post(
        `/notes/${id}/share`,
        {
          email,
        }
      );

      alert("Note shared successfully");

    } catch (error) {

      console.error(error);

      alert("Failed to share note");
    }
  };
  
  const myNotes = notes.filter(
    (note) =>
      note.ownerId === userId
  );

  const sharedNotes = notes.filter(
    (note) =>
      note.ownerId !== userId
  );

  const pinnedCount = notes.filter(
    (note) => note.isPinned
  ).length;

  const sharedCount =
    sharedNotes.length;

  const totalCount =
    myNotes.length;

  return (
    <div
      className={`min-h-screen p-6 transition duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800"
          : "bg-gradient-to-br from-indigo-100 via-white to-pink-100"
      }`}
    >

      <div className="max-w-6xl mx-auto">

        <div className={`backdrop-blur-lg border rounded-3xl p-6 shadow-xl mb-8 transition duration-300 ${
               darkMode
                 ? "bg-white/10 border-white/10 text-white"
                 : "bg-white/70 border-white/40"
             }`}>

          <div className="flex items-center justify-between mb-6">

            <div>
              <h1 className="text-3xl font-bold">
                Notes App
              </h1>

              <p className="text-gray-500 mt-1">
                Manage your notes beautifully
              </p>
            </div>
            
            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className="mr-4 bg-black text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
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

          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
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

          <p>Loading...</p>

        ) : notes.length === 0 ? (

          <div className="text-center py-20">

            <div className="text-6xl mb-4">
              📝
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              No notes yet
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first note and start organizing your ideas.
            </p>
          </div>

        ) : (

          <div className="flex flex-col gap-6">
          
          <h2 className="text-2xl font-bold">
            My Notes
          </h2>

            {myNotes
              .filter((note) => {

                const query =
                  searchQuery.toLowerCase();

                return (
                  note.title
                    .toLowerCase()
                    .includes(query) ||

                  note.content
                    .toLowerCase()
                    .includes(query)
                );
              })
              .map((note) => (

              <div
                key={note.id}className={`backdrop-blur-lg border border-white/40 rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 ${
  note.isPinned
    ? "bg-yellow-100/70"
    : note.isLocked
    ? "bg-red-100/70"
    : "bg-white/70"
}`}
                
              >

                <div className="flex items-center justify-between mb-3">
                <div className="flex flex-wrap gap-3">

                  {editingId === note.id ? (

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />

                  ) : (

                    <div>
                      <h2 className="text-xl font-semibold">
                        {note.title}
                      </h2>

                      {note.ownerId !== userId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Shared by: {note.owner.email}
                        </p>
                      )}
                    </div>
                  )}
                    
                  
                  

                  <div className="flex items-center">

                    <button
                      onClick={() =>
                        togglePin(note.id)
                      }
                      className="text-xl"
                    >
                      {note.isPinned
                        ? "📌"
                        : "📍"}
                    </button>

                    <button
                      onClick={() =>
                        toggleLock(note.id)
                      }
                      className="text-xl ml-3"
                    >
                      {note.isLocked
                        ? "🔒"
                        : "🔓"}
                    </button>
                  </div>
                </div>

                {editingId === note.id ? (

                  <textarea
                    value={editContent}
                    onChange={(e) =>
                      setEditContent(
                        e.target.value
                      )
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />

                ) : note.isLocked ? (

                  <p className="text-gray-500 italic">
                    🔒 This note is locked
                  </p>

                ) : (

                  <p className="text-gray-600">
                    {note.content}
                  </p>
                )}

                {note.isLocked && (
                  <p className="mt-3 text-sm">
                    🔒 Locked
                  </p>
                )}

                {editingId === note.id ? (
                  
                  <button
                    onClick={() =>
                      updateNote(note.id)
                    }
                    className="mt-4 mr-3 bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>

                ) : (

                  <button
                    onClick={() =>
                      startEditing(note)
                    }
                    className="mt-4 mr-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() =>
                    shareNote(note.id)
                  }
                  className="mt-4 mr-3 bg-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Share
                </button>
                <button
                  onClick={() =>
                    deleteNote(note.id)
                  }
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Delete
                </button>
                </div>
              </div>
            ))}
            <h2 className="text-2xl font-bold mt-10">
              Shared With Me
            </h2>
            {sharedNotes
              .filter((note) => {

                const query =
                  searchQuery.toLowerCase();

                return (
                  note.title
                    .toLowerCase()
                    .includes(query) ||

                  note.content
                    .toLowerCase()
                    .includes(query)
                );
              })
              .map((note) => (

              <div
                key={note.id}
                className={`backdrop-blur-lg border border-white/40 rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 ${
                  note.isPinned
                    ? "bg-yellow-100/70"
                    : note.isLocked
                    ? "bg-red-100/70"
                    : "bg-white/70"
                }`}
              >

                <div className="flex items-center justify-between mb-3">

                  {editingId === note.id ? (

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />

                  ) : (

                    <div>
                      <h2 className="text-xl font-semibold">
                        {note.title}
                      </h2>

                      {note.ownerId !== userId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Shared by: {note.owner.email}
                        </p>
                      )}
                    </div>
                  )}
                    
                  
                  

                  <div className="flex items-center">

                    <button
                      onClick={() =>
                        togglePin(note.id)
                      }
                      className="text-xl"
                    >
                      {note.isPinned
                        ? "📌"
                        : "📍"}
                    </button>

                    <button
                      onClick={() =>
                        toggleLock(note.id)
                      }
                      className="text-xl ml-3"
                    >
                      {note.isLocked
                        ? "🔒"
                        : "🔓"}
                    </button>
                  </div>
                </div>

                {editingId === note.id ? (

                  <textarea
                    value={editContent}
                    onChange={(e) =>
                      setEditContent(
                        e.target.value
                      )
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />

                ) : note.isLocked ? (

                  <p className="text-gray-500 italic">
                    🔒 This note is locked
                  </p>

                ) : (

                  <p className="text-gray-600">
                    {note.content}
                  </p>
                )}

                {note.isLocked && (
                  <p className="mt-3 text-sm">
                    🔒 Locked
                  </p>
                )}

                {editingId === note.id ? (

                  <button
                    onClick={() =>
                      updateNote(note.id)
                    }
                    className="mt-4 mr-3 bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>

                ) : (

                  <button
                    onClick={() =>
                      startEditing(note)
                    }
                    className="mt-4 mr-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() =>
                    shareNote(note.id)
                  }
                  className="mt-4 mr-3 bg-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Share
                </button>
                <button
                  onClick={() =>
                    deleteNote(note.id)
                  }
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;