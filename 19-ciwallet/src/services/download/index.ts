export const downloadTextFile = (name: string, text: string) => {
    const a = document.createElement("a")
    const type = name.split(".").pop()
    a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) )
    a.download = name
    a.click()
}