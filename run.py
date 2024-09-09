from backend import app, sched, parsing

if __name__ == '__main__':
    sched.add_job(parsing, 'interval', seconds=int(app.config['PARSING_TIME'])*60*60, id='get_posts')
    sched.start(paused=True)
    app.run(debug=True, host="0.0.0.0", port=5000)
