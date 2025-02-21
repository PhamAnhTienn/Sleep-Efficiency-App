import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";
import SignIn from "./sign-in/SignIn";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Box,
  FormGroup,
  AppBar,
  Toolbar,
  Card,
  CardContent,
} from "@mui/material";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from './theme/AppTheme';
import ColorModeSelect from './theme/ColorModeSelect';

const LandingContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 98%), hsl(0, 0%, 95%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(220, 30%, 10%), hsl(220, 30%, 5%))',
    }),
  },
}));

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | undefined>(undefined); 
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [bedtime, setBedtime] = useState("");
  const [bedtimeAMPM, setBedtimeAMPM] = useState("AM");
  const [wakeupTime, setWakeupTime] = useState("");
  const [wakeupTimeAMPM, setWakeupTimeAMPM] = useState("AM");
  const [sleepDuration, setSleepDuration] = useState("");
  const [awakenings, setAwakenings] = useState("");
  const [caffeineConsumption, setCaffeineConsumption] = useState("Yes");
  const [alcoholConsumption, setAlcoholConsumption] = useState("No");
  const [smokingStatus, setSmokingStatus] = useState("No");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [prediction, setPrediction] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const handlePredict = async () => {
    try {
      setIsCalculating(true);
      setPrediction(""); 
      const response = await httpClient.post("/api/predict", {
        Age: age,
        Gender: gender,
        Bedtime: bedtime,
        Bedtime_AMPM: bedtimeAMPM,
        Wakeup_time: wakeupTime,
        Wakeup_time_AMPM: wakeupTimeAMPM,
        Sleep_duration: sleepDuration,
        Awakenings: awakenings,
        Caffeine_consumption: caffeineConsumption,
        Alcohol_consumption: alcoholConsumption,
        Smoking_status: smokingStatus,
        Exercise_frequency: exerciseFrequency
      });
      setPrediction(response.data.result || "");
    } catch (error) {
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await httpClient.post("/api/logout");
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await httpClient.get("/api/@me");
        setUser(response.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  if (user === undefined) return null;

  return user ? (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <LandingContainer>
        <ColorModeSelect 
          sx={{ 
            position: 'fixed', 
            bottom: '1rem', 
            right: '1rem',
            backgroundColor: 'background.paper',
            borderRadius: '50%',
            padding: '8px',
            boxShadow: 3,
            zIndex: 1000
          }} 
        />
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sleep Efficiency Web
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              backgroundColor: 'background.paper',
              color: 'text.primary'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <BedtimeIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h4" component="h1">
                Sleep Analysis Form
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Age"
                  variant="outlined"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormGroup row sx={{ gap: 2 }}>
                  <TextField
                    label="Bedtime"
                    variant="outlined"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    sx={{ 
                      flexGrow: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.paper',
                      }
                    }}
                  />
                  <FormControl sx={{ minWidth: 100 }}>
                    <InputLabel>AM/PM</InputLabel>
                    <Select
                      value={bedtimeAMPM}
                      label="AM/PM"
                      onChange={(e) => setBedtimeAMPM(e.target.value)}
                    >
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </FormControl>
                </FormGroup>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormGroup row sx={{ gap: 2 }}>
                  <TextField
                    label="Wake-up Time"
                    variant="outlined"
                    value={wakeupTime}
                    onChange={(e) => setWakeupTime(e.target.value)}
                    sx={{ 
                      flexGrow: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.paper',
                      }
                    }}
                  />
                  <FormControl sx={{ minWidth: 100 }}>
                    <InputLabel>AM/PM</InputLabel>
                    <Select
                      value={wakeupTimeAMPM}
                      label="AM/PM"
                      onChange={(e) => setWakeupTimeAMPM(e.target.value)}
                    >
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </FormControl>
                </FormGroup>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sleep Duration (hrs)"
                  variant="outlined"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(e.target.value)}
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Awakenings"
                  variant="outlined"
                  value={awakenings}
                  onChange={(e) => setAwakenings(e.target.value)}
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
              </Grid>

              {/* Lifestyle Factors */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Lifestyle Factors</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Caffeine Consumption</InputLabel>
                      <Select
                        value={caffeineConsumption}
                        label="Caffeine Consumption"
                        onChange={(e) => setCaffeineConsumption(e.target.value)}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Alcohol Consumption</InputLabel>
                      <Select
                        value={alcoholConsumption}
                        label="Alcohol Consumption"
                        onChange={(e) => setAlcoholConsumption(e.target.value)}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Smoking Status</InputLabel>
                      <Select
                        value={smokingStatus}
                        label="Smoking Status"
                        onChange={(e) => setSmokingStatus(e.target.value)}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Exercise Frequency (times/week)"
                  variant="outlined"
                  value={exerciseFrequency}
                  onChange={(e) => setExerciseFrequency(e.target.value)}
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handlePredict}
                disabled={isCalculating}
                sx={{ 
                  minWidth: 200,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                {isCalculating ? 'Calculating...' : 'Predict'}
              </Button>
            </Box>

            {(isCalculating || prediction) && (
              <Card 
                sx={{ 
                  mt: 4, 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  boxShadow: 3,
                  position: 'relative',
                  minHeight: 200,
                  overflow: 'hidden'
                }}
              >
                <CardContent>
                  {isCalculating ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 160,
                        position: 'relative'
                      }}
                    >
                      <Typography variant="h5" component="div" align="center" sx={{ mb: 3 }}>
                        Calculating Sleep Efficiency Score...
                      </Typography>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 4,
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: '30%',
                            bgcolor: 'primary.contrastText',
                            borderRadius: 2,
                            animation: 'moveRight 1.5s infinite linear',
                            '@keyframes moveRight': {
                              '0%': {
                                left: '-30%',
                              },
                              '100%': {
                                left: '100%',
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h5" component="div" align="center">
                        Sleep Efficiency Score
                      </Typography>
                      <Typography 
                        variant="h3" 
                        component="div" 
                        align="center" 
                        sx={{ 
                          mt: 2,
                          animation: 'fadeIn 0.5s ease-in',
                          '@keyframes fadeIn': {
                            '0%': {
                              opacity: 0,
                              transform: 'scale(0.9)',
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'scale(1)',
                            },
                          },
                        }}
                      >
                        {prediction}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </Paper>
        </Container>
      </LandingContainer>
    </AppTheme>
  ) : (
    <SignIn />
  );
};

export default LandingPage;