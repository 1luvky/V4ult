from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/movie/<movie_id>')
def get_movie_detail(movie_id):
    url = f"https://movie-database-api1.p.rapidapi.com/movie_details.json"
    querystring = {"movie_id": movie_id}

    headers = {
        "x-rapidapi-key": "f5e06178e6msh3dbe951a8063592p10a94bjsn15759e0d8496 ",
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
        "x-rapidapi-key": "f5e06178e6msh3dbe951a8063592p10a94bjsn15759e0d8496",
        "x-rapidapi-host": "movie-database-api1.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()

        # You might want to process and filter this data similar to get_movies
        # to ensure it has posters, titles, etc., in a consistent format
        # For now, we'll return the raw response from this new API.
        return jsonify(data)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching movies list from new API: {e}"}), 500
    except ValueError:
        return jsonify({"error": "Failed to decode JSON from new API response for movies list"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred while fetching movies list: {e}"}), 500

@app.route('/api/series-list')
def get_series_list():
    url = "https://movies-tv-shows-database.p.rapidapi.com/"
    querystring = {"page": "1"}
    headers = {
        "x-rapidapi-key": "b4e3442fe8msh7b52a38b72f00bep1e398djsn4d0607892190",
        "x-rapidapi-host": "movies-tv-shows-database.p.rapidapi.com",
        "Type": "get-trending-shows" # This header is crucial for this API
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()

        processed_series = []
        # The response structure for this API is under 'tv_results'
        series_results = data.get('tv_results', []) 

        if isinstance(series_results, list):
            for show in series_results:
                processed_series.append({
                    "id": show.get("imdb_id"), # Use imdb_id as the unique ID
                    "title": show.get("title"),
                    "poster": "https://placehold.co/226x300/333333/FFFFFF?text=No+Image", # Placeholder as no poster URL in this response
                    "rating": "N/A" # Placeholder as no rating in this response
                })
        
        return jsonify(processed_series)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error fetching series list from API: {e}"}), 500
    except ValueError:
        return jsonify({"error": "Failed to decode JSON from series API response"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred while fetching series: {e}"}), 500



@app.route('/api/movies')
def get_movies():
    url = "https://moviesdatabase.p.rapidapi.com/titles/x/upcoming"

    headers = {
        "x-rapidapi-key": "b4e3442fe8msh7b52a38b72f00bep1e398djsn4d0607892190",
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
    app.run(debug=True)