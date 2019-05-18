import * as express from 'express';

const app = express();

// View a contact
app.get('/:orderId', (req, res) => {
  res.status(200).send('got it ' +  req.params.orderId);
})
// View all contacts
app.get('', (req, res) => {
  res.status(200).send('There u goes')
})
// Add new contact
app.post('', (req, res) => {
  res.send('Create a new order');
})
// Update new contact
app.patch('/:orderId', (req, res) => {
  res.send('Update a new order' + req.params.orderId);
})
// Update new contact
app.put('/:orderId', (req, res) => {
  res.send('Update a new order' + req.params.orderId);
})
// Delete a contact
app.delete('/:orderId', (req, res) => {
  res.send('Document deleted');
})

export = app;
