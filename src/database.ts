import * as mongodb from "mongodb";
import { User } from "./user";

export const collections: {
    users?: mongodb.Collection<User>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("HashingExample");
    await applySchemaValidation_User(db);

    const usersCollection = db.collection<User>("users");
    collections.users = usersCollection;
}

async function applySchemaValidation_User(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["username", "pwd"],
            additionalProperties: false,
            properties: {
                _id: {},
                username: {
                    bsonType: "string",
                    description: "'username' is required and is a string",
                },
                pwd: {
                    bsonType: "string",
                    description: "'pwd' is required and is a string",
                }
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: "users",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("users", { validator: jsonSchema });
        }
    });
}