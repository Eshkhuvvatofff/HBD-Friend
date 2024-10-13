const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require('dotenv').config(); // .env faylini yuklash

// Muhit o'zgaruvchilarini tekshirish
const checkEnvVariables = () => {
  const requiredVariables = ["NAME", "PIC"];
  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      console.error(`Please specify ${variable} in environment.`);
      process.exit(1); // Dasturdan chiqish
    }
  });
  
  if (!process.env.SCROLL_MSG) {
    console.warn("SCROLL_MSG is not specified, proceeding without it.");
  }
};

checkEnvVariables(); // O'zgaruvchilarni tekshirish

const picPath = process.env.PIC;
const msgPath = process.env.SCROLL_MSG;

// Local initialization
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
    console.log("Local data set successfully.");
  } catch (e) {
    console.error("Error in setLocalData:", e.message);
    process.exit(1); // Dasturdan chiqish
  }
};

// Remote initialization
const setRemoteData = async () => {
  try {
    let res = await axios.get(picPath, {
      responseType: "arraybuffer",
    });
    const pic = res.data;
    let markup = "";
    
    if (msgPath) {
      const article = msgPath.split("/").pop();
      res = await axios.get(
        `https://api.telegra.ph/getPage/${article}?return_content=true`
      );
      const { content } = res.data.result;
      markup = content.reduce(
        (string, node) => string + generateMarkupRemote(node),
        ""
      );
    }
    
    await setPic(pic);
    genIndex(markup);
    console.log("Remote data set successfully.");
  } catch (e) {
    console.error("Error in setRemoteData:", e.message);
    process.exit(1); // Dasturdan chiqish
  }
};

// Vercel muhitida ishlatish
if (process.argv[2] === "--local") {
  setLocalData();
} else if (process.argv[2] === "--remote") {
  setRemoteData();
} else {
  console.log("Fetch mode not specified. Use '--local' or '--remote'.");
}
