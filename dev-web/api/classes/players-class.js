let db, config;

module.exports = (pDb,pConfig) => {
    // db comme config juste en dessous sont les propriété de la classe, 
    // on leur assigne les valeurs recues en paramètres
    db = pDb; 
    config = pConfig;
    return Players;
};

let Players = class {

    static add(pPlayerName,pSessionId)
    {
        return new Promise((next)=>{
            
            if(pPlayerName != undefined && pPlayerName.trim() != '' && pSessionId != '')
            {
                pPlayerName = pPlayerName.trim();
                db.query('SELECT * FROM players WHERE player_name = ?', [pPlayerName])
                .then((results)=>{
                    if(results[0] != undefined)
                        next(new Error("Player Name already exists !"));
                    else
                        return db.query('INSERT INTO players (player_name) VALUES (?)', [pPlayerName]);
                })
                .then(()=>{
                    return db.query('SELECT * FROM players WHERE player_name = ?', [pPlayerName]);
                })
                .then((results)=>{
                    if(results[0] != undefined)
                        next(new Error("Player Name Not Found !"));
                    else
                        return db.query('INSERT INTO sessions_players_link (player_id, session_id) VALUES (?, ?)', [results[0].player_id, pSessionId]);
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