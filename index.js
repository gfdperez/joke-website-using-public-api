import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/";

app.use("/public", express.static(__dirname + "/public"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use(bodyParser.urlencoded({ extended: true }));


let joke = "";
let isSingleJoke = true;
let categories = [
    {name: "Programming", value: false},
    {name: "Misc", value: false},
    {name: "Dark", value: false},
    {name: "Pun", value: false},
    {name: "Spooky", value: false},
    {name: "Christmas", value: false}
];

let blacklist = [
    {name: "Nsfw", value: false},
    {name: "Religious", value: false},
    {name: "Political", value: false},
    {name: "Racist", value: false},
    {name: "Sexist", value: false},
    {name: "Explicit", value: false}
];

function getInputAPICall(defaultReturn, arrayOfInputs, endChar){
    let inputAPICall = [];
    arrayOfInputs.forEach(input => {
        if(input.value){
            inputAPICall.push(input.name);
        }
    });

    if(inputAPICall.length > 0){
        return inputAPICall.join(",") + endChar;
    }

    return defaultReturn;
}

app.get("/", async (req, res) => {
    const viewsData = {
        isSingleJoke: isSingleJoke,
        categories: categories,
        blacklist: blacklist,
        joke: joke
    }

    res.render(__dirname + "/views/index.ejs", viewsData);
});

app.post("/setJokeType", async (req, res) => {
    isSingleJoke = req.body.type === "single";
    res.redirect("/");
});

app.post("/getSingleJoke", async (req, res) => {
    try {
        console.log("req.body:", req.body);
        for (let key in req.body){
            categories.map(category => {
                if (category.name === key) {
                    category.value = req.body[key];
                }
            });
            blacklist.map(item => {
                if (item.name === key) {
                    item.value = req.body[key];
                }
            });
        }
        
        const getCategories = getInputAPICall("Any?", categories, "?");
        const getBlacklist = getInputAPICall("", blacklist, "&");
        const result = await axios.get(API_URL + `/joke/${getCategories}${getBlacklist}type=single`);
        joke = result.data.joke;
        console.log("result:", joke);

        res.redirect("/");
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
