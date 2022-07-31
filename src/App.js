import React, { useEffect } from 'react';
import './App.css';
import Login from './Login';
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import Player from './Player';
import { useStateProviderValue } from "./StateProvider"

const spotify = new SpotifyWebApi()

function App() {
  const [{ token}, dispatch] = useStateProviderValue();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;

    if (_token) {
      spotify.setAccessToken(_token);

      dispatch({
        type: "SET_TOKEN",
        token: _token
      });

      spotify.getPlaylist('37i9dQZF1E34Ucml4HHx1w').then(Response=>
        dispatch({
          type:"SET_DISCOVER_WEEKLY",
          discover_weekly: Response,
        })
         ) 

         spotify.getMyTopArtists().then((response) =>
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: response,
        })
      );

      dispatch({
        type: "SET_SPOTIFY",
        spotify: spotify,
      });

      spotify.getMe().then((user) =>{
        dispatch({
          type: 'SET_USER',
          user: user,
        });
      });
      }
      spotify.getUserPlaylists().then((plaaylists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          plaaylists: plaaylists,
        });
      });
  },[token, dispatch]);

  return (
    <div className="app">
      {!token && <Login/>}
       {token && <Player spotify={spotify} />}
    </div>
  );
}

export default App;