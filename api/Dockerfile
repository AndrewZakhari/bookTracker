FROM python:3.10-slim as builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHON#UNBUFFERED 1

COPY requirements.txt
RUN pip install --no-chache-dir -r requirements.txt

FROM python3.10-slim

WORKDIR /usr/src/app

COPY --from-builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]


