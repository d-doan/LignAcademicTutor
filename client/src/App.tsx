import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import MyLinkComponent from './components/TopicList';
import TopicList from './components/QuestionBank';
import LoginPage from './components/LoginPage';
import CreateAccountPage from './components/CreateAccountPage';

interface User {
    username: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);
    
    // Define the function
    const testFlaskConnection = async () => {
        try {
        const response = await fetch('/test');
        const data = await response.json();
        console.log(data); // Or display it in your UI
        } catch (error) {
        console.error('Error fetching from Flask:', error);
        }
    };

    // Trigger on component mount
    useEffect(() => {
        testFlaskConnection();

        // Get current user if logged in
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/auth/current-user', {
                    method: 'GET',
                    credentials: 'include',  // if your backend relies on cookies
                    // headers: { Authorization: `Bearer ${token}` }, // if using token-based auth
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Handle the case where the user is not logged in
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
                setUser(null);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <Router>
        <TopBar user={user} />
        <Routes>
            <Route path="/" element={<MyLinkComponent />} />
            {/* <Route path="/your-target-path" element={<YourTargetComponent />} /> */}
            <Route path="/question-bank/:topic" element={<TopicList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            {/* Other routes */}
        </Routes>
        </Router>
    );
}

export default App;
