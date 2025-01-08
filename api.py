import json
import requests
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

STEAM_API_KEY = "6551A66F58B71B6E47F57105BFC83759"
STEAM_API_BASE = "http://api.steampowered.com"
GEMINI_API_KEY = "AIzaSyAEUhihyy-c2Z5KvaRu9Zwf8IulAdU6w_8"

genai.configure(api_key=GEMINI_API_KEY)

@app.route('/')
def index():
    return render_template('index.html')   

@app.route('/user_games', methods=['GET'])
def get_user_games():
    steam_username = request.args.get('username')
    page = int(request.args.get('page', 1))  # Página inicial é 1

    if not steam_username:
        return jsonify({'error': 'Steam username is required'}), 400

    try:
        steam_id_url = f"{STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/"
        params = {'key': STEAM_API_KEY, 'vanityurl': steam_username}
        response = requests.get(steam_id_url, params=params)
        response.raise_for_status()

        steam_id_data = response.json()
        steam_id = steam_id_data.get('response', {}).get('steamid')
        if not steam_id:
            return jsonify({'error': 'SteamID not found for this username'}), 404

        games_url = f"{STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/"
        params = {
            'key': STEAM_API_KEY,
            'steamid': steam_id,
            'include_appinfo': True,
            'include_played_free_games': True
        }
        response = requests.get(games_url, params=params)
        response.raise_for_status()

        games = response.json().get('response', {}).get('games', [])
        game_data = [{'name': game['name'], 'img': f"https://cdn.cloudflare.steamstatic.com/steam/apps/{game['appid']}/header.jpg"} for game in games]

        # Dividir os jogos em páginas de 10 jogos
        start_index = (page - 1) * 15
        end_index = start_index + 15
        games_on_page = game_data[start_index:end_index]

        # Enviar apenas nomes para recomendação
        game_names = [game['name'] for game in games]

        return jsonify({'games': games_on_page, 'game_names': game_names, 'total_games': len(game_names)}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


@app.route('/recommend_games', methods=['POST'])
def recommend_games():
    data = request.get_json()
    if not data or 'games_names' not in data:
        return jsonify({'error': 'Games data is required'}), 400

    games_list = data['games_names']
    
    try:
        prompt = f"""
        Baseado nos seguintes jogos que eu gosto: {', '.join(games_list[:20])}, 
        recomende 3 jogos semelhantes que eu poderia gostar. Explique brevemente a razão de cada recomendação.
        """

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)

        recommendations = response.text.strip().split('\n') 

        return jsonify({'recommendations': recommendations}), 200

    except Exception as e:
        return jsonify({'error': f"Erro ao usar a API Gemini: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)

