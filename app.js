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

app.post("/create_user", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const email = req.body.email;
    const s_name = req.body.s_name;
	const f_name = req.body.f_name;
	const m_name = req.body.m_name;
	const admin = req.body.admin;
	const comment = req.body.comment;
	const pass = req.body.pass;
    pool.query("INSERT INTO users (email, s_name, f_name, m_name) VALUES (?,?,?,?)", [email, s_name, f_name, m_name], function(err, data) {
      if(err) return console.log(err);
      res.redirect("/users");
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