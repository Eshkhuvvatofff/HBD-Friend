const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

if (!process.env.NAME) throw new Error("Iltimos, muhitda NAME ni ko'rsating.");
if (!process.env.PIC) throw new Error("Iltimos, muhitda PIC ni ko'rsating.");

const picPath = process.env.PIC;
const msgPath = process.env.SCROLL_MSG;

//Local initialization
const setLocalData = async () => {
  try {
    const pic = path.join(__dirname, "../local/", picPath);
    let markup = "";
    if (msgPath) {
      const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
        encoding: "utf-8",
      });
      markup = generateMarkupLocal(text);
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

// setRemoteData funksiyasini olib tashladik
// const setRemoteData = async () => {
//   try {
//     let res = await axios.get(picPath, {
//       responseType: "arraybuffer",
//     });
//     const pic = res.data;
//     let markup = "";
//     if (msgPath) {
//       const article = msgPath.split("/").pop();
//       res = await axios.get(
//         `https://api.telegra.ph/getPage/${article}?return_content=true`
//       );
//       const { content } = res.data.result;
//       markup = content.reduce(
//         (string, node) => string + generateMarkupRemote(node),
//         ""
//       );
//     }
//     await setPic(pic);
//     genIndex(markup);
//   } catch (e) {
//     console.error("Xato yuz berdi:", e); // Xatolik haqida qo'shimcha ma'lumot
//     throw new Error(e.message || "Noma'lum xato"); // Xatolik haqida aniqroq ma'lumot
//   }
// };

if (process.argv[2] === "--local") setLocalData();
// else if (process.argv[2] === "--remote") setRemoteData(); // Bu qatorni olib tashladik
else console.log("Fetch mode not specified.");