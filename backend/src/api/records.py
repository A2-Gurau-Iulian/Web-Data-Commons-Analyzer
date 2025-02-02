from core.sparql_manager import execute_select_query
from fastapi import HTTPException

def select_records(
    limit: int = 10,
    offset: int = 0,
    sortBy: str = "subject",
    sortDirection: str = "asc",
    subjectFilter: str = None,
    predicateFilter: str = None,
    objectFilter: str = None,
    datasets: list = None  # Accept a list of datasets to query
):
    if not datasets or len(datasets) == 0:
        print("here")
        raise HTTPException(status_code=400, detail="No datasets selected for querying.")

    # Map sorting fields to SPARQL variables
    sort_field_mapping = {
        "subject": "?subject",
        "predicate": "?predicate",
        "object": "?object"
    }

    sort_field = sort_field_mapping.get(sortBy, "?subject")
    order_by = "ASC" if sortDirection == "asc" else "DESC"

    # Build the WHERE clause with optional filters
    filters = []
    if subjectFilter:
        filters.append(f"FILTER(CONTAINS(STR(?subject), \"{subjectFilter}\"))")
    if predicateFilter:
        filters.append(f"FILTER(CONTAINS(STR(?predicate), \"{predicateFilter}\"))")
    if objectFilter:
        filters.append(f"FILTER(CONTAINS(STR(?object), \"{objectFilter}\"))")

    filters_clause = "\n".join(filters)

    # SPARQL query template
    sparql_query = f"""
    SELECT ?subject ?predicate ?object
    WHERE {{
      ?subject ?predicate ?object
      {filters_clause}
    }}
    ORDER BY {order_by}({sort_field})
    LIMIT {limit}
    OFFSET {offset}
    """

    try:
        # Execute the query across the selected datasets
        results = execute_select_query(sparql_query, datasets)
        refined = [
            {
                "subject": item["subject"]["value"],
                "predicate": item["predicate"]["value"],
                "object": item["object"]["value"],
            }
            for dataset_result in results
            for item in dataset_result.get("results", {}).get("bindings", [])
        ]
        return {"triples": refined, "total": len(refined)}  # Replace with actual total count if available
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
