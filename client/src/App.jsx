import { io } from "socket.io-client";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@mui/material";

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [allMessages, setAllmessages] = useState([]);
  const [roomName,setRoomName] = useState("")

  const socket = useMemo(() => {
    return io("http://localhost:3000/"); // backend url
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    socket.emit("join-room",roomName)
    setRoomName("")
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });
    socket.on("receive-messsage", (data) => {
      console.log(data);
      setAllmessages((mess) => [...mess, data]);
    });
    socket.on("welcome", (data) => {
      console.log(data);
    });
  });

  return (
    <Container maxWidth="sm">
      <div>Welcom to soket.io</div>
      <p>ID: {socketId}</p>
      <form onSubmit={handleJoin}>
        <input type="text" placeholder="Room Name" value={roomName} onChange={e=>setRoomName(e.target.value)} />
        <button>Join</button>
      </form>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="message"
        />
        <button>Send</button>
      </form>

      <ul>
        {allMessages.length &&
          allMessages.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
    </Container>
  );
}

export default App;
