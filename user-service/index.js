const { connectRabbitMQ } = require('./services/rabbitmq.service');
const { transactionGetVendorCustomerRequestListener } = require('./rabbitmq/listener');

connectRabbitMQ().then(async (channel) => {
    channel.assertQueue('transaction_get_vendor_customer_request', { durable: false });
    channel.consume('transaction_get_vendor_customer_request', (msg) => transactionGetVendorCustomerRequestListener(channel, msg), { noAck: false });
});

const port = process.env.APP_PORT;

const express = require('express');
const app = express();
const { body } = require('express-validator');
const userController = require('./controllers/user.controller');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', userController.findAllUsers);
app.post(
    '/',
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    userController.createUser
);
app.get('/:id', userController.findUser);
app.put(
    '/:id',
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    userController.updateUser
);
app.delete('/:id', userController.deleteUser);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
