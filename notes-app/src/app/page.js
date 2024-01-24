
'use client'
import Link from 'next/link';
import styles from '../app/styles/home.module.css';
import CustomModal from './Components/Modal';
import axios from 'axios';
import { useState , useEffect} from 'react';

const Home = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDesc] = useState('');

 
  const deleteNote = async (noteId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/notes/${noteId}`);
      console.log(response.data); 
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  const updateNote = async (noteId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:4000/notes/${selectedNote.id}`, {title:newTitle, description:newDescription});
      console.log(response.data); 
      closeEditModal()
    } catch (error) {
      console.error('Error updating note:', error);
     
    }
  };
  
  const handleDeleteNote = (noteId) => {
    
    deleteNote(noteId);
  };
  const openEditModal = (note) => {
    fetchNoteForEditing(note.id)
    
    setEditModalOpen(true);
  };
  const fetchNoteForEditing = async (noteId) => {
    try {
      const response = await axios.get(`http://localhost:4000/notes/${noteId}`);
      response.data; 
      setSelectedNote(response.data);
      console.log(selectedNote)
    } catch (error) {
      console.error('Error fetching note for editing:', error);
      return null;
    }
  };
  const openDeleteModal = (note) => {
    setSelectedNote(note);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedNote(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedNote(null);
  };
  useEffect(() => {
  
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [updateNote]); 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className={`container mx-auto ${styles.container}`}>
        <h1 className="text-4xl font-bold text-white mb-4">Notes App</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.id} className={`note ${styles.note}`}>
              <h2 className="text-2xl font-bold mb-2 text-black">{note.title}</h2>
              <p className="text-black">{note.description}</p>
              <div className={`actions ${styles.actions}`}>
                <button onClick={() => openEditModal(note)} className="btn btn-primary">
                  Edit
                </button>
                <button onClick={() => handleDeleteNote(note.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/create">
          <p className="btn btn-primary mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
            Create Note
          </p>
        </Link>
        
        <CustomModal
          isOpen={editModalOpen}
          onRequestClose={closeEditModal}
          title="Edit Note"
        >
          {selectedNote && (
            <>
            <div className="space-y-2">
            <label htmlFor="editedTitle" className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <input
              type="text"
              id="editedTitle"
             defaultValue={selectedNote.title}
             onChange={(e)=> setNewTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="editedDescription" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              id="editedDescription"
              defaultValue={selectedNote.description}
              rows="4"
              onChange={(e)=> setNewDesc(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div className="flex justify-center">
  <button
    onClick={()=> updateNote()}
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full mt-4"
  >
    Edit
  </button>
</div>
          </>
          )}
        </CustomModal>
      
      </div>
    </div>
  );
};

export default Home;
