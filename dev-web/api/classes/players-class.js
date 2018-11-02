let db, config;

module.exports = (pDb,pConfig) => {
    // db comme config juste en dessous sont les propriété de la classe, 
    // on leur assigne les valeurs recues en paramètres
    db = pDb; 
    config = pConfig;
    return Players;
};

let Players = class {

    static getPlayersAndScores(pSessionID)
    {
        return new Promise((next)=>{
            if(pSessionID != undefined)
            {
                db.query("SELECT * FROM players NATURAL JOIN given_answers INNER JOIN quiz_answers ON given_answers.answer_id = quiz_answers.answer_id WHERE session_id = ? and is_good_answer = '1' ORDER BY players.player_id", [pSessionID])
                .then((results)=>{
                    if(results[0] == undefined)
                    {
                        // Compter le nombre de bonnes réponses de chaque joueur
                        // Composer un objet contenant les joueurs et leurs scores
                        // Composer une requete d'update qui met à jour les scores des joueurs
                        // Executer la requete d'update
                        // Retourner l'objet avec les joueurs et leurs scores
                    }                       
                    else
                    {
                        next(new Error("No Players or No Scores"));
                    }
                })
                .catch((err)=>{next(err.message);});
            }
            else
            {
                next(new Error("No session id"));
            }
        });
    }

    static add(pPlayerName,pSessionId)
    {
        return new Promise((next)=>{
            if(pPlayerName != undefined && pPlayerName.trim() != '' && pSessionId != '')
            {
                pPlayerName = pPlayerName.trim();
                db.query('SELECT * FROM players WHERE player_name = ?', [pPlayerName])
                .then((results)=>{
                    if(results[0] == undefined)
                        return db.query('INSERT INTO players (player_name) VALUES (?)', [pPlayerName]);                        
                    else
                        next(new Error("Player Name already exists !"));
                })
                .then(()=>{
                    return db.query('SELECT * FROM players WHERE player_name = ?', [pPlayerName]);
                })
                .then((results)=>{
                    if(results[0] != undefined)
                        return db.query('INSERT INTO sessions_players_link (player_id, session_id) VALUES (?, ?)', [results[0].player_id, pSessionId]);    
                    else
                        next(new Error("Player Name Not Found !"));                        
                })
                .then(()=>{
                    next("Success");
                })
                .catch((err)=>{next(err.message);});
            }
            else
            {
                next(new Error("No name or session id"));
            }
        });
    }

}