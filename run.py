from backend import app, sched
from parsing_app.parsing import parsing

if __name__ == '__main__':
    sched.add_job(parsing, 'interval', seconds=int(app.config['PARSING_TIME']) * 60 * 60, id='get_posts')
    sched.start(paused=True)
    app.run(debug=True)
