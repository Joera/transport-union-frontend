import fs from "fs";
import glob from "glob";
import sass from 'node-sass';

const fsPromises = fs.promises;
const distdir = "./dist";
const builddir = "./build";

export class MaintenanceController {

    async compileStyling() {

        let result  = await sass.renderSync({ 
            file : "/home/joera/Documents/chronicles/subscription-form/styling/main.scss",
            // outputStyle: 'compressed',
            // outFile: '/home/joera/Documents/chronicles/subscription-form/dist/style.css',
        });

        await this._writeCss(result.css);

        return;
    }

    async _writeCss (css: any)  {

        await fsPromises.writeFile(distdir + "/style.css", css);

    }
}