"use server";

import { fetchMedicines, MedicineFilters } from "./api";


export async function getMedicinesAction(filters: MedicineFilters) {
    return await fetchMedicines(filters);
}
