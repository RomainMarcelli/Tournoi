
// Créer des équipes
var teams = [];
var poolCounts = { A: 0, B: 0 };

// Gestionnaire d'événements pour la frappe de touche
function handleKeyPress(event) {
    if (event.keyCode === 13) {
        addTeam();
    }
}

// Ajouter une équipe
function addTeam() {
    var teamName = document.getElementById('teamName').value;
    var poolSelection = document.getElementById('poolSelection').value;
    if (teamName) {
        teams.push({ name: teamName, pool: poolSelection, stats: { played: 0, wins: 0, draws: 0, losses: 0, points: 0 } });
        poolCounts[poolSelection]++;
        displayTeams();
        document.getElementById('teamName').value = '';
    }
    checkStartButton();
}

// Afficher les équipes
function displayTeams() {
    var poolA = document.getElementById('poolA');
    var poolB = document.getElementById('poolB');
    poolA.innerHTML = '';
    poolB.innerHTML = '';
    teams.forEach(team => {
        var teamDiv = document.createElement('tr');
        teamDiv.className = 'team';
        teamDiv.innerHTML = `<td>${team.name}</td>
                             <td contenteditable="true">${team.stats.played}</td>
                             <td contenteditable="true">${team.stats.wins}</td>
                             <td contenteditable="true">${team.stats.draws}</td>
                             <td contenteditable="true">${team.stats.losses}</td>
                             <td>${team.stats.points}</td>
                             <td><button onclick="deleteTeam('${team.name}')">Supprimer</button></td>`;
        if (team.pool === 'A') {
            poolA.appendChild(teamDiv);
        } else {
            poolB.appendChild(teamDiv);
        }
    });
}

// Supprimer une équipe
function deleteTeam(teamName) {
    var index = teams.findIndex(team => team.name === teamName);
    if (index !== -1) {
        var teamToDelete = teams[index];
        poolCounts[teamToDelete.pool]--;
        teams.splice(index, 1);
        displayTeams();
        checkStartButton();
    }
}

// Vérifier si le bouton de démarrage doit être affiché
function checkStartButton() {
    if (poolCounts['A'] >= 4 && poolCounts['B'] >= 4) {
        document.getElementById('startButton').style.display = 'block';
    } else {
        document.getElementById('startButton').style.display = 'none';
    }
}

// Démarrer le tournoi
function startTournament() {
    var poolA = teams.filter(team => team.pool === 'A');
    var poolB = teams.filter(team => team.pool === 'B');
    poolA.sort((a, b) => (a.name > b.name) ? 1 : -1);
    poolB.sort((a, b) => (a.name > b.name) ? 1 : -1);
    displayRankings(poolA, 'A');
    displayRankings(poolB, 'B');
}

// Calculer les points en fonction des statistiques de l'équipe
function calculatePoints(team) {
    team.stats.points = (team.stats.wins * 3) + team.stats.draws;
}

// Gestionnaire d'événements pour la modification des statistiques d'une équipe
function handleStatsChange(event, teamName, statType) {
    var newValue = parseInt(event.target.textContent);
    var teamIndex = teams.findIndex(team => team.name === teamName);
    if (teamIndex !== -1) {
        var team = teams[teamIndex];
        if (!isNaN(newValue)) {
            team.stats[statType] = newValue;
            calculatePoints(team);
            displayTeams();
        }
    }
}

// Fonction pour comparer les équipes en fonction de leurs points
function compareTeams(a, b) {
    return b.stats.points - a.stats.points; // Trie par ordre décroissant des points
}

/// Afficher les équipes classées par ordre de points
function displayTeams() {
    var poolA = document.getElementById('poolA');
    var poolB = document.getElementById('poolB');
    poolA.innerHTML = '';
    poolB.innerHTML = '';
    
    // Trier les équipes par ordre décroissant de points
    teams.sort((a, b) => b.stats.points - a.stats.points);
    
    teams.forEach((team, index) => {
        var teamDiv = document.createElement('tr');
        teamDiv.className = 'team';
        teamDiv.innerHTML = `<td>${index + 1}</td>
                             <td>${team.name}</td>
                             <td contenteditable="true" onblur="handleStatsChange(event, '${team.name}', 'played')">${team.stats.played}</td>
                             <td contenteditable="true" onblur="handleStatsChange(event, '${team.name}', 'wins')">${team.stats.wins}</td>
                             <td contenteditable="true" onblur="handleStatsChange(event, '${team.name}', 'draws')">${team.stats.draws}</td>
                             <td contenteditable="true" onblur="handleStatsChange(event, '${team.name}', 'losses')">${team.stats.losses}</td>
                             <td>${team.stats.points}</td>
                             <td><button onclick="deleteTeam('${team.name}')">Supprimer</button></td>`;
        if (team.pool === 'A') {
            poolA.appendChild(teamDiv);
        } else {
            poolB.appendChild(teamDiv);
        }
    });
}

// Afficher les classements de chaque poule
function displayRankings(pool, poolName) {
    var poolTeams = teams.filter(team => team.pool === pool); // Filtrer les équipes par pool
    poolTeams.sort((a, b) => b.stats.points - a.stats.points); // Trier les équipes par points

    // Afficher le classement pour cette poule
    var rankingText = `<h2>Classement de la Poule ${poolName}</h2>
               <table>
                   <thead>
                       <tr>
                           <th>Classement</th>
                           <th>Équipe</th>
                           <th>Matchs Joués</th>
                           <th>Victoires</th>
                           <th>Matchs Nuls</th>
                           <th>Défaites</th>
                           <th>Points</th>
                       </tr>
                   </thead>
                   <tbody>`;
    // Initialiser le classement à 1 pour cette poule
    var rank = 1;
    // Afficher chaque équipe avec son classement
    poolTeams.forEach((team) => {
        rankingText += `<tr>
                    <td>${rank}</td>
                    <td>${team.name}</td>
                    <td>${team.stats.played}</td>
                    <td>${team.stats.wins}</td>
                    <td>${team.stats.draws}</td>
                    <td>${team.stats.losses}</td>
                    <td>${team.stats.points}</td>
                </tr>`;
        rank++; // Incrémenter le classement pour la prochaine équipe
    });
    rankingText += '</tbody></table>';
    document.body.insertAdjacentHTML('beforeend', rankingText);
}


