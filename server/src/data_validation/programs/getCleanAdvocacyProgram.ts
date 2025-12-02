import type { Program } from "../../types/types";
import { getCleanProgramId } from "./getCleanProgramId";
import { getCleanBrand } from "./getCleanBrand";
import { getCleanTotalSalesAttributed } from "./getCleanTotalSalesAttributed";
import { getCleanTasksCompletes } from "../tasks/getCleanTasksCompletes";

export const getCleanAdvocacyProgram = (programs: unknown): Program[] => {
    if (!Array.isArray(programs)) {
        return [];
    }

    return programs.map((program: any) => ({
        program_id: getCleanProgramId(program.program_id),
        brand: getCleanBrand(program.brand),
        total_sales_attributed: getCleanTotalSalesAttributed(program.total_sales_attributed),
        tasks_completed: getCleanTasksCompletes(program.tasks_completed)
    }));
};