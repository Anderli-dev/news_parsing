from backend import app, sched

if __name__ == '__main__':
    sched.start(paused=True)
    app.run(debug=True)
