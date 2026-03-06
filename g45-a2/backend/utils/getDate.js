function getTorontoDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
    }).format(new Date());
}

module.exports = getTorontoDate;
