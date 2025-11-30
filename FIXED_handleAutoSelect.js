// FIXED handleAutoSelect function with random combination generator
// Replace lines 366-431 in App.js with this function

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

    // Generate random combinations from all available Unicode spaces
    const allSpaceKeys = Object.keys(unicodeSpaces);
    const numCombinationsToTest = 20; // Test 20 random combinations
    const candidates = [];

    // Helper function to generate a random combination (max 3 spaces)
    const generateRandomCombination = () => {
        const numSpaces = Math.floor(Math.random() * 3) + 1; // 1-3 spaces per combination
        const combination = [];
        const availableKeys = [...allSpaceKeys];

        for (let i = 0; i < numSpaces; i++) {
            const randomIndex = Math.floor(Math.random() * availableKeys.length);
            combination.push(availableKeys[randomIndex]);
            availableKeys.splice(randomIndex, 1); // Remove to avoid duplicates in same combo
        }

        return combination;
    };

    // Generate unique random combinations
    const seenCombinations = new Set();
    while (candidates.length < numCombinationsToTest) {
        const combo = generateRandomCombination();
        const comboKey = combo.sort().join('|'); // Sort to detect duplicates

        if (!seenCombinations.has(comboKey)) {
            seenCombinations.add(comboKey);
            candidates.push(combo);
        }
    }

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
