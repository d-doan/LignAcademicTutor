import { Box, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the type for a code object
interface Code {
    code: string;
    is_used: boolean;
}

const GenerateCodes: React.FC = () => {
    const [codes, setCodes] = useState<Code[]>([]);
    const navigate = useNavigate();

    const generateCode = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        // Send a POST request to your backend to generate a code
        const response = await fetch('/admin/generate_code', {
            method: 'POST',
        });

        if (response.status === 200) {
            const data = await response.json();
            setCodes(data); // Update the state with the generated code
        } else {
            // Handle the error case
            console.error('Error generating code:', response.statusText);
        }
        } catch (error) {
        console.error('Error generating code:', error);
        }
    };

    useEffect(() => {
        // Fetch existing codes from your backend and update the 'codes' state
        // You can use the 'setCodes' function to update the state with the fetched data
        const fetchCodes = async () => {
            try {
                const response = await fetch('/admin/generate_code', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        // Add headers if needed (e.g., authentication token)
                    },
                });

                if (response.ok) {
                    const data: Code[] = await response.json();
                    setCodes(data);
                } else {
                    // Handle error if the request fails
                    console.error('Failed to fetch codes');
                }
            } catch (error) {
                // Handle network or other errors
                console.error('Error fetching codes:', error);
            }
        };

        // Call the fetchCodes function when the component mounts
        fetchCodes();
    }, []);

    return (
        <div>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Button variant="outlined" sx={{ margin:"20px" }} onClick={() => { navigate('/') }}>Back to Menu</Button>
                <h1>Generate New Instructor Registration Code</h1>
            </Box>
            
            <button onClick={generateCode}>Generate Code</button>

            <h2>Existing Codes</h2>
            <ul>
                {codes.map((code, index) => (
                    <li key={index}>
                        {code.code} - {code.is_used ? 'Used' : 'Unused'}
                    </li>
                ))}
            </ul>

            {/* Navigation links */}
            {/* Include your navigation component here */}
        </div>
    );
};

export default GenerateCodes;
