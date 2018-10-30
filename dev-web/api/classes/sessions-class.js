let db, config;

module.exports = (pDb,pConfig) => {
    // db comme config juste en dessous sont les propriété de la classe, 
    // on leur assigne les valeurs recues en paramètres
    db = pDb; 
    config = pConfig;
    return Sessions;
};

let Sessions = class {

    static getAll()
    {
        return new Promise((next)=>{
                // On récupère toutes les sessions.
                db.query('SELECT * FROM sessions')
                .then((result) => next(result))
                .catch((error) => next(error));
        });
    }

    static add(pSessionName,pQuizId)
    {
        return new Promise((next)=>{
            
            if(pSessionName != undefined && pSessionName.trim() != '' && pQuizId != '')
            {
                pSessionName = pSessionName.trim();
                db.query('SELECT * FROM sessions WHERE session_name = ?', [pSessionName])
                .then((results)=>{
                    if(results[0] != undefined)
                        next(new Error("Session Name already exists !"));
                    else
                        return db.query('INSERT INTO sessions (session_name,quiz_id) VALUES (?, ?)', [pSessionName, pQuizId]);
                })
                .then(()=>{
                    return db.query('SELECT * FROM sessions WHERE session_name = ?', [pSessionName]);
                })
                .then((results)=>{
                    next({
                        session_id:results[0].session_id,
                        session_name:results[0].session_name,
                        quiz_id:results[0].quiz_id,
                        collected_amount:results[0].collected_amount
                    });
                })
                .catch((err)=>{next(err.message);});
            }
            else
            {
                next(new Error("No name or quiz value"));
            }
        });
    }

}