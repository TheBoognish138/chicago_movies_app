from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
import os


#################################################
# Change to expected directory so that SQLIte
# file can be opened
#################################################
os.chdir(os.path.dirname(os.path.realpath(__file__)))
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################

# HTML ROUTES
@app.route("/")
def index():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

# SQL Queries
@app.route("/api/v1.0/get_dashboard/<user_selection>")
def get_dashboard(user_selection):
    bar_data = sql.get_bar(user_selection)
    sunburst_data = sql.get_sunburst()

    data = {
        "bar_data": bar_data,
        "sunburst_data": sunburst_data
    }
    return(jsonify(data))

@app.route("/api/v1.0/get_map/<year_min>/<year_max>")
def get_map(year_min, year_max):
    year_min = int(year_min) # cast to int
    year_max = int(year_max) # cast to int
    map_data = sql.get_map(year_min, year_max)

    return(jsonify(map_data))



# Run the App
if __name__ == '__main__':
    app.run(debug=True)
