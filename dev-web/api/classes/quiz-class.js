let db, config;

module.exports = (pDb,pConfig) => {
    // db comme config juste en dessous sont les propriété de la classe, 
    // on leur assigne les valeurs recues en paramètres
    db = pDb; 
    config = pConfig;
    return Quiz;
};

let Quiz = class {

    static getAll()
    {
        return new Promise((next)=>{
                // On récupère tous les quiz.
                db.query('SELECT * FROM quiz')
                .then((result) => next(result))
                .catch((error) => next(error));
        });
    }

}