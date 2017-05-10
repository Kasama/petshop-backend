"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ClientRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.get('/', this.listClients);
    }
    listClients(req, res, next) {
        res.send({ clients: [{ 'name': 'jose', 'age': 30 }] });
    }
}
exports.ClientRouter = ClientRouter;
const clientRoutes = new ClientRouter();
clientRoutes.init();
exports.default = clientRoutes.router;
