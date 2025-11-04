// Skill Test Page - Interactive Quiz for "Prove It" Feature
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';
import { onAuthStateChange } from '../services/authService';
import { runChat } from '../services/geminiService';
import Navbar from '../components/Navbar';
import BackgroundVideo from '../components/BackgroundVideo';

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8080'  // Use Flask API in development
  : 'https://placementpredictionai.onrender.com';  // Direct in production

const SkillTestPage = () => {
  const { skillName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Voice test states for Communication Skills
  const [isVoiceTest, setIsVoiceTest] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [synthesis, setSynthesis] = useState(null);
  
  // Get original values from navigation state
  const originalProbability = location.state?.originalProbability || 50;
  const originalShapValues = location.state?.originalShapValues || {};
  const originalConfidence = location.state?.originalConfidence || 50;
  const originalTrack = location.state?.originalTrack || 'General';

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Initialize speech recognition and synthesis
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
    
    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
    
    // Check if this is a voice test (Communication Skills)
    const decodedSkillName = decodeURIComponent(skillName);
    setIsVoiceTest(decodedSkillName.toLowerCase().includes('communication'));
  }, [skillName]);

  useEffect(() => {
    if (skillName && user) {
      generateTest();
    }
  }, [skillName, user]);

  const generateTest = async () => {
    try {
      setLoading(true);
      setError('');

      const decodedSkillName = decodeURIComponent(skillName);
      const isCommunication = decodedSkillName.toLowerCase().includes('communication');

      let prompt;
      if (isCommunication) {
        // Voice-based questions for communication skills
        prompt = `Generate ONLY valid JSON. No text before or after. Just pure JSON.

Create 5 communication skill questions for voice interview:

{
  "questions": [
    {
      "question_text": "Tell me about yourself and your career goals.",
      "evaluation_criteria": "Clarity, confidence, structure, relevance"
    },
    {
      "question_text": "Describe a challenging situation you faced and how you handled it.",
      "evaluation_criteria": "Problem-solving, communication clarity, confidence"
    },
    {
      "question_text": "What are your strengths in teamwork and collaboration?",
      "evaluation_criteria": "Self-awareness, articulation, examples"
    },
    {
      "question_text": "How do you handle constructive criticism?",
      "evaluation_criteria": "Emotional intelligence, communication style"
    },
    {
      "question_text": "Where do you see yourself in the next 5 years?",
      "evaluation_criteria": "Vision, clarity, professional goals"
    }
  ]
}

Return ONLY this JSON structure with 5 questions about communication skills.`;
      } else {
        // Multiple choice for other skills
        prompt = `Generate ONLY valid JSON. No explanations. No markdown. Just pure JSON.

Create 10 multiple-choice questions about "${decodedSkillName}":

{
  "questions": [
    {
      "question_text": "What is the output of print(2 ** 3) in Python?",
      "options": ["6", "8", "9", "5"],
      "correct_answer": "8"
    }
  ]
}

Make 6 easy, 3 medium, 1 hard question about ${decodedSkillName}. Return ONLY the JSON object with 10 questions.`;
      }

      console.log('🤖 Generating test for skill:', decodedSkillName);
      const response = await runChat([], prompt);
      
      console.log('📝 Raw Gemini Response:', response);
      console.log('📝 Response type:', typeof response);
      console.log('📝 Response length:', response?.length);

      // Parse the JSON response
      let parsedData;
      try {
        // First, try direct JSON parse (if response is already JSON)
        try {
          parsedData = JSON.parse(response);
          console.log('✅ Direct JSON parse successful');
        } catch (directParseError) {
          console.log('⚠️ Direct parse failed, trying extraction methods...');
          
          // Try multiple extraction methods
          let jsonString = response;
          
          // Method 1: Extract from markdown code blocks
          const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
          if (jsonMatch) {
            jsonString = jsonMatch[1];
            console.log('📦 Extracted from markdown code block');
          }
          
          // Method 2: Extract from curly braces if no code block found
          if (!jsonMatch) {
            const braceMatch = response.match(/\{[\s\S]*\}/);
            if (braceMatch) {
              jsonString = braceMatch[0];
              console.log('📦 Extracted from curly braces');
            }
          }
          
          // Clean up the string
          jsonString = jsonString.trim();
          
          console.log('🔍 Extracted JSON string (first 500 chars):', jsonString.substring(0, 500));
          
          parsedData = JSON.parse(jsonString);
          console.log('✅ Extraction and parse successful');
        }
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('❌ Full response:', response);
        setError(`Failed to parse test questions. Response: ${response.substring(0, 200)}...`);
        throw new Error('Failed to parse test questions. The AI response was not in the correct format. Please try again.');
      }

      // Validate the response structure
      if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        console.error('❌ Invalid structure:', parsedData);
        throw new Error('Invalid test format received - missing questions array');
      }

      // For voice tests, expect 5 questions; for MCQ, expect 10
      const expectedCount = isCommunication ? 5 : 10;
      if (parsedData.questions.length < expectedCount) {
        console.warn(`⚠️ Expected ${expectedCount} questions, got ${parsedData.questions.length}`);
      }
      
      // Validate question structure based on test type
      const firstQuestion = parsedData.questions[0];
      if (isCommunication) {
        // Voice test validation
        if (!firstQuestion.question_text || !firstQuestion.evaluation_criteria) {
          console.error('❌ Invalid voice question:', firstQuestion);
          throw new Error('Invalid voice question format - missing required fields');
        }
        console.log('✅ Voice test validation passed');
      } else {
        // MCQ test validation
        if (!firstQuestion.question_text || !firstQuestion.options || !firstQuestion.correct_answer) {
          console.error('❌ Invalid MCQ question:', firstQuestion);
          throw new Error('Invalid MCQ format - missing required fields');
        }
        console.log('✅ MCQ test validation passed');
      }

      // Set the voice test flag based on skill type
      setIsVoiceTest(isCommunication);
      
      console.log('✅ Successfully parsed', parsedData.questions.length, 'questions');
      console.log('✅ Test type:', isCommunication ? 'Voice Test' : 'MCQ Test');
      setQuestions(parsedData.questions);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error generating test:', err);
      setError(err.message || 'Failed to generate test. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer
    });
  };

  const handleSubmitTest = async () => {
    try {
      setSubmitting(true);
      setError('');

      // Calculate score
      let correctCount = 0;
      questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / questions.length) * 100);
      console.log(`✅ Test Score: ${correctCount}/${questions.length} = ${score}%`);

      // Call the /re-predict API with original probability
      const response = await axios.post(`${API_BASE_URL}/re-predict`, {
        userId: user.uid,
        skillName: decodeURIComponent(skillName),
        newScore: score,
        originalProbability: originalProbability
      });

      console.log('📊 Re-prediction Response:', response.data);

      setTestResult({
        score,
        correctCount,
        totalQuestions: questions.length,
        newProbability: response.data.new_probability,
        originalProbability: response.data.original_probability,
        improvement: response.data.improvement,
        newShapValues: response.data.new_shap_values,
        newConfidence: response.data.new_confidence,
        newTrack: response.data.new_recommended_track,
        message: response.data.message
      });

      setSubmitting(false);
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test results. Please try again.');
      setSubmitting(false);
    }
  };

  // Voice test functions
  const speakQuestion = (questionText) => {
    if (synthesis && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      synthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      setError('');
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 User said:', transcript);
        
        // Store the voice answer
        setUserAnswers(prev => ({
          ...prev,
          [currentQuestionIndex]: transcript
        }));
        
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Speech recognition error. Please try again.');
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceTestSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');

      // For voice test, give score based on answer length and completeness
      let totalScore = 0;
      questions.forEach((question, index) => {
        const answer = userAnswers[index] || '';
        // Score based on answer length (minimum 20 words for good answer)
        const wordCount = answer.trim().split(/\s+/).length;
        const questionScore = Math.min(100, (wordCount / 20) * 100);
        totalScore += questionScore;
      });

      const score = Math.round(totalScore / questions.length);
      console.log(`✅ Voice Test Score: ${score}%`);

      // Call the /re-predict API
      const response = await axios.post(`${API_BASE_URL}/re-predict`, {
        userId: user.uid,
        skillName: decodeURIComponent(skillName),
        newScore: score,
        originalProbability: originalProbability
      });

      console.log('📊 Re-prediction Response:', response.data);

      setTestResult({
        score,
        totalQuestions: questions.length,
        newProbability: response.data.new_probability,
        originalProbability: response.data.original_probability,
        improvement: response.data.improvement,
        newShapValues: response.data.new_shap_values,
        newConfidence: response.data.new_confidence,
        newTrack: response.data.new_recommended_track,
        message: response.data.message
      });

      setSubmitting(false);
    } catch (err) {
      console.error('Error submitting voice test:', err);
      setError('Failed to submit test results. Please try again.');
      setSubmitting(false);
    }
  };

  const isTestComplete = () => {
    return Object.keys(userAnswers).length === questions.length;
  };

  const getProgress = () => {
    return (Object.keys(userAnswers).length / questions.length) * 100;
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <BackgroundVideo />
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3, color: '#ffffff' }}
        >
          Back to Dashboard
        </Button>

        <Paper
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip
              label={decodeURIComponent(skillName)}
              color="primary"
              sx={{ fontSize: '1rem', py: 2.5, px: 3, fontWeight: 'bold', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Skill Assessment Test
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Complete this test to prove your skills and improve your placement score
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 3 }}>
                Generating your personalized test...
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                This may take 10-15 seconds
              </Typography>
            </Box>
          )}

          {/* Test Result View */}
          {!loading && testResult && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <EmojiEventsIcon sx={{ fontSize: 80, color: '#FFD700', mb: 2 }} />
              <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
                Test Complete!
              </Typography>
              
              <Box sx={{ my: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Your Score: <strong>{testResult.score}%</strong>
                </Typography>
                {testResult.correctCount !== undefined && (
                  <Typography variant="body1" color="textSecondary">
                    {testResult.correctCount} out of {testResult.totalQuestions} questions correct
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ my: 4 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                  Original Probability: <strong>{testResult.originalProbability}%</strong>
                </Typography>
                <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
                  🎉 New Placement Probability: {testResult.newProbability}%
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                  {testResult.message}
                </Typography>
                {testResult.improvement > 0 && (
                  <Chip
                    label={`+${testResult.improvement}% Improvement`}
                    color="success"
                    sx={{ mt: 2, fontWeight: 'bold' }}
                  />
                )}
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard', {
                  state: {
                    updatedProbability: testResult.newProbability,
                    updatedShapValues: testResult.newShapValues,
                    updatedConfidence: testResult.newConfidence,
                    updatedTrack: testResult.newTrack,
                    completedSkill: decodeURIComponent(skillName) // Pass the completed skill name
                  }
                })}
                sx={{ mt: 3 }}
              >
                Back to Dashboard
              </Button>
            </Box>
          )}

          {/* Voice Test View */}
          {!loading && !testResult && questions.length > 0 && isVoiceTest && (
            <>
              {/* Progress Bar */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {currentQuestionIndex + 1} / {questions.length}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={((currentQuestionIndex + 1) / questions.length) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Current Question */}
              <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Chip
                    label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
                    size="medium"
                    color="primary"
                    sx={{ mr: 2 }}
                  />
                  {isSpeaking && (
                    <Chip
                      label="AI Speaking..."
                      size="small"
                      color="info"
                      icon={<MicIcon />}
                    />
                  )}
                </Box>
                
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {questions[currentQuestionIndex]?.question_text}
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 3 }}>
                  📝 Evaluation Focus: {questions[currentQuestionIndex]?.evaluation_criteria}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Voice Controls */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<MicIcon />}
                    onClick={() => speakQuestion(questions[currentQuestionIndex]?.question_text)}
                    disabled={isListening || isSpeaking}
                    sx={{ minWidth: 200 }}
                  >
                    Hear Question
                  </Button>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {!isListening ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<MicIcon />}
                        onClick={startListening}
                        disabled={isSpeaking}
                        color="primary"
                        sx={{ minWidth: 200 }}
                      >
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<StopIcon />}
                        onClick={stopListening}
                        color="error"
                        sx={{ minWidth: 200 }}
                      >
                        Stop Recording
                      </Button>
                    )}
                  </Box>

                  {isListening && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <MicIcon sx={{ 
                        fontSize: 60, 
                        color: 'error.main',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                          '100%': { transform: 'scale(1)', opacity: 1 }
                        },
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }} />
                      <Typography variant="body2" color="textSecondary">
                        Listening... Speak your answer
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Transcript Display */}
                {userAnswers[currentQuestionIndex] && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Your Answer:
                    </Typography>
                    <Typography variant="body1">
                      {userAnswers[currentQuestionIndex]}
                    </Typography>
                    <CheckCircleIcon color="success" sx={{ fontSize: 20, mt: 1 }} />
                  </Box>
                )}
              </Paper>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                >
                  Previous
                </Button>
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    disabled={!userAnswers[currentQuestionIndex]}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleVoiceTestSubmit}
                    disabled={Object.keys(userAnswers).length !== questions.length}
                  >
                    Submit Test
                  </Button>
                )}
              </Box>
            </>
          )}

          {/* Quiz View (MCQ) */}
          {!loading && !testResult && questions.length > 0 && !isVoiceTest && (
            <>
              {/* Progress Bar */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Object.keys(userAnswers).length} / {questions.length}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getProgress()} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Questions */}
              <Box sx={{ mb: 4 }}>
                {questions.map((question, index) => (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{
                      p: 3,
                      mb: 3,
                      border: userAnswers[index] ? '2px solid #4caf50' : '1px solid #e0e0e0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={`Q${index + 1}`}
                        size="small"
                        color="primary"
                        sx={{ mr: 2 }}
                      />
                      {userAnswers[index] && (
                        <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
                      )}
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {question.question_text}
                    </Typography>

                    <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
                      <RadioGroup
                        value={userAnswers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                      >
                        {question.options.map((option, optIndex) => (
                          <FormControlLabel
                            key={optIndex}
                            value={option}
                            control={<Radio />}
                            label={option}
                            sx={{
                              mb: 1,
                              p: 1.5,
                              borderRadius: 1,
                              border: '1px solid #e0e0e0',
                              '&:hover': { backgroundColor: '#f5f5f5' }
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                ))}
              </Box>

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmitTest}
                  disabled={!isTestComplete() || submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                  sx={{ 
                    minWidth: 200,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Test'}
                </Button>
                {!isTestComplete() && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    Please answer all questions before submitting
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default SkillTestPage;
