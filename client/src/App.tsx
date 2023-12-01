import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import MyLinkComponent from './components/ButtonReroute';
import QuestionBank from './components/QuestionBank';
import LoginPage from './components/LoginPage';
import CreateAccountPage from './components/CreateAccountPage';

import logo from './logo.svg';
import './App.css';

function App() {
    const handleLogin = () => {
        // Implement your login logic here, or pass down from a context/provider if needed
    };

    return (
        <Router>
        <TopBar onLogin={handleLogin} />
        <Routes>
            <Route path="/" element={<MyLinkComponent />} />
            {/* <Route path="/your-target-path" element={<YourTargetComponent />} /> */}
            <Route path="/question-bank/:topic" element={<QuestionBank />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            {/* Other routes */}
        </Routes>
        </Router>
    );
}

export default App;
