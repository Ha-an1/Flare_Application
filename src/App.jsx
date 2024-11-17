import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  const [isListOpen, setIsListOpen] = useState(true); // Toggle state for List
  const [isDetailOpen, setIsDetailOpen] = useState(true); // Toggle state for Detail

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  const toggleList = () => {
    setIsListOpen((prev) => !prev); // Toggle the List open/close
  };

  const toggleDetail = () => {
    setIsDetailOpen((prev) => !prev); // Toggle the Detail open/close
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          {currentUser ? (
            <>
              <Route path="/" element={<><List />{chatId && <Chat />}{chatId && <Detail />}</>} />
              <Route path="*" element={<Navigate to="/" replace />} /> 
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Navigate to="/login" replace />} /> 
            </>
          )}
        </Routes>
        <Notification />
      </div>
    </Router>
  );
};

export default App;
