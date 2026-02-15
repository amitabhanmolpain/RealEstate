import pika
import json
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["realestate"]

def recommend(user_id, property_id):
    liked_property = db.properties.find_one({"_id": property_id})

    if not liked_property:
        return

    similar = db.properties.find({
        "type": liked_property["type"],
        "location": liked_property["location"]
    }).limit(5)

    rec_ids = [str(p["_id"]) for p in similar]

    db.recommendations.update_one(
        {"user_id": user_id},
        {"$set": {"recommended": rec_ids}},
        upsert=True
    )

def callback(ch, method, properties, body):
    data = json.loads(body)

    if data["event"] == "PROPERTY_LIKED":
        print("Processing recommendation...")
        recommend(data["user_id"], data["property_id"])

    ch.basic_ack(delivery_tag=method.delivery_tag)

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost')
)

channel = connection.channel()
channel.queue_declare(queue='property_likes', durable=True)

channel.basic_consume(queue='property_likes', on_message_callback=callback)

print("Worker running...")
channel.start_consuming()