const express = require('express');
const morgan = require('morgan')('dev'); // comme le require retourne une fonction, on lui passe le dev en paramètre de la fonction.
const bodyParser = require('body-parser');
const config = require('./config');
const mysql = require('promise-mysql');
const { checkAndChange } = require('./api/functions');
const cors = require('cors');

mysql
	.createConnection({
		host: config.db.host,
		user: config.db.user,
		password: config.db.password,
		port: config.db.port,
		database: config.db.database,
		multipleStatements: config.db.multipleStatements,
	})
	.then((connexion) => {
		console.log('Connected !');

		const app = express();

		let APIRouter = express.Router();
		let Sessions = require('./api/classes/sessions-class')(connexion, config); // Comme il y a un return, on récupère directement la fonction. + petit trick JS : le fait d'avoir fait une fonction permet de passer des paramètres de cette facon.
		let Players = require('./api/classes/players-class')(connexion, config);
		let Quiz = require('./api/classes/quiz-class')(connexion, config);

		app.use(morgan);
		app.use(cors());
		app.use(bodyParser.json()); // for parsing application/json
		app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// SESSIONS //
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

		// Récupère toutes les sessions
		APIRouter.route('/sessions/list').get(async (requete, resultat) => {
			let allSessions = await Sessions.getAll();
			resultat.json(checkAndChange(allSessions));
		});

		// Ajoute une session
		APIRouter.route('/sessions/add').post(async (requete, resultat) => {
			let newSession = await Sessions.add(requete.body.name, requete.body.quiz);
			resultat.json(checkAndChange(newSession));
		});

		// Calculer le montant récolté à un instant T, le stocker en base et le retourner
		APIRouter.route('/sessions/collected-amount/:id_session').get(async (requete, resultat) => {
			let collectedAmount = await Sessions.getCollectedAmount(requete.params.id_session);
			resultat.json(checkAndChange(collectedAmount));
		});

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// PLAYERS //
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Ajouter un participant dans une session
		APIRouter.route('/players/add/:id_session').post(async (requete, resultat) => {
			let newPlayer = await Players.add(requete.body.name, requete.params.id_session);
			resultat.json(checkAndChange(newPlayer));
		});

		// Calculer le score des participants à un instant T, les stocker en base et les retourner (les joueurs + scores)
		APIRouter.route('/players/get-scores/:id_session').get(async (requete, resultat) => {
			let playersAndScores = await Players.getPlayersAndScores(requete.params.id_session);
			resultat.json(checkAndChange(playersAndScores));
		});

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// QUIZ
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// Lister les quiz
		APIRouter.route('/quiz/list').get(async (requete, resultat) => {
			let allQuiz = await Quiz.getAll();
			resultat.json(checkAndChange(allQuiz));
		});

		// Récupérer les questions d'un quiz et récupérer les réponses des question dans un objet global
		APIRouter.route('/quiz/:id/questions-answers/').get(async (requete, resultat) => {
			let questionsAndAnswers = await Quiz.getQuestionsAnswers(requete.params.id);
			resultat.json(checkAndChange(questionsAndAnswers));
		});

		// Enregistrer la réponse donnée par un participant à une question lors d'une session
		APIRouter.route('/quiz/new-answer/').post(async (requete, resultat) => {
			let newAnswer = await Quiz.addNewAnswer(requete.body.player_id, requete.body.session_id, requete.body.question_id, requete.body.answer_id);
			resultat.json(checkAndChange(newAnswer));
		});

		// Définition de la route de l'API
		app.use(config.rootApi, APIRouter);

		app.listen(config.port, () => console.log('Started'));
	})
	.catch((err) => {
		console.log('Error during connexion : ' + err.message);
	});
