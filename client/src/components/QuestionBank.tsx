import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Paper, Button, IconButton } from '@mui/material';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';

interface RouteParams {
    [key: string]: string | undefined;
}

// Define the structure for question and options
interface Question {
    id: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

// Side panel props
type SidePanelProps = {
    isVisible: boolean;
    onQuestionSelect: (index: number) => void;
};

const QuestionBank = () => {
    const navigate = useNavigate();
    const params = useParams<RouteParams>();
    const topic = params.topic ?? 'default';
    const subtopic = params.subtopic ?? 'default';

// generated questions
const [questionList, setQuestionList] = useState<Question[]>([]);
const [dataLoaded, setDataLoaded] = useState(false);
const [hasEffectRun, setHasEffectRun] = useState(false);

// question submission
    const [selectedOption, setSelectedOption] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        setSubmitted(false); // Reset submission state on option change
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const isAnswerCorrect = selectedOption === questionList[currentQuestionIndex].correctAnswer;
        setIsCorrect(isAnswerCorrect);

        // Always update the answeredQuestions with the current submission
        setAnsweredQuestions(prev => {
            const currentAnswer = prev.get(currentQuestionIndex);
            return new Map(prev).set(currentQuestionIndex, { 
                selectedOption, 
                isCorrect: isAnswerCorrect,
                wasEverCorrect: currentAnswer?.wasEverCorrect || isAnswerCorrect, // Set wasEverCorrect to true if it was ever correct before or is correct now
                isFlagClicked: isFlagClicked,
            });
        });
    };
    
// handle question access
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const exampleQuestion = questionList[currentQuestionIndex];
    const [answeredQuestions, setAnsweredQuestions] = useState(new Map<number, { selectedOption: string; isCorrect: boolean; wasEverCorrect: boolean; isFlagClicked: boolean }>());
    const [lastReachedQuestionIndex, setLastReachedQuestionIndex] = useState(0);

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
        if (currentQuestionIndex < questionList.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setLastReachedQuestionIndex(Math.max(lastReachedQuestionIndex, currentQuestionIndex + 1));
            setSubmitted(false);
            setSelectedOption("");
        }
    };

    // The "Next" button should be disabled only if the question hasn't been answered correctly at least once
    const isNextButtonDisabled = !answeredQuestions.get(currentQuestionIndex)?.wasEverCorrect || currentQuestionIndex === questionList.length - 1;;

// Instructor Feedback constants
    const [user, setUser] = useState(null);
    // TODO: set default to student
    const [userRole, setUserRole] = useState('instructor'); // Default to student
    const [feedbackText, setFeedbackText] = useState('');
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset the height to auto to calculate the actual height needed
        const computedHeight = Math.max(textarea.scrollHeight, 40); // Set a minimum height
        textarea.style.height = computedHeight + 'px';
        setFeedbackText(textarea.value);
    };

    // Get current user (null if student)
    const fetchCurrentUser = async () => {
        try {
          const response = await fetch('/auth/current-user', {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
    
            // Set the userRole to 'instructor' if there is a user
            setUserRole('instructor');
          } else {
            setUser(null);
            setUserRole('student'); // No user, set to student
          }
        } catch (error) {
          console.error('Error fetching current user:', error);
          setUser(null);
          setUserRole('student'); // Error, set to student
        }
    };

    const handleFeedbackSubmit = async () => {
        // Make a POST request to your Flask backend to submit the text
        try {
          const response = await fetch('/auth/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subtopic, feedbackText }), // Send the text as JSON
          });
          if (response.ok) {
            // Handle successful submission, show a success message
            window.alert('Feedback submitted successfully.');
          } else {
            // Handle submission error, show an error message
            window.alert('Error submitting feedback: ' + response.statusText);
          }
        } catch (error: any) {
          // Handle network or other errors, show an error message
          window.alert('Error submitting feedback: ' + error.message);
        }
    };

    

