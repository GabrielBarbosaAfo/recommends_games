let currentPage = 1
let totalGames = 0
let currentGameNames = []
let currentUsername = "" // Add this line

async function getUserGames(forceUsername = null) {
  const username = forceUsername || document.getElementById("steam-username").value
  if (!username) {
    showError("Por favor, insira um nome de usuário Steam!")
    return
  }

  currentUsername = username // Store the username

  try {
    showLoading(true)
    const response = await fetch(`/user_games?username=${username}&page=${currentPage}`)
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 404) {
        showError("Usuário não encontrado. Verifique o nome de usuário e tente novamente.")
      } else {
        showError(data.message || data.error || "Erro ao buscar jogos")
      }
      return
    }

    totalGames = data.total_games
    currentGameNames = data.game_names // Armazena os nomes dos jogos
    displayGames(data.games)
    updateNavigationButtons()
    if (currentPage === 1) {
      await recommendGames(data.game_names)
    }
  } catch (error) {
    showError("Erro ao obter os jogos do usuário!")
  } finally {
    showLoading(false)
  }
}

function displayGames(games) {
  const gameList = document.getElementById("game-list")
  gameList.innerHTML = ""

  games.forEach((game) => {
    const card = document.createElement("div")
    card.className = "game-card"

    const link = document.createElement("a")
    link.href = `https://store.steampowered.com/app/${game.appid}`
    link.target = "_blank"
    link.title = game.name // Adiciona tooltip

    const img = document.createElement("img")
    img.src = game.img
    img.alt = game.name
    img.loading = "lazy" // Lazy loading para melhor performance
    img.onerror = function () {
      this.onerror = null
      this.src = ""
      this.alt = "Imagem não disponível"
      this.classList.add("placeholder-img")
    }

    const info = document.createElement("div")
    info.className = "game-info"

    const title = document.createElement("h3")
    title.textContent = game.name

    info.appendChild(title)
    link.appendChild(img)
    link.appendChild(info)
    card.appendChild(link)
    gameList.appendChild(card)
  })

  document.getElementById("game-list-container").style.display = "block"
}

async function recommendGames(games) {
  try {
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

        const img = document.createElement("img")
        img.src = rec.img
        img.alt = rec.title
        img.className = "recommendation-img"
        img.loading = "lazy"
        img.onerror = function () {
          this.onerror = null
          this.src = ""
          this.alt = "Imagem não disponível"
          this.classList.add("placeholder-img")
        }

        const content = document.createElement("div")
        content.className = "recommendation-content"
        content.innerHTML = `
                    <h3>${rec.title || "Título não disponível"}</h3>
                    <p class="description"><strong>Descrição:</strong> ${rec.description || "Descrição não disponível"}</p>
                    <p class="reason"><strong>Razão:</strong> ${rec.reason || "Razão não disponível"}</p>
                `

        card.appendChild(img)
        card.appendChild(content)
        recommendationsList.appendChild(card)
      })
    } else {
      throw new Error("Formato de resposta inválido")
    }

    document.getElementById("recommendation-container").style.display = "block"
  } catch (error) {
    console.error("Erro ao obter recomendações de jogos:", error)
    showError(`Erro ao obter recomendações de jogos: ${error.message}`)
  }
}

async function refreshRecommendations() {
  if (currentGameNames.length > 0) {
    showLoading(true)
    await recommendGames(currentGameNames)
    showLoading(false)
  }
}

function showError(message) {
  const errorContainer = document.getElementById("error-container")
  const errorMessage = document.getElementById("error-message")

  errorMessage.textContent = message
  errorContainer.style.display = "flex"

  setTimeout(() => {
    errorContainer.style.display = "none"
  }, 5000)
}

function showLoading(show) {
  document.getElementById("loading-container").style.display = show ? "flex" : "none"
}

function updateNavigationButtons() {
  const loadMoreBtn = document.getElementById("load-more-btn")
  const backBtn = document.getElementById("back-btn")

  loadMoreBtn.style.display = currentPage * 15 < totalGames ? "block" : "none"
  backBtn.style.display = currentPage > 1 ? "block" : "none"
}

document.getElementById("load-more-btn").addEventListener("click", () => {
  currentPage++
  getUserGames(currentUsername)
})

document.getElementById("back-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    getUserGames(currentUsername)
  }
})

document.getElementById("steam-username").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    currentPage = 1
    currentUsername = "" // Reset username on new search
    getUserGames()
  }
})

