import os

from pandas import Timestamp
from pandas._libs import NaTType
from sqlalchemy import create_engine
import pandas as pd
import json
# The name of the database => watr
# The username you use to log into your MySQL database => root
# The password for your MySQL user => watr_admin_WEB
# The database host => localhost:3306

engine = create_engine("mysql://root:watr_admin_WEB@localhost:3306/iulian")
root_folder = r"D:\Facultate\master\WEB\test\data"
a_lists = []
# Process each class folder
for class_folder in os.listdir(root_folder):
    class_path = os.path.join(root_folder, class_folder)
    if os.path.isdir(class_path):  # Ensure it's a folder
        all_columns = {}
        data_list = []

        # Step 1: Scan all JSON files to determine all unique columns
        index_host = 0
        for json_file in os.listdir(class_path):
            # if index_host == 5:
            #     break
            index_host += 1
            if json_file.endswith(".json.gz"):
                file_path = os.path.join(class_path, json_file)
                df = pd.read_json(file_path, compression='gzip', lines=True)

                for col in list(df.columns):
                    if col not in all_columns:
                        all_columns[col] = 0

                # Convert to JSON where column names are keys
                json_dict = df.to_dict(orient="records")

                index = 0
                loaded = len(json_dict)
                if loaded > 1000:
                    print(f"[{class_folder}][{index_host}] {len(json_dict)} elements loaded but only 1000 were stored")
                else:
                    print(f"[{class_folder}][{index_host}] {len(json_dict)} elements loaded")
                for item in json_dict:
                    if index == 1000:
                        break
                    for item_key, item_value in item.items():
                        if item_value is not None:
                            all_columns[item_key] += 1
                        item[item_key] = json.dumps(item_value) if isinstance(item_value, list | dict) else item_value
                    data_list.append(item)
                    index += 1

        total_size = len(data_list)
        for col_key, col_value in all_columns.items():
            if (col_value / total_size) > 0.5:
                all_columns[col_key] = True
            else:
                all_columns[col_key] = False

        final_data_list = []

        for dictionary in data_list:
            aux_dict = {}
            other_info = {}
            for dict_key, dict_value in dictionary.items():
                if all_columns[dict_key]:
                    aux_dict[dict_key] = dict_value
                elif dict_value is not None:
                    if not isinstance(dict_value, NaTType | Timestamp):
                        dict_value = str(dict_value)
                        other_info[dict_key] = dict_value
            aux_dict["other_info"] = json.dumps(other_info)

            for elem_key, elem_value in aux_dict.items():
                aux_dict[elem_key] = None if elem_value.__sizeof__() > 65535 else elem_value
            final_data_list.append(aux_dict)

        df_final = pd.DataFrame(final_data_list)

        # Step 4: Save the DataFrame to the database
        table_name = class_folder.lower()
        df_final.to_sql(table_name, engine, if_exists="replace", index=False)
        print(f"Class '{class_folder}': {len(final_data_list)} rows inserted into table '{table_name}'.")

print()
