FROM python:3.13.3-alpine
LABEL maintainer="adrianoeusebio2006c1@gmail.com"

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1       
EXPOSE 8000  

RUN apk update && apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    postgresql-dev \
    build-base \
    linux-headers

COPY . /backend
COPY scripts /scripts

WORKDIR /backend

RUN python -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r /backend/requirements.txt

RUN mkdir -p /backend/data/web/static && \
    mkdir -p /backend/data/web/media && \
    mkdir -p /backend/data/web/images && \
    chmod -R 775 /backend/data/web/static && \
    chmod -R 775 /backend/data/web/media && \
    chmod +x /scripts/commands.sh

ENV PATH="/scripts:/venv/bin:$PATH"

CMD [ "commands.sh" ]
