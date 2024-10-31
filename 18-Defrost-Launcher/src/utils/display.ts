export function shorten(
    input: bigint | string | number | unknown,
): string {
    if (!input) {
        return "";
    }

    const strVal = input.toString();
    const len = strVal.length;
    if (len <= 9) {
        return strVal;
    }

    return strVal.slice(0, 3) + "..." + strVal.slice(len - 3, len);
}