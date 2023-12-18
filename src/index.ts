import fs from "node:fs";
import { execSync } from "node:child_process";
import prompts from "prompts";
import kleur from "kleur";

const defaultPackageName = "node-blueprint";

async function init() {
  let answers: prompts.Answers<"packageName">;

  try {
    answers = await prompts(
      [
        {
          type: "text",
          name: "packageName",
          message: "What would you like to call your new package?",
          initial: defaultPackageName,
          validate: (value) => {
            if (/^([a-z0-9\.\-\_])+$/.test(value)) {
              return true;
            }

            return "The package name can only contain lowercase letters, digits, and the characters ., -, and _";
          },
        },
        {
          type: (packageName: string) => {
            if (!isEmptyDir(packageName)) {
              throw new Error(
                `${kleur.red("✖")} Directory ${kleur.bold(
                  packageName
                )} already exists and is not empty. Please empty the directory or choose a different name for your package`
              );
            }

            return null;
          },
          name: "",
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${kleur.red("✖")} Operation cancelled`);
        },
      }
    );
  } catch (cancelled: any) {
    console.error(cancelled.message);
    return;
  }

  const { packageName } = answers;

  console.log(`\nScaffolding template in ${kleur.bold(packageName)}`);

  if (!fs.existsSync(packageName)) {
    fs.mkdirSync(packageName);
  }

  fs.cpSync("./templates/base", packageName, { recursive: true });

  editFile(`${packageName}/package.json`, (c) =>
    c.replace("node-blueprint", packageName)
  );

  console.log("\nInstalling dependencies with npm");

  execSync("npm i", { cwd: packageName, stdio: "inherit" });

  console.log("\nDone. Now you can run:\n");
  console.log(kleur.dim(`    cd ${packageName}`));
  console.log(kleur.dim("    npm run dev"));
}

function isEmptyDir(dirName: string) {
  if (!fs.existsSync(dirName)) {
    return true;
  }

  const files = fs.readdirSync(dirName);
  return files.length === 0;
}

function editFile(fileName: string, callback: (content: string) => string) {
  const fileContent = fs.readFileSync(fileName, { encoding: "utf-8" });
  fs.writeFileSync(fileName, callback(fileContent), { encoding: "utf-8" });
}

init().catch((e) => {
  console.error(e);
});
