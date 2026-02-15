import pika
import json

def publish_like_event(user_id, property_id):

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost')
    )

    channel = connection.channel()

    channel.queue_declare(queue='property_likes', durable=True)

    message = {
        "event": "PROPERTY_LIKED",
        "user_id": user_id,
        "property_id": property_id
    }

    channel.basic_publish(
        exchange='',
        routing_key='property_likes',
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2)
    )

    connection.close()