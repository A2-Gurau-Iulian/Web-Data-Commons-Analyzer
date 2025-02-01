from core.sparql_manager import execute_select_query
from api.charts import select_chart_data
from api.records import select_records
from api.graphs import select_initial_graph
from api.graphs import select_high_impact_nodes
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import ast
import os
import re

DATA_PATH = os.path.join(os.getcwd(), "backend\src\data.json")
with open(DATA_PATH, "r") as file:
    DATA = json.load(file)
    COUNTRIES = DATA["countries"]
    PAIRS = DATA["pairs"]

CURRENT_COUNTRY = None

def get_current_country(values):
    for country in COUNTRIES:
        for value in values:
            pattern = r'\b' + country + r'\b'
            if re.search(pattern, value, re.IGNORECASE):
                return country
    return None

        
def deserialize_recursive(data):
    # If the data is a string and looks like JSON, parse it
    if isinstance(data, str):
        try:
            # Try to parse the string as JSON
            return json.loads(data)
        except json.JSONDecodeError:
            pass  # not a JSON string, return it as is
    elif isinstance(data, dict):
        # Recursively process all dictionary values
        for key, value in data.items():
            data[key] = deserialize_recursive(value)
    elif isinstance(data, list):
        # Recursively process list elements
        data = [deserialize_recursive(item) for item in data]
    return data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

from fastapi import Query

from fastapi import Query

@app.get("/visualize/charts")
def read_chart_data(
    what: str = Query("Count of", description="What data to retrieve"),
    by: str = Query("Predicate", description="Group data by Predicate, Subject, or Object"),
    datasets: list = Query(None, description="List of datasets to query")
):
    """
    Dynamic endpoint to retrieve chart data based on user selection and datasets.
    """
    if not datasets:
        print("aa", datasets)
        raise HTTPException(status_code=400, detail="No datasets selected.")
    
    print("bb", datasets)
    
    return select_chart_data(what=what, by=by, datasets=datasets)


