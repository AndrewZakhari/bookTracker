"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_image_url: string;
  user_book_id?: number;
  status?: string;
  book?: {
    id: number;
    google_books_id: string;
    title: string;
    author: string;
    published_date: string;
    thumbnail_url: string;
  };
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchLibrary = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/library', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBooks(data as any[]);
        } else {
          setError('Failed to fetch library');
        }
      } catch (err) {
        setError('An error occurred');
      }
    };

    fetchLibrary();
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/books/search?q=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data as any[]);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleAddBook = async (book: Book) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://127.0.0.1:5000/api/library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          google_books_id: book.id,
          title: book.title,
          authors: book.author ? book.author.split(', ') : [],
          published_date: '', // Not available from search result in this implementation
          thumbnail_url: book.cover_image_url,
        }),
      });

      if (res.ok) {
        // Refetch library to get the new book with user_book_id
        const fetchLibrary = async () => {
          try {
            const res = await fetch('http://127.0.0.1:5000/api/library', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              setBooks(data);
            } else {
              setError('Failed to fetch library');
            }
          } catch (err) {
            setError('An error occurred');
          }
        };
        fetchLibrary();
      } else {
        setError('Failed to add book');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleDeleteBook = async (userBookId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/library/${userBookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBooks((books as any[]).filter((book) => book.user_book_id !== userBookId));
      } else {
        setError('Failed to delete book');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleUpdateBookStatus = async (userBookId: number, status: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/library/${userBookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setBooks(
          (books as any[]).map((book) =>
            book.user_book_id === userBookId ? { ...book, status } : book
          )
        );
      } else {
        setError('Failed to update book status');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Search for Books</h2>
            <form onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Search by title or author"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                >
                  Search
                </button>
              </div>
            </form>
            {searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Search Results</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {searchResults.map((book) => (
                    <li key={book.id} className="bg-gray-50 p-4 rounded-lg shadow">
                      <img src={book.cover_image_url} alt={book.title} className="w-full h-48 object-cover mb-4 rounded" />
                      <h4 className="font-bold">{book.title}</h4>
                      <p className="text-gray-600">{book.author}</p>
                      <button
                        onClick={() => handleAddBook(book)}
                        className="mt-2 w-full bg-green-500 text-white py-1 rounded-lg hover:bg-green-600"
                      >
                        Add to Library
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Your Books</h2>
            {books.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(books as any[]).map((book) => (
                  <li key={book.user_book_id} className="bg-white p-4 rounded-lg shadow">
                    <img src={book.book?.thumbnail_url} alt={book.book?.title} className="w-full h-48 object-cover mb-4 rounded" />
                    <h4 className="font-bold">{book.book?.title}</h4>
                    <p className="text-gray-600">{book.book?.author}</p>
                    <div className="mt-4">
                      <select
                        value={book.status}
                        onChange={(e) => handleUpdateBookStatus(book.user_book_id!, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      >
                        <option value="to_read">To Read</option>
                        <option value="reading">Reading</option>
                        <option value="read">Read</option>
                      </select>
                      <button
                        onClick={() => handleDeleteBook(book.user_book_id!)}
                        className="mt-2 w-full bg-red-500 text-white py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Your library is empty.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
