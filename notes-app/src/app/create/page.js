'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CreateNote = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateNote = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:4000/notes', {
                title,
                description: content,
            });
            console.log('New Note:', response.data);
            router.push('/'); // Redirect after successful creation
        } catch (error) {
            console.error('Error creating note:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600">
            <div className="container mx-auto max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Create a New Note</h1>
                <form onSubmit={handleCreateNote} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title:
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content:
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        ></textarea>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNote;
