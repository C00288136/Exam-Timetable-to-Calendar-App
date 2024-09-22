from flask import Flask, render_template,redirect,url_for,request,jsonify
from flask_bootstrap import Bootstrap5
from dotenv import load_dotenv
import os
from pprint import pprint


load_dotenv()

# TODO configure app
app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ['SECRET_KEY']
Bootstrap5(app)


# TODO index page   
@app.route('/')
def home():
    return render_template('index.html') 
# TODO pdf view page\
@app.route('/pdfviewer')    
def pdfviewer():
    return render_template('pdf-viewer.html')

# TODO extract pdf data
@app.route('/process-data', methods=['POST'])
def process_structured_text():
    data = request.json
    structured_text = data.get('data')
    course_code = data.get('course_code')
    year = data.get('year')

    # Process the structured text, course code, and year here
    print(f"Received course code: {course_code}, year: {year}")

    # Respond with success or error
    return jsonify({"success": True})
# TODO Oauth2 integration
# TODO google calendar api


# run app 
if __name__ == "__main__":
    app.run(debug=True)