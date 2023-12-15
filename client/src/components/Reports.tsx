import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define an interface for report data
interface Report {
  id: number;
  topic_id: string;
  question_content: string;
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

  useEffect(() => {
    fetchAllReports();
  }, []); // Fetch reports when the component mounts

  return (
    <Box padding="16px">
        <Box display="flex" flexDirection="column" alignItems="center">
            <Button variant="outlined" sx={{ margin:"20px" }} onClick={() => { navigate('/') }}>Back to Menu</Button>
        </Box>
        <h1>Reports</h1>
        <ul>
            {reports.map((report) => (
                <li key={report.id}>
                    <h2>{report.topic_id}</h2>
                    <p>Question: {report.question_content}</p>
                    <p>Content: {report.content}</p>
                    <p>Resolved: {report.is_resolved ? 'Yes' : 'No'}</p>
                </li>
            ))}
        </ul>
    </Box>
  );
};

export default Reports;
