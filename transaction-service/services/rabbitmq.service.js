const amqp = require('amqplib');

function generateSessionID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function connectRabbitMQ() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    return channel;
}

async function sendAndReceive(channel, queueName, message) {
    const queueSessionID = generateSessionID();

    channel.assertQueue(`${queueName}_response`, { durable: false });
    channel.sendToQueue(`${queueName}_request`, Buffer.from(
        JSON.stringify({
            sessionID: queueSessionID,
            ...message
        }))
    );

    return new Promise((resolve, _) => {
        channel.consume(`${queueName}_response`, async (msg) => {
            channel.ack(msg);

            const response = JSON.parse(msg.content.toString());

            if (response.sessionID == queueSessionID) {
                resolve(response);
            }
        }, { noAck: false });
    });
}

module.exports = { connectRabbitMQ, sendAndReceive };