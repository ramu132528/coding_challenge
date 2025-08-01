import React from 'react';
import Navbar from './Navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #A8E6CF, #D0F0C0)',
        }}
      >
        <h1 className="display-4 fw-bold mb-3">✨ Task Management ✨</h1>
        <p className="lead" style={{ maxWidth: '600px' }}>
          Welcome to your simple and powerful Task Manager. <br />
          Here you can add, edit, update, and track tasks easily.
          Stay organized and productive every day!
        </p>
      </div>
    </div>
  );
}
