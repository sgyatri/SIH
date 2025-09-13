// Global state
let currentLetterIndex = 0;
let quizActive = false;
let quizTimeLeft = 60;
let quizScore = 0;
let quizCorrect = 0;
let quizIncorrect = 0;
let quizInterval = null;
let matchPairs = 0;
let matchMoves = 0;
let matchTimeLeft = 120;
let matchInterval = null;
let selectedCards = [];
let matchedCards = [];
let cameraStream = null;
let cameraActive = false;
let tutorialCameraStream = null; // Added for tutorial camera

// ASL Data with actual image URLs
const aslData = {
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    descriptions: {
        A: "Make a fist with your thumb held against the side of your hand.",
        B: "Hold your hand straight up with fingers together and thumb folded across palm.",
        C: "Form a C shape with your hand, with fingers slightly curved.",
        D: "Point your index finger up, with other fingers folded and thumb resting on them.",
        E: "With your hand in a fist, curl your fingers down over your thumb.",
        F: "Touch thumb to index finger, forming a circle, with other fingers extended.",
        G: "Point your index finger and extend your thumb, forming a gun-like shape.",
        H: "Point your index and middle fingers together, extending them forward.",
        I: "Extend your pinky finger upward with other fingers folded into your palm.",
        J: "Form the letter I then draw a J in the air.",
        K: "Make a V shape with index and middle fingers, thumb placed between them.",
        L: "Extend your index finger and thumb to form an L shape.",
        M: "Tuck your thumb under your first three fingers.",
        N: "Tuck your thumb under your first two fingers.",
        O: "Form a circle by touching tips of all fingers to your thumb.",
        P: "Form the letter K then point your hand downward.",
        Q: "Form the letter G then point your hand downward.",
        R: "Cross your middle finger over your index finger.",
        S: "Make a fist with your thumb folded across the front.",
        T: "Make a fist with thumb tucked between index and middle fingers.",
        U: "Extend index and middle fingers together upward.",
        V: "Form a V shape with index and middle fingers.",
        W: "Extend index, middle, and ring fingers to form a W shape.",
        X: "Curve your index finger like a hook.",
        Y: "Extend thumb and pinky finger while keeping other fingers folded.",
        Z: "Draw a Z in the air with your index finger."
    },
    // Using free ASL images from an educational site
    imageUrls: {
        A: "https://media.baamboozle.com/uploads/images/190665/1608397021_124160",
        B: "https://media.baamboozle.com/uploads/images/190665/1608397065_129624",
        C: "https://media.baamboozle.com/uploads/images/190665/1608397114_137651",
        D: "https://media.baamboozle.com/uploads/images/190665/1608397155_125244",
        E: "https://media.baamboozle.com/uploads/images/190665/1608397184_135387",
        F: "https://media.baamboozle.com/uploads/images/190665/1608397215_124715",
        G: "https://media.baamboozle.com/uploads/images/190665/1608397256_118071",
        H: "https://media.baamboozle.com/uploads/images/190665/1608397291_111991",
        I: "https://media.baamboozle.com/uploads/images/190665/1608397356_147552",
        J: "https://media.baamboozle.com/uploads/images/190665/1608397376_163909",
        K: "https://media.baamboozle.com/uploads/images/190665/1608397399_129402",
        L: "https://media.baamboozle.com/uploads/images/190665/1608397463_138205",
        M: "https://media.baamboozle.com/uploads/images/190665/1608397480_137653",
        N: "https://media.baamboozle.com/uploads/images/190665/1608397504_147138",
        O: "https://media.baamboozle.com/uploads/images/190665/1608397567_143251",
        P: "https://media.baamboozle.com/uploads/images/190665/1608397602_104501",
        Q: "https://media.baamboozle.com/uploads/images/190665/1608397647_119087",
        R: "https://media.baamboozle.com/uploads/images/190665/1608397683_120388",
        S: "https://media.baamboozle.com/uploads/images/190665/1608397711_146806",
        T: "https://media.baamboozle.com/uploads/images/190665/1608397736_137928",
        U: "https://media.baamboozle.com/uploads/images/190665/1608397765_128440",
        V: "https://media.baamboozle.com/uploads/images/190665/1608397806_138178",
        W: "https://media.baamboozle.com/uploads/images/190665/1608397828_148709",
        X: "https://media.baamboozle.com/uploads/images/190665/1608397876_151653",
        Y: "https://media.baamboozle.com/uploads/images/190665/1608397909_138670",
        Z: "https://media.baamboozle.com/uploads/images/190665/1608397937_134970"
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTutorial();
    initializeQuiz();
    initializeMatchGame();
    initializeChallenge();
    initializeCamera();
});

