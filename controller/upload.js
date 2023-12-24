const fileUpload = require("express-fileupload");
exports.upload = async (req, res) => {
  const file = req.file.upload;

  file.mv(__dirname + "/bulk/" + fileName + ".json", function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("uploaded");
    }
  });
};
