import { Box, Button, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define an interface for report data
interface Report {
  id: number;
  topic_id: string;
  question_content: string;
  answer: string;
  content: string;
  is_resolved: boolean;
}

// Array of topic_ids
const topicIds: string[] = ['transcription', 'phonrules', 'trees', 'entailment', 'maxims'];

const Reports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const navigate = useNavigate();

    // Function to fetch reports for a specific topic_id
    async function fetchReportsForTopic(topicId: string): Promise<Report[]> {
        try {
        const response = await fetch(`/gpt/reports/${topicId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch reports for topic ${topicId}`);
        }
        return (await response.json()) as Report[]; // Assuming the response is an array of reports
        } catch (error: any) {
        console.error(`Error fetching reports for topic ${topicId}: ${error.message}`);
        return [];
        }
    }

    // Function to fetch reports for all topic_ids
    async function fetchAllReports(): Promise<void> {
        const allReports: Report[] = [];

        for (const topicId of topicIds) {
        const reports = await fetchReportsForTopic(topicId);
        allReports.push(...reports);
        }

        setReports(allReports);
    }

    // Function to group reports by topic_id
    function groupReportsByTopic(reports: Report[]): Record<string, Report[]> {
        const groupedReports: Record<string, Report[]> = {};

        for (const report of reports) {
        if (!groupedReports[report.topic_id]) {
            groupedReports[report.topic_id] = [];
        }
        groupedReports[report.topic_id].push(report);
        }

        return groupedReports;
    }

    const groupedReports = groupReportsByTopic(reports);

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

    // mark resolved function
    const markResolved = async (reportId: number) => {
        try {
            // Make an API request to mark the report as resolved
            const response = await fetch(`/gpt/report/mark-resolved/${reportId}`, {
                method: 'PUT',
        });
    
        if (response.ok) {
            // Update the report in the state to mark it as resolved
            setReports((prevReports) =>
                prevReports.map((report) =>
                    report.id === reportId ? { ...report, is_resolved: true } : report
                )
            );

            window.location.reload();
        } else {
            console.error(`Error marking report ${reportId} as resolved`);
        }
        } catch (error: any) {
            console.error(`Error marking report ${reportId} as resolved: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchAllReports();
    }, []); // Fetch reports when the component mounts

    return (
        <Box padding="16px">
            <Box display="flex" flexDirection="column" alignItems="center">
                <Button variant="outlined" sx={{ margin:"20px" }} onClick={() => { navigate('/') }}>Back to Menu</Button>
            </Box>
            <h1>Reports</h1>
            {Object.entries(groupedReports).map(([topicId, topicReports]) => (
                <div key={topicId}>
                    <h2>{idToSubtopic(topicId)}</h2>
                    <ul>
                        {topicReports.map((report) => (
                        <li key={report.id} className="report-item">
                            <Paper elevation={3} style={{ margin:'8px' }} className="report-paper">
                                <Box p={2}>
                                    <Typography variant="h6">Question: {report.question_content}</Typography>
                                    <Typography>Answer: {report.answer}</Typography>
                                    <Typography>Student Comment: {report.content}</Typography>
                                    <Typography>Resolved: {report.is_resolved ? 'Yes' : 'No'}</Typography>
                                    {!report.is_resolved && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => markResolved(report.id)}
                                        >
                                            Mark Resolved
                                        </Button>
                                    )}
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

export default Reports;
