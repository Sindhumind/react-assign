"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const getUsers = async (req, res, next) => {
    try {
        const result = await db_1.default.query("SELECT * FROM users");
        res.json(result.rows);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const result = await db_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res, next) => {
    try {
        const { name, email, phone, gender } = req.body;
        const result = await db_1.default.query(`INSERT INTO users (name, email, phone, gender)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [name, email, phone, gender]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const updateUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { name, email, phone, gender } = req.body;
        const result = await db_1.default.query(`UPDATE users
       SET name = $1,
           email = $2,
           phone = $3,
           gender = $4
       WHERE id = $5
       RETURNING *`, [name, email, phone, gender, id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const result = await db_1.default.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.json({
            message: "User deleted successfully",
            user: result.rows[0],
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
