import type { Program } from "../../types/types";
import { getCleanBrand } from "./getCleanBrand";
import { getCleanTotalSalesAttributed } from "./getCleanTotalSalesAttributed";

export const getCleanAdvocacyProgram = (program: any): Omit<Program, "_id" | "tasks_completed" | "user_id"> => {

   return {
        legacy_program_id: program?.program_id,
        brand: getCleanBrand(program?.brand),
        total_sales_attributed: getCleanTotalSalesAttributed(program?.total_sales_attributed),
    }
};