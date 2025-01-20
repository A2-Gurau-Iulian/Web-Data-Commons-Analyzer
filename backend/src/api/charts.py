from core.sparql_manager import execute_select_query
from fastapi import HTTPException

def select_categories():
    """
    Endpoint to retrieve 
    """
    query = """
    SELECT ?predicate (COUNT(*) AS ?count)
    WHERE {
    ?subject ?predicate ?object
    }
    GROUP BY ?predicate
    ORDER BY DESC(?count)
    LIMIT 25
    """
    try:
        results = execute_select_query(query)
        results = results.get("results", {}).get("bindings", [])
        refined = []
        for item in results:
            object_value = item["predicate"]["value"]
            count_value = int(item["count"]["value"])  # Convert count to an integer
            refined.append({"predicate": object_value, "count": count_value})
        return refined
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))