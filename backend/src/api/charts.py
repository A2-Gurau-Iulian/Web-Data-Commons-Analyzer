from core.sparql_manager import execute_select_query
from fastapi import HTTPException

def select_chart_data(what: str = "Count of", by: str = "Predicate", datasets: list = None):
    """
    Dynamically fetch chart data based on the user's selections.
    """

    if not datasets or len(datasets) == 0:
        raise HTTPException(status_code=400, detail="No datasets selected for querying.")

    # Mapping for 'by' parameters
    valid_groupings = {"Predicate": "?predicate", "Subject": "?subject", "Object": "?object"}
    group_by = valid_groupings.get(by, "?predicate")

    # SPARQL query selection based on `what`
    if what == "Count of":
        query = f"""
        SELECT {group_by} (COUNT(*) AS ?count)
        WHERE {{
          ?subject ?predicate ?object
        }}
        GROUP BY {group_by}
        ORDER BY DESC(?count)
        """

    elif what == "Subjects with the Most Unique Objects":
        query = """
        SELECT ?subject (COUNT(DISTINCT ?object) AS ?count)
        WHERE {
          ?subject ?predicate ?object.
        }
        GROUP BY ?subject
        ORDER BY DESC(?count)
        LIMIT 20
        """

    elif what == "Top Subjects with Most Relations":
        query = """
        SELECT ?subject (COUNT(*) AS ?count)
        WHERE {
          ?subject ?predicate ?object.
        }
        GROUP BY ?subject
        ORDER BY DESC(?count)
        LIMIT 20
        """

    elif what == "Top Objects with Most Mentions":
        query = """
        SELECT ?object (COUNT(*) AS ?count)
        WHERE {
          ?subject ?predicate ?object.
        }
        GROUP BY ?object
        ORDER BY DESC(?count)
        LIMIT 20
        """

    elif what == "Top Predicate-Object Pairs":
        query = """
        SELECT ?predicate ?object (COUNT(*) AS ?count)
        WHERE {
          ?subject ?predicate ?object.
        }
        GROUP BY ?predicate ?object
        ORDER BY DESC(?count)
        LIMIT 20
        """

    else:
        raise HTTPException(status_code=400, detail="Invalid 'what' selection.")

    try:
        # Execute the query across selected datasets
        results = execute_select_query(query, datasets)
        refined = []

        for result in results:
            result = result.get("results", {}).get("bindings", [])
            for item in result:
                if what == "Top Predicate-Object Pairs":
                    name = f"{item['predicate']['value']} - {item['object']['value']}"
                else:
                    name = item[list(item.keys())[0]]["value"]  # Extract first key's value dynamically
                
                count = int(item["count"]["value"])  # Convert count to integer
                refined.append({"name": name, "value": count})  # Format to match frontend

        return refined
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
