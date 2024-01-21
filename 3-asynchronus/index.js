const fs = require("fs");
const superagent = require("superagent");

// functions
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(`I could not find the file.`);
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write file");
      resolve("sucess");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    const breeds = data
      .toString()
      .trim()
      .split(/\s*\n\s*/);
    const randomIndex = Math.floor(Math.random() * breeds.length);
    const breed = breeds[randomIndex].toLowerCase();

    console.log(`Breed: ${breed}`);

    const res1 = await superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    const res2 = await superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    const res3 = await superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    const all = await Promise.all([res1, res2, res3]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro("dog-img.txt", imgs.join("\n"));
    console.log(`Random dog image saved to file!`);
  } catch (err) {
    console.log(err);
    throw err;
  }
  return "2: Ready";
};

(async () => {
  try {
    console.log("1: will get dog pics");
    const x = await getDogPic();
    console.log(x);
    console.log("3: Done getting dog pics");
  } catch (err) {}
})();

/*
console.log("1: will get dog pics");
getDogPic()
  .then((x) => {
    console.log(x);
    console.log("3: Done getting dog pics");
  })
  .catch((err) => {
    console.log("ERROR");
  });
*/
/*
// the code
readFilePro(`${__dirname}/dog.txt`)
  .then((result) => {
    console.log(`Breed: ${result}`);
    return superagent.get(`https://dog.ceo/api/breed/${result}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro("dog-img.txt", res.body.message);
  })
  .then(() => {
    console.log(`Random dog image`);
  })
  .catch((err) => {
    console.log(err.message);
  });

// gets the url
// then is what happens once the url is run successfully
//catch is if an error happens instead
*/
