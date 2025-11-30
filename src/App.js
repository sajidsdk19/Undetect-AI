import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  TextField, Container, Typography, Box, Grid, AppBar, Toolbar,
  CssBaseline, Button, Card, CardContent, IconButton, Snackbar,
  useMediaQuery, Tooltip, Fade, Select, MenuItem, Chip, ToggleButton, ToggleButtonGroup,
  CircularProgress, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FileCopy as FileCopyIcon, Clear as ClearIcon, DarkMode, LightMode, Add as AddIcon, TextFields, FormatColorText, Settings as SettingsIcon } from '@mui/icons-material';
import { FaGithub } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

// Register fonts with Quill
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = [
  // Basic web fonts
  'sans-serif',
  'serif',
  'monospace',

  // Web Safe Fonts
  'arial',
  'arial-black',
  'arial-narrow',
  'comic-sans',
  'courier',
  'courier-new',
  'georgia',
  'helvetica',
  'impact',
  'lucida-console',
  'lucida-sans',
  'palatino',
  'tahoma',
  'times',
  'times-new-roman',
  'trebuchet-ms',
  'verdana',

  // System Fonts
  'calibri',
  'cambria',
  'consolas',
  'franklin-gothic',
  'segoe-ui',
  'system-ui',
  'microsoft-sans-serif',
  'book-antiqua',
  'century-gothic',
  'lucida-grande',
  'optima',
  'futura',
  'avenir',
  'proxima-nova',

  // Google Fonts
  'open-sans',
  'roboto',
  'lato',
  'montserrat',
  'source-sans-pro',
  'raleway',
  'pt-sans',
  'ubuntu',
  'nunito',
  'poppins',
  'oswald',
  'merriweather',
  'playfair-display',
  'roboto-slab',
  'lora',
  'fira-sans',
  'noto-sans',
  'roboto-condensed',
  'source-serif-pro',
  'crimson-text',
  'pt-serif',
  'libre-baskerville',
  'bitter',
  'droid-sans',
  'droid-serif',

  // Classic Typography
  'garamond',
  'baskerville',
  'caslon',
  'gill-sans',
  'minion-pro',
  'myriad-pro',
  'adobe-garamond',
  'bookman',
  'avant-garde',
  'copperplate',
  'trajan',
  'optima',

  // Monospace Fonts
  'monaco',
  'menlo',
  'inconsolata',
  'source-code-pro',
  'fira-code',
  'dejavu-sans-mono',
  'liberation-mono',
  'anonymous-pro',
  'courier-prime'
];
ReactQuill.Quill.register(Font, true);

const unicodeSpaces = {
  'Em Space': '\u2003',
  'En Space': '\u2002',
  'Thin Space': '\u2009',
  'Thin Space*2': '\u2009\u2009',
  'Hair Space': '\u200A',
  'Narrow, Hair': '\u202F\u200A',
  'Thin, Hair': ' \u2009\u200A',
  'Hair Space*3': '\u200A\u200A\u200A',
  'Narrow No-Break': '\u202F',
  'Narrow No-Break*2': '\u202F\u202F',
  'Zero Width Space': '\u200A\u200B\u200A',
  'Word Joiner': '\u2009\u2060\u2009'
};

const usageDescription = {
  'Em Space': 'in wide spacing between characters',
  'En Space': 'for mid-range spacing',
  'Thin Space': 'for slightly narrower spacing',
  'Thin Space*2': 'for even narrower spacing',
  'Hair Space': 'for very thin spacing',
  'Narrow, Hair': 'for extra narrow hair-like spacing',
  'Thin, Hair': 'for a mix of thin and hair spacing',
  'Hair Space*3': 'for extremely tight spacing',
  'Narrow No-Break': 'to prevent line breaks with tight spacing',
  'Narrow No-Break*2': 'for even tighter no-break spacing',
  'Zero Width Space': 'to create word breaks without visible space',
  'Word Joiner': 'to prevent word breaks without adding width'
};

