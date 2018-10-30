// Ces fonctions permettent d'ajouter un niveau supplémentaire dans les résultats 
// qui contient le status pour qu'on puisse tester si tout va bien 
// à l'aide du status avant de traiter les données. 

exports.mySuccessFunction = function (pResult)
{
    return {
        status: "success",
        result: pResult
    };
}

exports.myErrorFunction = function (pMessage)
{
    return {
        status: "error",
        result: pMessage
    };
}

exports.isErr = function (pErr) 
{
    return pErr instanceof Error;
}

exports.checkAndChange = (obj) => {
    if(this.isErr(obj))
        return this.myErrorFunction(obj.message);
    else
        return this.mySuccessFunction(obj);
}