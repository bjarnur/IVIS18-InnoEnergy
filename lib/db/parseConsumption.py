# coding: utf-8

# In[536]:

import pandas as pd
import numpy as np
import sqlite3 as lite
import sys
import time

data_source='secret/el_07_07_2017.csv'
table_name='consumption'
database_location='secret/db.sqlite'

# load data

start_time = time.time()
# chunk size of 10k will take about 10 gb of your RAM.
for df in pd.read_csv(data_source, chunksize=10000):
    #stacked = df.unstack()
    #stacked
    # dt = df.transpose()
    #df.pivot_table(index=df.iloc[:,0])
    #pd.melt(dt, id_vars='date', value_vars=dt.iloc[:,1:])
    #pd.melt(dt, id_vars=dt.iloc[0,:], value_vars='date')
    #pd.melt(df, id_vars="date", value_vars=df.iloc[:,0])
    d = pd.melt(df, id_vars=['date'], value_vars=df.iloc[:,1:])
    d = d.rename(columns={'date': 'timestamp', 'variable': 'id'})
    d['timestamp'] = pd.to_datetime(d['timestamp'])
    # Read sqlite query results into a pandas DataFrame
    start_time = time.time()
    con = lite.connect(database_location)
    #df = pd.read_sql_query("SELECT * from consumption", con)
    print("--- %s seconds ---" % (time.time() - start_time))

    # drop data into database
    start_time = time.time()
    d.to_sql(table_name, con, if_exists="append", index=False) # we might want to index it but it takes about 1.5 gb more
    print("--- %s seconds ---" % (time.time() - start_time))

    start_time = time.time()
    d = pd.read_sql_query("SELECT COUNT(*) from " + table_name, con)
    print("--- %s seconds ---" % (time.time() - start_time))

    # Verify that result of SQL query is stored in the dataframe
    print(d.head())

    con.close()
