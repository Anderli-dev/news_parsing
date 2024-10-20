FROM python:3.10

WORKDIR /backend

COPY backend/requirements.txt /backend
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY backend/. /backend
COPY run.py /

WORKDIR /parsing_app
COPY parsing_app/. /parsing_app

WORKDIR /

ENTRYPOINT ["python3"]
CMD ["run.py"]
