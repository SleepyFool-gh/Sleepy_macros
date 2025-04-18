//  ███  ████   ███   ████  ████      █
// █   █ █   █ █     █    █ █   █     █
// █████ ████  █  ██ █    █ ████      █
// █   █ █   █ █   █ █    █ █   █ █   █
// █   █ █   █  ███   ████  ████   ███
// SECTION: ArgObj
// DESCRIPTION:
// Converts an array of arguments into argument object based off a provided template. Requires TypeSet to work properly. If the value of an array element is the name of a key, it will assume the next element is that key's value. If no key is provided, it will try go through the template and assign the element to the first key it finds that accepts that element's type. Prefilled generic objects will be parsed for keys in the template and assign them to the output. [[markup]] will be parsed for passage name and link text.
//
// EXAMPLE:
//      const template = {
//          transition: {           // flag, set to true if found, else false
//              flag: true,
//          },
//          npc: {
//              type: "string",     // will be used to create a TypeSet for checking
//                                      // must be a string, array of strings, or
//                                      // or {any: 'string', exact: 4}
//              alias: "char",      // other acceptable names for the key
//                                      // must be a string or array of strings
//          },
//          linkText: {             // [[markup]] use the keys "linkText" and "passage"
//              alias: "text",
//          },
//          passage: {
//          },
//      },
//      const argObj    = new ArgObj("xlink", template, args_in);
//
//////////////////////////////////////////////////
class ArgObj {

