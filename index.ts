import express from "express";
import { PrismaClient } from "@prisma/client";
import { brotliDecompressSync } from "zlib";

const prisma : PrismaClient = new PrismaClient();

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3001;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended : true }));



app.post("/haku", async (req : express.Request, res : express.Response) => {

    const haku = await prisma.kunta.findMany({
        where: {
          kunta: {
            startsWith: req.body.kunta,
          },
        },
      })    

    const tilastotieto = await prisma.kunta.aggregate ({
        where: {
            kunta: {
                startsWith: req.body.kunta,
            }
        },
        _avg: {
            asukkaatYhteensa: true,
        },
        _count: {
            kunta: true
        }
    })



    res.render("index", { kunnat : haku, tilastot : tilastotieto });

});


app.get("/", async (req : express.Request, res : express.Response) => {

    const tilastotieto = await prisma.kunta.aggregate ({
        where: {
            kunta: {
                startsWith: req.body.kunta,
            }
        },
        _avg: {
            asukkaatYhteensa: true,
        },
        _count: {
            kunta: true
        }
    }) 

    let kunnat = await prisma.kunta.findMany();
    

    res.render("index", { kunnat : kunnat, tilastot : tilastotieto });

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`)

});