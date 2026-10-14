from flask import Flask
import psycopg2

app = Flask(__name__)

@app.route('/')
def hello():
    conn = psycopg2.connect("dbname=postgres user=postgres password=mysecret host=db")
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS test (id SERIAL, name TEXT); INSERT INTO test (name) VALUES ('DevOps');")
    cur.execute("SELECT * FROM test;")
    data = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return str(data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)