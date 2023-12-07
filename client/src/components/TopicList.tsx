import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, List, ListItem, Collapse } from '@mui/material';

const TopicList = () => {
    const navigate = useNavigate();

    const [open, setOpen] = useState<Record<string, boolean>>({});

    const handleClick = (menuName: string) => {
        setOpen((prevOpen) => ({ ...prevOpen, [menuName]: !prevOpen[menuName] }));
    };

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const menuItems = {
        // trees: ["Oak", "Spruce", "Birch"],
        // rocks: ["Amethyst", "Gold", "Diamond"],
        // plants: ["Roses", "Ferns", "Kelp"],
        phonetics: ["Transcription"],
        phonology: ["Phonological Rules"],
        syntax: ["Syntax Trees"],
        semantics: ["Entailment vs. Implicature"],
        pragmatics: ["Maxims"]
        // Add other categories and their items here
    };

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <List sx={{ width: '80%' }}>
            {Object.entries(menuItems).map(([key, values]) => (
            <React.Fragment key={key}>
                <ListItem disablePadding>
                <Button
                    variant="outlined"
                    onClick={() => handleClick(key)}
                    fullWidth
                    sx={{
                    width: '100%', // Full width relative to parent List
                    justifyContent: 'space-between',
                    margin: '6px'
                    }}
                >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </Button>
                </ListItem>
                <Collapse in={open[key] || false} timeout="auto" unmountOnExit>
                <Box border={1} borderColor="grey.300" mx={2} my={1}>
                    {values.map((value) => (
                    <ListItem 
                        button 
                        key={value} 
                        onClick={() => handleNavigate(`/question-bank/${key}/${value}`)}
                        sx={{
                        width: '100%', // Full width for the ListItem
                        }}
                    >
                        {value}
                    </ListItem>
                    ))}
                </Box>
                </Collapse>
            </React.Fragment>
            ))}
        </List>
        </Box>
    );
};

export default TopicList;