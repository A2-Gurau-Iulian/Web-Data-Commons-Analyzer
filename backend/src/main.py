from core.sparql_manager import execute_select_query
from api.charts import select_categories
from api.records import select_records
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/visualize/charts")
def read_object_count():
    return select_categories()

@app.get("/visualize/records")
def read_object_count(
    limit: int = Query(10, ge=1, le=100, description="Number of records per page"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),):
    return select_records(limit=limit, offset=offset)

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
