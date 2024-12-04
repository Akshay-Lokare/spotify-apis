import React from 'react';
import '../App.css';

export default function NotFound() {
  return (
    <div className='not-found'>
    <h3 className="not-found-h3">404 Error</h3>
    <p className="not-found-p">This page does not exist. <a href="/" className='not-found-a'>Go Back Home.</a></p>
    </div>
  )
}
