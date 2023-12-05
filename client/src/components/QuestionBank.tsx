import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Paper, Button } from '@mui/material';

interface RouteParams {
    [key: string]: string | undefined;
}

// Define the structure for question and options
interface Question {
    id: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
}

// Side panel props
type SidePanelProps = {
    isVisible: boolean;
    onQuestionSelect: (index: number) => void;
};

// Example questions (this will be generated through GPT API call)
const exampleQuestions: Question[] = [
    {
      id: 1,
      questionText: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris"
    },
    {
      id: 2,
      questionText: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean"
    },
    {
      id: 3,
      questionText: "What is the most spoken language in the world?",
      options: ["English", "Mandarin", "Hindi", "Spanish"],
      correctAnswer: "Mandarin"
    },
    {
      id: 4,
      questionText: "In which continent is the Sahara Desert located?",
      options: ["Asia", "Africa", "North America", "South America"],
      correctAnswer: "Africa"
    }
  ];

const QuestionBank = () => {
    const navigate = useNavigate();
    const params = useParams<RouteParams>();
    const topic = params.topic ?? 'default';

    // submission constants
    const [selectedOption, setSelectedOption] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // current question index constants
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(new Set());
    const exampleQuestion = exampleQuestions[currentQuestionIndex];

    // Initialize state to keep track of answered questions and their selected options
    const [answeredQuestions, setAnsweredQuestions] = useState(new Map<number, { selectedOption: string; isCorrect: boolean; wasEverCorrect: boolean }>());

    // Side Panel constants
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

    // When changing the question, set the selected option to the one stored in the state
    useEffect(() => {
        const answered = answeredQuestions.get(currentQuestionIndex);
        if (answered) {
            setSelectedOption(answered.selectedOption);
            setSubmitted(true);
            setIsCorrect(answered.isCorrect);
        } else {
            // Reset for unanswered questions
            setSelectedOption("");
            setSubmitted(false);
            setIsCorrect(false);
        }
        }, [currentQuestionIndex, answeredQuestions]);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        setSubmitted(false); // Reset submission state on option change
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const isAnswerCorrect = selectedOption === exampleQuestions[currentQuestionIndex].correctAnswer;
        setIsCorrect(isAnswerCorrect);

        // Always update the answeredQuestions with the current submission
        setAnsweredQuestions(prev => {
            const currentAnswer = prev.get(currentQuestionIndex);
            return new Map(prev).set(currentQuestionIndex, { 
                selectedOption, 
                isCorrect: isAnswerCorrect,
                wasEverCorrect: currentAnswer?.wasEverCorrect || isAnswerCorrect // Set wasEverCorrect to true if it was ever correct before or is correct now
            });
        });
    };
    // The "Next" button should be disabled only if the question hasn't been answered correctly at least once
    const isNextButtonDisabled = !answeredQuestions.get(currentQuestionIndex)?.wasEverCorrect || currentQuestionIndex === exampleQuestions.length - 1;;

    // Function to navigate to the previous question
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSubmitted(false);
            setSelectedOption("");
        }
    };

    // Function to navigate to the next question
    const handleNext = () => {
        if (currentQuestionIndex < exampleQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSubmitted(false);
            setSelectedOption("");
        }
    };

    // Side Panel logic
    const toggleSidePanel = () => {
        setIsSidePanelVisible(!isSidePanelVisible);
    };

    const SidePanel: React.FC<SidePanelProps> = ({ isVisible, onQuestionSelect }) => {
        if (!isVisible) return null;
      
        return (
            <div style={{ width: '200px' /* Adjust as needed */ }}>
                {exampleQuestions.map((question, index) => (
                    <div 
                        key={question.id} 
                        onClick={() => onQuestionSelect(index)}
                        style={{
                            cursor: 'pointer', // Changes the cursor to a pointer
                            padding: '10px', // Optional: for better spacing
                            marginBottom: '5px', // Optional: space between items
                            backgroundColor: '#f0f0f0', // Optional: background color
                            borderRadius: '5px', // Optional: rounded corners
                            transition: 'background-color 0.3s', // Optional: smooth transition for hover effect
                        }}
                    >
                        Question {index + 1}
                    </div>
                ))}
            </div>
        );
    };

    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index);
        setSubmitted(false);
        setSelectedOption(answeredQuestions.get(index)?.selectedOption || "");
    };

    // Option box style
    const getOptionStyle = (option: string) => {
        let style = {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%', // Full width
            margin: '5px 0',
            borderRadius: '10px',
            boxSizing: 'border-box',
        }
        if (submitted && option === selectedOption) {
            return {
                ...style,
                backgroundColor: isCorrect ? 'green' : 'red',
                color: 'white'
            }
        }
        return {  };
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
            <Button variant="outlined" sx={{ margin: "20px" }} onClick={() => navigate('/')}>Back to Menu</Button>
            <h2 style={{ margin: '0px' }}>{topic.charAt(0).toUpperCase() + topic.slice(1)} Question Bank</h2>
            {/* Content based on the topic */}
            <div style={{ display: 'flex' }}>
                <Paper style={{ width:'70%', padding: '20px', margin: '20px',  }}>
                    <FormControl component="fieldset" style={{ width: '100%' }}>
                        <FormLabel component="legend">
                            <Typography variant="h6">{exampleQuestion.questionText}</Typography>
                        </FormLabel>
                        <RadioGroup name="questionOptions" value={selectedOption} onChange={handleOptionChange}>
                            {exampleQuestion.options.map((option, index) => (
                                <FormControlLabel 
                                key={index} 
                                value={option} 
                                control={<Radio />} 
                                label={option} 
                                style={getOptionStyle(option)}
                                />
                            ))}
                        </RadioGroup>
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Button variant="contained" style={{ width:"100px"}} onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                                Previous
                            </Button>
                            
                            <Button variant="contained" style={{ width:"100px"}} color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                            
                            <Button variant="contained" style={{ width:"100px"}} onClick={handleNext} disabled={isNextButtonDisabled}>
                                Next
                            </Button>

                            <Button variant="contained" style={{ width:"250px", marginLeft: 'auto' }} onClick={toggleSidePanel}>
                                Toggle Questions
                            </Button>
                        </Box>
                        {submitted && (
                            <Typography style={{ marginTop: '20px' }}>
                                {isCorrect ? 'Correct Answer!' : 'Incorrect Answer.'}
                            </Typography>
                        )}
                    </FormControl>
                </Paper>
                <SidePanel isVisible={isSidePanelVisible} onQuestionSelect={handleQuestionSelect} />
            </div>
        </Box>
    );
};

export default QuestionBank;