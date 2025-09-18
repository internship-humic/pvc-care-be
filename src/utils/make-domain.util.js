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
import ${capitalize(name)}Service from "./${name}.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class ${capitalize(name)}Controller extends BaseController {
  constructor() {
    super(${capitalize(name)}Service);
    // this.error = BaseError
    // this.response = BaseResponse
    // this.service = ${capitalize(name)}Service
  }

  async someMethod(req, res) {
    // implement method logic here
  }
}

export default new ${capitalize(name)}Controller();
`;

    const serviceTemplate = `
import BaseService from "../../common/base_classes/base-service.js";

class ${capitalize(name)}Service extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }
  
  async someMethod() {
    // implement method logic here
  }
}

export default new ${capitalize(name)}Service();
`;

    const routesTemplate = `
import ${capitalize(name)}Controller from "./${name}.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";
import { ${name}Schema } from './${name}.schema.js';

class ${capitalize(name)}Routes extends BaseRoutes {
  constructor() {
    super(${capitalize(name)}Controller);
    //this.router = Router();
    //this.auth = AuthMiddleware;
    //this.validate = Validate;
    //this.errCatch = ErrorMiddleware.errorCatcher;
    //this.controller = controller;
    //this.roles = Roles;
    //this.routes();
  }

  routes() {
    this.router.get("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.errCatch(this.controller.someMethod.bind(this.controller))
    ]);
    this.router.post("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Farmer]),
      this.validate(${name}Schema),
      this.errCatch(this.controller.someMethod.bind(this.controller))
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
