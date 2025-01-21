from core.sparql_manager import execute_select_query
from api.charts import select_categories
from api.records import select_records
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

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
    category = category.replace(" ", "").lower()
    sparql_query = f"""
    PREFIX a: <http://example.org/>

    SELECT ?name (STRAFTER(STR(?subject), "{category}/") AS ?id)
    WHERE {{
    ?subject a:name ?name.
    FILTER(STRSTARTS(LCASE(STR(?name)), "{query}"))
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
