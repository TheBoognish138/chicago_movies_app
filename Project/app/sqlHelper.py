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
    def get_bar(self, user_selection):

        #title popularity.
        #user selection, where clause
        user_selection = "Cult Favorites" #default selection
        if user_selection == "Most Loved":
            filter_clause = "COUNT(title) >= 20"
        elif user_selection == "Highly Acclaimed":
            filter_clause = "COUNT(title) >= 15 and COUNT(title) < 20"
        elif user_selection == "Popular":
            filter_clause = "COUNT(title) >= 10 and COUNT(title) <15"
        elif user_selection == "Cult Favorites":
            filter_clause ="COUNT(title) >= 2 and COUNT(title) <10"
        else:
            user_selection == "One Timers"
            filter_clause = "COUNT(title) = 1"

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
                title,
                datayear,
                datamonth,
                day
            FROM
                showings;
        """

        df = pd.read_sql(text(query), con = self.engine)
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
