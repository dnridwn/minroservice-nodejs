const port = process.env.APP_PORT;

const express = require('express');
const app = express();
const { body } = require('express-validator');
const transactionController = require('./controllers/transaction.controller');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', transactionController.findAllTransactions);
app.post(
    '/',
    body('vendor_id').notEmpty().withMessage('Vendor ID is required').isNumeric().withMessage('Vendor ID must be a number'),
    body('customer_id').notEmpty().withMessage('Customer ID is required').isNumeric().withMessage('Customer ID must be a number'),
    body('material_id').notEmpty().withMessage('Masterial ID is required').isNumeric().withMessage('Masterial ID must be a number'),
    transactionController.createTransaction
);
app.get('/:id', transactionController.findTransaction);
app.put(
    '/:id',
    body('vendor_id').notEmpty().withMessage('Vendor ID is required').isNumeric().withMessage('Vendor ID must be a number'),
    body('customer_id').notEmpty().withMessage('Customer ID is required').isNumeric().withMessage('Customer ID must be a number'),
    body('material_id').notEmpty().withMessage('Masterial ID is required').isNumeric().withMessage('Masterial ID must be a number'),
    transactionController.updateTransaction
);
app.delete('/:id', transactionController.deleteTransaction);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
