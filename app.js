const express = require("express");
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const app = express();

let webPort = process.argv[2];

// Настройка layout
app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static("public"));

app.use("/about", function(request, response){
     
    response.render("text.hbs", {
        title: "Текст Домашняя страница",
		text: "Произвольный текст",
    });
});

app.use("/contact", function(request, response){
      
		response.render("contact.hbs", {
        title: "Мои контакты",
        email: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
        phone: "+1234567890"
    });
});

app.use("/", function(request, response){
     
    response.render("index.hbs", {
        title: "Заглушка Домашняя страница",
		text: "Произвольный текст",
    });
});

if (typeof webPort == 'undefined') {
	webPort = 3000;
		} else { 
			if ( webPort > 0 && webPort < 49150) {
//				console.log("webPort: " + webPort);
				} else {
					console.log("Недопустимое значение параметра webPort: " + webPort);
					webPort = 3000;
				}
			}

app.listen(webPort, () => {
  console.log(`Приложение доступно по адресу - http://localhost:${webPort}`)
});