// pages/index.js
import Link from 'next/link';
import styles from '../app/styles/home.module.css';

const notes = [
  { id: 1, title: 'Note 1', content: 'This is the content of note 1.' },
  { id: 2, title: 'Note 2', content: 'This is the content of note 2.' },
  // Add more notes as needed
];

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className={`container mx-auto ${styles.container}`}>
        <h1 className="text-4xl font-bold text-white mb-4">Notes App</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.id} className={`note ${styles.note}`}>
              <h2 className="text-2xl font-bold mb-2 text-black">{note.title}</h2>
              <p className="text-black">{note.content}</p>
              <div className={`actions ${styles.actions}`}>
                <Link href={`/edit/${note.id}`}>
                  <p className="btn btn-primary">Edit</p>
                </Link>
                <Link href={`/delete/${note.id}`}>
                  <p className="btn btn-danger">Delete</p>
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/create">
          <p className="btn btn-primary mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
            Create Note
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
