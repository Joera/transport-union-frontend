import fs from "fs";
import glob from "glob";
import sass from 'node-sass';

const fsPromises = fs.promises;
const distdir = "../dist";
const builddir = "./build";

export class MaintenanceController {


    async compileStyling(templateName: string, dataObject: any) : Promise<any> {


        let result  = await sass.renderSync({ file : "./styling/main.scss"});
        await this._writeCss(result.css);

    }

    async _writeCss (css: any) : Promise<void> {

        await fsPromises.writeFile(distdir + "/style.css", css);

    }
}