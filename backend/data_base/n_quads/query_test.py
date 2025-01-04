from sqlalchemy import create_engine
import pandas as pd
import json

# Convert string columns back to their real formats
def convert_json_column(cell):
    try:
        # Try to parse the string using json.loads
        return json.loads(cell)
    except (TypeError, ValueError):
        # If the cell is already a dict/list or invalid, return it as-is
        return cell


engine = create_engine("mysql://root:watr_admin_WEB@localhost:3306/iulian")
query = "SELECT * FROM localbusiness;"  # Change condition as needed

# Execute the query and load the result into a Pandas DataFrame
df = pd.read_sql(query, engine)

new_df = df.copy()
# Display the DataFrame
for column in new_df.columns:
    new_df[column] = new_df[column].apply(convert_json_column)

print()
