# recommends_games

# Aplicativo de Recomendação de Jogos Steam

![image](https://github.com/user-attachments/assets/a0d4c9fc-ef2c-454a-ada4-d1f4bdbadf4c)


Este aplicativo fornece recomendações de jogos com base na biblioteca de jogos Steam de um usuário. O sistema usa a API Web da Steam para obter os dados de jogos do usuário e a API de IA Generativa Gemini para gerar recomendações personalizadas.

## Funcionalidades
- Obtém a biblioteca de jogos Steam do usuário com base no nome de usuário.
- Exibe uma lista paginada de jogos possuídos pelo usuário.
- Gera recomendações personalizadas de jogos usando IA.

![image](https://github.com/user-attachments/assets/913672a2-467f-4bc1-af1a-04668fd93784)

---

## Requisitos

Para executar este aplicativo, você precisará de:
1. Python 3.8 ou superior.
2. Pacotes Python necessários instalados (listados no `requirements.txt`).
3. Uma chave válida da API Web da Steam.
4. Uma chave válida da API Gemini.

---

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio/recomendacao-jogos-steam.git
   cd recomendacao-jogos-steam
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure suas variáveis de ambiente em um arquivo `.env`:
   ```env
   STEAM_API_KEY=sua_chave_api_steam
   GEMINI_API_KEY=sua_chave_api_gemini
   ```

4. Execute o aplicativo:
   ```bash
   python app.py
   ```

O aplicativo estará acessível em `http://127.0.0.1:5000/` por padrão.

---

## Estrutura de Arquivos

```
.
|-- static/
|   |-- styles.css           # CSS para o frontend
|   |-- script.js            # Lógica em JavaScript para o frontend
|   |-- loading.gif          # Animação de carregamento
|
|-- templates/
|   |-- index.html           # Arquivo HTML principal
|
|-- app.py                   # Lógica do aplicativo Flask
|-- .env                     # Variáveis de ambiente (não incluído no repositório)
|-- requirements.txt         # Dependências do Python
```

---

## Endpoints

### 1. `/` (GET)
- **Descrição**: Renderiza a página principal do aplicativo.
- **Resposta**: `index.html`

### 2. `/user_games` (GET)
- **Descrição**: Obtém a biblioteca de jogos Steam do usuário.
- **Parâmetros**:
  - `username` (string): Nome de usuário Steam.
  - `page` (int, opcional): Número da página para resultados paginados. Padrão é 1.
- **Resposta**:
  - Objeto JSON contendo os dados dos jogos e o total de jogos.
  - Exemplo:
    ```json
    {
        "games": [
            {
                "name": "Título do Jogo",
                "img": "https://cdn.cloudflare.steamstatic.com/steam/apps/appid/header.jpg"
            }
        ],
        "game_names": ["Título do Jogo"],
        "total_games": 100
    }
    ```

### 3. `/recommend_games` (POST)
- **Descrição**: Gera recomendações de jogos com base na biblioteca do usuário.
- **Corpo da Requisição**:
  ```json
  {
      "games_names": ["Jogo 1", "Jogo 2", "Jogo 3"]
  }
  ```
- **Resposta**:
  - Objeto JSON contendo as recomendações de jogos.
  - Exemplo:
    ```json
    {
        "recommendations": [
            "Recomendação 1",
            "Recomendação 2",
            "Recomendação 3"
        ]
    }
    ```

---

## Como Funciona

1. **Entrada do Usuário**:
   - O usuário insere seu nome de usuário Steam.
   - O aplicativo obtém o Steam ID do usuário por meio da API Steam.

2. **Obtenção de Jogos**:
   - O aplicativo recupera os jogos possuídos pelo usuário, incluindo metadados como nomes e imagens dos jogos.

3. **Recomendações**:
   - Um subconjunto de jogos é enviado para a API Gemini, que gera recomendações personalizadas com base em jogos semelhantes.

4. **Exibição no Frontend**:
   - Os jogos e as recomendações são exibidos na página web.

---

## Observações

- Certifique-se de que suas chaves de API são válidas e possuem as permissões adequadas.
- A API Gemini exige um prompt para gerar recomendações. Ajuste o prompt conforme necessário para obter melhores resultados.
- A paginação para `/user_games` é limitada a 15 jogos por página.

---

## Solução de Problemas

- **Problema**: Nome de usuário Steam não encontrado.
  - **Solução**: Verifique se o nome de usuário está correto e público.

- **Problema**: Recomendações não carregam.
  - **Solução**: Verifique a chave da API Gemini e certifique-se de que o serviço está acessível.

- **Problema**: O aplicativo não está funcionando.
  - **Solução**: Certifique-se de que todas as dependências estão instaladas e que o arquivo `.env` está configurado corretamente.

---

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

## Contribuição

Contribuições são bem-vindas! Fique à vontade para abrir issues ou enviar pull requests.

---

## Agradecimentos

- [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API)
- [Gemini AI API](https://ai.google/gemini)


