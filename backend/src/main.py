from core.sparql_manager import execute_select_query
from api.visualize import select_categories
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/visualize")
def read_object_count():
    return select_categories()

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