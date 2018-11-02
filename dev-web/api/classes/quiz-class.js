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

    static getQuestionsAnswers(pQuizId)
    {
        let questionsAndAnswers = [];
        let allQuestions;        
        return new Promise((next)=>{
            if(pQuizId != undefined) {
                // On récupère toutes les questions.
                db.query('SELECT * FROM quiz_questions WHERE quiz_id = ?', [parseInt(pQuizId)])
                .then((results)=>{
                    if(results[0] != undefined)
                    {
                        allQuestions = results;
                        let pQuestionsIds = [];
                        for (let result of results)
                            pQuestionsIds.push(result.question_id);
                        // Juste en dessous je faisais un toString de pQuestionsIds qui foutait la merde dans la requête SQL
                        return db.query('SELECT * FROM quiz_answers WHERE question_id IN (?) ORDER BY question_id, answer_id', [pQuestionsIds]); 
                    }
                    else
                        next(new Error("No Questions in this Quiz"));
                })
                .then((results)=>{
                    if(results[0] != undefined)
                    {
                        for(let question of allQuestions)
                        {
                            let answers = [];
                            for (let result of results)
                            {
                                if(question.question_id == result.question_id)
                                    answers.push(result);
                            }
                            question.answers = answers;
                            questionsAndAnswers.push(question);
                        }
                        next(questionsAndAnswers);
                    }    
                    else
                        next(new Error("No Answers Found !"));
                })
/*                .then(()=>{
                    next("Success");
                })*/
                .catch((err)=>{next(err.message);}); 
            } 
            else
                next(new Error("No Quiz Id"));
        });
    }

    static addNewAnswer(pPlayerID, pSessionID, pQuestionsID, pAnswerID)
    {
        return new Promise((next)=>{
            
            if(pPlayerID != undefined && pSessionID != undefined && pQuestionsID != undefined && pAnswerID != undefined)
            {
                db.query('INSERT INTO given_answers (player_id, session_id, question_id, answer_id) VALUES (?, ?, ?, ?)', [pPlayerID, pSessionID, pQuestionsID, pAnswerID])
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