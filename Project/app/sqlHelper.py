import sqlalchemy
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///CLEAN_PARK_DATA.sqlite")

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    def get_bar(self, user_selection="All"):

        #title popularity.
        #user selection, where clause
        if user_selection == "All":
            filter_clause = "datamonth=datamonth"
        elif user_selection == "June":
            filter_clause = "datamonth=6"
        elif user_selection == "July":
            filter_clause = "datamonth=7"
        elif user_selection == "August":
            filter_clause = "datamonth=8"
        else:
            user_selection == "September"
            filter_clause = "datamonth=9"

        # build the query
        query = f"""
            SELECT
                Count(title) AS "Plays", title AS "Movie", datamonth AS "Month"
            FROM
                showings
            WHERE
                {filter_clause}
            GROUP BY
                title
            HAVING
                Plays > 1
            ORDER BY
                Plays DESC;
                    """
        
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
    

    def get_sunburst(self, user_selection="All"):

        if user_selection == "All":
            filter_clause = "datamonth=datamonth"
        elif user_selection == "June":
            filter_clause = "datamonth=6"
        elif user_selection == "July":
            filter_clause = "datamonth=7"
        elif user_selection == "August":
            filter_clause = "datamonth=8"
        else:
            user_selection == "September"
            filter_clause = "datamonth=9"

        # build the query
        query = f"""
            SELECT
                datayear as label,
                "" as parent,
                count(title) num_plays
            FROM
                showings
            WHERE
                {filter_clause}
            GROUP BY
                datayear

            UNION ALL

            SELECT
                day as label,
                datayear as parent,
                count(title) num_plays
            FROM
                showings
            WHERE
                {filter_clause}
            GROUP BY
                day,
                datayear;
        """

        df = pd.read_sql(text(query), con=self.engine)
        data = df.to_dict(orient="records")

        return(data)

    def get_map(self, year_min, year_max):

        # build the query
        query = f"""
            SELECT
                title,
                park,
                date,
                rating,
                cc,
                latitude,
                longitude,
                datayear,
                community,
                geocode_address
            FROM
                showings
            WHERE
                datayear >= {year_min}
                and datayear <= {year_max}
            ORDER BY
                datayear ASC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
