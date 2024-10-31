export const consoleLogError = (error: unknown) => {
    console.log((error as Error).message)
}
