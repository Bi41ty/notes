
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/home.module.css'
import axios from 'axios';
const CreateNote = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateNote = async () => {
    try {
      const response = await axios.post('http://localhost:4000/notes', { title, description:content });
      console.log('New Note:', response.data);
      router.push('/');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className={`container mx-auto ${styles.container}`}>
        <h1 className="text-4xl font-bold text-white mb-4">Create Note</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-white">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 text-white">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            ></textarea>
          </div>
          <button
            type="button"
            onClick={handleCreateNote}
            className="btn btn-primary mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
          >
            Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
