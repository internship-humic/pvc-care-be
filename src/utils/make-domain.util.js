import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import capitalize from "capitalize";

const ROOT = process.cwd();

program
  .command("make:domain <name>")
  .description(
    "Generate a new domain folder with controller, service, routes, and schema"
  )
  .action((name) => {
    const domainParts = name.split("/");
    const domainPath = path.join(ROOT, "src", "domains", ...domainParts);

    if (fs.existsSync(domainPath)) {
      console.error(`Domain ${name} already exists!`);
      process.exit(1);
    }

    fs.ensureDirSync(domainPath);
    name = domainParts.at(-1);

    const controllerTemplate = `
import BaseError from "../../common/base_classes/base-error.js";
import BaseResponse from "../../common/base_classes/base-response.js";
import ${capitalize(name)}Service from "./${name}.service.js";

class ${capitalize(name)}Controller {
  async someMethod(req, res) {
    // Implement controller logic here
  }
}

export default new ${capitalize(name)}Controller();
`;

    const serviceTemplate = `
import BaseError from "../../common/base_classes/base-error.js";
import Prisma from "../../common/services/prisma.service.js";

class ${capitalize(name)}Service {
  constructor() {
    this.prisma = Prisma;
  }
  
  async someMethod() {
    // Implement service logic here
  }
}

export default new ${capitalize(name)}Service();
`;

    const routesTemplate = `
import ${capitalize(name)}Controller from "./${name}.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import ErrorMiddleware from "../../middlewares/error.middleware.js";
import validate from '../../middlewares/request-validator.middleware.js';
import AuthMiddleware from '../../middlewares/auth.middleware.js';
import Roles from "../../common/enums/user-roles.enum.js";
import { ${name}Schema } from './${name}.schema.js';

class ${capitalize(name)}Routes extends BaseRoutes {
  routes() {
    this.router.post("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize([Roles.Farmer]),
      ErrorMiddleware.errorCatcher(${capitalize(name)}Controller.someMethod)
    ]);
    this.router.post("/", [
      AuthMiddleware.authenticate,
      validate(${name}Schema), 
      ErrorMiddleware.errorCatcher(${capitalize(name)}Controller.someMethod)
    ]);
  }
}

export default new ${capitalize(name)}Routes().router;
`;

    const schemaTemplate = `
import Joi from "joi";

const ${name}Schema = Joi.object({
  // Define your validation schema here
});

export { ${name}Schema };
`;

    fs.writeFileSync(
      path.join(domainPath, `${name}.controller.js`),
      controllerTemplate
    );
    fs.writeFileSync(
      path.join(domainPath, `${name}.service.js`),
      serviceTemplate
    );
    fs.writeFileSync(
      path.join(domainPath, `${name}.routes.js`),
      routesTemplate
    );
    fs.writeFileSync(
      path.join(domainPath, `${name}.schema.js`),
      schemaTemplate
    );

    console.log(`Domain '${name}' created successfully!`);
  });

program.parse(process.argv);
