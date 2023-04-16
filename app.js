const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded( {extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via API 
app.post("/", function(req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data={
        members:[{
          email_address: email,
          status: "subscribed",
          merge_fields:{
            FNAME: firstName,
            LNAME: lastName
          }
        }]
      }
    // Converting string data to JSON data
const jsonData= JSON.stringify(data);
const url="https://us21.api.mailchimp.com/3.0/lists/52878b327f";
const options={
  method:"POST",
  auth:"201951173:6a62d334bbdb6cb05438e6cc0dc05da5-us21"
}



// On success send users to success, otherwise on failure template 
const request=https.request(url,options,function(response){
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
    request.write(jsonData);
    request.end();
  });


// Failure route
app.post("/failure",function(req,res){
    res.redirect("/");
 })



app.listen(port, function() {
    console.log("Server is running on port 3000");
});


// API key
// 6a62d334bbdb6cb05438e6cc0dc05da5-us21

//Audience ID
//52878b327f