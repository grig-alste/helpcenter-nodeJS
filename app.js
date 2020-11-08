const express = require("express");
const app = express();


let webPort = process.argv[2];

if (typeof webPort == 'undefined') {
   webPort = 3000;
}


app.set("view engine", "hbs");
//app.set("views", "templates"); // установка пути к представлениям


app.get("/", function(request, response){
     
    response.send("<h1>Главная страница</h1>");
});
app.get("/about", function(request, response){
     
    response.send("<h1>О сайте</h1>");
});
app.use("/contact", function(request, response){
     
    response.render("contact.hbs", {
        title: "Мои контакты",
        emailsVisible: true,
        emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890"
    });
});

app.listen(webPort, () => {
  console.log(`App listening at http://localhost:${webPort}`)
});
console.log("webPort: " + webPort);