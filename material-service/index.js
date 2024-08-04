const { connectRabbitMQ } = require('./services/rabbitmq.service');
const { transactionGetMaterialRequestListener } = require('./rabbitmq/listener');

connectRabbitMQ().then(channel => {
    channel.assertQueue('transaction_get_material_request', { durable: false });
    channel.consume('transaction_get_material_request', (msg) => transactionGetMaterialRequestListener(channel, msg), { noAck: false });
});

const port = process.env.APP_PORT;

const express = require('express');
const app = express();

const { body } = require('express-validator');
const materialController = require('./controllers/material.controller');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', materialController.findAllMaterials);
app.post('/', body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'), materialController.createMaterial);
app.get('/:id', materialController.findMaterial);
app.put('/:id', body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'), materialController.updateMaterial);
app.delete('/:id', materialController.deleteMaterial);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
