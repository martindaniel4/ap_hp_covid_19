import time
from flask import Flask, redirect, url_for

app = Flask(__name__, static_folder='../build', static_url_path='/')


@app.route('/')
def index():
    return redirect(url_for('static', filename='index.html'))
    # another option:
    # return send_file('../build/index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}
