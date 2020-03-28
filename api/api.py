import time
from flask import Flask, request, redirect, url_for, jsonify

app = Flask(__name__, static_folder='../build', static_url_path='/')


@app.route('/')
def index():
    return redirect(url_for('static', filename='index.html'))
    # another option:
    # return send_file('../build/index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/files', methods = ['POST'])
def post_files():
    time.sleep(2)
    print (request.is_json)
    return {'files': 'JSON posted'}
