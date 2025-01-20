import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fuseki SPARQL endpoints
QUERY_ENDPOINT = "http://localhost:3030/airport/query"
UPDATE_ENDPOINT = "http://localhost:3030/dataset/update"

def execute_select_query(sparql_query, endpoint=None):
    local_enpoint = endpoint if endpoint is not None else QUERY_ENDPOINT

    """
    Execute a SPARQL SELECT query and return the results.
    """
    headers = {"Accept": "application/sparql-results+json"}
    response = requests.get(local_enpoint, params={"query": sparql_query}, headers=headers)
    if response.status_code == 200:
        logger.info("Query executed successfully.")
        return response.json()
    else:
        logger.error(f"Failed to execute query: {response.text}")
        raise Exception("Error executing SPARQL SELECT query")

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



