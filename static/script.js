let currentPage = 1;
let totalGames = 0;

async function getUserGames() {
    const username = document.getElementById('steam-username').value;
    if (!username) {
        alert('Por favor, insira um nome de usuário Steam!');
        return;
    }

    try {
        const response = await fetch(`/user_games?username=${username}&page=${currentPage}`);
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        totalGames = data.total_games;
        const gameList = document.getElementById('game-list');
        gameList.innerHTML = ''; // Limpa os jogos anteriores

        data.games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
        
            // Criando o link para a página do Steam
            const link = document.createElement('a');
            link.href = `https://store.steampowered.com/app/${game.appid}`;
            link.target = '_blank';
        
            const img = document.createElement('img');
            img.src = game.img;
            img.alt = game.name;
        
            const info = document.createElement('div');
            info.className = 'game-info';
        
            const title = document.createElement('h3');
            title.textContent = game.name;
        
            info.appendChild(title);
            card.appendChild(link); 
            link.appendChild(img);  
            card.appendChild(info);
            gameList.appendChild(card);
        });
        

        document.getElementById('game-list-container').style.display = 'block';

        if (currentPage * 15 < totalGames) {
            document.getElementById('load-more-btn').style.display = 'block';
        } else {
            document.getElementById('load-more-btn').style.display = 'none';
        }

        recommendGames(data.game_names);
    } catch (error) {
        alert('Erro ao obter os jogos do usuário!');
    }
}

async function recommendGames(games) {
    try {
        // Exibir o carregamento
        document.getElementById('loading-container').style.display = 'flex';

        const response = await fetch('/recommend_games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ games_names: games })
        });
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        data.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = rec;
            recommendationsList.appendChild(li);
        });

        document.getElementById('recommendation-container').style.display = 'block';
    } catch (error) {
        alert('Erro ao obter recomendações de jogos!');
    } finally {
        // Ocultar o carregamento
        document.getElementById('loading-container').style.display = 'none';
    }
}

document.getElementById('load-more-btn').addEventListener('click', function() {
    currentPage++;
    getUserGames();
});

document.getElementById('steam-username').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        currentPage = 1;
        getUserGames();
    }
});
