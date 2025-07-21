from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/movie/<movie_id>')
def get_movie_detail(movie_id):
    url = f"https://movie-database-api1.p.rapidapi.com/movie_details.json"
    querystring = {"movie_id": movie_id}

    headers = {
        "x-rapidapi-key": "3fd6ed0019msh33503b3cd0b7897p12980bjsn2e6f7da36fe8",
        "x-rapidapi-host": "movie-database-api1.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json().get("data", {}).get("movie", {})

        result = {
            "id": data.get("id"),
            "title": data.get("title"),
            "year": data.get("year"),
            "genres": data.get("genres"),
            "summary": data.get("description_full"),
            "rating": data.get("rating"),
            "language": data.get("language"),
            "poster": data.get("large_cover_image") or data.get("medium_cover_image")
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Error fetching movie details: {e}"}), 500


@app.route('/api/movies-list')
def get_movies_list():
    url = "https://movie-database-api1.p.rapidapi.com/list_movies.json"
    querystring = {
        "limit": "20",
        "page": "1",
        "quality": "all",
        "genre": "all",
        "minimum_rating": "0",
        "query_term": "0",
        "sort_by": "date_added",
        "order_by": "desc",
        "with_rt_ratings": "false"
    }
    headers = {
        "x-rapidapi-key": "3fd6ed0019msh33503b3cd0b7897p12980bjsn2e6f7da36fe8",
        "x-rapidapi-host": "movie-database-api1.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching movies list from new API: {e}"}), 500
    except ValueError:
        return jsonify({"error": "Failed to decode JSON from new API response for movies list"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred while fetching movies list: {e}"}), 500


@app.route('/api/movies')
def get_movies():
    url = "https://moviesdatabase.p.rapidapi.com/titles/x/upcoming"

    headers = {
        "x-rapidapi-key": "3fd6ed0019msh33503b3cd0b7897p12980bjsn2e6f7da36fe8",
        "x-rapidapi-host": "moviesdatabase.p.rapidapi.com"
    }

    try:
        res = requests.get(url, headers=headers)
        res.raise_for_status()
        data = res.json()

        results = data.get("results", [])

        movies = []
        for movie in results:
            primary_image = movie.get("primaryImage")
            poster_url = None

            # Only proceed if primary_image exists and has a 'url'
            if primary_image and primary_image.get("url"):
                poster_url = primary_image.get("url")

                # Only add the movie to the list if it has a valid poster URL
                movies.append({
                    "id": movie.get("id"),
                    "title": movie.get("titleText", {}).get("text"),
                    "poster": poster_url,
                    "rating": movie.get("ratingsSummary", {}).get("aggregateRating", "N/A")})

        return jsonify(movies)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching data from external API: {e}"}), 500
    except ValueError:
        return jsonify({"error": "Failed to decode JSON from external API response"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))    