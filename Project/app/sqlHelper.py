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
    def get_bar(self, user_selection="Most Loved"):

        #title popularity.
        #user selection, where clause
        if user_selection == "Most Loved":
            filter_clause = "COUNT(title) >= 20"
        elif user_selection == "Highly Acclaimed":
            filter_clause = "COUNT(title) >= 15 and COUNT(title) < 20"
        elif user_selection == "Popular":
            filter_clause = "COUNT(title) >= 10 and COUNT(title) <15"
        else:
            user_selection == "Cult Favorites"
            filter_clause = "COUNT(title) >= 2 and COUNT(title) <10"

        # build the query
        query = f"""
            SELECT
                Count(title) AS "Plays", title AS "Movie"
            FROM
                showings
            GROUP BY
                Movie
            HAVING
                {filter_clause}
            ORDER BY
                Plays DESC;
                    """
        
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
    

    def get_sunburst(self):

        # build the query
        query = f"""
            SELECT
                datayear as label,
                "" as parent,
                count(*) num_plays
            FROM
                showings
            GROUP BY
                datayear

            UNION ALL

            SELECT
                datamonth as label,
                datayear as parent,
                count(*) num_plays
            FROM
                showings
            GROUP BY
                datamonth,
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
