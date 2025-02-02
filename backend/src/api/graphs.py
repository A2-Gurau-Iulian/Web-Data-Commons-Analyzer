from core.sparql_manager import execute_select_query
from fastapi import HTTPException

def select_high_impact_nodes(datasets, limit=10, search=None):
    """
    Fetch the most connected subjects or filter by keyword search.
    """

    # Add optional search filter
    search_filter = ""
    if search:
        search_filter = f"""
        FILTER (
            CONTAINS(LCASE(STR(?subject)), LCASE(\"{search}\")) ||
            CONTAINS(LCASE(STR(?predicate)), LCASE(\"{search}\")) ||
            CONTAINS(LCASE(STR(?object)), LCASE(\"{search}\"))
        )
        """

    # Construct SPARQL query
    query = f"""
    SELECT ?subject (COUNT(?predicate) AS ?count)
    WHERE {{
      ?subject ?predicate ?object
      {search_filter}
    }}
    GROUP BY ?subject
    ORDER BY DESC(?count)
    LIMIT {limit}
    """
    try:
        results = execute_select_query(query, datasets)
        subjects = []
        for result in results:
            bindings = result.get("results", {}).get("bindings", [])

            # Extract top subjects
            subjects.extend([binding["subject"]["value"] for binding in bindings])
        return subjects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in select_high_impact_nodes: {str(e)}")

def select_initial_graph(subjects, datasets, limit=100, search=None):
    """
    Fetch triples for the top subjects or filter by keyword search.
    """
    if not subjects:
        return {"nodes": [], "links": []}  # Return empty graph if no subjects

    # Prepare subject filter
    subject_values = " ".join(f"<{subject}>" for subject in subjects)

    # Add optional search filter
    search_filter = ""
    if search:
        search_filter = f"""
        FILTER (
            CONTAINS(LCASE(STR(?subject)), LCASE(\"{search}\")) ||
            CONTAINS(LCASE(STR(?predicate)), LCASE(\"{search}\")) ||
            CONTAINS(LCASE(STR(?object)), LCASE(\"{search}\"))
        )
        """

    # Construct SPARQL query
    query = f"""
    SELECT ?subject ?predicate ?object
    WHERE {{
      VALUES ?subject {{ {subject_values} }}
      ?subject ?predicate ?object
      {search_filter}
    }}
    LIMIT {limit}
    """
    try:
        results = execute_select_query(query, datasets)
        nodes = {}
        links = []
        for result in results:
            bindings = result.get("results", {}).get("bindings", [])

            # Transform results into graph format
            for binding in bindings:
                subject = binding["subject"]["value"]
                predicate = binding["predicate"]["value"]
                obj = binding["object"]["value"]

                if subject not in nodes:
                    nodes[subject] = {"id": subject, "type": "subject"}
                if obj not in nodes:
                    nodes[obj] = {"id": obj, "type": "object"}

                links.append({"source": subject, "target": obj, "predicate": predicate})

        return {"nodes": list(nodes.values()), "links": links}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in select_initial_graph: {str(e)}")
