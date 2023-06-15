const fs = require('fs');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');

const swaggerConfigPath = './swagger.yaml';
const swaggerDocument = YAML.parse(fs.readFileSync(swaggerConfigPath, 'utf8'));

function swaggerDocs(app, port) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
}

module.exports = swaggerDocs;
