import fs from "node:fs";
import prompts from "prompts";
import kleur from "kleur";

const defaultTargetDir = "node-blueprint";

async function init() {
  let result: prompts.Answers<"targetDir">;

  try {
    result = await prompts(
      [
        {
          type: "text",
          name: "targetDir",
          message: "What is the name of your project?",
          initial: defaultTargetDir,
          format: formatTargetDir,
        },
        {
          type: (targetDir: string) => {
            if (!isEmptyDir(targetDir)) {
              throw new Error(
                `${kleur.red("✖")} Directory ${kleur.bold(
                  targetDir
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

  console.log(result);
}

function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, "");
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
