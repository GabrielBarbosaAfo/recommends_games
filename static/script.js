let currentPage = 1
let totalGames = 0
let gameHistory = []

async function getUserGames() {
  const username = document.getElementById("steam-username").value
  if (!username) {
    alert("Por favor, insira um nome de usuário Steam!")
    return
  }

  try {
    const response = await fetch(`/user_games?username=${username}&page=${currentPage}`)
    const data = await response.json()

    if (data.error) {
      alert(data.error)
      return
    }

    totalGames = data.total_games
    const gameList = document.getElementById("game-list")

    // Armazena os jogos atuais no histórico
    gameHistory.push(data.games)

    displayGames(data.games)

    document.getElementById("game-list-container").style.display = "block"

    updateNavigationButtons()

    recommendGames(data.game_names)
  } catch (error) {
    alert("Erro ao obter os jogos do usuário!")
  }
}

function displayGames(games) {
  const gameList = document.getElementById("game-list")
  gameList.innerHTML = "" // Limpa os jogos anteriores

  games.forEach((game) => {
    const card = document.createElement("div")
    card.className = "game-card"

    const link = document.createElement("a")
    link.href = `https://store.steampowered.com/app/${game.appid}`
    link.target = "_blank"

    const img = document.createElement("img")
    img.src = game.img
    img.alt = game.name

    const info = document.createElement("div")
    info.className = "game-info"

    const title = document.createElement("h3")
    title.textContent = game.name

    info.appendChild(title)
    card.appendChild(link)
    link.appendChild(img)
    card.appendChild(info)
    gameList.appendChild(card)
  })
}

function updateNavigationButtons() {
  const loadMoreBtn = document.getElementById("load-more-btn")
  const backBtn = document.getElementById("back-btn")

  loadMoreBtn.style.display = currentPage * 15 < totalGames ? "inline-block" : "none"
  backBtn.style.display = currentPage > 1 ? "inline-block" : "none"
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

document.getElementById("back-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    gameHistory.pop() // Remove a página atual do histórico
    displayGames(gameHistory[gameHistory.length - 1]) // Exibe a página anterior
    updateNavigationButtons()
  }
})

document.getElementById("steam-username").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    currentPage = 1
    gameHistory = []
    getUserGames()
  }
})

