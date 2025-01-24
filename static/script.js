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
    document.getElementById("loading-container").style.display = "flex"

    const response = await fetch("/recommend_games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ games_names: games }),
    })
    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    const recommendationsList = document.getElementById("recommendations-list")
    recommendationsList.innerHTML = ""

    if (data.recommendations && Array.isArray(data.recommendations)) {
      data.recommendations.forEach((rec) => {
        const card = document.createElement("div")
        card.className = "recommendation-card"

        card.innerHTML = `
                    <img src="${rec.img}" alt="${rec.title}" class="recommendation-img">
                    <div class="recommendation-content">
                        <h3>${rec.title || "Título não disponível"}</h3>
                        <p class="description"><strong>Descrição:</strong> ${rec.description || "Descrição não disponível"}</p>
                        <p class="reason"><strong>Razão:</strong> ${rec.reason || "Razão não disponível"}</p>
                    </div>
                `

        recommendationsList.appendChild(card)
      })
    } else {
      throw new Error("Formato de resposta inválido")
    }

    document.getElementById("recommendation-container").style.display = "block"
  } catch (error) {
    console.error("Erro ao obter recomendações de jogos:", error)
    alert(`Erro ao obter recomendações de jogos: ${error.message}`)
  } finally {
    document.getElementById("loading-container").style.display = "none"
  }
}

document.getElementById("load-more-btn").addEventListener("click", () => {
  currentPage++
  getUserGames()
})

document.getElementById("steam-username").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    currentPage = 1
    getUserGames()
  }
})