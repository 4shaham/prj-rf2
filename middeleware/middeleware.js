



exports.myMiddleware = (req, res, next) => {
  // Your middleware logic here
  console.log('Middleware executed');
  next(); // Call next() to pass control to the next middleware in the chain
};



exports.checking = (req, res, next) => {
  if (req.session.authentication == true) {
    res.redirect("/logout")
  } else {
    next()
  }



}

exports.adminchecking = (req, res,next) => {
  if (! req.session.admin==true) {
    res.redirect("/adminlogin")
  }else {
    next()
  }
}