// Camera functionality
function initializeCamera() {
    const enableBtn = document.getElementById('enable-cam-btn');
    const tutorialEnableBtn = document.getElementById('tutorial-enable-cam');
    const tipsBtn = document.getElementById('tips-btn');
    
    enableBtn.addEventListener('click', toggleMainCamera);
    tutorialEnableBtn.addEventListener('click', toggleTutorialCamera);
    tipsBtn.addEventListener('click', showCameraTips);
}

async function toggleMainCamera() {
    const enableBtn = document.getElementById('enable-cam-btn');
    const camPreview = document.getElementById('main-cam-preview');
    const camStatus = document.getElementById('cam-status');
    
    try {
        if (!cameraActive) {
            // Enable camera
            cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user" 
                },
                audio: false 
            });
            
            // Create video element if it doesn't exist
            let videoElement = camPreview.querySelector('video');
            if (!videoElement) {
                videoElement = document.createElement('video');
                videoElement.autoplay = true;
                videoElement.muted = true;
                camPreview.innerHTML = '';
                camPreview.appendChild(videoElement);
            }
            
            videoElement.srcObject = cameraStream;
            cameraActive = true;
            enableBtn.textContent = "Disable Cam";
            camStatus.textContent = "Status: Active";
            
            // Simulate latency measurement
            setInterval(() => {
                document.getElementById('cam-latency').textContent = `Latency: ${Math.floor(Math.random() * 20) + 10}ms`;
            }, 1000);
            
        } else {
            // Disable camera
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraStream = null;
            }
            
            camPreview.innerHTML = '<div style="text-align:center"><div style="font-size:36px">🎥</div><p class="small" style="margin-top:8px">Webcam + hand-tracking placeholder</p></div>';
            cameraActive = false;
            enableBtn.textContent = "Enable Cam";
            camStatus.textContent = "Status: Idle";
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera: ' + error.message);
        enableBtn.textContent = "Enable Cam";
        camStatus.textContent = "Status: Error";
    }
}

async function toggleTutorialCamera() {
    const enableBtn = document.getElementById('tutorial-enable-cam');
    const camPreview = document.getElementById('tutorial-cam-preview');
    const errorDiv = document.getElementById('tutorial-cam-error');
    
    try {
        if (!tutorialCameraStream) {
            // Enable camera
            tutorialCameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 320 },
                    height: { ideal: 240 },
                    facingMode: "user" 
                },
                audio: false 
            });
            
            const videoElement = document.createElement('video');
            videoElement.autoplay = true;
            videoElement.muted = true;
            videoElement.srcObject = tutorialCameraStream;
            
            camPreview.innerHTML = '';
            camPreview.appendChild(videoElement);
            enableBtn.textContent = "Disable Camera";
            errorDiv.style.display = 'none';
            
        } else {
            // Disable camera
            if (tutorialCameraStream) {
                tutorialCameraStream.getTracks().forEach(track => track.stop());
                tutorialCameraStream = null;
            }
            
            camPreview.innerHTML = '<span id="tutorial-cam-placeholder">Camera preview</span>';
            enableBtn.textContent = "Enable Camera";
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
        errorDiv.textContent = 'Camera error: ' + error.message;
        errorDiv.style.display = 'block';
        enableBtn.textContent = "Enable Camera";
    }
}

function showCameraTips() {
    alert("Tips for using the ASL camera:\n\n1. Ensure good lighting on your hands\n2. Keep your hands visible to the camera\n3. Make clear, distinct signs\n4. Position yourself about 2-3 feet from the camera\n5. Practice each sign slowly before trying at speed");
}

// Tutorial functionality
function initializeTutorial() {
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');
    const letterDisplay = document.getElementById('asl-letter');
    const signDisplay = document.getElementById('asl-sign-display');
    const descriptionDisplay = document.getElementById('asl-description');
    
    // Set up navigation
    prevBtn.addEventListener('click', () => navigateTutorial(-1));
    nextBtn.addEventListener('click', () => navigateTutorial(1));
    
    // Initial display
    updateTutorialDisplay();
}

function navigateTutorial(direction) {
    currentLetterIndex += direction;
    
    // Boundary checking
    if (currentLetterIndex < 0) currentLetterIndex = aslData.letters.length - 1;
    if (currentLetterIndex >= aslData.letters.length) currentLetterIndex = 0;
    
    updateTutorialDisplay();
}

