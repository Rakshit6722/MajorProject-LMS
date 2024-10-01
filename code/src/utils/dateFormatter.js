export const formattedDate = (data) => {
    return new Date(date).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    }
    )
}