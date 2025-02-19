import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.primary,
  background: 'rgba(255, 255, 255, 0.9)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  padding: theme.spacing(10, 0),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <HeroSection>
        <Box sx={{ color: 'white', textAlign: 'center', py: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Sleep Better, Live Better
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Track, analyze, and improve your sleep patterns for a healthier lifestyle
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: 'white',
              color: '#2193b0',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </HeroSection>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <BedtimeIcon sx={{ fontSize: 60, color: '#2193b0', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Sleep Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Record your sleep schedule and get detailed insights about your sleep patterns
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <TrendingUpIcon sx={{ fontSize: 60, color: '#2193b0', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Visualize your sleep data with intuitive charts and progress tracking
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper elevation={3}>
            <TimerIcon sx={{ fontSize: 60, color: '#2193b0', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Smart Recommendations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Get personalized tips and recommendations to improve your sleep quality
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;