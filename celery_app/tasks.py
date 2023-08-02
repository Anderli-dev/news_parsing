from app import celery_app


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(5.0, test.s('hello world'), name='add every 5')


@celery_app.task
def test(arg):
    print(arg)
