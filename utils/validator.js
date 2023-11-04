class Validator {

    // maximum length for the fields
    static _lengthLimit = {
        email: 40,
        password: 40,
        name: 30
    }

    // regex patterns for the fields
    static _patterns = {
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        password: /^[\x21-\x7E]{8,40}$/,
        name: /^[A-Za-z\s]{2,30}$/,
        orgName:  /^([a-zA-Z0-9\s\{\}\[\]\(\)\@\#\&\!]+)$/
    };

    /**
     * Check if a string is a valid json encoded object.
     * @param {string} jsonstr string to be checked
     * @returns {boolean}
     */
    static _isJson(jsonstr) {
        try {
            if (!jsonstr) return false;
            let obj = JSON.parse(jsonstr);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Validates the value according to the type.
     * @param {string} type type of the string
     * @param {string} value value to be checked
     * @returns {boolean}
     */
    static validate(type, value) {
        try {
            if (typeof value !== 'string') return false;
            if (type == 'json') { // json serialized string
                return this._isJson(value);
            }
            if (!this._lengthLimit.hasOwnProperty(type)) return false; // unknown type
            if (value.length > this._lengthLimit[type]) return false; // too long
            return this._patterns[type].test(value); // invalid format
        } catch (e) {
            return false;
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = Validator;
}