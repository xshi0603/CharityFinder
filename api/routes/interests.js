import { db } from "../config/firebase.js";
import { Router } from "express";
const router = Router();

// TODO: Update documentation

/**
 * @route [GET] /api/interests/
 * @desc Get All Interest Areas
 * @return List of all "interest" areas
 */
router.get("/", async (req, res) => {
  try {
    const { uid } = req.body;
    const interestsRef = db
      .collection("users")
      .doc(uid)
      .collection("interests");
    const interestsSnap = await interestsRef.get();
    console.log(interestsSnap);

    let interestsData = [];
    interestsSnap.forEach((doc) => {
      interestsData.push({ ...doc.data(), id: doc.id }); // append id for update+delete
    });
    return res.status(200).json(interestsData);
  } catch (e) {
    console.log("Could not get favorites. There's an error afoot...", e);
  }
});

// TODO: Switch to accept a list of interests, and update db selection
/**
 * @route [POST] /api/interests/
 * @desc Add an interest area to your profile
 * @return 204 good response
 */
router.post("/", async (req, res) => {
  try {
    const { causeId, causeName } = req.body;

    const favoriteRef = db.collection("users").doc(uid).collection("interests");

    await favoriteRef.add({
      causeId,
      causeName,
    });

    return res.status(204).send("Interest Areas Added :)");
  } catch (e) {
    console.log("There's an error afoot...", e);
  }
});

/**
 * @route [GET] /api/interests/:interestId
 * @desc GET Interest Area Information
 * @return Interests object, if exists
 */
router.get("/:interestId", async (req, res) => {
  try {
    const { uid } = req.body;
    const { interestsId } = req.params;

    if (interestsId) {
      const interestRef = db
        .collection("users")
        .doc(uid)
        .collection("interests")
        .doc(interestsId);

      const interestItem = await interestRef.get();

      if (interestItem.exists) {
        return res
          .status(200)
          .json({ ...interestItem.data(), id: interestItem.id });
      } else {
        console.log(
          "This interest area does not exist for this user. *raises eyebrow*"
        );
      }
    }
  } catch (e) {
    console.log("Could not get interest area.");
  }
});

export default router;
