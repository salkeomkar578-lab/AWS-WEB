/**
 * Vercel Serverless Function entry point for AWS SBG VPKBIET API
 */
const handleRequest = require('../server.js');

module.exports = (req, res) => {
  return handleRequest(req, res);
};
