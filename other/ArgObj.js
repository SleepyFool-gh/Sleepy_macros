//  ███  ████   ███   ████  ████      █
// █   █ █   █ █     █    █ █   █     █
// █████ ████  █  ██ █    █ ████      █
// █   █ █   █ █   █ █    █ █   █ █   █
// █   █ █   █  ███   ████  ████   ███
// SECTION: ArgObj
// DESCRIPTION:
    // Converts macro arguments array to an argument object based off a provided template. Requires TypeSet to work properly. If argument names are not specified, it will assign the argument value to the first template argument that accepts the type of unnamed argument value that isn't already filled.
// EXAMPLES:
//
//      const template = {
//          transition: {           // sample flag, place before everything else
//              type: "flag",
//          },
//          linkText: {
//              required: true,     // whether argument is required
//              type: "string",     // acceptable TypeSet types
//              alias: "text",      // other acceptable names for argument
//          },
//          passage: {
//              type: "string",
//          },
//      },
//
//      const args_in1  = ["passage","start","click to begin"];
//      const argObj1   = new ArgObj({
//          id       : argObj1,
//          args_in  : args_in1,
//          template : template,
//      });
//          --> {passage: "start", linkText: "click to begin"};
//
//      const args_in2  = ["continue","transition"];
//      const argObj2   = new ArgObj(this, {
//          id       : argObj2,
//          args_in  : args_in2,
//          template : template
//      });
//          --> {linkText: "continue", transition: "transition"};
//          note: convert transition flag to boolean via !!
//
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
            throw new Error(`ArgObj - constructor requires an "id", "template", and "args_in", in that order`)
        }
        // ERROR: id should be a string
        if (typeof id !== 'string') {
            throw new Error(`ArgObj - id for constructor should be a string`)
        }
        // ERROR: empty template
        const keys = Object.keys(template);
        if (! keys.length) {
            throw new Error(`${id} - ArgObj "template" can't be empty`)
        }
        // WARNING: empty args_in
        if (! args_in.length) {
            console.warning(`${id} - ArgObj "args_in" is empty, no args to parse; aborted`);
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
                        throw new Error(`${id} - ArgObj failed, alias should be a string or an array of strings`)
                    }
                    // ERROR: clobbering existing alia
                    if (typeof alias[a] !== 'undefined') {
                        throw new Error(`${id} - ArgObj faied, clobbering existing name/alias "${a}"`)
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
                // else {
                    // i += this.#parse_lazy(i);
                // }

            }
            catch (error) {
                console.error(`${id} - ArgObj failed to parse arguments,  at"${arg_this}"`);
                console.error(error);
            }
        }
    }
    // parse flags
    #parse_flag(i) {
        const { id, template, args_in, keys, alias } = this["#data"];
        const arg_this = args_in[i];
        const key_this = alias[arg_this];
        try {
            // write data
            this[key_this]  = true;
            // i increments by 1
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
        const val_this = args_in[1+1];
        try {
            // ERROR: undefined input for key
            if (typeof val_this === "undefined") {
                throw new Error(`${id} - ArgObj failed to parse key value pair at key "${arg_this}", missing value`)
            }
            // only check types of provided
            if (typeof template[key_this].type !== 'undefined') {
                // check if TypeSet, create if not
                const typeset   = TypeSet.isTypeSet(template[key_this])
                                    ? template[key_this]
                                    : new TypeSet(template[key_this]);
                // ERROR: failed type validation
                if (! typeset.accepts(val_this)) {
                    throw new Error(`${id} - ArgObj failed to parse key value pair at key "${arg_this}", "${val_this}" is an invalid type ("${TypeSet.id(val_this)}"), expected ${typeset.print}`)
                }
            }
            // write values
            this[key_this] = val_this;
            // i increments by 2
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
            // WARNING: [[markup]] when no passage in template
            if (! keys.includes('passage')) {
                console.warning(`${id} - ArgObj template does not contain a "passage" argument`);
            }
            // WARNING: [[markup]] when no linkText in template
            if (! keys.includes('linkText')) {
                console.warning(`${id} - ArgObj template does not contain a "linkText" argument`);
            }
            // write values
            this.linkText = arg_this.text;
            this.passage  = arg_this.link;
            // i increments by 1
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
                    console.warning(`${id} - ArgObj template does not contain "${k}" or any alias for it, ignored`);
                    continue;
                }
                // only check types of provided
                if (typeof template[key_this].type !== 'undefined') {
                    // check if TypeSet, create if not
                    const typeset   = TypeSet.isTypeSet(template[key_this])
                                        ? template[key_this]
                                        : new TypeSet(template[key_this]);
                    // ERROR: failed type validation
                    if (! typeset.accepts(val_this)) {
                        throw new Error(`${id} - ArgObj failed to parse key value pair at key "${arg_this}", "${val_this}" is an invalid type ("${TypeSet.id(val_this)}"), expected ${typeset.print}`)
                    }
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
            const keys_left = keys.filter( function(k) {
                // skip flags
                return (! Object.keys(output).includes(k)) && (template[k].type !== "flag")
            });
    
            // if no unwritten keys, exit
            if (! keys_left.length) {
                return active
            }
    
            // write to the first key that matches type
            for (const k of keys_left) {
                const typeset = new TypeSet(template[k].type);
                if (typeset.accepts(arg_this)) {
                    output[k] = arg_this;
                    active.splice = 1;
                    break;
                }
            }
    
            return active
        }
        catch (error) {
            console.error(`${id} - failed to parse macro arguments inside lazy parser (argObj_lazy)`);
            console.error(error);
        }
    }
}