function updateTutorialDisplay() {
    const letter = aslData.letters[currentLetterIndex];
    document.getElementById('asl-letter').textContent = letter;
    
    // Use actual ASL image instead of text
    const signDisplay = document.getElementById('asl-sign-display');
    signDisplay.innerHTML = ''; // Clear previous content
    signDisplay.style.background = 'transparent';
    
    const img = document.createElement('img');
    img.src = aslData.imageUrls[letter];
    img.alt = `ASL sign for ${letter}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    signDisplay.appendChild(img);
    
    document.getElementById('asl-description').textContent = aslData.descriptions[letter];
    
    // Update button states
    document.getElementById('tutorial-prev').disabled = currentLetterIndex === 0;
    document.getElementById('tutorial-next').disabled = currentLetterIndex === aslData.letters.length - 1;
}

// Quiz functionality
function initializeQuiz() {
    const quizOptions = document.getElementById('quiz-options');
    
    // Set up option click events
    quizOptions.querySelectorAll('.match-card').forEach(card => {
        card.addEventListener('click', () => {
            if (!quizActive) startQuiz();
            checkQuizAnswer(card.dataset.letter);
        });
    });
    
    // Set up modal open event to reset quiz
    document.getElementById('act2').addEventListener('click', function(e) {
        if (e.target === this) resetQuiz();
    });
}

function startQuiz() {
    quizActive = true;
    quizTimeLeft = 60;
    quizScore = 0;
    quizCorrect = 0;
    quizIncorrect = 0;
    
    updateQuizStats();
    document.getElementById('quiz-timer').textContent = `⏱ ${quizTimeLeft}s`;
    
    // Start timer
    quizInterval = setInterval(() => {
        quizTimeLeft--;
        document.getElementById('quiz-timer').textContent = `⏱ ${quizTimeLeft}s`;
        
        if (quizTimeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
    
    generateQuizQuestion();
}

function generateQuizQuestion() {
    // Select a random letter (not the same as previous)
    let randomLetter;
    do {
        randomLetter = aslData.letters[Math.floor(Math.random() * aslData.letters.length)];
    } while (randomLetter === document.getElementById('quiz-sign-display').dataset.letter);
    
    // Use actual ASL image
    const signDisplay = document.getElementById('quiz-sign-display');
    signDisplay.innerHTML = '';
    signDisplay.dataset.letter = randomLetter;
    signDisplay.style.background = 'transparent';
    
    const img = document.createElement('img');
    img.src = aslData.imageUrls[randomLetter];
    img.alt = `ASL sign for ${randomLetter}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    signDisplay.appendChild(img);
    
    // Generate options (include correct answer and random others)
    const options = [randomLetter];
    while (options.length < 6) {
        const randomOption = aslData.letters[Math.floor(Math.random() * aslData.letters.length)];
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    // Update option displays
    const optionElements = document.getElementById('quiz-options').querySelectorAll('.match-card');
    optionElements.forEach((element, index) => {
        element.textContent = options[index];
        element.dataset.letter = options[index];
    });
}

function checkQuizAnswer(selectedLetter) {
    const correctLetter = document.getElementById('quiz-sign-display').dataset.letter;
    
    if (selectedLetter === correctLetter) {
        // Correct answer
        quizScore += 10;
        quizCorrect++;
        document.getElementById('tutorial-feedback').textContent = "Correct! 👍";
        document.getElementById('tutorial-feedback').style.color = "var(--ok)";
    } else {
        // Incorrect answer
        quizScore = Math.max(0, quizScore - 5);
        quizIncorrect++;
        document.getElementById('tutorial-feedback').textContent = "Incorrect! Try again. 👎";
        document.getElementById('tutorial-feedback').style.color = "var(--danger)";
    }
    
    updateQuizStats();
    
    // Next question after a brief delay
    setTimeout(() => {
        document.getElementById('tutorial-feedback').textContent = "";
        generateQuizQuestion();
    }, 1000);
}

function updateQuizStats() {
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-correct').textContent = quizCorrect;
    document.getElementById('quiz-incorrect').textContent = quizIncorrect;
}

function endQuiz() {
    quizActive = false;
    clearInterval(quizInterval);
    
    alert(`Quiz over!\nScore: ${quizScore}\nCorrect: ${quizCorrect}\nIncorrect: ${quizIncorrect}`);
}

function resetQuiz() {
    quizActive = false;
    clearInterval(quizInterval);
    document.getElementById('quiz-timer').textContent = "⏱ 60s";
    document.getElementById('quiz-sign-display').textContent = "?";
    document.getElementById('tutorial-feedback').textContent = "";
}

// Match game functionality
function initializeMatchGame() {
    // Set up modal open event to reset and start game
    document.getElementById('act3').addEventListener('click', function(e) {
        if (e.target === this) {
            resetMatchGame();
            startMatchGame();
        }
    });
}

function startMatchGame() {
    matchPairs = 0;
    matchMoves = 0;
    matchTimeLeft = 120;
    selectedCards = [];
    matchedCards = [];
    
    document.getElementById('match-timer').textContent = `⏱ ${matchTimeLeft}s`;
    document.getElementById('match-pairs').textContent = "0";
    document.getElementById('match-moves').textContent = "0";
    
    // Create match pairs (6 pairs for 12 cards)
    const letters = [];
    while (letters.length < 6) {
        const randomLetter = aslData.letters[Math.floor(Math.random() * aslData.letters.length)];
        if (!letters.includes(randomLetter)) {
            letters.push(randomLetter);
        }
    }
    
    // Duplicate to create pairs
    const cardValues = [...letters, ...letters];
    
    // Shuffle cards
    cardValues.sort(() => Math.random() - 0.5);
    
    // Create card elements
    const matchBoard = document.getElementById('match-board');
    matchBoard.innerHTML = '';
    
    cardValues.forEach((letter, index) => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.dataset.index = index;
        card.dataset.letter = letter;
        card.textContent = '?';
        card.addEventListener('click', () => selectMatchCard(card));
        matchBoard.appendChild(card);
    });
    
    // Start timer
    matchInterval = setInterval(() => {
        matchTimeLeft--;
        document.getElementById('match-timer').textContent = `⏱ ${matchTimeLeft}s`;
        
        if (matchTimeLeft <= 0) {
            endMatchGame();
        }
    }, 1000);
}

