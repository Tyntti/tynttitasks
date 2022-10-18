"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const portti = Number(process.env.PORT) || 3001;
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.post("/haku", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const haku = yield prisma.kunta.findMany({
        where: {
            kunta: {
                startsWith: req.body.kunta,
            },
        },
    });
    const tilastotieto = yield prisma.kunta.aggregate({
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
    });
    res.render("index", { kunnat: haku, tilastot: tilastotieto });
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tilastotieto = yield prisma.kunta.aggregate({
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
    });
    let kunnat = yield prisma.kunta.findMany();
    res.render("index", { kunnat: kunnat, tilastot: tilastotieto });
}));
app.listen(portti, () => {
    console.log(`Palvelin käynnistyi osoitteeseen http://localhost:${portti}`);
});
