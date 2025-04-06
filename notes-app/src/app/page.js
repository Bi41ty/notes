'use client'
import Link from 'next/link';
import styles from '../app/styles/home.module.css';
import CustomModal from './Components/Modal';
import axios from 'axios';
import { useState, useEffect } from 'react';

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
            const response = await axios.put(`http://localhost:4000/notes/${selectedNote.id}`, { title: newTitle, description: newDescription });
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
            setSelectedNote(response.data);
            console.log(selectedNote);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600 p-6">
            <div className={`container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-lg ${styles.container}`}>
                <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Notes App</h1>
                <ul>
                    {notes.map((note) => (
                        <li key={note.id} className="bg-gray-50 rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-700">{note.title}</h2>
                                <p className="text-gray-600">{note.description}</p>
                            </div>
                            <div className="space-x-4">
                                <button
                                    onClick={() => openEditModal(note)}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <Link href="/create">
                    <p className="w-full text-center bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
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
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="editedTitle" className="block text-sm font-medium text-gray-700">
                                        Title:
                                    </label>
                                    <input
                                        type="text"
                                        id="editedTitle"
                                        defaultValue={selectedNote.title}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="editedDescription" className="block text-sm font-medium text-gray-700">
                                        Description:
                                    </label>
                                    <textarea
                                        id="editedDescription"
                                        defaultValue={selectedNote.description}
                                        rows="4"
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => updateNote()}
                                        className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </CustomModal>
            </div>
        </div>
    );
};

export default Home;
