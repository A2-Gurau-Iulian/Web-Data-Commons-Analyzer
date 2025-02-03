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
    datasets: list = None
):
    if not datasets or len(datasets) == 0:
        raise HTTPException(status_code=400, detail="No datasets selected for querying.")

    sort_field_mapping = {
        "subject": "?subject",
        "predicate": "?predicate",
        "object": "?object"
    }
    sort_field = sort_field_mapping.get(sortBy, "?subject")
    order_by = "ASC" if sortDirection == "asc" else "DESC"

    filters = []
    if subjectFilter:
        filters.append(f"FILTER(CONTAINS(STR(?subject), \"{subjectFilter}\"))")
    if predicateFilter:
        filters.append(f"FILTER(CONTAINS(STR(?predicate), \"{predicateFilter}\"))")
    if objectFilter:
        filters.append(f"FILTER(CONTAINS(STR(?object), \"{objectFilter}\"))")

    filters_clause = "\n".join(filters)

    count_records_query_template = f"""
    SELECT (COUNT(*) as ?total)
    WHERE {{
      ?subject ?predicate ?object
      {filters_clause}
    }}
    """

    sparql_query_template = f"""
    SELECT ?subject ?predicate ?object
    WHERE {{
      ?subject ?predicate ?object
      {filters_clause}
    }}
    ORDER BY {order_by}({sort_field})
    """

    # Step 1: Get total count across datasets
    total_count = 0
    dataset_counts = []
    try:
        for dataset in datasets:
            count_result = execute_select_query(count_records_query_template, [dataset])[0]
            dataset_total = int(count_result.get("results", {}).get("bindings", [{}])[0].get("total", {}).get("value", 0))
            dataset_counts.append((dataset, dataset_total))
            total_count += dataset_total
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error counting records: {str(e)}")

    if offset >= total_count:
        return {"triples": [], "total": total_count}  # Return empty if offset exceeds total records

    # Step 2: Apply offset across datasets
    remaining_offset = offset
    collected_records = []
    remaining_limit = limit

    try:
        for dataset, dataset_total in dataset_counts:
            if remaining_offset >= dataset_total:
                remaining_offset -= dataset_total  # Skip this dataset entirely
                continue

            # Adjust limit so we don't fetch more than required
            dataset_limit = min(remaining_limit, dataset_total - remaining_offset)

            # Fetch records for this dataset
            dataset_query = f"{sparql_query_template} LIMIT {dataset_limit} OFFSET {remaining_offset}"
            results = execute_select_query(dataset_query, [dataset])

            for dataset_result in results:
                bindings = dataset_result.get("results", {}).get("bindings", [])
                for item in bindings:
                    collected_records.append({
                        "subject": item["subject"]["value"],
                        "predicate": item["predicate"]["value"],
                        "object": item["object"]["value"],
                    })

            # Update remaining limits
            remaining_limit -= len(collected_records)
            remaining_offset = 0  # After first dataset with records, reset offset

            if remaining_limit == 0:
                break  # Stop when we reach the required limit

        return {"triples": collected_records, "total": total_count}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching records: {str(e)}")
