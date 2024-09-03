from flask import Flask, render_template,redirect,url_for
from flask_bootstrap import Bootstrap5



# TODO configure app
app = Flask(__name__)
app.config["SECRET_KEY"] = "eH1L07Y2hPtpsrElJX6gCo29STQeUVW9"
Bootstrap5(app)



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