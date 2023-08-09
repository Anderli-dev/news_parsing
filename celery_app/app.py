from celery import Celery, Task


def get_celery_app_instance(app):
    class ContextTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery = Celery(
        app.name,
        task_cls=ContextTask,
        broker=app.config['CELERY_BROKER_URL']
    )

    celery.conf.timezone = 'UTC'
    celery.conf.update(app.config)

    return celery
