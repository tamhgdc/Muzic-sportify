import { useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SpinStretch } from "react-cssfx-loading";

import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import { PlayerContext } from "./context/PlayerContext";
import Player from "./components/Player";
import client from "./shared/spotify-client";
import Album from "./pages/Album";
import Playlist from "./pages/Playlist";
import Category from "./pages/Category";
import Artist from "./pages/Artist";
import Search from "./pages/Search";

enum LoadingStates {
  loading,
  finished,
  error,
}

function App() {
  const [loadingState, setLoadingState] = useState(LoadingStates.loading);
  const { playerId } = useContext(PlayerContext);

  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  useEffect(() => {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          `${import.meta.env.VITE_CLIENT_ID}:${
            import.meta.env.VITE_CLIENT_SECRET
          }`
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          setLoadingState(LoadingStates.finished);
          client.setAccessToken(data.access_token);
        } else setLoadingState(LoadingStates.error);
      })
      .catch((err) => {
        console.log(err);
        setLoadingState(LoadingStates.error);
      });
  }, []);
  if (loadingState === LoadingStates.loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <SpinStretch />
      </div>
    );
  if (loadingState === LoadingStates.error)
    return (
      <div className="flex justify-center items-center text-center h-screen">
        Something went wrong
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-144px)]">
        <Routes>
          <Route index element={<Home />} />
          <Route path="album/:id" element={<Album />} />
          <Route path="playlist/:id" element={<Playlist />} />
          <Route path="category/:id" element={<Category />} />
          <Route path="artist/:id" element={<Artist />} />
          <Route path="search" element={<Search />} />
        </Routes>
      </div>

      {!!playerId && <Player key={playerId} />}
    </>
  );
}

export default App;