const App = () => {
  const [inputText, setInputText] = useState('');
  const [richText, setRichText] = useState('');
  const [inputMode, setInputMode] = useState('rich');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const [customSpaces, setCustomSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('zerogpt_api_key') || 'c9cbf0ef-c07e-49ce-baa2-c4ee1d030c3e');
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Save API key to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('zerogpt_api_key', apiKey);
  }, [apiKey]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#2196f3' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#f50057' : '#f48fb1',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#ffffff',
            secondary: mode === 'light' ? '#757575' : '#b0bec5',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
            marginBottom: '1rem',
            color: mode === 'light' ? '#1976d2' : '#90caf9',
          },
          h6: {
            fontWeight: 500,
            marginBottom: '0.5rem',
          },
          body1: {
            marginBottom: '0.75rem',
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                color: mode === 'light' ? '#333333' : '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light'
                  ? '0 2px 4px rgba(0, 0, 0, 0.1)'
                  : '0 2px 4px rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: mode === 'light'
                    ? '0 4px 8px rgba(0, 0, 0, 0.15)'
                    : '0 4px 8px rgba(255, 255, 255, 0.1)',
                },
              },
            },
          },
          MuiCardContent: {
            styleOverrides: {
              root: {
                padding: '16px',
                '&:last-child': {
                  paddingBottom: '16px',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '6px',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode],
  );

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleRichTextChange = (content, delta, source, editor) => {
    setRichText(content);
    setInputText(editor.getText());
  };

  const handleInputModeChange = (event, newMode) => {
    if (newMode !== null) {
      setInputMode(newMode);
    }
  };

  const replaceSpaces = useCallback((text, unicodeCharacter) => {
    return text.split(' ').join(unicodeCharacter);
  }, []);

  const replaceSpacesInHtml = useCallback((html, unicodeCharacter) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const walkTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = replaceSpaces(node.textContent, unicodeCharacter);
      } else {
        for (let child of node.childNodes) {
          walkTextNodes(child);
        }
      }
    };

    walkTextNodes(doc.body);
    return doc.body.innerHTML;
  }, [replaceSpaces]);

  const getUnicodeCode = (text) => {
    return text.split('').map((char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()).join('');
  };

  const handleClearText = () => {
    setInputText('');
    setRichText('');
  };

  const handleCopyText = useCallback((text, key, isHtml = false) => {
    if (isHtml && inputMode === 'rich') {
      const blob = new Blob([text], { type: 'text/html' });
      const item = new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([inputText], { type: 'text/plain' }) });
      navigator.clipboard.write([item]).then(() => {
        setSnackbarMessage(`Copied formatted text with ${key} spacing!`);
        setSnackbarOpen(true);
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setSnackbarMessage(`Copied text with ${key} spacing!`);
        setSnackbarOpen(true);
      });
    }
  }, [inputMode, inputText]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleToggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleAddCustomSpace = () => {
    if (selectedSpace && !customSpaces.includes(selectedSpace)) {
      setCustomSpaces([...customSpaces, selectedSpace]);
      setSelectedSpace('');
    }
  };

  const handleRemoveCustomSpace = (space) => {
    setCustomSpaces(customSpaces.filter(s => s !== space));
  };

  const checkZeroGPT = async (text, key) => {
    try {
      const response = await fetch('/api/detect/detectText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ApiKey': key
        },
        body: JSON.stringify({ input_text: text })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("ZeroGPT Response:", data);

      // Adjust based on actual response structure.
      const score = data.fakePercentage ?? data.ai_score ?? data.score ?? (data.data && data.data.fakePercentage) ?? null;

      if (score === null) {
        console.warn("Could not find score in response:", data);
        return null;
      }

      return typeof score === 'number' ? score : parseFloat(score);
    } catch (error) {
      console.error("ZeroGPT Check Failed:", error);
      return null; // Return null to indicate failure
    }
  };

  const handleAutoSelect = async () => {
    if (!apiKey) {
      setSettingsOpen(true);
      setSnackbarMessage('Please enter your ZeroGPT API Key first.');
      setSnackbarOpen(true);
      return;
    }

    if (!inputText) {
      setSnackbarMessage('Please enter some text to test.');
      setSnackbarOpen(true);
      return;
    }

    setIsTesting(true);
    setTestProgress(0);

    const candidates = [
      ['Zero Width Space'],
      ['Thin Space'],
      ['Hair Space'],
      ['Zero Width Space', 'Thin Space'],
      ['Zero Width Space', 'Hair Space'],
      ['Thin Space', 'Hair Space'],
      ['Zero Width Space', 'Thin Space', 'Hair Space'],
      ['Zero Width Space', 'Word Joiner'],
      ['Thin Space', 'Word Joiner']
    ];

    let bestScore = 101; // Start higher than max possible score (100)
    let bestCombo = candidates[0]; // Default fallback

    for (let i = 0; i < candidates.length; i++) {
      const combo = candidates[i];

      // Construct the text with this combination
      const customSpacingStr = combo.map(space => unicodeSpaces[space]).join('');
      const testText = replaceSpaces(inputText, customSpacingStr);

      // Call API
      const score = await checkZeroGPT(testText, apiKey);

      // Update progress
      setTestProgress(Math.round(((i + 1) / candidates.length) * 100));

      if (score !== null) {
        console.log(`Combination: ${combo.join(' + ')}, Score: ${score}`);
        if (score < bestScore) {
          bestScore = score;
          bestCombo = combo;
        }
      } else {
        // If API fails, we might want to stop or continue. For now, we continue.
        console.warn(`Failed to check combination: ${combo.join(' + ')}`);
      }

      // Add a small delay to avoid rate limits if necessary
      await new Promise(r => setTimeout(r, 500));
    }

    setCustomSpaces(bestCombo);
    setSelectedSpace('');
    setIsTesting(false);
    setSnackbarMessage(`Auto-selected best combination! (Lowest AI Score: ${bestScore === 101 ? 'N/A' : bestScore}%)`);
    setSnackbarOpen(true);
  };

  const getCustomSpacingText = useCallback(() => {
    const customSpacing = customSpaces.map(space => unicodeSpaces[space]).join('');
    return replaceSpaces(inputText, customSpacing);
  }, [customSpaces, inputText, replaceSpaces]);

  const getCustomSpacingHtml = useCallback(() => {
    const customSpacing = customSpaces.map(space => unicodeSpaces[space]).join('');
    return replaceSpacesInHtml(richText, customSpacing);
  }, [customSpaces, richText, replaceSpacesInHtml]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Zero-ZeroGPT
          </Typography>
          <Tooltip title="Settings">
            <IconButton
              color="inherit"
              onClick={() => setSettingsOpen(true)}
              sx={{ mr: 1 }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View on GitHub">
            <IconButton
              color="inherit"
              aria-label="github"
              href="https://github.com/oct4pie/zero-zerogpt.git"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mr: 2 }}
            >
              <FaGithub size={24} />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton color="inherit" onClick={handleToggleMode} edge="end">
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Box my={2}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            AI Content with Unicode Spacing
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Enter text to experiment with the impact of unicode space types on AI detection tools.
          </Typography>

          <Box display="flex" justifyContent="center" mb={2}>
            <ToggleButtonGroup
              value={inputMode}
              exclusive
              onChange={handleInputModeChange}
              aria-label="input mode"
            >
              <ToggleButton value="plain" aria-label="plain text">
                <TextFields sx={{ mr: 1 }} />
                Plain Text
              </ToggleButton>
              <ToggleButton value="rich" aria-label="rich text">
                <FormatColorText sx={{ mr: 1 }} />
                Rich Text
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {inputMode === 'plain' ? (
            <TextField
              label="Input Text"
              variant="outlined"
              multiline
              minRows={12}
              maxRows={14}
              value={inputText}
              onChange={handleInputChange}
              margin="dense"
              placeholder="Enter your text here..."
              sx={{
                width: "90%",
                mx: "5%",
                borderRadius: '6px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          ) : (
            <Box sx={{ width: '90%', mx: '5%', mb: 2 }}>
              <ReactQuill
                theme="snow"
                value={richText}
                onChange={handleRichTextChange}
                style={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: '6px'
                }}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    [{
                      'font': [
                        'sans-serif', 'serif', 'monospace',
                        'arial', 'arial-black', 'arial-narrow', 'comic-sans', 'courier', 'courier-new',
                        'georgia', 'helvetica', 'impact', 'lucida-console', 'lucida-sans', 'palatino',
                        'tahoma', 'times', 'times-new-roman', 'trebuchet-ms', 'verdana',
                        'calibri', 'cambria', 'consolas', 'franklin-gothic', 'segoe-ui', 'system-ui',
                        'microsoft-sans-serif', 'book-antiqua', 'century-gothic', 'lucida-grande',
                        'optima', 'futura', 'avenir', 'proxima-nova',
                        'open-sans', 'roboto', 'lato', 'montserrat', 'source-sans-pro', 'raleway',
                        'pt-sans', 'ubuntu', 'nunito', 'poppins', 'oswald', 'merriweather',
                        'playfair-display', 'roboto-slab', 'lora', 'fira-sans', 'noto-sans',
                        'roboto-condensed', 'source-serif-pro', 'crimson-text', 'pt-serif',
                        'libre-baskerville', 'bitter', 'droid-sans', 'droid-serif',
                        'garamond', 'baskerville', 'caslon', 'gill-sans', 'minion-pro', 'myriad-pro',
                        'adobe-garamond', 'bookman', 'avant-garde', 'copperplate', 'trajan',
                        'monaco', 'menlo', 'inconsolata', 'source-code-pro', 'fira-code',
                        'dejavu-sans-mono', 'liberation-mono', 'anonymous-pro', 'courier-prime'
                      ]
                    }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
              />
            </Box>
          )}
          <Box display="flex" justifyContent="center" mb={6} mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearText}
              startIcon={<ClearIcon />}
            >
              Clear Text
            </Button>
          </Box>

          <Grid container spacing={2} mb={5}>
            {Object.entries(unicodeSpaces).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" color="primary" fontWeight="bold">
                        {key}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getUnicodeCode(value)}
                      </Typography>
                    </Box>
                    {inputMode === 'plain' ? (
                      <TextField
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={10}
                        value={replaceSpaces(inputText, value)}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          mb: 1,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.background.paper,
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        }}
                      />
                    ) : (
                      <Box
                        className="quill-output"
                        sx={{
                          mb: 1,
                          p: 1,
                          border: '1px solid rgba(0, 0, 0, 0.12)',
                          borderRadius: '4px',
                          backgroundColor: theme.palette.background.paper,
                          minHeight: '60px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          '& p': { margin: '0 0 0.5em 0' },
                          '& p:last-child': { marginBottom: 0 },
                          '& ul, & ol': { paddingLeft: '1.5em', margin: '0.5em 0' },
                          '& blockquote': { borderLeft: '4px solid #ccc', marginLeft: 0, paddingLeft: '1em' },
                          '& pre': { background: '#f4f4f4', padding: '0.5em', borderRadius: '3px' },
                          '& h1': { fontSize: '2em', margin: '0.5em 0' },
                          '& h2': { fontSize: '1.5em', margin: '0.5em 0' },
                          '& h3': { fontSize: '1.17em', margin: '0.5em 0' }
                        }}
                        dangerouslySetInnerHTML={{
                          __html: replaceSpacesInHtml(richText, value)
                        }}
                      />
                    )}
                    <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                      {usageDescription[key]}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                      <Tooltip title={`Copy text with ${key} spacing`}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleCopyText(
                            inputMode === 'rich' ? replaceSpacesInHtml(richText, value) : replaceSpaces(inputText, value),
                            key,
                            inputMode === 'rich'
                          )}
                        >
                          <FileCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Unicode Spacing
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Select
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  displayEmpty
                  sx={{ mr: 2, minWidth: 200 }}
                >
                  <MenuItem value="" disabled>Select</MenuItem>
                  {Object.keys(unicodeSpaces).map((key) => (
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddCustomSpace}
                  startIcon={<AddIcon />}
                  sx={{ mr: 1 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAutoSelect}
                  disabled={isTesting}
                  startIcon={isTesting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                >
                  {isTesting ? 'Testing...' : 'Auto Select'}
                </Button>
              </Box>
              {isTesting && (
                <Box sx={{ width: '100%', mb: 2 }}>
                  <LinearProgress variant="determinate" value={testProgress} />
                  <Typography variant="caption" color="textSecondary" align="center" display="block">
                    Testing combinations... {testProgress}%
                  </Typography>
                </Box>
              )}
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {customSpaces.map((space) => (
                  <Chip
                    key={space}
                    label={space}
                    onDelete={() => handleRemoveCustomSpace(space)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              {inputMode === 'plain' ? (
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={10}
                  maxRows={12}
                  value={getCustomSpacingText()}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
              ) : (
                <Box
                  className="quill-output"
                  sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    backgroundColor: theme.palette.background.paper,
                    minHeight: '250px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    '& p': { margin: '0 0 0.5em 0' },
                    '& p:last-child': { marginBottom: 0 },
                    '& ul, & ol': { paddingLeft: '1.5em', margin: '0.5em 0' },
                    '& blockquote': { borderLeft: '4px solid #ccc', marginLeft: 0, paddingLeft: '1em' },
                    '& pre': { background: '#f4f4f4', padding: '0.5em', borderRadius: '3px' },
                    '& h1': { fontSize: '2em', margin: '0.5em 0' },
                    '& h2': { fontSize: '1.5em', margin: '0.5em 0' },
                    '& h3': { fontSize: '1.17em', margin: '0.5em 0' }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: getCustomSpacingHtml()
                  }}
                />
              )}
              <Box display="flex" justifyContent="flex-end">
                <Tooltip title="Copy custom spaced text">
                  <IconButton
                    color="primary"
                    onClick={() => handleCopyText(
                      inputMode === 'rich' ? getCustomSpacingHtml() : getCustomSpacingText(),
                      'Custom',
                      inputMode === 'rich'
                    )}
                  >
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Enter your ZeroGPT API Key to enable dynamic auto-selection.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="apiKey"
            label="ZeroGPT API Key"
            type="password"
            fullWidth
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={() => setSettingsOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={
          <Box display="flex" alignItems="center">
            <FileCopyIcon sx={{ mr: 1 }} />
            <Typography>{snackbarMessage}</Typography>
          </Box>
        }
        TransitionComponent={Fade}
      />
    </ThemeProvider>
  );
};

export default App;