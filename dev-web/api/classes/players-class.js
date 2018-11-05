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
                let players_with_scores = [];
                let score = 1;
                db.query("SELECT * FROM players NATURAL JOIN given_answers INNER JOIN quiz_answers ON given_answers.answer_id = quiz_answers.answer_id WHERE session_id = ? and is_good_answer = '1' ORDER BY players.player_id", [pSessionID])
                .then((results)=>{
                    if(results[0] != undefined)
                    {
                        // Compter le nombre de bonnes réponses de chaque joueur
                        for (let cpt = 0; cpt<results.length; cpt++)
                        {
                            if(players_with_scores[0] == undefined)
                            {
                                players_with_scores.push({
                                    player_id:results[cpt].player_id,
                                    score:score
                                });
                            }
                            else
                            {
                                if(players_with_scores[players_with_scores.length - 1].player_id == results[cpt].player_id)
                                {
                                    players_with_scores[players_with_scores.length - 1].score = players_with_scores[players_with_scores.length - 1].score + 1; 
                                }
                                else
                                {
                                    players_with_scores.push({
                                        player_id:results[cpt].player_id,
                                        score:score
                                    });
                                }
                            }
                        }
                        // Requete d'update qui met à jour les scores des joueurs
                        let updateSql = "";
                        for (let cpt = 0; cpt<players_with_scores.length; cpt++)
                        {
                            updateSql = updateSql+"UPDATE sessions_players_link SET score = " + players_with_scores[cpt].score + " WHERE player_id = " + players_with_scores[cpt].player_id + " AND session_id = " + pSessionID + "; ";
                        }
                        return db.query(updateSql);
                    }                       
                    else
                    {
                        next(new Error("No Players or No Scores"));
                    }
                })
                .then(()=>{
                    // Récupérer l'intégralité des joueurs d'une session avec leur scores                        
                    return db.query('SELECT * FROM sessions_players_link NATURAL JOIN players WHERE session_id = ?', [pSessionID]);
                })
                .then((results) => next(results))
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