    /**
     * Creates an argument object from the this.args of a SugarCube macro
     * @param {string} id - id, used for error codes
     * @param {Object} template - template dictating structure of arguments
     * @param {Object} template.arg1 - first arg to be parsed
     * @param {boolean} [template.arg1.flag] - whether arg1 is a flag
     * @param {TypeSet} [template.arg1.type] - TypeSet or inputs to a new TypeSet, determines valid data types for arg1
     * @param {string|string[]} [template.arg1.alias] - alternate names for arg1
     */
    constructor(id, template, args_in) {

        //////////////////////////////////////////////////
        // ERROR: missing required input
        if (
            (typeof id === 'undefined') ||
            (typeof template === 'undefined') ||
            (typeof args_in === 'undefined')
        ){
            throw new Error(`ArgObj - constructor requires an "id", "template", and "args_in", in that order; FAILED`)
        }
        // ERROR: id should be a string
        if (typeof id !== 'string') {
            throw new Error(`ArgObj - id for constructor should be a string; FAILED`)
        }
        // ERROR: empty template
        const keys = Object.keys(template);
        if (! keys.length) {
            throw new Error(`${id} - ArgObj "template" can't be empty; FAILED`)
        }
        // WARNING: empty args_in
        if (! args_in.length) {
            console.warn(`${id} - ArgObj "args_in" is empty, no args to parse; ABORTED`);
            return
        }

        //////////////////////////////////////////////////
        // create alias object
        const alias = {};
        try {
            for (const k of keys) {
                // add own name first
                alias[k] = k;
                // if no aliases, skip
                if (typeof template[k].alias === 'undefined') {
                    continue;
                }
                // wrap alias in an array if not in one
                const arr   = Array.isArray(template[k].alias)
                                ? template[k].alias
                                : [template[k].alias];
                for (const a of arr) {
                    // ERROR: alias wasn't a string or an array of strings
                    if (typeof a !== 'string') {
                        throw new Error(`${id} - ArgObj failed, alias should be a string or an array of strings; FAILED`)
                    }
                    // ERROR: clobbering existing alia
                    if (typeof alias[a] !== 'undefined') {
                        throw new Error(`${id} - ArgObj failed, clobbering existing name/alias "${a}"; FAILED`)
                    }
                    alias[a] = k;
                }
            }
        }
        catch (error) {
            console.error(`${id} - ArgObj failed to parse aliases`);
            console.error(error);
        }
        
        // save vars to #data
        this["#data"] = {id, template, args_in, keys, alias};

        // go through every arg
        let i = 0;
        while (i < args_in.length) {

            const arg_this = args_in[i];

            const key_this = alias[arg_this];
            try {   
                //////////////////////////////////////////////////
                // [[markup]] input
                // must come before {object} input
                if (
                    arg_this.isLink
                ) {
                    i += this.#parse_markup(i);
                }
                // {object} input
                else if (
                    TypeSet.id(arg_this) === 'object'
                ) {
                    i += this.#parse_obj(i);
                }
                // flag input
                // must come before kvp input
                else if (
                    (typeof key_this !== 'undefined') &&
                    (template[key_this].flag)
                ) {
                    i += this.#parse_flag(i);
                }
                // kvp input
                else if (
                    typeof key_this !== 'undefined'
                ) {
                    i += this.#parse_kvp(i);
                }
                // lazy matcher
                // if nothing matches, an error is thrown inside the class method
                else {
                    i += this.#parse_lazy(i);
                }
            }
            catch (error) {
                console.error(`${id} - ArgObj failed to parse arguments,  at"${arg_this}"`);
                console.error(error);
            }
            console.log(clone(this));
        }
        // populate leftover flags with false
        const keys_flags = keys.filter( (k) => template[k].flag );
        for (const k of keys_flags) {
            this[k] ??= false;
        }
        // delete #data
        delete this["#data"];
    }
    // parse flags
    #parse_flag(i) {
        const { id, template, args_in, keys, alias } = this["#data"];
        const arg_this = args_in[i];
        const key_this = alias[arg_this];
        try {
            // write value, i increments by 1
            this[key_this]  = true;
            return 1
        }
        catch (error) {
            console.error(`${id} - ArgObj failed to parse flag at "${arg_this}"`);
            console.error(error);
        }
    }
    // parse key value pairs
    #parse_kvp(i) {
        const { id, template, args_in, keys, alias } = this["#data"];
        const arg_this = args_in[i];
        const key_this = alias[arg_this];
        const val_this = args_in[i + 1];
        try {
            // ERROR: undefined input for key
            if (typeof val_this === "undefined") {
                throw new Error(`${id} - ArgObj failed to parse key value pair at key "${arg_this}", missing value; FAILED`)
            }
            // only check types of provided
            if (typeof template[key_this].type !== 'undefined') {
                // check if TypeSet, create if not
                const typeset   = TypeSet.isTypeSet(template[key_this].type)
                                    ? template[key_this].type
                                    : new TypeSet(template[key_this].type);
                // ERROR: failed type validation
                if (! typeset.accepts(val_this)) {
                    throw new Error(`${id} - ArgObj failed to parse key value pair at key "${arg_this}", "${val_this}" is an invalid type ("${TypeSet.id(val_this)}"), expected ${typeset.print}; FAILED`)
                }
            }
            // WARNING: clobbering
            if (typeof this[key_this] !== 'undefined') {
                console.warn(`${id} - ArgObj clobbering key "${key_this}" previous val "${this[key_this]}" with new val "${val_this}"; CLOBBERED`);
            }
            // write values, i increments by 2
            this[key_this] = val_this;
            return 2
        }
        catch (error) {
            console.error(`${id} - ArgObj failed to parse key value pair at "${arg_this}"`);
            console.error(error);
        }
    }
    #parse_markup(i) {
        const { id, template, args_in, keys, alias } = this["#data"];
        const arg_this = args_in[i];
        try {
            // WARNING: [[markup]] when no "passage" or "linkText" key in template
            if (! keys.includes('passage')) {
                console.warn(`${id} - ArgObj template does not contain a "passage" argument; ADDED`);
            }
            if (! keys.includes('linkText')) {
                console.warn(`${id} - ArgObj template does not contain a "linkText" argument; ADDED`);
            }
            // WARNING: clobbering
            if (typeof this.linkText !== 'undefined') {
                console.warn(`${id} - ArgObj clobbering key "linkText" previous val "${this.linkText}" with new val "${val_this}"; CLOBBERED`);
            }
            if (typeof this.passage !== 'undefined') {
                console.warn(`${id} - ArgObj clobbering key "passage" previous val "${this.passage}" with new val "${val_this}"; CLOBBERED`);
            }
            // write values, i increments by 1
            this.linkText = arg_this.text;
            this.passage  = arg_this.link;
            return 1
        }
        catch (error) {
            console.error(`${id} - ArgObj failed to parse [[markup]] at "${arg_this}"`);
            console.error(error);
        }
    }
    #parse_obj(i) {
        const { id, template, args_in, keys, alias } = this["#data"];
        const arg_this = args_in[i];
        try {
            for (const k in arg_this) {
                const key_this = alias[k];
                const val_this = arg_this[k];
                // WARNING: template doesn't contain key
                if (typeof key_this === 'undefined') {
                    console.warn(`${id} - ArgObj template does not contain "${k}" or any alias for it; IGNORED`);
                    continue;
                }
                // only check types of provided
                if (typeof template[key_this].type !== 'undefined') {
                    // check if TypeSet, create if not
                    const typeset   = TypeSet.isTypeSet(template[key_this].type)
                                        ? template[key_this].type
                                        : new TypeSet(template[key_this].type);
                    // ERROR: failed type validation
                    if (! typeset.accepts(val_this)) {
                        throw new Error(`${id} - ArgObj failed to parse key value pair at key "${arg_this}", "${val_this}" is an invalid type ("${TypeSet.id(val_this)}"), expected ${typeset.print}; FAILED`)
                    }
                }
                // WARNING: clobbering
                if (typeof this[key_this] !== 'undefined') {
                    console.warn(`${id} - ArgObj clobbering key "${key_this}" previous val "${this[key_this]}" with new val "${val_this}"; CLOBBERED`);
                }
                // write values
                this[key_this] = val_this;
            }
            // i increments by 1
            return 1
        }
        catch (error) {
            console.error(`${id} - ArgObj failed to parse {object} input at ${arg_this}`);
            console.error(error);
        }
    }
    #parse_lazy(i) {
        const { id, template, args_in, keys, alias } = this["#data"];
        const val_this = args_in[i];
        try {
            // array of leftover template keys that no data has been provided for yet
            const keys_left = keys.filter( (k) =>
                (! Object.keys(this).includes(k)) &&    // remove already written keys
                (! template[k].flag)                    // remove flags
            );
            console.log(keys_left);
            // ERROR: no unwritten keys, unknown arg,
            if (! keys_left.length) {
                throw new Error(`${id} - ArgObj failed to identify key in lazy parser at val "${val_this}", no unwritten template keys left; FAILED`)
            }
            // iterate through leftover keys, find first that matches type
            for (const k of keys_left) {
                console.log(k);
                // key accepts anything
                if (! template[k].type) {
                    // write value, i increments by 1
                    this[k] = val_this;
                    return 1
                }
                const typeset   = TypeSet.isTypeSet(template[k].type)
                                    ? template[k].type
                                    : new TypeSet(template[k].type);
                // write only if key accepts type, i increments by 1
                if (typeset.accepts(val_this)) {
                    // WARNING: clobbering
                    if (typeof this[k] !== 'undefined') {
                        console.warn(`${id} - ArgObj clobbering key "${k}" previous val "${this[k]}" with new val "${val_this}"; CLOBBERED`);
                    }
                    this[k] = val_this;
                    return 1
                }
            }
            // ERROR: nothing matched
            throw new Error(`${id} - ArgObj failed to type match val "${val_this}" to an unwritten template key; FAILED`)
        }
        catch (error) {
            console.error(`${id} - ArgObj failed to lazy parse input at ${val_this}`);
            console.error(error);
        }
    }
}

