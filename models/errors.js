class Errors extends Error {
    constructor(message, errorCode) {
        super(message); //adding a message property
        this.code = errorCode; // Adds a code property
    }
}

module.exports = Errors;