function selectMatchCard(card) {
    // Ignore if already selected or matched
    if (card.classList.contains('selected') || card.classList.contains('matched') || selectedCards.length >= 2) {
        return;
    }
    
    // Show the card
    card.textContent = card.dataset.letter;
    card.classList.add('selected');
    selectedCards.push(card);
    
    // If two cards are selected, check for match
    if (selectedCards.length === 2) {
        matchMoves++;
        document.getElementById('match-moves').textContent = matchMoves;
        
        const [card1, card2] = selectedCards;
        
        if (card1.dataset.letter === card2.dataset.letter) {
            // Match found
            setTimeout(() => {
                card1.classList.remove('selected');
                card2.classList.remove('selected');
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                matchedCards.push(card1, card2);
                selectedCards = [];
                
                matchPairs++;
                document.getElementById('match-pairs').textContent = matchPairs;
                
                // Check for game completion
                if (matchPairs >= 6) {
                    endMatchGame();
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.textContent = '?';
                card2.textContent = '?';
                card1.classList.remove('selected');
                card2.classList.remove('selected');
                selectedCards = [];
            }, 1000);
        }
    }
}

function endMatchGame() {
    clearInterval(matchInterval);
    
    if (matchTimeLeft <= 0) {
        alert("Time's up! Game over.");
    } else {
        alert(`Congratulations! You found all pairs in ${matchMoves} moves with ${matchTimeLeft} seconds left.`);
    }
}

function resetMatchGame() {
    clearInterval(matchInterval);
    document.getElementById('match-timer').textContent = "⏱ 120s";
}

// Challenge functionality
function initializeChallenge() {
    const checkBtn = document.getElementById('challenge-check');
    const nextBtn = document.getElementById('challenge-next');
    
    checkBtn.addEventListener('click', checkChallengeSign);
    nextBtn.addEventListener('click', nextChallengeSign);
    
    // Initial sign
    nextChallengeSign();
}

function nextChallengeSign() {
    const randomIndex = Math.floor(Math.random() * aslData.letters.length);
    const letter = aslData.letters[randomIndex];
    
    // Use actual ASL image
    const signDisplay = document.getElementById('challenge-sign-display');
    signDisplay.innerHTML = '';
    signDisplay.style.background = 'transparent';
    
    const img = document.createElement('img');
    img.src = aslData.imageUrls[letter];
    img.alt = `ASL sign for ${letter}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    signDisplay.appendChild(img);
    
    document.getElementById('challenge-letter').textContent = letter;
    document.getElementById('challenge-description').textContent = aslData.descriptions[letter];
}

function checkChallengeSign() {
    // In a real app, this would use the camera to check the sign
    // For now, we'll just show a message
    document.getElementById('tutorial-feedback').textContent = "Camera sign checking would happen here!";
    document.getElementById('tutorial-feedback').style.color = "var(--brand)";
    
    // Clear message after 2 seconds
    setTimeout(() => {
        document.getElementById('tutorial-feedback').textContent = "";
    }, 2000);
}