from core.sparql_manager import execute_select_query
from fastapi import HTTPException

def select_records(limit: int = 10, offset: int = 0):
    """
    Endpoint to retrieve 
    """
    query = f"""
    SELECT ?subject ?predicate ?object
    WHERE {{
      ?subject ?predicate ?object
    }}
    LIMIT {limit}
    OFFSET {offset}
    """
    try:
        results = execute_select_query(query)
        bindings = results.get("results", {}).get("bindings", [])
        refined = [
            {
                "subject": item["subject"]["value"],
                "predicate": item["predicate"]["value"],
                "object": item["object"]["value"],
            }
            for item in bindings
        ]
        return {"triples": refined}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))