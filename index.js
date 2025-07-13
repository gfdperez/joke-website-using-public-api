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
app.use(bodyParser.urlencoded({ extended: true }));

let joke = "";
let isSingleJoke = true;
app.get("/", async (req, res) => {
    const viewsData = {
        isSingleJoke: isSingleJoke,
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
        isSingleJoke = true;
        const result = await axios.get(API_URL + "/joke/Any?type=single");
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
