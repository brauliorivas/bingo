import { useEffect, useRef, useState } from 'react';
import './App.css'

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const userUUID = crypto.randomUUID();
const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const wsUrl = `${protocol}://${SERVER_URL}/ws/${userUUID}`;

function App() {
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);
  const [showStartModal, setShowStartModal] = useState(true);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => setSocketReady(true);
    socket.onclose = () => setSocketReady(false);

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  function registerUser(formData) {
    if (!socketReady) return;

    socketRef.current.send(
      JSON.stringify({ user: formData.get("name") })
    );

    setShowStartModal(false);
  }

  return (
    <>
      {showStartModal && (
        <main>
          <h1>Bingo</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerUser(new FormData(e.currentTarget));
            }}
          >
            <input name="name" />
            <button type="submit">Submit</button>
          </form>

        </main>
      )}
      <main>

      </main>
    </>
  )
}

export default App
