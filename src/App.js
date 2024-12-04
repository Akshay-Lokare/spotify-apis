import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Home from './components/Home';
import Playlists from './components/Playlists';
import UserInfo from './components/UserInfo';
import TopTracks from './components/TopTracks';
import NotFound from './components/Not-Found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/home' replace />,
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/playlists',
    element: <Playlists />,
  },
  {
    path: '/user-info',
    element: <UserInfo />,
  },
  {
    path: '/top-tracks',
    element: <TopTracks />
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />

    </div>
  );
}

export default App;
