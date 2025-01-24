let currentPage = 1
let totalGames = 0
let gameHistory = []

async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
}

async function getUserGames() {
  const username = document.getElementById("steam-username").value
  if (!username) {
    showError("Por favor, insira um nome de usuário Steam!")
    return
  }

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
    const gameList = document.getElementById("game-list")
    gameList.innerHTML = "" // Limpa os jogos anteriores

    data.games.forEach((game) => {
      const card = document.createElement("div")
      card.className = "game-card"

      // Criando o link para a página do Steam
      const link = document.createElement("a")
      link.href = `https://store.steampowered.com/app/${game.appid}`
      link.target = "_blank"

      const img = document.createElement("img")
      img.src = game.img
      img.alt = game.name
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
      card.appendChild(link)
      link.appendChild(img)
      card.appendChild(info)
      gameList.appendChild(card)
    })

    document.getElementById("game-list-container").style.display = "block"

    if (currentPage * 15 < totalGames) {
      document.getElementById("load-more-btn").style.display = "block"
    } else {
      document.getElementById("load-more-btn").style.display = "none"
    }

    await recommendGames(data.game_names)
  } catch (error) {
    showError("Erro ao obter os jogos do usuário!")
  } finally {
    showLoading(false)
  }
}

function displayGames(games) {
  //This function is no longer used after the update.  It's kept here for reference in case it's needed later.
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

  loadMoreBtn.style.display = currentPage * 15 < totalGames ? "inline-block" : "none"
  backBtn.style.display = currentPage > 1 ? "inline-block" : "none"
}

document.getElementById("load-more-btn").addEventListener("click", () => {
  currentPage++
  getUserGames()
})

document.getElementById("back-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    gameHistory.pop()
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
