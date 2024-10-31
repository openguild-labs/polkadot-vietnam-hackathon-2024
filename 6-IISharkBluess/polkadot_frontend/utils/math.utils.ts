import { FarmsList } from "@/types";

export const add = (item: FarmsList[]) => {
    let sum = 0.0;
    item.map((item) => sum += parseFloat(item.profit))
    return sum.toFixed(2);
}