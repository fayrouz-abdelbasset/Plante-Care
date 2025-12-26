import { db } from "../../../config.js";


const COLLECTION_NAME = "tokens";

export const TokenModel = {

  async findOne({ filter }) {
    const [key, value] = Object.entries(filter)[0];

    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where(key, "==", value)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  },

  async create({ data }) {
    const doc = data[0];

    await db.collection(COLLECTION_NAME).add({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
};

export default TokenModel;