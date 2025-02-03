import requests
import logging

AVAILABE_DATASETS = [
        "administrativearea",
        "airport",
        "book",
        "city",
        "collegeoruniversity",
        "country",
        "creativework",
        "dataset",
        "educationalorganization",
        "event",
        "geocoordinates",
        "governmentorganization",
        "hospital",
        "hotel",
        "jobposting",
        "lakebodyofwater",
        "landmarksorhistoricalbuildings",
        "language",
        "library",
        "localbusiness",
        "mountain",
        "movie",
        "museum",
        "musicalbum",
        "musicalbumrecording",
        "painting",
        "park",
        "place",
        "product",
        "question",
        "radiostation",
        "recipe",
        "restaurant",
        "riverbodyofwater",
        "school",
        "shoppingcenter",
        "skiresort",
        "sportsevent",
        "sportsteam",
        "stadiumorarena",
        "televisionstation",
        "tvepisode"
    ]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fuseki SPARQL endpoints
QUERY_ENDPOINT = "http://localhost:3030/{dataset}/query"
UPDATE_ENDPOINT = "http://localhost:3030/dataset/update"

def select_from_dataset(sparql_query, dataset):
    """
    Execute a SPARQL SELECT query and return the results.
    """
    headers = {"Accept": "application/sparql-results+json"}

    response = requests.get(QUERY_ENDPOINT.format(dataset=dataset), params={"query": sparql_query}, headers=headers)
    if response.status_code == 200:
        logger.info("Query executed successfully.")
        return response.json()
    else:
        logger.error(f"Failed to execute query: {response.text}")
        raise Exception("Error executing SPARQL SELECT query")

def execute_select_query(sparql_query, datasets = AVAILABE_DATASETS):
    results = []
    for dataset in datasets:
        data = select_from_dataset(sparql_query=sparql_query, dataset=dataset)
        results.append(data)
    return results

def execute_update_query(sparql_update):
    """
    Execute a SPARQL UPDATE query (INSERT/DELETE).
    """
    headers = {"Content-Type": "application/sparql-update"}
    response = requests.post(UPDATE_ENDPOINT, data=sparql_update, headers=headers)
    if response.status_code == 200:
        logger.info("Update query executed successfully.")
    else:
        logger.error(f"Failed to execute update query: {response.text}")
        raise Exception("Error executing SPARQL UPDATE query")



