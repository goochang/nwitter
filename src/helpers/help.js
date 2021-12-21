export const reverseObject = (object) => {
    var newObject = {};
    var keys = [];

    for (var key in object) {
        keys.push(key);
    }
    for (var i = keys.length - 1; i >= 0; i--) {
        var value = object[keys[i]];
        value.key = keys[i];
        const key = keys.length - 1 - i;
        newObject[key] = value;
    }       

    return newObject;
}

export const toArrayObject = (object) => {
    var newObject = [];
    var keys = [];

    for (var key in object) {
        keys.push(key);
    }
    for (var i = 0; i < keys.length; i++) {
        var value = object[keys[i]];
        value.key = keys[i];
        if(value.isFollow){
            newObject.push(value)
        }        
    }

    return newObject;
}