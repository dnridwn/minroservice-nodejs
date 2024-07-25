const amqp = require('amqplib');

exports.connectRabbitMQ = async function() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    return channel;
};
