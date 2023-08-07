const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

const post = (host, port, path, event) => {
  axios.post(`http://${host}:${port}${path}`, event).catch(err => {
    console.log(err.message + ` : http://${host}:${port}${path}`);
  });
}

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);

  post('posts-clusterip-svc', '4000', '/events', event);
  post('comments-svc', '4001', '/events', event);
  post('query-svc', '4002', '/events', event);
  post('moderation-svc', '4003', '/events', event);

  res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => console.log('Listening to 4005'));
