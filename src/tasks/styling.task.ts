import { MaintenanceController } from "../maintenance/maintenance.controller";
const maintenanceController = new MaintenanceController();

maintenanceController.compileStyling()
    .then((pages: any) => {
        process.exit(0);
    })
    .catch((error: any) => {
        process.exit(1);
    });