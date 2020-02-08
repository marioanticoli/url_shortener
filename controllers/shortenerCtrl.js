const redis = require("redis");

const client = redis.createClient({
  host: "redis",
  port: 6379
});

/**
 * Create a new shortened url
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
const shorten = async (req, res) => {
  try {
    const orig_url = req.body.url;
    if (urlIsValid(orig_url)) {
      let idUnique = false;
      let id;
      while (!idUnique) {
        id = randomID(10);
        if ((await redisGet(id)) == null) {
          idUnique = true;
          client.SET(id, orig_url);
        }
      }

      res.status(200).send({
        original_link: orig_url,
        short_link: `http://localhost/${id}`
      });
    } else {
      res.status(422).send({
        message: `${orig_url} is not a valid URL`
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({
      error: err,
      message: err.message
    });
  }
};

/**
 * Serve a shortened url
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
const serve = async (req, res) => {
  const id = req.params.id;
  const orig_url = await redisGet(id);
  console.log(orig_url);
  res.redirect(301, orig_url);
};

const randomID = l => {
  return [...Array(l)].map(() => Math.random().toString(36)[2]).join("");
};

const urlIsValid = s => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

const redisGet = key => {
  return new Promise((resolve, reject) => {
    client.get(key, function(err, reply) {
      if (err) reject(err);
      resolve(reply);
    });
  });
};

module.exports = {
  shorten,
  serve
};
