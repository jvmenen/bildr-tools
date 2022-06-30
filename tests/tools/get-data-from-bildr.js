const stripFunctions = (obj, indent = '') => {
    if (indent.length > 20) {
        // console.log ("<<<<<<")
        return null
    };
    indent = indent + "-";
    let strippedObj = {}
    for (var prop in obj) {
        let objProp = obj[prop];
        if (!prop.startsWith("updateState")) {
            if (Object.prototype.hasOwnProperty.call(obj, prop) && !bapi.helper.isFunction(objProp)) {
                if (bapi.helper.isArray(objProp)) {
                    let nwArray = []
                    objProp.forEach(element => {
                        // console.log(indent + prop)
                        nwArray.push(stripFunctions(element, indent))
                    });
                    objProp = nwArray;
                } else if (bapi.helper.isObject(objProp) || typeof (objProp) == 'object') {
                    // console.log(indent + prop)
                    objProp = stripFunctions(objProp, indent)
                }
                strippedObj[prop] = objProp;
            }
        }
    }
    return strippedObj;
}