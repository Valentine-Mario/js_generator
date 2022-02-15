var handlebars = require("handlebars");
var fs = require("fs");

const main = async () => {
  if (process.argv.length !== 5) {
    console.log(
      "please pass in the correct number of args eg ./cli function NewComponent app"
    );
    return;
  } else {
    const fileType = process.argv[2].toLowerCase();
    const componentName = process.argv[3];

    if (fileType !== "function" && fileType !== "class") {
      console.log("component type must be a function or a class");
      return;
    }
    if (componentName.length < 1 || process.argv[4].length < 1) {
      console.log("component or file name cannot be an empty string");
      return;
    }
    const compiled_content = await compileHbs({
      function: fileType === "function",
      name: componentName,
    });
    await writeToFile(`${process.argv[4]}.js`, compiled_content);
    console.log("file created successfully");
  }
};

const compileHbs = async (args) => {
  try {
    const hbsContent = await readFile("template.hbs", "utf8");
    return renderToString(hbsContent, args);
  } catch (err) {
    console.log(err);
  }
};

async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function renderToString(source, data) {
  var template = handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}

async function writeToFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err);
      resolve("data written successful");
    });
  });
}
main();
