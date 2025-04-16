// █████ █   █ ████  █████  ████ █████ █████
//   █    █ █  █   █ █     █     █       █
//   █     █   ████  ███    ███  ███     █
//   █     █   █     █         █ █       █
//   █     █   █     █████ ████  █████   █
// SECTION: typeset class
// DESCRIPTION: 
// Class to store information about acceptable inputs for a variable. "any" is assumed unless "exact" is specified.
// EXAMPLES:
//
//      const example1 = new Typeset("string","number");
//      const example2 = new TypeSet(["string","number"]);
//      const example3 = new TypeSet({exact:5},"string");
//
//      example1.accepts(5)            --> true
//      example2.accepts("something")  --> true
//      example3.accepts(4)            --> false
//      example3.accepts(5)            --> true
//      example3.accepts("other")      --> true
//
//      example1.has(5)                --> false
//      example1.has("number")         --> true
//
//      TypeSet.isTypeSet(example1)    --> true
//
//      TypeSet.valid  --> array w/ valid types [ "string", "number", "object", "boolean", "undefined", "array", "null" ]
//
class TypeSet {
    //////////////////////////////////////////////////
    /**
     * Creates a set of data types to be used in sorting or validation
     * @param {string|Object|Array} input any-kind type is assumed if a string is provided; objects should be `{any:"number"}`; arrays can be used like `{exact:[1,2]}` or `["string",{exact:4}]`
     */
    constructor(...args) {
        this.any = [];
        this.exact = [];
        this.label = null;
        try {
            for (const a of args) {
                this.add(a);
            }
        }
        catch (error) {
            console.error('TypeSet - failed to create TypeSet object');
        }
    }
    // return the string description
    get print() {
        if (this.label) {
            return this.label;
        }
        const print = [];
        for (const t of this.any) {
            if (t === 'undefined' || t === 'null') {
                print.push(`${t}`);
            }
            else {
                print.push(`any '${t}'`);
            }
        }
        for (const t of this.exact) {
            print.push(`exactly the ${TypeSet.id(t)} '${t}'`);
        }
        return print.join(" or ")
    }

    //////////////////////////////////////////////////
    // add to TypeSet
    add(val) {
        // given array, break it up
        if (TypeSet.id(val) === 'array') {
            this.#parse_arr(val);
        }
        // given object, parse
        else if (TypeSet.id(val) === 'generic') {
            this.#parse_obj(val);
        }
        // given string, assume any-type
        else if (TypeSet.id(val) === 'string') {
            this.#push(val, 'any');
        }
        // ERROR: input not string or object or array
        else {
            console.error(`TypeSet - invalid input "${val}", must be 'string' or 'object' or 'array'`);
        }
    }

    //////////////////////////////////////////////////
    // disects array and plugs it back into push
    #parse_arr(arr, kind) {
        // ERROR: empty array
        if (arr.length === 0) {
            console.error(`TypeSet - array input should not be empty, ignored`);
            return
        }
        // split and pass to #push
        for (const t of arr) {
            this.#push(t, kind);
        }
    }
    // add type to TypeSet from object
    #parse_obj(obj) {
        for (const key in obj) {
            const val = obj[key];
            // ERROR: unknown key, skipped
            if (
                (key !== 'any') &&
                (key !== 'exact') &&
                (key !== 'label')
            ) {
                console.error(`TypeSet - unknown object input key, ${key}; key should be "any" or "exact" or "label"; key ignored`);
                continue;
            }
            // assign label
            if (key === 'label') {
                this.label = val;
                continue;
            }
            // parse arrays
            if (TypeSet.id(val) === 'array') {
                this.#parse_arr(val, key);
            }
            // for everything else, pass to #push
            else {
                this.#push(val, key);
            }
        }
    }

    //////////////////////////////////////////////////
    // add to TypeSet
    #push(val, kind) {
        try {
            // assume any-kind if not specified
            kind ??= 'any';
            // already has value, do nothing
            if (this[kind].includes(val)) {
                return
            }
            // any-kind
            if (kind === 'any') {
                // ERROR: failed validation by type
                if (! TypeSet.validAny.includes(val)) {
                    console.error(`TypeSet - "${val}" is not a valid any-kind type; check TypeSet.validAny for list of valid any-kind types`);
                    return
                }
                this.any.push(val);
                return
            }
            // exact-kind
            if (kind === 'exact') {
                // ERROR: failed validation
                if (
                    (! TypeSet.validExact.includes(TypeSet.id(val))) ||
                    (TypeSet.id(val) === 'number' && isNaN(val))
                 ) {
                    console.error(`TypeSet - "${val}" is a "${TypeSet.id(val)}", which is not a valid exact-kind type; check TypeSet.validExact for the list of valid exact-kind types; limitations apply for comparing objects or NaN`);
                    return
                }
                this.exact.push(val);
                return
            }
        }
        catch (error) {
            console.error(`TypeSet - failed to push ${kind}-kind to TypeSet at "${val}"`);
            console.error(error);
        }
    }

    //////////////////////////////////////////////////
    // list valid any-kind types
    static get validAny() {
        const valid = [
            "string", "number", "boolean", "bigint", "symbol", "undefined",             // also in typeof
            "array", "null", "function", "date", "set", "map", "weakset", "weakmap",    // more specific than typeof
            "generic"                                                                   // special handling
        ];
        return valid
    }
    // list valid any-kind types
    static get validExact() {
        const valid = [
            "string", "number", "boolean", "bigint", "undefined",
            "null",
        ];
        return valid
    }
    // identify type
    static id(input) {
        const str = Object.prototype.toString.call(input).slice(8, -1).toLowerCase();
        // replace "object" with "generic" for generic objects
        return str === "object" ? "generic" : str
    }
    // identify TypeSet
    static isTypeSet(input) {
        return input instanceof TypeSet
    }

    //////////////////////////////////////////////////
    // checks whether the type object passes/accepts the input
    accepts(val) {
        for (const t of this.any) {
            if (TypeSet.id(val) === t) {
                return true
            }
        }
        for (const t of this.exact) {
            if (val === t) {
                return true
            }
        }
        return false
    }
}

window.TypeSet = TypeSet;