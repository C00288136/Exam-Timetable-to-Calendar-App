from flask import Flask, render_template,redirect,url_for
from flask_bootstrap import Bootstrap5
from dotenv import load_dotenv
import os


load_dotenv()

# TODO configure app
app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ['SECRET_KEY']
Bootstrap5(app)
print(os.environ['SECRET_KEY'])


# TODO index page   
@app.route('/')
def home():
    return render_template('index.html') 
# TODO pdf view page\
@app.route('/pdfviewer')    
def pdfviewer():
    return render_template('pdf-viewer.html')
# TODO Oauth2 integration
# TODO google calendar api


# run app 
if __name__ == "__main__":
    app.run(debug=True)