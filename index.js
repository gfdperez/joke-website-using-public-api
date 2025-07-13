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
app.use(bodyParser.urlencoded({ extended : true }));

app.get("/", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "/joke/Any");
        const data = JSON.stringify(result.data)
        console.log("result:", data);
        res.render("index.ejs", { content: data });
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
});

// app.get("/getJoke", async (req, res) => {
//     try {
//         const result = await axios.get(API_URL + "/joke/Any");
//         console.log("result:", result);
//         res.render("index.ejs", { content: result });
//     } catch (error) {
//         console.error("Failed to make request:", error.message);
//     }
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
