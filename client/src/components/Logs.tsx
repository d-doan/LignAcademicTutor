import { Box, Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define an interface for report data
interface Feedback {
  id: number;
  topic_id: string;
  feedback_messages: string;
}

// Array of topic_ids
const topicIds: string[] = ['transcription', 'phonrules', 'trees', 'entailment', 'maxims'];

const Logs: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const navigate = useNavigate();

    // Function to fetch reports for a specific topic_id
    async function fetchReportsForTopic(topicId: string): Promise<Feedback[]> {
        try {
        const response = await fetch(`/gpt/feedback/${topicId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch reports for topic ${topicId}`);
        }
        return (await response.json()) as Feedback[]; // Assuming the response is an array of reports
        } catch (error: any) {
        console.error(`Error fetching reports for topic ${topicId}: ${error.message}`);
        return [];
        }
    }

    // Function to fetch reports for all topic_ids
    async function fetchAllFeedbacks(): Promise<void> {
        const allFeedbacks: Feedback[] = [];

        for (const topicId of topicIds) {
        const reports = await fetchReportsForTopic(topicId);
        allFeedbacks.push(...reports);
        }

        setFeedbacks(allFeedbacks);
    }

    // Function to group reports by topic_id
    function groupFeedbacksByTopic(feedbacks: Feedback[]): Record<string, Feedback[]> {
        const groupedFeedbacks: Record<string, Feedback[]> = {};

        for (const feedback of feedbacks) {
        if (!groupedFeedbacks[feedback.topic_id]) {
            groupedFeedbacks[feedback.topic_id] = [];
        }
        groupedFeedbacks[feedback.topic_id].push(feedback);
        }

        return groupedFeedbacks;
    }

    const groupedFeedbacks = groupFeedbacksByTopic(feedbacks);

    // translate topic_id to subtopic name
    const subtopicMappings: { [key: string]: string } = {
        'transcription': 'Transcription',
        'phonrules': 'Phonological Rules',
        'trees': 'Syntax Trees',
        'entailment': 'Entailment vs. Implicature',
        'maxims': 'Maxims',
    };
    const idToSubtopic = (id: string) => {
        return subtopicMappings[id] || id.toLowerCase();
    }

    // Function to update feedback messages
    async function updateFeedbackMessage(feedbackId: number, newMessage: string): Promise<void> {
        try {
        const response = await fetch(`/gpt/feedback/edit/${feedbackId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ feedback_text: newMessage }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update feedback ${feedbackId}`);
        }

        // Update the feedback in the state with the new message
        setFeedbacks((prevFeedbacks) =>
            prevFeedbacks.map((feedback) =>
            feedback.id === feedbackId ? { ...feedback, feedback_messages: newMessage } : feedback
            )
        );
        } catch (error: any) {
        console.error(`Error updating feedback ${feedbackId}: ${error.message}`);
        }
    }

    // Function to delete feedback by ID
    async function deleteFeedbackById(feedbackId: number): Promise<void> {
        try {
        const response = await fetch(`/gpt/feedback/delete/${feedbackId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete feedback ${feedbackId}`);
        }

        // Remove the deleted feedback from the component's state
        setFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => feedback.id !== feedbackId));
        } catch (error: any) {
            console.error(`Error deleting feedback ${feedbackId}: ${error.message}`);
        }
    }

    useEffect(() => {
        fetchAllFeedbacks();
    }, []); // Fetch reports when the component mounts

    return (
        <Box padding="16px">
            <Box display="flex" flexDirection="column" alignItems="center">
                <Button variant="outlined" sx={{ margin:"20px" }} onClick={() => { navigate('/') }}>Back to Menu</Button>
            </Box>
            <h1>Instructor Feedback</h1>
            {Object.entries(groupedFeedbacks).map(([topicId, topicFeedbacks]) => (
                <div key={topicId}>
                    <h2>{idToSubtopic(topicId)}</h2>
                    <ul>
                        {topicFeedbacks.map((feedback) => (
                        <li key={feedback.id} className="report-item">
                            <Paper elevation={3} style={{ margin:'8px' }} className="report-paper">
                                <Box p={2}>
                                    <Typography>Feedback: {feedback.feedback_messages}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2, mr: 1 }}
                                        onClick={() => {
                                            const newMessage = prompt('Edit Feedback:', feedback.feedback_messages);
                                            if (newMessage !== null) {
                                                updateFeedbackMessage(feedback.id, newMessage);
                                            }
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ mt: 2 }}
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this feedback?')) {
                                                deleteFeedbackById(feedback.id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Paper>
                        </li>
                        ))}
                    </ul>
                </div>
            ))}
        </Box>
    );
};

export default Logs;
