import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";
import kleur from "kleur";

const defaultPackageName = "node-blueprint";

async function init() {
  let answers: prompts.Answers<"packageName" | "framework" | "orm">;

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
              description: "https://apollographql.com/docs/apollo-server",
              value: "graphql-apollo",
            },
          ],
        },
        {
          type: (framework: string | null) => {
            return framework ? "select" : null;
          },
          name: "orm",
          message: "What ORM do you want to use in your Node.js project?",
          initial: 0,
          choices: [
            {
              title: "None",
              value: null,
            },
            {
              title: "Prisma",
              description: "https://prisma.io",
              value: "prisma",
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

  const { packageName, framework, orm } = answers;

  console.log(`\nScaffolding template in ${kleur.bold(packageName)}`);

  if (!fs.existsSync(packageName)) {
    fs.mkdirSync(packageName);
  }

  const templatesDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `templates`
  );

  fs.cpSync(`${templatesDir}/base`, packageName, { recursive: true });

  if (framework) {
    if (framework.includes("graphql")) {
      fs.cpSync(`${templatesDir}/graphql-base`, packageName, {
        recursive: true,
        force: true,
      });
    }

    fs.cpSync(`${templatesDir}/${framework}`, packageName, {
      recursive: true,
      force: true,
    });
  }

  if (orm) {
    if (orm === "prisma") {
      fs.cpSync(`${templatesDir}/prisma-base`, packageName, {
        recursive: true,
        force: true,
      });

      if (framework.includes("graphql")) {
        fs.cpSync(`${templatesDir}/prisma-graphql-base`, packageName, {
          recursive: true,
          force: true,
        });
      }
    }

    fs.cpSync(`${templatesDir}/${orm}-${framework}`, packageName, {
      recursive: true,
      force: true,
    });

    fs.renameSync(`${packageName}/.env.example`, `${packageName}/.env`);
  }

  editFile(`${packageName}/package.json`, (c) =>
    c.replace("node-blueprint", packageName)
  );

  console.log("\nInstalling dependencies with npm");

  execSync("npm i", { cwd: packageName, stdio: "inherit" });

  if (orm && orm === "prisma") {
    execSync("npm run migrate:dev -- --name init", {
      cwd: packageName,
      stdio: "inherit",
    });
  }

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
