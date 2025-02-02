from core.sparql_manager import execute_select_query
from fastapi import HTTPException

def select_chart_data(what: str = "Count of", by: str = "Predicate", datasets: list = None):
    """
    Dynamically fetch chart data based on the user's selections.
    """

    if not datasets or len(datasets) == 0:
        raise HTTPException(status_code=400, detail="No datasets selected for querying.")

    # Validate the 'by' parameter
    valid_groupings = {"Predicate": "?predicate", "Subject": "?subject", "Object": "?object"}
    group_by = valid_groupings.get(by, "?predicate")

    # Construct the SPARQL query
    query = f"""
    SELECT {group_by} (COUNT(*) AS ?count)
    WHERE {{
      ?subject ?predicate ?object
    }}
    GROUP BY {group_by}
    ORDER BY DESC(?count)
    """
    try:
        # Execute the query
        results = execute_select_query(query, datasets)
        refined = []
        for result in results:
            result = result.get("results", {}).get("bindings", [])
            for item in result:
                name = item[group_by[1:]]["value"]  # Extract value (e.g., ?predicate -> predicate)
                count = int(item["count"]["value"])  # Convert count to an integer
                refined.append({"name": name, "value": count})  # Match frontend format

        return refined
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
