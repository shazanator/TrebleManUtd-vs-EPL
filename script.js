// Player database for Man Utd 1998-99
const manutd99 = {
    teamName: "Manchester United 1998-99",
    players: [
        { id: 1, name: "Peter Schmeichel", position: "GK", rating: 92 },
        { id: 2, name: "Gary Neville", position: "RB", rating: 85 },
        { id: 3, name: "Denis Irwin", position: "LB", rating: 87 },
        { id: 4, name: "Jaap Stam", position: "CB", rating: 90 },
        { id: 5, name: "Ronny Johnsen", position: "CB", rating: 84 },
        { id: 6, name: "Roy Keane", position: "CM", rating: 93 },
        { id: 7, name: "David Beckham", position: "RM", rating: 89 },
        { id: 8, name: "Paul Scholes", position: "CM", rating: 91 },
        { id: 9, name: "Ryan Giggs", position: "LM", rating: 90 },
        { id: 10, name: "Andy Cole", position: "ST", rating: 88 },
        { id: 11, name: "Dwight Yorke", position: "ST", rating: 89 },
        { id: 12, name: "Ole Gunnar Solskjær", position: "ST", rating: 86 },
        { id: 13, name: "Teddy Sheringham", position: "ST", rating: 85 },
        { id: 14, name: "Nicky Butt", position: "CM", rating: 83 },
        { id: 15, name: "Jesper Blomqvist", position: "LM", rating: 82 }
    ],
    formation: "4-4-2",
    strengths: ["Team Spirit", "Late Goals", "Wing Play", "Defensive Solidity"],
    weaknesses: ["Squad Depth", "European Experience"]
};

// Modern team templates
const modernTeams = {
    mancity: {
        name: "Manchester City 2023",
        rating: 94,
        style: "Possession-based",
        keyPlayers: ["Haaland", "De Bruyne", "Rodri"]
    },
    arsenal: {
        name: "Arsenal 2023",
        rating: 89,
        style: "Attacking Football",
        keyPlayers: ["Saka", "Ødegaard", "Rice"]
    },
    liverpool: {
        name: "Liverpool 2023",
        rating: 90,
        style: "High Press",
        keyPlayers: ["Salah", "Van Dijk", "Alexander-Arnold"]
    },
    chelsea: {
        name: "Chelsea 2023",
        rating: 84,
        style: "Transition Play",
        keyPlayers: ["Sterling", "Enzo", "James"]
    },
    tottenham: {
        name: "Tottenham 2023",
        rating: 86,
        style: "Counter-Attack",
        keyPlayers: ["Son", "Kane", "Maddison"]
    },
    newcastle: {
        name: "Newcastle 2023",
        rating: 87,
        style: "Physical Play",
        keyPlayers: ["Isak", "Guimarães", "Trippier"]
    }
};

// Commentary snippets
const commentaries = [
    "Typical Fergie time! United steal it at the death!",
    "The Class of '99 showing these youngsters how it's done",
    "VAR would have ruled out half these goals in 1999",
    "Roy Keane just murdered their midfield - and it's only a yellow!",
    "Beckham's crosses vs modern fullbacks - a tactical nightmare",
    "The treble winners showing their legendary mentality",
    "Modern fitness vs old-school grit - what a battle!",
    "Schmeichel would be booked every game with today's rules",
    "They don't make defenders like Jaap Stam anymore",
    "Giggs would cost £150m in today's market"
];

// DOM elements
const opponentSelect = document.getElementById('opponent-select');
const simulateBtn = document.getElementById('simulate-btn');
const manutdScoreEl = document.getElementById('manutd-score');
const opponentScoreEl = document.getElementById('opponent-score');
const opponentNameEl = document.getElementById('opponent-name');
const goalsList = document.getElementById('goals-list');
const cardsList = document.getElementById('cards-list');
const potmEl = document.getElementById('potm');
const commentaryEl = document.getElementById('match-commentary');
const matchResult = document.getElementById('match-result');
const simulateAgainBtn = document.getElementById('simulate-again');

// Chart initialization
const statsCtx = document.getElementById('statsChart');
let statsChart;

