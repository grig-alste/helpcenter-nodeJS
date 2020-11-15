const express = require("express");
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
// Получение аргумента запуска приложения (порт приложеения)
let webPort = process.argv[2];

const urlencodedParser = bodyParser.urlencoded({extended: false});

// Подключение пула MySQL
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  port: 3306,
  user: "helpcenter",
  database: "helpcenter",
  password: "12345678"
});

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

app.use(express.static(__dirname + "/public"));

// Получение списка пользователей
app.get("/users", function(req, res){
    pool.query("SELECT * FROM users", function(err, data) {
      if(err) return console.log(err);
      res.render("users.hbs", {
		  title: "Список пользователей",
          users: data
      });
    });
});

app.get("/create_user", function(req, res){
      res.render("create_user.hbs", {
		  title: "Создать нового пользователя",
	  });
});

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
        title: "Домашняя страница",
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