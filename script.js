document.addEventListener("DOMContentLoaded", () => {
    // Animação de partículas
    const particlesContainer = document.querySelector(".particles")
    for (let i = 0; i < 50; i++) {
      createParticle()
    }
  
    function createParticle() {
      const particle = document.createElement("div")
      particle.style.position = "absolute"
      particle.style.width = "2px"
      particle.style.height = "2px"
      particle.style.background = "rgba(102, 192, 244, 0.5)"
      particle.style.borderRadius = "50%"
  
      // Posição inicial aleatória
      particle.style.left = Math.random() * 100 + "%"
      particle.style.top = Math.random() * 100 + "%"
  
      // Animação
      particle.style.animation = `float ${Math.random() * 3 + 2}s linear infinite`
  
      particlesContainer.appendChild(particle)
  
      // Remove e recria a partícula após a animação
      setTimeout(() => {
        particle.remove()
        createParticle()
      }, 5000)
    }
  
    // Animação de scroll
    const animatedElements = document.querySelectorAll("[data-aos]")
  
    const observerOptions = {
      threshold: 0.1,
    }
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate")
        }
      })
    }, observerOptions)
  
    animatedElements.forEach((element) => {
      observer.observe(element)
    })
  
    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  
    // Navbar transparente no topo e sólida ao rolar
    const header = document.querySelector(".header")
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.style.backgroundColor = "rgba(23, 26, 33, 0.95)"
      } else {
        header.style.backgroundColor = "rgba(23, 26, 33, 0.8)"
      }
    })
  
    // Adiciona keyframes para animação das partículas
    const style = document.createElement("style")
    style.textContent = `
          @keyframes float {
              0% {
                  transform: translateY(0) translateX(0);
                  opacity: 0;
              }
              50% {
                  opacity: 1;
              }
              100% {
                  transform: translateY(-100px) translateX(100px);
                  opacity: 0;
              }
          }
      `
    document.head.appendChild(style)

    window.addEventListener("scroll", () => {
      const howItWorks = document.querySelector(".how-it-works")
      if (howItWorks) {
        const scrolled = window.pageYOffset
        const rate = scrolled * 0.3
        howItWorks.style.backgroundPosition = `center ${-rate}px`
      }
    })
  })
  
  