// Event listeners
simulateBtn.addEventListener('click', simulateMatch);
simulateAgainBtn.addEventListener('click', resetSimulation);

// Main simulation function
function simulateMatch() {
    const opponent = opponentSelect.value;
    if (!opponent) {
        alert("Please select an opponent first!");
        return;
    }

    // Show loading state
    matchResult.style.display = 'none';
    document.body.classList.add('loading');

    // Simulate with slight delay for realism
    setTimeout(() => {
        const result = calculateMatch(opponent);
        displayResult(result);
        document.body.classList.remove('loading');
        matchResult.style.display = 'block';
        
        // Scroll to results
        matchResult.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

function calculateMatch(opponentKey) {
    const opponent = modernTeams[opponentKey];
    
    // Base probabilities
    const manutdStrength = 92; // Average team rating
    const opponentStrength = opponent.rating;
    
    // Calculate goal probabilities
    const manutdGoals = weightedRandom(0, 4, manutdStrength / 100);
    const opponentGoals = weightedRandom(0, 3, opponentStrength / 100);
    
    // Special consideration for Fergie Time (20% chance of late goal)
    if (Math.random() < 0.2) {
        manutdGoals = Math.min(manutdGoals + 1, 5);
    }
    
    // Generate match events
    const events = generateMatchEvents(manutdGoals, opponentGoals);
    
    return {
        manutdGoals,
        opponentGoals,
        opponentName: opponent.name,
        events,
        stats: generateMatchStats(manutdGoals, opponentGoals),
        potm: determinePOTM(events),
        commentary: commentaries[Math.floor(Math.random() * commentaries.length)]
    };
}

function weightedRandom(min, max, weight) {
    // More weight = higher probability of higher numbers
    const base = Math.random() * Math.random() * (max - min + 1);
    return Math.floor(base * weight) + min;
}

function generateMatchEvents(manutdGoals, opponentGoals) {
    const events = [];
    
    // Generate goals
    for (let i = 0; i < manutdGoals; i++) {
        const scorer = getRandomPlayer(manutd99.players.filter(p => 
            p.position !== 'GK' && p.rating > 80));
        const assister = Math.random() < 0.7 ? getRandomPlayer(manutd99.players.filter(p => 
            p.id !== scorer.id && (p.position === 'RM' || p.position === 'LM' || p.position === 'CM'))) : null;
        
        events.push({
            type: 'goal',
            team: 'manutd',
            scorer: scorer.name,
            assister: assister ? assister.name : null,
            minute: weightedRandom(1, 90, 0.7) // More goals in second half
        });
    }
    
    for (let i = 0; i < opponentGoals; i++) {
        events.push({
            type: 'goal',
            team: 'opponent',
            scorer: getRandomPlayerName(modernTeams[opponentSelect.value].keyPlayers),
            minute: weightedRandom(1, 90, 0.7)
        });
    }
    
    // Generate cards (more for Man Utd - old school tackling!)
    const cardCount = weightedRandom(2, 6, 0.5);
    for (let i = 0; i < cardCount; i++) {
        events.push({
            type: Math.random() < 0.8 ? 'yellow' : 'red',
            team: Math.random() < 0.7 ? 'manutd' : 'opponent',
            player: Math.random() < 0.7 ? 
                getRandomPlayer(manutd99.players.filter(p => ['CM', 'CB', 'RB', 'LB'].includes(p.position))).name :
                'Opposition Player',
            minute: weightedRandom(1, 90, 0.5)
        });
    }
    
    // Sort events by minute
    return events.sort((a, b) => a.minute - b.minute);
}

function generateMatchStats(manutdGoals, opponentGoals) {
    return {
        possession: weightedRandom(40, 60, 0.5),
        shots: manutdGoals * 3 + weightedRandom(5, 15, 0.5),
        shotsOnTarget: manutdGoals + weightedRandom(2, 8, 0.5),
        fouls: weightedRandom(10, 20, 0.7),
        corners: weightedRandom(3, 10, 0.5),
        offsides: weightedRandom(1, 6, 0.3)
    };
}

function determinePOTM(events) {
    // Count goal contributions
    const contributions = {};
    
    events.forEach(event => {
        if (event.type === 'goal') {
            if (event.team === 'manutd') {
                contributions[event.scorer] = (contributions[event.scorer] || 0) + 2;
                if (event.assister) {
                    contributions[event.assister] = (contributions[event.assister] || 0) + 1;
                }
            }
        }
    });
    
    // Find max contributor
    let maxScore = 0;
    let potm = "Roy Keane"; // Default to Keano
    
    for (const [player, score] of Object.entries(contributions)) {
        if (score > maxScore) {
            maxScore = score;
            potm = player;
        }
    }
    
    // 30% chance it's just Keane for being Keane
    if (Math.random() < 0.3) {
        return "Roy Keane (because he's Roy Keane)";
    }
    
    return potm;
}

function displayResult(result) {
    // Update scoreline
    manutdScoreEl.textContent = result.manutdGoals;
    opponentScoreEl.textContent = result.opponentGoals;
    opponentNameEl.textContent = result.opponentName;
    
    // Update goals list
    goalsList.innerHTML = result.events
        .filter(e => e.type === 'goal')
        .map(e => {
            if (e.team === 'manutd') {
                return `<li>${e.minute}' - ${e.scorer} ${e.assister ? `(assist: ${e.assister})` : ''}</li>`;
            } else {
                return `<li>${e.minute}' - ${e.scorer} (${result.opponentName})</li>`;
            }
        })
        .join('');
    
    // Update cards list
    cardsList.innerHTML = result.events
        .filter(e => e.type === 'yellow' || e.type === 'red')
        .map(e => {
            const card = e.type === 'yellow' ? '🟨' : '🟥';
            return `<li>${e.minute}' - ${card} ${e.player} ${e.team === 'manutd' ? '(Man Utd)' : `(${result.opponentName})`}</li>`;
        })
        .join('');
    
    // Update POTM and commentary
    potmEl.textContent = result.potm;
    commentaryEl.textContent = result.commentary;
    
    // Create/update stats chart
    if (statsChart) {
        statsChart.destroy();
    }
    
    statsChart = new Chart(statsCtx, {
        type: 'bar',
        data: {
            labels: ['Possession %', 'Shots', 'Shots on Target', 'Fouls', 'Corners', 'Offsides'],
            datasets: [
                {
                    label: 'Man Utd 1999',
                    data: [
                        result.stats.possession,
                        result.stats.shots,
                        result.stats.shotsOnTarget,
                        result.stats.fouls,
                        result.stats.corners,
                        result.stats.offsides
                    ],
                    backgroundColor: 'rgba(218, 2, 14, 0.7)',
                    borderColor: 'rgba(218, 2, 14, 1)',
                    borderWidth: 1
                },
                {
                    label: result.opponentName,
                    data: [
                        100 - result.stats.possession,
                        result.stats.shots + weightedRandom(-3, 3, 0.5),
                        result.stats.shotsOnTarget + weightedRandom(-2, 2, 0.5),
                        result.stats.fouls + weightedRandom(-3, 3, 0.5),
                        result.stats.corners + weightedRandom(-2, 2, 0.5),
                        result.stats.offsides + weightedRandom(-1, 1, 0.5)
                    ],
                    backgroundColor: 'rgba(61, 25, 91, 0.7)',
                    borderColor: 'rgba(61, 25, 91, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Match Statistics Comparison',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
    
    // Add animations
    animateScoreline();
}

function animateScoreline() {
    anime({
        targets: [manutdScoreEl, opponentScoreEl],
        scale: [1.5, 1],
        duration: 1000,
        easing: 'easeOutElastic'
    });
}

function resetSimulation() {
    matchResult.style.display = 'none';
    opponentSelect.value = '';
}

// Helper functions
function getRandomPlayer(players) {
    return players[Math.floor(Math.random() * players.length)];
}

function getRandomPlayerName(players) {
    return players[Math.floor(Math.random() * players.length)];
}

// Initialize
if (statsChart) {
    statsChart.destroy();
}