@app.get("/visualize/records")
def read_records(
    limit: int = Query(10, ge=1, le=100, description="Number of records per page"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    sortBy: str = Query("subject", regex="^(subject|predicate|object)$", description="Field to sort by"),
    sortDirection: str = Query("asc", regex="^(asc|desc)$", description="Sort direction (asc or desc)"),
    subjectFilter: str = Query(None, description="Filter for subject (contains match)"),
    predicateFilter: str = Query(None, description="Filter for predicate (contains match)"),
    objectFilter: str = Query(None, description="Filter for object (contains match)"),
    datasets: list = Query(None, description="List of datasets to query (e.g., ['airport', 'city'])")
):
    """
    API endpoint to fetch paginated, sorted, and filtered RDF triples across selected datasets.
    """
    if not datasets:
        print("aa", datasets)
        raise HTTPException(status_code=400, detail="No datasets selected.")
    
    print("bb", datasets)

    return select_records(
        limit=limit,
        offset=offset,
        sortBy=sortBy,
        sortDirection=sortDirection,
        subjectFilter=subjectFilter,
        predicateFilter=predicateFilter,
        objectFilter=objectFilter,
        datasets=datasets
    )

@app.get("/sparql/select")
async def sparql_select(query: str):
    """
    Endpoint to execute a SPARQL SELECT query.
    Query parameter: `query` (SPARQL SELECT query string)
    """
    try:
        results = execute_select_query(query)
        return results["results"]["bindings"]  # Simplify the response to only include bindings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/datasets")
def get_available_datasets():
    """
    Return the list of available datasets.
    """
    datasets = [
        "administrativearea",
        "airport",
        "book",
        "city",
        "collegeoruniversity",
        "country",
        "creativework",
        "dataset",
        "educationalorganization",

    ]
    return {"datasets": datasets}

@app.get("/visualize/graph")
def get_initial_graph(
    datasets: list = Query(..., description="List of datasets to include"),
    search: str = Query(None, description="Keyword search to filter nodes or links"),
    limit: int = Query(500, ge=1, le=10000, description="Number of triples to fetch"),
):
    """
    Fetch the initial RDF graph for visualization, with optional keyword search.
    """
    try:
        if not datasets:
            raise HTTPException(status_code=400, detail="At least one dataset must be specified.")

        # Fetch top subjects or apply keyword search
        top_subjects = select_high_impact_nodes(datasets=datasets, limit=limit, search=search)

        # Fetch triples for these subjects and datasets
        graph = select_initial_graph(top_subjects, datasets=datasets, limit=limit, search=search)
        return graph
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/visualize/records/export", response_class=JSONResponse)
def export_triples_jsonld(
    datasets: list = Query(..., description="List of datasets to include"),
    sortBy: str = Query("subject", regex="^(subject|predicate|object)$", description="Field to sort by"),
    sortDirection: str = Query("asc", regex="^(asc|desc)$", description="Sort direction (asc or desc)"),
    subjectFilter: str = Query(None, description="Filter for subject (contains match)"),
    predicateFilter: str = Query(None, description="Filter for predicate (contains match)"),
    objectFilter: str = Query(None, description="Filter for object (contains match)")
):
    """
    Fetch all filtered and sorted RDF triples and return them in JSON-LD format.
    """
    sort_field_mapping = {
        "subject": "?subject",
        "predicate": "?predicate",
        "object": "?object"
    }
    sort_field = sort_field_mapping.get(sortBy, "?subject")
    order_by = "ASC" if sortDirection == "asc" else "DESC"

    # Build filters
    filters = []
    if subjectFilter:
        filters.append(f"FILTER(CONTAINS(LCASE(STR(?subject)), LCASE(\"{subjectFilter}\")))")
    if predicateFilter:
        filters.append(f"FILTER(CONTAINS(LCASE(STR(?predicate)), LCASE(\"{predicateFilter}\")))")
    if objectFilter:
        filters.append(f"FILTER(CONTAINS(LCASE(STR(?object)), LCASE(\"{objectFilter}\")))")

    filters_clause = "\n".join(filters)

    # SPARQL Query to fetch all matching triples (without pagination)
    query = f"""
    SELECT ?subject ?predicate ?object
    WHERE {{
      ?subject ?predicate ?object
      {filters_clause}
    }}
    ORDER BY {order_by}({sort_field})
    """
    
    # Execute query
    results = execute_select_query(query, datasets)
    
    jsonld_context = {
        "@context": {
            "subject": "@id",
            "predicate": "@type",
            "object": "@value"
        }
    }
    
    jsonld_data = []
    for result in results:
        bindings = result.get("results", {}).get("bindings", [])
        for binding in bindings:
            jsonld_data.append({
                "subject": binding["subject"]["value"],
                "predicate": binding["predicate"]["value"],
                "object": binding["object"]["value"]
            })

    # Return JSON-LD response
    return JSONResponse(content={**jsonld_context, "@graph": jsonld_data})

from fastapi.responses import Response

@app.get("/visualize/records/export/rdf", response_class=Response)
def export_triples_rdf(
    datasets: list = Query(..., description="List of datasets to include"),
    sortBy: str = Query("subject", regex="^(subject|predicate|object)$", description="Field to sort by"),
    sortDirection: str = Query("asc", regex="^(asc|desc)$", description="Sort direction (asc or desc)"),
    subjectFilter: str = Query(None, description="Filter for subject (contains match)"),
    predicateFilter: str = Query(None, description="Filter for predicate (contains match)"),
    objectFilter: str = Query(None, description="Filter for object (contains match)")
):
    """
    Fetch all filtered and sorted RDF triples and return them in Turtle (RDF) format.
    """
    sort_field_mapping = {
        "subject": "?subject",
        "predicate": "?predicate",
        "object": "?object"
    }
    sort_field = sort_field_mapping.get(sortBy, "?subject")
    order_by = "ASC" if sortDirection == "asc" else "DESC"

    # Build filters
    filters = []
    if subjectFilter:
        filters.append(f"FILTER(CONTAINS(LCASE(STR(?subject)), LCASE(\"{subjectFilter}\")))")
    if predicateFilter:
        filters.append(f"FILTER(CONTAINS(LCASE(STR(?predicate)), LCASE(\"{predicateFilter}\")))")
    if objectFilter:
        filters.append(f"FILTER(CONTAINS(LCASE(STR(?object)), LCASE(\"{objectFilter}\")))")

    filters_clause = "\n".join(filters)

    # SPARQL Query to fetch all matching triples (without pagination)
    query = f"""
    SELECT ?subject ?predicate ?object
    WHERE {{
      ?subject ?predicate ?object
      {filters_clause}
    }}
    ORDER BY {order_by}({sort_field})
    """
    
    # Execute query
    results = execute_select_query(query, datasets)

    # Convert results to RDF Turtle format
    turtle_data = ""
    for result in results:
        bindings = result.get("results", {}).get("bindings", [])
        for binding in bindings:
            subject = f"<{binding['subject']['value']}>"
            predicate = f"<{binding['predicate']['value']}>"
            obj = binding["object"]["value"]
            
            # If object is a URI, wrap it in <>, otherwise wrap in ""
            if obj.startswith("http://") or obj.startswith("https://"):
                obj = f"<{obj}>"
            else:
                obj = f'"{obj}"'

            # Append to Turtle data
            turtle_data += f"{subject} {predicate} {obj} .\n"

    return Response(content=turtle_data, media_type="text/turtle")

@app.get("/category/sparql")
async def sparql_select(category: str, query: str, ):
    query = query.lower()
    category = category.replace(" ", "").lower()

    if category == "creativework":
        main_header = "headline"
    elif category == "jobposting":
        main_header = "title"
    else:
        main_header = "name"

    sparql_query = f"""
    PREFIX a: <http://example.org/>

    SELECT ?name (STRAFTER(STR(?subject), "{category}/") AS ?id)
    WHERE {{
    ?subject a:{main_header} ?name.
    FILTER(CONTAINS(LCASE(STR(?name)), "{query}"))
    }}
    LIMIT 10
    """
    results = execute_select_query(sparql_query, f"http://localhost:3030/{category}/query")
    bindings = results.get("results", {}).get("bindings", [])
    refined = [
            {
                "name": item["name"]["value"],
                "id": item["id"]["value"]
            }
            for item in bindings
        ]

    return {"results": refined}

@app.get("/item_by_id/sparql")
async def sparql_select(category: str, id: str, main: bool):
    global CURRENT_COUNTRY
    category = category.replace(" ", "").lower()
    sparql_query = f"""
    SELECT (STRAFTER(STR(?predicate), "http://example.org/") AS ?property) ?object
    WHERE {{
    ?subject ?predicate ?object.
    FILTER(?subject = <http://example.org/{category}/{id}>)
    }}
    """
    results = execute_select_query(sparql_query, f"http://localhost:3030/{category}/query")
    bindings = results.get("results", {}).get("bindings", [])

    refined = []
    other_info = {}
    collected_values = []
    for item in bindings:
        aux_value = {}
        aux_value["attribute"] = item["property"]["value"]

        # collect the values to determin the current country
        if item["property"]["value"] in PAIRS[category]:
            collected_values += item["object"]["value"],

        json_value = item["object"]["value"]
        
        if '{' in json_value:
            # Remove the extra escaping and convert to a dictionary
            corrected_string = json_value.replace(r'\\', r'')  # Remove extra backslashes

            try:
                # Convert the string to a Python dictionary
                data = ast.literal_eval(corrected_string)
            except SyntaxError as e:
                print(f"SyntaxError: {e}")
                aux_value["value"] = f"SyntaxError: {e}"
                if aux_value["attribute"] == "other_info":
                    other_info["attribute"] = aux_value["attribute"]
                    other_info["value"] = aux_value["value"]
                    continue
                refined += aux_value,
                continue

            # Recursively deserialize all JSON-like strings
            result = deserialize_recursive(data)
        else:
            result = json_value
        
        aux_value["value"] = result

        if aux_value["attribute"] == "other_info":
            other_info["attribute"] = aux_value["attribute"]
            other_info["value"] = aux_value["value"]
            continue
        
        refined += aux_value,
    
    # Update the current country only if the category is from search bar
    if main:
        CURRENT_COUNTRY = get_current_country(collected_values)

    refined += {"attribute": "CURRENT_COUNTRY", "value": CURRENT_COUNTRY},

    refined += other_info,

    

    if category == "creativework":
        main_header = "headline"
    elif category == "jobposting":
        main_header = "title"
    else:
        main_header = "name"

    for item in refined:
        if item["attribute"] == main_header:
            item["attribute"] = "name"
            break

    return {"results": refined}


@app.get("/similarities/sparql")
async def sparql_select(category: str):
    category = category.replace(" ", "").lower()
    if CURRENT_COUNTRY is None:
        return {"ids": []}
    
    ids_list = []
    attributes = PAIRS[category]

    search_in = ""
    for attribute in attributes:
        search_in = search_in + f"ex:{attribute},"
    search_in = search_in[:-1]
    sparql_query = f"""
    PREFIX ex: <http://example.org/>
    SELECT DISTINCT  
        (STRAFTER(STR(?predicate), "example.org/") AS ?attr)
        (STRAFTER(STR(?subject), "{category}/") AS ?id)
    WHERE {{
        ?subject ?predicate ?object .
        FILTER(?predicate IN ({search_in}) && REGEX(LCASE(STR(?object)), "\\\\b{CURRENT_COUNTRY}\\\\b", "i"))
    }}
    LIMIT 10
    """
    results = execute_select_query(sparql_query, f"http://localhost:3030/{category}/query")
    bindings = results.get("results", {}).get("bindings", [])
    item_list = []
    for item in bindings:
        # aux_value = {}
        # aux_value["id"] = item["id"]["value"]
        # aux_value["attr"] = item["attr"]["value"]
        # aux_value["value"] = item["object"]["value"]
        item_list += item["id"]["value"],

    return {"ids": item_list}
