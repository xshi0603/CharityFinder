import { db } from "../config/firebase.js";
import { Router } from "express";
const router = Router();

// TODO: Update documentation
// TODO: Update Error Handling

/**
 * @route [GET] /api/favorites
 * @desc Get All Favorites
 * @return List of all "favorited" organizations
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const favoritesRef = db.collection("favorites");

    const snapshot = await favoritesRef.where("userId", "==", userId).get();

    let userFavorites = [];

    snapshot.forEach((doc) => {
      userFavorites.push({ ...doc.data(), id: doc.id });
    });
    return res.status(200).json(userFavorites);
  } catch (e) {
    console.error("Could not get favorites. There's an error afoot...", e);
  }
});

/**
 * @route [POST] /api/favorites
 * @desc Add an Organization to your Favorites
 * @return 204 good response
 */
router.post("/", async (req, res) => {
  try {
    const { orgName, orgId, orgAddress, userId } = req.query;

    const favoriteRef = db.collection("favorites");

    await favoriteRef.add({
      orgName,
      orgId,
      orgAddress,
      userId,
    });
    return res.status(204).send("Favorited :)");
  } catch (e) {
    console.error("There's an error afoot...", e);
  }
});

/**
 * @route [GET] /api/favorites/:favoriteId
 * @desc GET Favorite organization
 * @return Organization object, if in user's Favorites
 */
router.get("/:favoriteId", async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favoriteRef = db.collection("favorites").doc(favoriteId);

    const favoriteItem = await favoriteRef.get();

    console.log(favoriteItem);
    if (favoriteItem.exists) {
      return res
        .status(200)
        .json({ ...favoriteItem.data(), id: favoriteItem.id });
    } else {
      return res.status(304).json({
        error: "This organization is not favorited",
      });
    }
  } catch (e) {
    console.error("Could not get favorited organization.");
  }
});

/**
 * EXPERIMENTAL
 * @route [PUT] /api/favorites
 * @desc Update Favorited organization to your profile
 * @return 204 good response / 304 Not Modified [check user authentication]
 */
router.put("/:favoriteId", async (req, res) => {
  try {
    const { orgName, orgId, orgAddress } = req.query;
    const { favoriteId } = req.params;

    const favoriteRef = db.collection("favorites").doc(favoriteId);

    await favoriteRef.update({
      orgName,
      orgId,
      orgAddress,
    });

    return res.status(204).send(`${orgName} was updated`);
  } catch (e) {
    console.error("There's an error afoot...", e);
  }
});

/**
 * @route [DEL] /api/favorites
 * @desc Remove favorited organization from to your profile
 * @return 204 good response
 */
router.delete("/:favoriteId", async (req, res) => {
  try {
    const { orgName } = req.query;
    const { favoriteId } = req.params;

    const favoriteRef = db.collection("favorites").doc(favoriteId);

    await favoriteRef.delete();

    return res.status(204).send(`${orgName} was removed from your causes`);
  } catch (e) {
    console.error("There's an error afoot...", e);
  }
});
export default router;