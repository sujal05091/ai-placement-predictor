// Mock Interview Page - Stateful Voice Interview
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Paper,
  Button,
  Typography,
  Chip,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from '../components/Navbar';
import BackgroundVideo from '../components/BackgroundVideo';
import Chatbot from '../components/Chatbot';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(API_KEY);

const MockInterviewPage = () => {
  const tracks = ['HR Interview Round', 'Data Analyst', 'Software Engineer', 'Product Manager', 'UX Designer', 'Marketing'];
  
  const [selectedTrack, setSelectedTrack] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatRef = useRef(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        transcriptRef.current += finalTranscript;
        console.log('📝 Transcript so far:', transcriptRef.current);
      };

      recognitionRef.current.onend = () => {
        console.log('🛑 Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech error:', event.error);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [isListening]);

  const getSystemPrompt = (track) => {
    if (track === 'HR Interview Round') {
      return `You are an HR Manager at a top tech company. Conduct a behavioral interview. Ask ONE question at a time. Focus on teamwork, conflict resolution, and leadership. Keep responses under 3 sentences. Start with a welcome.`;
    }
    return `You are a technical recruiter for ${track}. Ask ONE technical question at a time. Keep responses under 3 sentences. Start with a welcome.`;
  };

  const startInterview = async () => {
    if (!selectedTrack) {
      setError('Please select a track');
      return;
    }
    if (!speechSupported) {
      setError('Speech not supported');
      return;
    }

    console.log('Starting interview:', selectedTrack);
    setLoading(true);
    setError('');
    setMessages([]);
    setInterviewStarted(true);

    try {
      const model = ai.getGenerativeModel({
        model: 'gemini-2.5-flash',  // Current stable model for v1beta API
        systemInstruction: getSystemPrompt(selectedTrack)
      });

      chatRef.current = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.9,
        }
      });

      const result = await chatRef.current.sendMessage('Begin the interview. Greet me and ask your first question.');
      const aiText = result.response.text();

      setMessages([{ role: 'model', text: aiText }]);
      setLoading(false);
      speakText(aiText);

    } catch (error) {
      console.error('Failed to start:', error);
      setError(`Failed: ${error.message}`);
      setLoading(false);
      setInterviewStarted(false);
    }
  };

  const sendUserMessage = async (userText) => {
    if (!chatRef.current || loading) return;

    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const result = await chatRef.current.sendMessage(userText);
      const aiText = result.response.text();

      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
      setLoading(false);
      speakText(aiText);

    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}`);
      setMessages(prev => [...prev, { role: 'model', text: 'Error. Please repeat.' }]);
      setLoading(false);
      setTimeout(() => startListening(), 1500);
    }
  };

  const speakText = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (interviewStarted && selectedTrack === 'HR Interview Round') {
        setTimeout(() => startListening(), 1000);
      }
    };
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!speechSupported || isListening || isSpeaking || loading) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setError('');
    } catch (error) {
      setError('Failed to start mic');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Get and send the transcript
      const transcript = transcriptRef.current.trim();
      if (transcript && interviewStarted) {
        console.log('👤 User said:', transcript);
        transcriptRef.current = ''; // Reset for next input
        sendUserMessage(transcript);
      } else {
        console.log('⚠️ No transcript or interview not started');
      }
    }
  };

  const endInterview = () => {
    stopListening();
    window.speechSynthesis.cancel();
    transcriptRef.current = '';
    chatRef.current = null;
    setInterviewStarted(false);
    setLoading(false);
    setIsSpeaking(false);
    setError('');
  };

  return (
    <>
      <Navbar />
      <BackgroundVideo />
      <Container maxWidth='lg' sx={{ pt: 4, pb: 4, position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Paper elevation={3} sx={{ p: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 2, minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h4' gutterBottom align='center' fontWeight='bold' color='primary'>AI Mock Interview Coach</Typography>
            {!interviewStarted && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Select Interview Track</InputLabel>
                <Select value={selectedTrack} label='Select Interview Track' onChange={(e) => setSelectedTrack(e.target.value)}>
                  {tracks.map(track => <MenuItem key={track} value={track}>{track}</MenuItem>)}
                </Select>
              </FormControl>
            )}
            {interviewStarted && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Chip label={selectedTrack} color='primary' variant='outlined' />
                {selectedTrack === 'HR Interview Round' && (<><Chip label='Behavioral Questions' color='secondary' size='small' /><Chip icon={<VolumeUpIcon />} label='Auto Voice Mode' color='success' size='small' /></>)}
                {isListening && <Chip label='Listening...' color='error' />}
                {isSpeaking && <Chip label='Speaking...' color='info' />}
                {loading && <Chip label='Thinking...' color='warning' />}
              </Box>
            )}
          </Box>
          {error && <Alert severity='error' onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
          {interviewStarted && (
            <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, minHeight: 400 }}>
              {messages.map((message, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                  <Paper elevation={1} sx={{ p: 2, maxWidth: '75%', backgroundColor: message.role === 'user' ? '#1976d2' : '#fff', color: message.role === 'user' ? '#fff' : '#000' }}>
                    <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>{message.text}</Typography>
                  </Paper>
                </Box>
              ))}
              {loading && (<Box sx={{ display: 'flex', justifyContent: 'flex-start' }}><Paper elevation={2} sx={{ p: 2, backgroundColor: '#f5f5f5' }}><Typography variant='body1'>Thinking...</Typography></Paper></Box>)}
              <div ref={messagesEndRef} />
            </Box>
          )}
          {!interviewStarted && !loading && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
              <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
                <Typography variant='h4' gutterBottom color='primary' fontWeight='bold'>Welcome to Mock Interview</Typography>
                <Typography variant='body1' color='text.secondary' paragraph>Select an interview track above to begin.</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mt: 3 }}><strong>HR Interview Round:</strong> Voice-first behavioral interview.</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}><strong>Technical Tracks:</strong> Role-specific questions with voice support.</Typography>
              </Box>
            </Box>
          )}
          {loading && !interviewStarted && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Starting interview...</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            {!interviewStarted ? (
              <Button variant='contained' color='primary' size='large' onClick={startInterview} disabled={!selectedTrack || loading}>Start Interview</Button>
            ) : (
              <>
                <IconButton color={isListening ? 'error' : 'primary'} onClick={isListening ? stopListening : startListening} disabled={loading || isSpeaking} size='large' sx={{ border: '2px solid', borderColor: isListening ? 'error.main' : 'primary.main' }}>
                  <MicIcon fontSize='large' />
                </IconButton>
                <Button variant='contained' color='error' size='large' onClick={endInterview} startIcon={<StopCircleIcon />}>End Interview</Button>
              </>
            )}
          </Box>
          {interviewStarted && (
            <Typography variant='caption' align='center' color='text.secondary' sx={{ mt: 2 }}>
              {selectedTrack === 'HR Interview Round' ? 'AI will speak first, then your mic will auto-activate. Click mic when done.' : 'Click microphone to answer with voice.'}
            </Typography>
          )}
        </Paper>
      </Container>
      <Chatbot />
    </>
  );
};

export default MockInterviewPage;