// Side Panel logic
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

    const toggleSidePanel = () => {
        setIsSidePanelVisible(!isSidePanelVisible);
    };

    const SidePanel: React.FC<SidePanelProps> = ({ isVisible, onQuestionSelect }) => {
        if (!isVisible) return null;
      
        return (
            <div style={{ width: '200px', height: '350px', overflowY: 'auto' }}>
                {questionList.map((question, index) => (
                    <Button 
                        key={question.id} 
                        onClick={() => onQuestionSelect(index)}
                        disabled={index > lastReachedQuestionIndex}
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
                    </Button>
                ))}
            </div>
        );
    };

    // display reached questions in sidebar
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
// Report flag
    const [isFlagClicked, setIsFlagClicked] = useState(false);
    const handleReportClick = () => {
        setIsFlagClicked(!isFlagClicked);
    };

// Generate questions
    const fetchAndAddQuestions = async () => {
        // Check if the question list is empty or if the user is at the last question
        if (questionList.length === 0) { // || currentQuestionIndex === questionList.length - 1 when we get persistence across page refresh working
            const subtopicMappings: { [key: string]: string } = {
                'Transcription': 'transcription',
                'Phonological Rules': 'phonrules',
                'Syntax Trees': 'trees',
                'Entailment vs. Implicature': 'entailment',
                'Maxims': 'maxims',
            };
            const formattedSubtopic = subtopicMappings[subtopic] || subtopic.toLowerCase();
            try {
                const response = await fetch(`/gpt/${topic}/${formattedSubtopic}`, {
                    method: 'GET',
                    credentials: 'include',  // if your backend relies on cookies
                });
                if (response.ok) {
                    const questionData = await response.json();
                    console.log("questionData: ", questionData);
                    const newQuestions: Question[] = parseGPTQuestions(questionData);
                    console.log('Fetched and parsed questions:', newQuestions);
                    setQuestionList(newQuestions); // Update questionList state
                    setDataLoaded(true); // Mark the data as loaded
                } else {
                    // Handle the case where there is an error
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } 
        }
    };

    const parseGPTQuestions = (response: { questions: any[] }): Question[] => {
        const questions: Question[] = [];
    
        response.questions.forEach((questionObject) => {
            const { id, question, choices, correctAnswer, explanation } = questionObject;
            if (Array.isArray(choices) && typeof question === 'string' && typeof correctAnswer === 'string' && typeof explanation === 'string') {
                const questionText = question.trim();
                const options = choices.map((choice: string) => choice.trim());
    
                questions.push({
                    id,
                    questionText,
                    options,
                    correctAnswer,
                    explanation,
                });
            }
        });
    
        return questions;
    };
    
    

// Call fetchAndAddQuestions when the component mounts, only once
// Since we are using React.StrictMode (check index.tsx), components are mounted twice
// a.k.a. we will fetch questions twice
// https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode
    useEffect(() => {
        if (!hasEffectRun) {
            fetchAndAddQuestions();
            // const newQuestions: Question[] = parseGPTQuestions(mockResponse);
            // console.log('Fetched and parsed questions:', newQuestions);
            // setQuestionList(newQuestions); // Update questionList state
            // setDataLoaded(true); // Mark the data as loaded
            setHasEffectRun(true); // Set the flag to true to prevent further runs
        }
    }, [hasEffectRun]);


// Things to do when refreshing page:
// When changing the question, set the selected option to the one stored in the state
// Check if user is logged in (instructor)
    useEffect(() => {
        const answered = answeredQuestions.get(currentQuestionIndex);
        if (answered) {
            setSelectedOption(answered.selectedOption);
            setSubmitted(true);
            setIsCorrect(answered.isCorrect);
            setIsFlagClicked(answered.isFlagClicked)
        } else {
            // Reset for unanswered questions
            setSelectedOption("");
            setSubmitted(false);
            setIsCorrect(false);
            setIsFlagClicked(false);
        }
        fetchCurrentUser();
    }, [currentQuestionIndex, answeredQuestions]);

    // // Load answeredQuestions and selectedOption from localStorage on component mount
    // useEffect(() => {
    //     const savedAnsweredQuestions = localStorage.getItem('answeredQuestions');
    //     const savedCurrentQuestionIndex = localStorage.getItem('currentQuestionIndex');
        
    //     if (savedAnsweredQuestions) {
    //       setAnsweredQuestions(new Map(JSON.parse(savedAnsweredQuestions)));
    //     }
    //     if (savedCurrentQuestionIndex) {
    //       setCurrentQuestionIndex(JSON.parse(savedCurrentQuestionIndex));
    //     }
    // }, []);

    // // Save answeredQuestions and selectedOption to localStorage whenever they change
    // useEffect(() => {
    //     localStorage.setItem('answeredQuestions', JSON.stringify(Array.from(answeredQuestions.entries())));
    //     localStorage.setItem('currentQuestionIndex', JSON.stringify(currentQuestionIndex));
    // }, [answeredQuestions, currentQuestionIndex]);

    // // Reset answeredQuestions and selectedOption when needed
    // const resetState = () => {
    //     localStorage.removeItem('answeredQuestions');
    //     localStorage.removeItem('selectedOption');
    //     setAnsweredQuestions(new Map());
    //     setSelectedOption('');
    // };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
        {/* <Button variant="outlined" sx={{ margin: "20px" }} onClick={() => { resetState(); navigate('/') }}>Back to Menu</Button> */}
        <Button variant="outlined" sx={{ margin: "20px" }} onClick={() => { navigate('/') }}>Back to Menu</Button>
            <h2 style={{ margin: '0px' }}>{subtopic.charAt(0).toUpperCase() + subtopic.slice(1)} Question Bank</h2>
            {/* Content based on the topic */}
            {dataLoaded ? (
                questionList.length === 0 ? (
                    <Typography variant="body1">No questions available in this topic.</Typography>
                ) : (
                    <div style={{ display: 'flex', alignItems:"center" }}>
                        <IconButton
                            onClick={handleReportClick} // Add your report click handler here
                            sx={{ color: isFlagClicked ? 'red' : 'default' }}
                            aria-label="Report"
                        >
                            <FlagOutlinedIcon />
                        </IconButton>
                        <Paper style={{ width:'500px', height: '300px', padding: '20px', margin: '20px', overflowY: 'auto' }}>
                            <FormControl component="fieldset" style={{ width: '100%' }}>
                                <FormLabel component="legend">
                                    <Typography variant="h6">{exampleQuestion.id}. {exampleQuestion.questionText}</Typography>
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
                                        &lt;Previous
                                    </Button>
                                    
                                    <Button variant="contained" style={{ width:"100px"}} color="primary" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    
                                    <Button variant="contained" style={{ width:"100px"}} onClick={handleNext} disabled={isNextButtonDisabled}>
                                        Next&gt;
                                    </Button>

                                    <Button variant="contained" style={{ width:"250px", marginLeft: 'auto' }} onClick={toggleSidePanel}>
                                        View Question List
                                    </Button>
                                </Box>
                                {submitted && (
                                    <Typography style={{ marginTop: '20px' }}>
                                        {isCorrect ? 'Correct Answer!' : 'Incorrect Answer. ' + exampleQuestion.explanation}
                                    </Typography>
                                )}
                            </FormControl>
                        </Paper>
                        <SidePanel isVisible={isSidePanelVisible} onQuestionSelect={handleQuestionSelect}/>
                    </div>
                )
            ) : (
                // Render a loading indicator while waiting for data
                <p>Loading...</p>
            )}
            {userRole === 'instructor' && (
                <Paper elevation={3} style={{ width: '70%', padding: '16px', margin: '16px', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">Instructor Feedback</Typography>
                <textarea
                  value={feedbackText}
                  onChange={handleTextChange}
                  placeholder="Type your feedback here..."
                  style={{
                    width: '95%',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'none', // Prevent resizing handle
                    overflowY: 'hidden', // Hide vertical scrollbar
                    minHeight: '40px', // Minimum height
                    fontFamily: 'Arial, sans-serif',
                  }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFeedbackSubmit}
                    style={{ margin: '10px', alignSelf: 'flex-end' }}
                    disabled={!feedbackText}
                >
                Submit
                </Button>
              </Paper>
            )}
        </Box>
    );
};

export default QuestionBank;