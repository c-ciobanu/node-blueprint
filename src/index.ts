import fs from "node:fs";
import { execSync } from "node:child_process";
import prompts from "prompts";
import kleur from "kleur";

const defaultTargetDirName = "node-blueprint";

async function init() {
  let result: prompts.Answers<"targetDirName">;

  try {
    result = await prompts(
      [
        {
          type: "text",
          name: "targetDirName",
          message: "What is the name of your project?",
          initial: defaultTargetDirName,
          format: formatTargetDirName,
        },
        {
          type: (targetDirName: string) => {
            if (!isEmptyDir(targetDirName)) {
              throw new Error(
                `${kleur.red("✖")} Directory ${kleur.bold(
                  targetDirName
                )} already exists and is not empty. Please empty the directory or choose a different name`
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

  const { targetDirName } = result;

  if (!fs.existsSync(targetDirName)) {
    fs.mkdirSync(targetDirName, { recursive: true });
  }

  fs.cpSync("./templates/base", targetDirName, { recursive: true });

  const packageContents = fs.readFileSync(`${targetDirName}/package.json`, {
    encoding: "utf-8",
  });
  fs.writeFileSync(
    `${targetDirName}/package.json`,
    packageContents.replace("node-blueprint", targetDirName),
    "utf-8"
  );

  execSync("npm i", { cwd: targetDirName });
}

function formatTargetDirName(targetDirName: string) {
  return targetDirName.trim().replace(/\/+$/g, "");
}

function isEmptyDir(dirName: string) {
  if (!fs.existsSync(dirName)) {
    return true;
  }

  const files = fs.readdirSync(dirName);
  return files.length === 0;
}

init().catch((e) => {
  console.error(e);
});
