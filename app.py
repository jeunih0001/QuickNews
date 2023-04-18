from flask import Flask,render_template,request
import json
import requests

apiKey = "fc15ba2c83b744aeb9e1634f13a057ef"

app = Flask(__name__)

global url

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/fetch',methods=['GET','POST'])
def fetch():
    data = json.loads(request.data)
    url = data["url"]+apiKey
    r = requests.get(url).json()
    return r
# @app.route('/search',methods=['GET','POST'])
# def search():
#     data = json.loads(request.data)
#     search_url = data['url']+apiKey
#     r = requests.get(search_url).json()
#     print(search_url)
#     return r

if __name__ == '__main__':
    app.run(debug=True)