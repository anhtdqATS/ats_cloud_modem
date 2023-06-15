const express = require('express');
const router = express.Router();
const { errorRes, successRes } = require('../common/response');
const { onlyAdmin, notFound } = require('../middleware/index');
const { exec } = require('child_process');

const Ping = (req, res) => {
  const host = req.params.host;

  // call ping with host
  exec(`ping -c 5 ${host}`, (error, stdout, stderr) => {
    if (error) {
      return errorRes(res, error.message, error.message, 500);
    }
    res.status(200).json({ result: stdout });
  });
};

const traceRoute = (req, res) => {
  const host = req.params.host;

  exec(`traceroute ${host}`, (error, stdout, stderr) => {
    if (error) {
      return errorRes(res, error.message, error.message, 500);
    }

    res.status(200).json({ result: stdout });
  });
};

router.get('/ping/:host', Ping).get('/traceroute/:host', traceRoute).use(notFound);
module.exports = router;
