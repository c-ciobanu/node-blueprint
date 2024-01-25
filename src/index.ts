import fs from "node:fs";
import { execSync } from "node:child_process";
import prompts from "prompts";
import kleur from "kleur";

const defaultPackageName = "node-blueprint";

async function init() {
  let answers: prompts.Answers<"packageName" | "framework">;

  try {
    answers = await prompts(
      [
        {
          type: "text",
          name: "packageName",
          message: "What would you like to call your new project?",
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

            return "select";
          },
          name: "framework",
          message: "What framework do you want to use in your Node.js project?",
          initial: 0,
          choices: [
            {
              title: "None",
              description: "Just Node.js",
              value: null,
            },
            {
              title: "Express",
              description: "https://expressjs.com",
              value: "express",
            },
            {
              title: "Koa",
              description: "https://koajs.com",
              value: "koa",
            },
            {
              title: "GraphQL Yoga",
              description: "https://the-guild.dev/graphql/yoga-server",
              value: "graphql-yoga",
            },
            {
              title: "Apollo GraphQL",
              description: "https://www.apollographql.com/docs/apollo-server/",
              value: "apollo-graphql",
            },
          ],
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

  const { packageName, framework } = answers;

  console.log(`\nScaffolding template in ${kleur.bold(packageName)}`);

  if (!fs.existsSync(packageName)) {
    fs.mkdirSync(packageName);
  }

  fs.cpSync("./templates/base", packageName, { recursive: true });

  if (framework) {
    fs.cpSync(`./templates/${framework}`, packageName, {
      recursive: true,
      force: true,
    });
  }

  editFile(`${packageName}/package.json`, (c) =>
    c.replace("node-blueprint", packageName)
  );

  console.log("\nInstalling dependencies with npm");

  execSync("npm i", { cwd: packageName, stdio: "inherit" });

  console.log(`\n${kleur.green("✔")} Done. Now you can run:\n`);
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
