function handleErrors(error, req, res, next) {
  console.log(error);

  if (error.code === 404) {
    return res.status(404).render("shared/404");
  }
  // 500 server side
  res.status(500).render("shared/500");
}

module.exports = handleErrors;
